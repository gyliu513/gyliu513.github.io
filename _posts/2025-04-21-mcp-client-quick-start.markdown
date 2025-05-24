---
layout: post
title:  "MCP Client Quick Start"
date:   2025-04-21 08:17:10 -0400
categories: jekyll update
tag: MCP
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [MCP Client Quick Start](#mcp-client-quick-start)
  - [Background](#background)
    - [MCP Server: Lightweight and Declarative](#mcp-server-lightweight-and-declarative)
    - [MCP Client: Smart, Interactive, LLM-Aware](#mcp-client-smart-interactive-llm-aware)
  - [MCP Client Creation Tutorial](#mcp-client-creation-tutorial)
    - [Set Up Virtual Env](#set-up-virtual-env)
    - [Set Up API Key](#set-up-api-key)
    - [Create Basic Client](#create-basic-client)
    - [Create Server Connection](#create-server-connection)
    - [Create Query Processing Logic](#create-query-processing-logic)
    - [Run this MCP Client](#run-this-mcp-client)
    - [Sequence Chart for E2E](#sequence-chart-for-e2e)
  - [Reference](#reference)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# MCP Client Quick Start

## Background

Usually, compared with MCP Server, MCP Client will be more complex. Here’s a breakdown to clarify why:

### MCP Server: Lightweight and Declarative

- Purpose: Exposes and hosts tools with metadata in a standardized format.
- Responsibilities:
  - Serves tool definitions
  - Provides a registry of capabilities (e.g. tool name, input/output schema).
- Key Traits:
  - Stateless, read-only, low logic overhead.
  - No need to interact with LLMs or orchestrate execution.

### MCP Client: Smart, Interactive, LLM-Aware

- Purpose: Acts as the bridge between the LLM and tool invocation infrastructure.
- Responsibilities:
  - Queries the MCP Server to fetch tool metadata.
  - Integrates with an LLM, providing it with the tool schema in MCP format.
  - Parses LLM outputs to detect tool invocations (tool_use events).
  - Calls tools using the provided input schema and passes results back to the LLM.
  - Optionally manages conversational context, error handling, fallbacks, and multi-step toolchains.
- Key Traits:
  - Stateful, interactive, and logic-heavy.
  - Needs tight coordination between LLM-generated plans and real-world tool APIs.

## MCP Client Creation Tutorial

### Set Up Virtual Env

I was using virtual environment for this tutorial, you can use either `uv` or `python venv`.

After virtual environment created, create a new file named as `client.py`.

### Set Up API Key

We are going to use Anthropic for this client, so get your [Anthropic API Key from here](https://console.anthropic.com/settings/keys) first and put it to a `.env` file.

```
ANTHROPIC_API_KEY=sk-ant-xxx
```

### Create Basic Client

First, let’s set up our imports and create the basic client class. It will include the following:

- The MCPClient class initializes with session management and API clients
- Uses AsyncExitStack for proper resource management
- Configures the Anthropic client for Claude interactions

```python
import asyncio
from typing import Optional
from contextlib import AsyncExitStack

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()  # load environment variables from .env

class MCPClient:
    def __init__(self):
        # Initialize session and client objects
        self.session: Optional[ClientSession] = None
        self.exit_stack = AsyncExitStack()
        self.anthropic = Anthropic()
    # methods will go here
```

### Create Server Connection

The following code is about how to build connections with an existing MCP Server:

- Validates server script type, support both Python and JS
- Sets up proper communication channels
- Initializes the session and lists available tools

```python
async def connect_to_server(self, server_script_path: str):
    """Connect to an MCP server

    Args:
        server_script_path: Path to the server script (.py or .js)
    """
    is_python = server_script_path.endswith('.py')
    is_js = server_script_path.endswith('.js')
    if not (is_python or is_js):
        raise ValueError("Server script must be a .py or .js file")

    command = "python" if is_python else "node"
    server_params = StdioServerParameters(
        command=command,
        args=[server_script_path],
        env=None
    )

    stdio_transport = await self.exit_stack.enter_async_context(stdio_client(server_params))
    self.stdio, self.write = stdio_transport
    self.session = await self.exit_stack.enter_async_context(ClientSession(self.stdio, self.write))

    await self.session.initialize()

    # List available tools
    response = await self.session.list_tools()
    tools = response.tools
    print("\nConnected to server with tools:", [tool.name for tool in tools])
```
​
### Create Query Processing Logic

This is the key part of the MCP Client, this will be used for processing natural language queries and handling tool calls:

- Sending it to the Claude AI model (Claude 3.5 Sonnet)
- Detecting if any tools are needed to answer the question
- Calling those tools if requested
- Sending the results back to Claude for further reasoning
- Repeating this process if needed
- Finally, returning the composed answer

```python
async def process_query(self, query: str) -> str:
    """Process a query using Claude and available tools"""
    messages = [
        {
            "role": "user",
            "content": query
        }
    ]

    response = await self.session.list_tools()
    available_tools = [{
        "name": tool.name,
        "description": tool.description,
        "input_schema": tool.inputSchema
    } for tool in response.tools]

    # Initial Claude API call
    response = self.anthropic.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1000,
        messages=messages,
        tools=available_tools
    )

    # Process response and handle tool calls
    final_text = []

    assistant_message_content = []
    for content in response.content:
        if content.type == 'text':
            final_text.append(content.text)
            assistant_message_content.append(content)
        elif content.type == 'tool_use':
            tool_name = content.name
            tool_args = content.input

            # Execute tool call
            result = await self.session.call_tool(tool_name, tool_args)
            final_text.append(f"[Calling tool {tool_name} with args {tool_args}]")

            assistant_message_content.append(content)
            messages.append({
                "role": "assistant",
                "content": assistant_message_content
            })
            messages.append({
                "role": "user",
                "content": [
                    {
                        "type": "tool_result",
                        "tool_use_id": content.id,
                        "content": result.content
                    }
                ]
            })

            # Get next response from Claude
            response = self.anthropic.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1000,
                messages=messages,
                tools=available_tools
            )

            final_text.append(response.content[0].text)

    return "\n".join(final_text)
```

You can get the full example from [here](https://github.com/gyliu513/langX101/blob/main/mcp-client/client.py).

### Run this MCP Client

You can run this program with any MCP Server that you have as below:

```
python client.py path/to/server.py
```

For my case, I was running this client against my `weather.py` at [here](https://github.com/gyliu513/langX101/blob/main/mcp/weather/weather.py). And `weather.py` was located at `` on my local host.

```console
mcp-client % python client.py /Users/gyliu513/github.com/gyliu513/langX101/mcp/weather/weather.py
[04/21/25 09:45:57] INFO     Processing request of type ListToolsRequest                                                                                                                                        server.py:534

Connected to server with tools: ['get_alerts', 'get_forecast']

MCP Client Started!
Type your queries or 'quit' to exit.

Query:
```

### Sequence Chart for E2E

The following is the full sequence chart for the e2e use case here.

```mermaid
sequenceDiagram
    participant User
    participant MCPClient
    participant MCPServer
    participant ClaudeLLM
    participant WeatherService

    User->>MCPClient: Enter query
    MCPClient->>MCPServer: Request available tool list
    MCPServer-->>MCPClient: Return list of available tools
    MCPClient->>ClaudeLLM: Send user query + tool metadata
    ClaudeLLM->>ClaudeLLM: Analysis available tools
    ClaudeLLM-->>MCPClient: Return response (may include tool call)
    alt Tool call requested
        MCPClient->>MCPServer: Execute weather tool
        MCPServer->>WeatherService: Retrieve weather from weather service
        WeatherService-->>MCPServer: Return weather info
        MCPServer-->>MCPClient: Return weather tool result
        MCPClient->>ClaudeLLM: Send weather tool result to ClaudLLM
        ClaudeLLM-->>MCPClient: Return follow-up response from ClaudLLM
    end
    MCPClient->>User: Display combined response
```

## Reference

- [MCP For Client Developers](https://modelcontextprotocol.io/quickstart/client)
