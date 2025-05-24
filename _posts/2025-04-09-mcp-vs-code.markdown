---
layout: post
title:  "Developer Quick Start with MCP Server in VS Code"
date:   2025-04-09 08:17:10 -0400
categories: jekyll update
tag: VSCode
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Developer Quick Start with MCP Server in VS Code](#developer-quick-start-with-mcp-server-in-vs-code)
  - [Enable Agent Mode for VS Code](#enable-agent-mode-for-vs-code)
  - [Config MCP Server](#config-mcp-server)
  - [Test MCP Server](#test-mcp-server)
  - [Conclusion](#conclusion)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Developer Quick Start with MCP Server in VS Code

GitHub Copilot Chat now supports Chat Agent Mode, allowing your MCP Server to respond to user questions within the VS Code chat interface. You can use this to extend GitHub Copilot Chat with custom intelligence from your observability platform, application, or tool. More importantly, it is FREE!

You can refer to [Use agent mode in VS Code](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode) and [Use MCP servers in VS Code (Preview)](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) to get more detail.

In this blog, I will use the [mcp filesystem server](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) as an example to show a quick tutorial for setting this up in your VS Code.

## Enable Agent Mode for VS Code

In agent mode, Copilot operates autonomously and determines the relevant context for your prompt.

You can access agent mode from the chat mode dropdown in the Chat view. Follow these steps to get started:

- Make sure that agent mode is enabled by configuring the [`chat.agent.enabled`](vscode://settings/chat.agent.enabled) setting in the `Settings` editor (requires VS Code 1.99 or later).

![](/images/vscode/chat.agent.enable.png)

- Open the Chat view by selecting Open Chat from the Copilot menu in the VS Code title bar, or use the ⌃⌘I keyboard shortcut.

![](/images/vscode/open-chat.png)

- Select `Agent` from the chat mode dropdown in the Chat view.

![](/images/vscode/agent-mode.png)

- Agent mode might invoke multiple [tools](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode#_agent-mode-tools) to accomplish different tasks. Optionally, select the Tools icon to configure which tools can be used for responding to your request.

![](/images/vscode/mcp-server-tools.png)

## Config MCP Server

Alright, we have enabled Agent mode for VS Code, now we can integrate it with the [mcp filesystem server](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) and do some test.

- Configure an MCP server in the `.vscode/mcp.json` file in your workspace to share configurations with project collaborators. Make sure to avoid hardcoding sensitive information like API keys and other credentials by using input variables or environment files. You can either click `Add Server` or just copy and paste the following content to `.vscode/mcp.json` to enable [mcp filesystem server](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem).

![](/images/vscode/addserver.png)

```json
{
    "servers": {
        "file-system": {
            "type": "stdio",
            "command": "npx",
            "args": [
                "-y",
                "@modelcontextprotocol/server-filesystem",
                "/Users/gyliu513/mcp"           
            ]
        }
    }
}
```

The above configuration means I want to use [mcp filesystem server](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) to help me manage the files under `/Users/gyliu513/mcp`

-  After the `.vscode/mcp.json` configuration finished, we can refresh the tools to load all the tools from [mcp filesystem server](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem).
   - From below diagram. we can see we have 9 tools now and there is also a `refresh` button besides the tools button.
      ![](/images/vscode/mcp-json.png)
  - After click the `refresh` button, we can see the tools number was increased from 9 to 20, this means the [mcp filesystem server](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) has been loaded and it has 11 tools.
      ![](/images/vscode/mcp-json-update.png)

## Test MCP Server

OK, all configuration are finished and it is time for some test with the [mcp filesystem server](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) using Github Copilot.

- Ask Github Copilot `show me all files under /Users/gyliu513/mcp`

![](/images/vscode/show-files.png)

- The tool `list_directory` will be invoked, click `continue` to enable this tool can be called, you will see the file list under `/Users/gyliu513/mcp`.

![](/images/vscode/show-files-result.png)

- Ask Github Copilot `rename file4 to file5`.

![](/images/vscode/rename-files.png)

- The tool `mv` will be invoked, click `continue` to enable this tool can be called, you will see the result is `file4` was renamed to `file5`.

![](/images/vscode/rename-files-result.png)

- Ask Github Copilot `show me all files under /Users/gyliu513/mcp` to confirm the file has been renamed, you will see the result is right, `file4` has been renamed to `file5`.

![](/images/vscode/show-files-again.png)

## Conclusion

With Copilot Chat’s new Agent Mode and support for MCP Servers, developers now have a powerful way to inject custom, domain-specific intelligence directly into their VS Code environment. In this blog, we demonstrated how to configure and integrate the MCP filesystem server to allow Copilot Chat to perform real-time operations—like listing and renaming files—using simple natural language instructions.

This workflow not only boosts productivity but also paves the way for more advanced use cases, such as connecting Copilot Chat to observability tools, internal APIs, or automation engines. And best of all—it’s free and easy to get started.

Happy hacking! 👨‍💻🚀
