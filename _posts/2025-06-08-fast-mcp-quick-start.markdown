---
layout: post
title:  "FastMCP 2.0 Quick Start"
date:   2025-06-08 08:17:10 -0400
categories: jekyll update
tag: FastMCP
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [FastMCP 2.0 Quick Start](#fastmcp-20-quick-start)
  - [Background](#background)
  - [What’s New in FastMCP 2.0?](#whats-new-in-fastmcp-20)
  - [Preparation](#preparation)
  - [Build Your Own Server](#build-your-own-server)
  - [Test the MCP Server](#test-the-mcp-server)
    - [With Python MCP Client](#with-python-mcp-client)
    - [With MCP Inspector](#with-mcp-inspector)
  - [Conclusion](#conclusion)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# FastMCP 2.0 Quick Start

## Background

FastMCP is the standard framework for working with the Model Context Protocol. FastMCP 1.0 was incorporated into the official [low-level Python SDK](https://github.com/modelcontextprotocol/python-sdk), and [FastMCP 2.0](https://github.com/jlowin/fastmcp) provides a complete toolkit for working with the MCP ecosystem.

FastMCP 2.0 has a comprehensive set of features that go far beyond the core MCP specification, all in service of providing the simplest path to production. These include client support, server composition, auth, automatic generation from OpenAPI specs, remote server proxying, built-in testing tools, integrations, and more.

## What’s New in FastMCP 2.0?

FastMCP 2.0 is a major evolution from version 1.0, moving from a minimal, demo-friendly library to a production-ready framework for building LLM tool backends.

In version 1.0, FastMCP gave developers a basic way to define tools using @mcp.tool decorators and connect them with simple clients over STDIO. It was ideal for small experiments, quick prototypes, and educational use cases, but lacked structure for large-scale or composable systems.

FastMCP 2.0 changes everything.

With 2.0, the server becomes modular and composable. You can now mount multiple FastMCP apps together, allowing different teams or domains to define tools independently and plug them into a shared platform. There’s also built-in support for proxying — so you can wrap existing MCP servers and bridge different transports or add authentication layers effortlessly.

Another key feature is OpenAPI integration. FastMCP 2.0 can ingest any OpenAPI spec and automatically turn its operations into callable tools. This means you can expose your existing HTTP APIs to LLMs in minutes, without writing glue code.

It also introduces a Context object available in every tool. This context lets you log messages, stream updates, upload/download files, and track execution metadata — making tools not just callable, but introspectable and traceable.

Finally, FastMCP 2.0 is built with asynchronous Python in mind. Clients and servers are fully async-capable, ready to support concurrent tool calls, fast I/O, and cloud-native deployments.

In short, while FastMCP 1.0 was a helpful beginning, FastMCP 2.0 is the foundation for real-world, large-scale agent systems.

## Preparation

Create a virtual env for FastMCP 2.0:

```
python3.10 -m venv fastmcp
```

Activate the virtual env:

```
source fastmcp/bin/activate
```

Install FastMCP 2.0:

```
pip install fastmcp
```

## Build Your Own Server

Copy the following python code and save it as `server.py`

```python
from fastmcp import FastMCP

mcp = FastMCP(name="My MCP Server")

@mcp.tool
def greet(name: str) -> str:
    """Returns a friendly greeting."""
    return f"Hello, {name}!"

if __name__ == "__main__":
    mcp.run(transport="streamable-http", host="0.0.0.0", port=8000, path="/mcp")
```

The above code starts the MCP server with:
- `transport="streamable-http"`: Uses a streaming HTTP interface.
- `host="0.0.0.0"`: Binds the server to all available network interfaces.
- `port=8000`: Exposes the server on port 8000.
- `path="/mcp"`: Listens on the endpoint `/mcp`.

So, once this server is running, a client (like an LLM or agent) can make a request to `http://<your-ip>:8000/mcp` to call the `greet` tool.

Run the above code via `python server.py`.

```console
% python server.py
[06/09/25 13:16:35] INFO     Starting MCP server 'My MCP Server' with transport 'streamable-http' on http://0.0.0.0:8000/mcp                                                                                   server.py:1031
INFO:     Started server process [29161]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

## Test the MCP Server

### With Python MCP Client

Copy the following python code and save it as `client.py`.

```python
from fastmcp import Client
from fastmcp.client.transports import StreamableHttpTransport
import asyncio

transport = StreamableHttpTransport(url="http://0.0.0.0:8000/mcp")
client = Client(transport)

async def main():
    # Connection is established here
    async with client:
        print(f"Client connected: {client.is_connected()}")
        tools = await client.list_tools()
        print(f"Available tools: {tools}")
        if any(tool.name == "greet" for tool in tools):
            result = await client.call_tool("greet", {"name": "FastMCP 2.0"})
            print(f"Greet result: {result}")

    # Connection is closed automatically here
    print(f"Client connected: {client.is_connected()}")

if __name__ == "__main__":
    asyncio.run(main())
```

Run the above code via `python client.py`.

```console
% python client.py
Client connected: True
Available tools: [Tool(name='greet', description='Returns a friendly greeting.', inputSchema={'properties': {'name': {'title': 'Name', 'type': 'string'}}, 'required': ['name'], 'type': 'object'}, annotations=None)]
Greet result: [TextContent(type='text', text='Hello, FastMCP 2.0!', annotations=None)]
Client connected: False`
```

### With MCP Inspector

You can also test the MCP Server with MCP Inspector as below:

```console
% npx @modelcontextprotocol/inspector
Starting MCP inspector...
⚙️ Proxy server listening on port 6277
🔍 MCP Inspector is up and running at http://127.0.0.1:6274 🚀
```

Connect to MCP Inspector as below:
![](/images/fastmcp2/connect-mcp.png)

Run tools from MCP Server:
![](/images/fastmcp2/hello-tool.png)

You can also use Chrome inspector to view network traffic of the MCP Server as below, this is for viewing the headers.

![](/images/fastmcp2/header-mcp.png)

This is for viewing the payload.

![](/images/fastmcp2/payload.png)


## Conclusion

FastMCP has grown from a minimal, experiment-friendly library into a fully featured framework built for production use in the LLM ecosystem.

FastMCP 1.0 introduced the core mechanics of MCP-compatible tool registration and communication. It laid the groundwork: lightweight, simple, but limited to basic use cases.

FastMCP 2.0 builds on that foundation with powerful new capabilities: composable server architecture, native OpenAPI integration, proxy support, a first-class Context object for tool introspection, and fully async I/O, all designed to streamline the path from prototype to production.

Whether you're building a single agent with a few tools or managing a multi-agent system with diverse backend services, FastMCP 2.0 gives you the flexibility, speed, and structure to succeed.

Now is the time to go fast — with FastMCP 2.0.