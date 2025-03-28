---
layout: post
title:  "MCP Quick Start"
date:   2025-03-23 08:17:10 -0400
categories: jekyll update
tag: MCP
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [MCP Quick Start](#mcp-quick-start)
  - [Introduction](#introduction)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
    - [Build Virtual Env](#build-virtual-env)
    - [Install MCP](#install-mcp)
  - [Create a sample server](#create-a-sample-server)
  - [Run with MCP Inspector](#run-with-mcp-inspector)
    - [Run demo](#run-demo)
    - [Access MCP Inspector](#access-mcp-inspector)
    - [Connect to MCP Server](#connect-to-mcp-server)
    - [Test with MCP Inspector](#test-with-mcp-inspector)
  - [Run with Claude Desktop](#run-with-claude-desktop)
    - [Install Claude Desktop](#install-claude-desktop)
    - [Install demo server to Claude](#install-demo-server-to-claude)
    - [Check MCP Tools](#check-mcp-tools)
    - [Run your server with Claude](#run-your-server-with-claude)
  - [Reference](#reference)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# MCP Quick Start

## Introduction

MCP is an open protocol that standardizes how applications provide context to LLMs. Think of MCP like a USB-C port for AI applications. Just as USB-C provides a standardized way to connect your devices to various peripherals and accessories, MCP provides a standardized way to connect AI models to different data sources and tools.

## Prerequisites

- A Linux or macOS system
- Python 3.8 or later installed
- pip package manager installed

## Installation

### Build Virtual Env

For Python developers, it is always good to use virtual environment to isolate your different test environments.

```
gyliu513@Guangyas-MacBook-Pro ~ % python3.10 -m venv mcp
gyliu513@Guangyas-MacBook-Pro ~ % source mcp/bin/activate
(mcp) gyliu513@Guangyas-MacBook-Pro ~ %
```

### Install MCP

```
(mcp) gyliu513@Guangyas-MacBook-Pro ~ % pip install "mcp[cli]"
```

## Create a sample server

Let's create a simple MCP server that exposes a calculator tool and some data:

```python
# demo.py
from mcp.server.fastmcp import FastMCP

# Create an MCP server
mcp = FastMCP("Demo")


# Add an addition tool
@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b


# Add a dynamic greeting resource
@mcp.resource("greeting://{name}")
def get_greeting(name: str) -> str:
    """Get a personalized greeting"""
    return f"Hello, {name}!"
```

## Run with MCP Inspector

Now, we can run the demo server using MCP Inspector, MCP Inspector is usually used for developer for some test.

### Run demo

```console
(mcp) gyliu513@Guangyas-MacBook-Pro test % mcp dev demo.py
Starting MCP inspector...
Proxy server listening on port 3000

🔍 MCP Inspector is up and running at http://localhost:5173 🚀
```

You will see the MCP Inspector will be running at `http://localhost:5173`.


### Access MCP Inspector

![](/images/mcp/mcp-inspect-ui.png)


### Connect to MCP Server

You can click `Connect` to connect to your mcp server.

![](/images/mcp/connect-mcp.png)

### Test with MCP Inspector

In above code, there are two functions:

- `tool` with `@mcp.tool()` named as `add`
- `resource template` with `@mcp.resource("greeting://{name}")` named as `get_greeting`. The decorator includes a variable `{name}`, so this is a `template`.

Click `Tools` in MCP Inspector UI, you will see the tools `add` and you can also do some test with this tool.

![](/images/mcp/inspect-tool.png)


Click `Resources` and `List Templates`, you will see the template `get_greeting` and do some test.

![](/images/mcp/inspect-template.png)

## Run with Claude Desktop

### Install Claude Desktop

Besides running with MCP Inspector, you can also run with Claude Desktop as well.

You may want to install [Claude Desktop](https://claude.ai/download) first.

### Install demo server to Claude

Once [Claude Desktop](https://claude.ai/download) is ready, install your demo code to [Claude Desktop](https://claude.ai/download) via following CLI.

```
mcp install demo.py
```

This CLI will update the `claude_desktop_config.json` by adding your demo server. For my case, I was using MacOS, and the file is located at `~/Library/Application Support/Claude/claude_desktop_config.json` by default.

![](/images/mcp/config-file.png)

The content of this file will be as following:

```yaml
{
  "mcpServers": {
    "Demo": {
      "command": "uv",
      "args": [
        "run",
        "--with",
        "mcp[cli]",
        "mcp",
        "run",
        "/Users/gyliu513/test/demo.py"
      ]
    }
  }
}
```

With default config, when you restart Claude, you usually get some error as below:

![](/images/mcp/uv-path-error.png)

This is because Claude cannot find the `uv` CLI, and thus report this error. To fix it, we usually update `claude_desktop_config.json` by using a full path of `uv`, like `/Users/gyliu513/.local/bin/uv`.

```yaml
{
  "mcpServers": {
    "Demo": {
      "command": "/Users/gyliu513/.local/bin/uv",
      "args": [
        "run",
        "--with",
        "mcp[cli]",
        "mcp",
        "run",
        "/Users/gyliu513/test/demo.py"
      ]
    }
  }
}
```

You can also view this via Claude Config from `Claude->Settings->Developer` as below.

![](/images/mcp/claude-config.png)

### Check MCP Tools

Once you restart Claude, and if it is running well, you will see a `hammer` in the prompt text window. Click the `hammer`, you will see the tool that we created named as `add`.

![](/images/mcp/check-tools.png)

### Run your server with Claude

You are ready to go now! Input a prompt like `add two numbers 1 and 2`, and this will trigger the call of the `add` tool.
![](/images/mcp/add-prompt.png)

Click `Allow for This Chat` and it will continue.

![](/images/mcp/call-tool.png)

Once finished, you will see the result as below.

![](/images/mcp/add-result.png)

Happy hacking with MCP!

## Reference
- [MCP Website](https://modelcontextprotocol.io/)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [MCP Marketplace](https://mcp.so/)