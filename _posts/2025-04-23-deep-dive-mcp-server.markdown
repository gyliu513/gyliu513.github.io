---
layout: post
title:  "Deep Dive into MCP Remote Server"
date:   2025-04-23 08:17:10 -0400
categories: jekyll update
tag: MCP
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Deep Dive into MCP Remote Server](#deep-dive-into-mcp-remote-server)
  - [Local MCP Server](#local-mcp-server)
  - [Remote MCP Server](#remote-mcp-server)
  - [Remote MCP Server Example](#remote-mcp-server-example)
  - [Testing the Remote MCP Server](#testing-the-remote-mcp-server)
    - [Start MCP Inspector](#start-mcp-inspector)
    - [Start Remote MCP Server](#start-remote-mcp-server)
    - [Connect to Remote MCP Server via MCP Inspector](#connect-to-remote-mcp-server-via-mcp-inspector)
    - [List MCP Server Tools](#list-mcp-server-tools)
    - [Do a Add Operation](#do-a-add-operation)
  - [Conclusion](#conclusion)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Deep Dive into MCP Remote Server

## Local MCP Server

Local MCP Server refers to an MCP server running on the user's local device. In this mode, the MCP client (e.g., Claude Desktop or Cursor) communicates with the MCP server via local inter-process communication (stdin/stdout), and the server then connects to various APIs and services on the internet. This architecture is simple and straightforward, making it suitable for individual developers, though it does have certain limitations.

```mermaid
graph LR
    subgraph "Application Host Process"
        ICB[Chat Bot]
        MSI[Local MCP Server]
        ICB <--> MSI
    end

    subgraph "Application Host Process"
        ICB2[Chat Bot]
        MSI2[Local MCP Server]
        ICB2 <--> MSI2
    end
    subgraph "Remote Service"
        II[Remote Service Instance]
        MSI <--> II
        MSI2 <--> II
    end
```

While Local MCP Server is simple and easy to use, it faces several challenges in enterprise-level applications:

- Dependency on Local Environment: It requires users to have a suitable local environment (e.g., installing Python or Docker) to run the MCP Server, which is not user-friendly for non-technical users.
- Security Risks: Enterprises are unlikely to distribute sensitive data tokens, API keys, or other credentials to individual employees' local machines. This not only violates security best practices, but also increases the risk of credential leakage.
- Consistency Issues: When multiple users need access to similar or shared resources, it becomes difficult to ensure consistent configurations and permissions, leading to potential data conflicts or permission confusion.
- High Maintenance Costs: Deploying and maintaining a Local MCP Server for each user requires substantial IT resources. Every update, security patch, and configuration change must be executed individually on each device.

## Remote MCP Server

Remote MCP Server refers to an MCP server deployed in the cloud, which users can access over the internet. In this mode, MCP clients can be broader web or mobile applications that communicate with the remote MCP server via the HTTP protocol. A Remote MCP Server typically integrates enterprise-level features such as authentication and authorization, state management, and database access, enabling it to serve multiple users.

```mermaid
graph LR
    subgraph "Application Host Process"
        ICB[Chat Bot]
    end

    subgraph "Application Host Process"
        ICB2[Chat Bot]
    end
    subgraph "Remote Service"
        MSI[Remote MCP Server]
        II[Remote Service Instance]
        ICB <--> MSI
        ICB2 <--> MSI
        MSI <--> II
    end
```

Remote MCP Server addresses the above Local MCP Server issues through centralized deployment and management:

- Expanded Usage Scenarios: Non-technical users can access the MCP functionality via web or mobile apps anytime, anywhere, through the internet.
- Centralized Security Management: Enterprises can enforce strict access control, encryption, and auditing mechanisms at the server level to ensure secure handling of sensitive data.
- Unified Access Control: With centralized identity and permission management, enterprises can precisely control each user's access to different resources.
- Simplified Deployment and Maintenance: Only the central server needs to be maintained, significantly reducing maintenance costs and system complexity.

## Remote MCP Server Example

Remote MCP servers uses HTTP as the transport for the JSON-RPC messages, and it leverages SSE(Server-Sent Events) transport enables server-to-client streaming with HTTP POST requests for client-to-server communication.

We will now build a remote MCP Server based on the Go MCP Server in the blog [Build and Run a Go MCP Server in 5Mins](https://medium.com/@gyliu513/build-and-run-a-go-mcp-server-in-5mins-0ed28e592069).

Local MCP Server using stdio server, but the remote MCP Server using HTTP server. The major difference with the local MCP Server in the blog [Build and Run a Go MCP Server in 5Mins](https://medium.com/@gyliu513/build-and-run-a-go-mcp-server-in-5mins-0ed28e592069) is how to start the MCP Server.

This is how we start the local MCP Server, checkout the whole local mcp server code from [here](https://github.com/gyliu513/langX101/blob/main/mcp-go/local-server/demo1.go).

```go
// Start the server
if err := server.ServeStdio(s); err != nil {
	fmt.Printf("Server error: %v\n", err)
}
```

This is how remote mcp server start, checkout the whole remote mcp server code from [here](https://github.com/gyliu513/langX101/blob/main/mcp-go/remote-server/remote-server.go).

```go
// Start the HTTP server using SSE
port := 8080
fmt.Printf("Starting MCP Calculator server on port %d...\n", port)

// Create an SSE server with custom options
sseServer := server.NewSSEServer(s,
	server.WithBasePath("/"),
	server.WithSSEEndpoint("/mcp/sse"),
	server.WithMessageEndpoint("/mcp/message"),
)

// Create a mux to handle different routes
mux := http.NewServeMux()

// Print all HTTP request header
mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
	log.Println("🔍 Incoming request:", r.Method, r.URL.Path)
	log.Println("🔍 Headers:", r.Header)

	// Handover to sseServer
	sseServer.ServeHTTP(w, r)
})

// Create an HTTP server
httpServer := &http.Server{
	Addr:    fmt.Sprintf(":%d", port),
	Handler: mux,
}

// Print available endpoints
fmt.Printf("SSE Endpoint: %s\n", sseServer.CompleteSsePath())
fmt.Printf("Message Endpoint: %s\n", sseServer.CompleteMessagePath())

// Start the server
if err := httpServer.ListenAndServe(); err != nil {
	log.Fatalf("Server error: %v\n", err)
}
```

From above, you can see there are two endpoints, one is for SSE and another is for Message.

| Endpoint       | Method | Role               | Typical Payload           | Response Style      |
|----------------|--------|--------------------|----------------------------|---------------------|
| `/mcp/message` | POST   | Request channel     | `message`, `callTool`, etc.| Immediate HTTP      |
| `/mcp/sse`     | GET    | Streaming response  | N/A (used to receive data) | Streaming via SSE   |


```mermaid
sequenceDiagram
    participant Agent
    participant MCP_Server
    participant Tool

    Agent->>MCP_Server: POST /mcp/message (start session)
    MCP_Server-->>Agent: SSE /mcp/sse (sessionId created)
    Agent->>MCP_Server: POST /mcp/message (callTool)
    MCP_Server->>Tool: Execute tool
    Tool-->>MCP_Server: Result
    MCP_Server-->>Agent: SSE (Tool Result)
```

## Testing the Remote MCP Server

In this tutorial, we are using [MCP Inspector](https://github.com/modelcontextprotocol/inspector) to test this remote MCP Server.

### Start MCP Inspector

```console
(bedrock) gyliu513@Guangyas-MacBook-Pro personal % npx @modelcontextprotocol/inspector
Starting MCP inspector...
⚙️ Proxy server listening on port 6277
🔍 MCP Inspector is up and running at http://127.0.0.1:6274 🚀
```

If you open `http://127.0.0.1:6274` in your browser, you will see the MCP Inspector UI as below.

![](/images/deep-dive-mcp-server/mcp-insepector-initial.png)

### Start Remote MCP Server

I was using the remote mcp server at [here](https://github.com/gyliu513/langX101/blob/main/mcp-go/remote-server/remote-server.go), and the file name is `remote-mcpserver.go`.

I was running this remote mcp server in a remote machine with IP address as `9.30.147.51`.

```console
root@gyliu-dev111:~/github.com/gyliu513/langX101/mcp-go/remote-server# go run remote-server.go
Starting MCP Calculator server on port 8080...
SSE Endpoint: /mcp/sse
Message Endpoint: /mcp/message
```

For my case, the two endpoints will be as following:

- SSE Endpoint: http://9.30.147.51:8080/mcp/sse
- Message Endpoint: http://9.30.147.51:8080/mcp/message

We need let MCP Inspector connect to the SSE Endpoint for test.

### Connect to Remote MCP Server via MCP Inspector

![](/images/deep-dive-mcp-server/pre-connect.png)

As we are using `SSE`, please select `SSE` as `Transport Type`. In the URL, input the SSE endpoint with `http://9.30.147.51:8080/mcp/sse`, then click `Connect`, you will be able to connect to the Remote MCP Serer.

### List MCP Server Tools

![](/images/deep-dive-mcp-server/list-tools.png)

If you click `List Tools`, you will see the tools from the console. For our case, we have only one tool named as `calculate`.

You can also see the request and response payload for the list tool API call from the box of `History`.

Request for tools:

```json
{
  "method": "tools/list",
  "params": {}
}
```

Response for tools:

```json
{
  "tools": [
    {
      "name": "calculate",
      "description": "Perform basic arithmetic operations",
      "inputSchema": {
        "type": "object",
        "properties": {
          "operation": {
            "description": "The operation to perform (add, subtract, multiply, divide)",
            "enum": [
              "add",
              "subtract",
              "multiply",
              "divide"
            ],
            "type": "string"
          },
          "x": {
            "description": "First number",
            "type": "number"
          },
          "y": {
            "description": "Second number",
            "type": "number"
          }
        },
        "required": [
          "operation",
          "x",
          "y"
        ]
      },
      "annotations": {
        "destructiveHint": true,
        "openWorldHint": true
      }
    }
  ]
}
```

### Do a Add Operation

![](/images/deep-dive-mcp-server/add.png)

Now we can do a simple add test as below to test the `add` operation. In the meantime, we can also see the request and response payload from the box of `History`.

Request for calling `add` tool:

```json
{
  "method": "tools/call",
  "params": {
    "name": "calculate",
    "arguments": {
      "operation": "add",
      "x": 1,
      "y": 2
    },
    "_meta": {
      "progressToken": 0
    }
  }
}
```

Response for calling `add` tool:

```json
{
  "content": [
    {
      "type": "text",
      "text": "3.00"
    }
  ]
}
```

## Conclusion

The evolution from Local to Remote MCP Servers reflects a broader shift in AI and agent architecture, from isolated, developer centric tools to scalable, secure, and shareable infrastructure. While local servers are perfect for quick testing and iteration, Remote MCP Servers open the door to multi-user collaboration, centralized management, and production grade deployment.

Through this deep dive, we:
- Compared the internal mechanics and tradeoffs between local and remote MCP setups
- Explored how the Remote MCP Server uses SSE and HTTP POST to facilitate full duplex interaction
- Demonstrated how to spin up a Go-based remote server with tool registration
- Used MCP Inspector to debug session flows and tool invocations

By understanding the nuances of session management, endpoint roles, payload formats, and transport protocols, developers can confidently integrate MCP into enterprise systems or multi-agent platforms.

As AI agents continue to proliferate across desktops, clouds, and edge devices, Remote MCP Servers will play a pivotal role in creating a consistent, secure, and observable interface between user intentions and tool execution.
