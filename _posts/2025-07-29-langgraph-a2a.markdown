---
layout: post
title:  "Building Intelligent Agents with LangGraph and A2A Protocol: A Comprehensive Guide"
date:   2025-07-29 08:17:10 -0400
categories: jekyll update
tag: LangGraph
---

# Building Intelligent Agents with LangGraph and A2A Protocol: A Comprehensive Guide

## Introduction

The Agent-to-Agent (A2A) protocol represents a significant advancement in the field of AI agent communication, providing a standardized way for agents to discover, interact, and collaborate. When combined with LangGraph's powerful workflow orchestration capabilities, developers can create sophisticated, conversational AI agents that can handle complex multi-turn interactions, tool usage, and real-time streaming responses.

This blog explores the architecture and implementation of a currency conversion agent built with LangGraph and exposed through the A2A protocol, demonstrating best practices for building production-ready AI agents.

## Architecture Overview

The LangGraph + A2A architecture consists of several key components that work together to create a robust, scalable agent system:

```mermaid
graph TB
    subgraph "A2A Client Layer"
        Client[A2A Client]
        UI[User Interface]
        Client --> UI
    end
    
    subgraph "A2A Server Layer"
        Server[A2A Server]
        Handler[Request Handler]
        TaskStore[Task Store]
        PushConfig[Push Notification Config]
        Server --> Handler
        Handler --> TaskStore
        Handler --> PushConfig
    end
    
    subgraph "Agent Layer"
        Executor[Agent Executor]
        Agent[LangGraph Agent]
        Memory[Checkpoint Memory]
        Tools[External Tools/APIs]
        Executor --> Agent
        Agent --> Memory
        Agent --> Tools
    end
    
    subgraph "External Services"
        LLM[Large Language Model]
        API[External APIs]
        Webhook[Webhook Endpoints]
    end
    
    Client <--> Server
    Server <--> Executor
    Agent <--> LLM
    Tools <--> API
    PushConfig <--> Webhook
```

**Architecture Description:**

This diagram illustrates the complete system architecture of a LangGraph + A2A agent. The system is organized into four main layers:

1. **A2A Client Layer**: Handles user interactions and provides the interface for sending requests to the agent. The client communicates with the A2A server using standardized JSON-RPC messages.

2. **A2A Server Layer**: Acts as the gateway and orchestrator, managing agent discovery, request routing, task state management, and push notifications. This layer ensures proper protocol compliance and handles the translation between A2A protocol messages and internal agent operations.

3. **Agent Layer**: Contains the core LangGraph agent implementation, including the executor that bridges A2A protocol with LangGraph workflows, the agent itself that handles reasoning and tool usage, memory management for conversation persistence, and tool integration capabilities.

4. **External Services**: Encompasses all external dependencies including the Large Language Model for reasoning, external APIs for tool execution, and webhook endpoints for push notifications.

The bidirectional arrows indicate that communication flows in both directions, enabling real-time updates, streaming responses, and push notifications throughout the system.

## Key Components Deep Dive

### 1. A2A Server Layer

The A2A server acts as the gateway between clients and the underlying agent logic. It handles:

- **Agent Card Discovery**: Provides standardized agent metadata
- **Request Routing**: Routes incoming messages to appropriate handlers
- **State Management**: Maintains conversation context and task state
- **Streaming Support**: Enables real-time response streaming
- **Push Notifications**: Supports webhook-based status updates

```python
# A2A Server Setup
server = A2AStarletteApplication(
    agent_card=agent_card, 
    http_handler=request_handler
)
```

### 2. Push Notification System Architecture

The A2A framework includes a sophisticated push notification system that enables real-time status updates to clients:

```mermaid
graph TB
    subgraph "Push Notification System"
        ConfigStore[Push Config Store]
        PushSender[Push Sender]
        RequestHandler[Request Handler]
        TaskStore[Task Store]
        AgentExecutor[Agent Executor]
        
        ConfigStore --> PushSender
        PushSender --> RequestHandler
        RequestHandler --> TaskStore
        RequestHandler --> AgentExecutor
    end
    
    subgraph "External System"
        Webhook[Webhook Endpoints]
        Client[A2A Client]
    end
    
    PushSender --> Webhook
    RequestHandler --> Client
```

**Push Notification System Description:**

This diagram illustrates the push notification architecture that enables real-time status updates to clients:

1. **Push Config Store**: Manages webhook URLs and authentication information for push notifications
2. **Push Sender**: Handles HTTP requests to webhook endpoints with proper authentication and retry logic
3. **Request Handler**: Coordinates all A2A protocol requests and manages task lifecycle
4. **Task Store**: Maintains task state and history
5. **Agent Executor**: Executes the actual agent logic and generates status updates

The system provides real-time updates without requiring clients to poll for status changes, improving user experience and reducing server load.

#### 2.1 Push Config Store (InMemoryPushNotificationConfigStore)

**Purpose**: Stores and manages push notification configuration information

```python
# Create configuration store
push_config_store = InMemoryPushNotificationConfigStore()
```

**Functionality**:
- Stores webhook URLs and authentication information
- Manages push notification subscription configurations
- Provides CRUD operations for configurations

**Working Principle**:
```python
# Pseudo-code example
class InMemoryPushNotificationConfigStore:
    def __init__(self):
        self.configs = {}  # In-memory storage
    
    async def add_config(self, task_id: str, webhook_url: str, auth_token: str):
        """Add push notification configuration"""
        self.configs[task_id] = {
            'webhook_url': webhook_url,
            'auth_token': auth_token
        }
    
    async def get_config(self, task_id: str):
        """Get push configuration for specific task"""
        return self.configs.get(task_id)
```

#### 2.2 Push Sender (BasePushNotificationSender)

**Purpose**: Responsible for sending push notifications to clients

```python
# Create push sender
push_sender = BasePushNotificationSender(
    httpx_client=httpx_client,
    config_store=push_config_store
)
```

**Functionality**:
- Sends HTTP requests to webhook URLs based on configuration
- Handles authentication and retry logic
- Manages push notification lifecycle

**Working Principle**:
```python
# Pseudo-code example
class BasePushNotificationSender:
    def __init__(self, httpx_client, config_store):
        self.client = httpx_client
        self.config_store = config_store
    
    async def send_notification(self, task_id: str, message: dict):
        """Send push notification"""
        config = await self.config_store.get_config(task_id)
        if config:
            headers = {
                'Authorization': f'Bearer {config["auth_token"]}',
                'Content-Type': 'application/json'
            }
            await self.client.post(
                config['webhook_url'],
                json=message,
                headers=headers
            )
```

#### 2.3 Request Handler (DefaultRequestHandler)

**Purpose**: Handles all A2A protocol requests and coordinates components

```python
# Create request handler
request_handler = DefaultRequestHandler(
    agent_executor=CurrencyAgentExecutor(),
    task_store=InMemoryTaskStore(),
    push_config_store=push_config_store,
    push_sender=push_sender
)
```

**Functionality**:
- Routes different types of A2A requests
- Manages task state and lifecycle
- Coordinates push notification sending
- Handles streaming responses

#### 2.4 Complete Workflow

```mermaid
sequenceDiagram
    participant Client as A2A Client
    participant Handler as Request Handler
    participant Executor as Agent Executor
    participant TaskStore as Task Store
    participant PushSender as Push Sender
    participant Webhook as Webhook Endpoint

    Client->>Handler: 1. Send message request
    Handler->>TaskStore: 2. Create new task
    Handler->>Executor: 3. Execute agent logic
    
    loop Processing
        Executor->>Handler: 4. Update task status
        Handler->>TaskStore: 5. Save state
        Handler->>PushSender: 6. Send push notification
        PushSender->>Webhook: 7. HTTP POST to webhook
    end
    
    Handler->>Client: 8. Return final result
```

**Workflow Description:**

This sequence diagram shows the complete push notification workflow:

1. **Request Initiation** (Steps 1-3): Client sends a message request, which is routed to the agent executor for processing
2. **Processing Loop** (Steps 4-7): During processing, the agent updates task status, which triggers push notifications to webhook endpoints
3. **Completion** (Step 8): Final result is returned to the client

This workflow ensures real-time updates are delivered to all subscribed clients without requiring polling.

#### 2.5 Server Startup Configuration

```python
# Complete configuration in __main__.py
httpx_client = httpx.AsyncClient()

# 1. Create push notification config store
push_config_store = InMemoryPushNotificationConfigStore()

# 2. Create push notification sender
push_sender = BasePushNotificationSender(
    httpx_client=httpx_client,
    config_store=push_config_store
)

# 3. Create request handler
request_handler = DefaultRequestHandler(
    agent_executor=CurrencyAgentExecutor(),
    task_store=InMemoryTaskStore(),
    push_config_store=push_config_store,
    push_sender=push_sender
)

# 4. Create A2A server application
server = A2AStarletteApplication(
    agent_card=agent_card, 
    http_handler=request_handler
)
```

#### 2.6 Push Notification Workflow in Agent Executor

```python
# Usage in agent_executor.py
async def execute(self, context: RequestContext, event_queue: EventQueue):
    # Create task updater
    updater = TaskUpdater(event_queue, task.id, task.context_id)
    
    try:
        async for item in self.agent.stream(query, task.context_id):
            if not is_task_complete and not require_user_input:
                # Send working status update
                await updater.update_status(
                    TaskState.working,
                    new_agent_text_message(
                        item['content'],
                        task.context_id,
                        task.id,
                    ),
                )
                # This triggers push notification sending
                
            elif require_user_input:
                # Send input required status
                await updater.update_status(
                    TaskState.input_required,
                    new_agent_text_message(
                        item['content'],
                        task.context_id,
                        task.id,
                    ),
                    final=True,
                )
                break
            else:
                # Complete task
                await updater.add_artifact(
                    [Part(root=TextPart(text=item['content']))],
                    name='conversion_result',
                )
                await updater.complete()
                break
    except Exception as e:
        # Error handling
        logger.error(f'Error during execution: {e}')
        raise ServerError(error=InternalError()) from e
```

#### 2.7 Push Notification Benefits

**Real-time Updates**:
- Clients receive immediate status updates without polling
- Supports both long-connection and webhook modes

**Scalability**:
- Supports multiple webhook endpoints
- Can add authentication and retry mechanisms

**Standardization**:
- Follows A2A protocol standards
- Compatible with other A2A clients

#### 2.8 Configuration Examples

```python
# Client configuration for push notifications
{
    "id": "request-id",
    "jsonrpc": "2.0",
    "method": "push/configure",
    "params": {
        "webhook_url": "https://my-app.com/webhook",
        "auth_token": "my-secret-token"
    }
}

# Push notification message format
{
    "task_id": "task-123",
    "status": "working",
    "message": "Looking up exchange rates...",
    "timestamp": "2024-01-01T12:00:00Z"
}
```

This architecture design enables A2A servers to provide real-time, reliable push notification services, allowing clients to stay informed about task status changes and providing a better user experience.

### 3. LangGraph Agent Layer

The LangGraph agent implements the core reasoning and tool usage logic:

```python
class CurrencyAgent:
    def __init__(self):
        self.model = ChatGoogleGenerativeAI(model='gemini-2.0-flash')
        self.tools = [get_exchange_rate]
        
        self.graph = create_react_agent(
            self.model,
            tools=self.tools,
            checkpointer=memory,
            prompt=self.SYSTEM_INSTRUCTION,
            response_format=(self.FORMAT_INSTRUCTION, ResponseFormat),
        )
```

### 4. Agent Executor

The executor bridges the A2A protocol with the LangGraph agent:

```python
class CurrencyAgentExecutor(AgentExecutor):
    async def execute(self, context: RequestContext, event_queue: EventQueue):
        async for item in self.agent.stream(query, task.context_id):
            if not is_task_complete and not require_user_input:
                await updater.update_status(TaskState.working, message)
            elif require_user_input:
                await updater.update_status(TaskState.input_required, message)
            else:
                await updater.add_artifact(parts, name='conversion_result')
                await updater.complete()
```

## Communication Flow

The interaction between A2A client and server follows this sequence:

```mermaid
sequenceDiagram
    participant Client as A2A Client
    participant Server as A2A Server
    participant Executor as Agent Executor
    participant Agent as LangGraph Agent
    participant LLM as Language Model
    participant API as External API

    Client->>Server: 1. Send message request
    Server->>Executor: 2. Route to executor
    Executor->>Agent: 3. Initialize agent with query
    Agent->>LLM: 4. Process with LLM
    LLM->>Agent: 5. Return reasoning/tool calls
    Agent->>API: 6. Execute tool calls
    API->>Agent: 7. Return tool results
    Agent->>LLM: 8. Process results
    LLM->>Agent: 9. Generate final response
    Agent->>Executor: 10. Stream response chunks
    Executor->>Server: 11. Update task status
    Server->>Client: 12. Stream status updates
    Server->>Client: 13. Send final result
```

**Communication Flow Description:**

This sequence diagram shows the detailed interaction flow between all components of the LangGraph + A2A system:

1. **Request Initiation** (Steps 1-3): The client sends a message request to the A2A server, which routes it to the appropriate agent executor. The executor initializes the LangGraph agent with the user's query.

2. **LLM Processing** (Steps 4-5): The agent processes the query with the Large Language Model, which returns reasoning steps and tool calls based on the user's request.

3. **Tool Execution** (Steps 6-7): The agent executes the necessary tool calls (e.g., API requests for currency conversion) and receives the results from external APIs.

4. **Result Processing** (Steps 8-9): The agent processes the tool results with the LLM to generate a coherent final response.

5. **Response Streaming** (Steps 10-13): The agent streams response chunks back through the executor to the server, which updates the client with real-time status updates and the final result.

This flow demonstrates the ReAct (Reasoning + Acting) pattern implemented by LangGraph, where the agent can reason about what tools to use, execute them, and then reason about the results to provide a final answer.

## Multi-Turn Conversation Support

One of the key strengths of this architecture is its support for multi-turn conversations:

```mermaid
stateDiagram-v2
    [*] --> Submitted: User sends initial message
    Submitted --> Working: Agent starts processing
    Working --> InputRequired: Agent needs more info
    InputRequired --> Working: User provides additional info
    Working --> Completed: Agent completes task
    Working --> Error: Processing fails
    Error --> [*]
    Completed --> [*]
```

**Multi-Turn Conversation Description:**

This state diagram illustrates how the system handles multi-turn conversations, a crucial feature for building conversational AI agents:

1. **Submitted State**: The conversation begins when a user sends their initial message. The system creates a new task and enters the working state.

2. **Working State**: The agent processes the user's request, which may involve reasoning, tool execution, or both. During this state, the agent can either complete the task or determine that additional information is needed.

3. **Input Required State**: If the agent determines that more information is needed (e.g., "What currency would you like to convert to?"), it transitions to the input-required state and waits for the user's response.

4. **Return to Working**: When the user provides additional information, the agent returns to the working state to continue processing with the complete context.

5. **Completion or Error**: The conversation can end in either a completed state (successful task completion) or an error state (processing failure), both of which terminate the conversation flow.

This state management enables natural, human-like conversations where the agent can ask clarifying questions and maintain context throughout the interaction, making it suitable for complex tasks that require multiple information exchanges.

## Framework Extensibility

This framework is highly extensible and can be adapted for various use cases. The core architecture provides a flexible foundation that can be customized with different tools, services, and external APIs.

The framework's extensibility is demonstrated through its modular design:

```mermaid
sequenceDiagram
    participant Client as A2A Client
    participant Server as A2A Server
    participant Agent as LangGraph Agent
    participant Tools as External Tools/Services

    Note over Client,Tools: Common part for a LangGraph+A2A Agent
    Client->>Server: Send task with query
    Server->>Agent: Forward query to agent
    
    Note over Tools: Customization part, it can be MCP Server or Tools
    alt Complete Information
        Agent->>Tools: Call custom tool/API
        Tools->>Agent: Return data
        Agent->>Server: Process data & return result
        Server->>Client: Respond with information
    else Incomplete Information
        Agent->>Server: Request additional input
        Server->>Client: Set state to "input-required"
        Client->>Server: Send additional information
        Server->>Agent: Forward additional info
        Agent->>Tools: Call custom tool/API
        Tools->>Agent: Return data
        Agent->>Server: Process data & return result
        Server->>Client: Respond with information
    end

    alt With Streaming
        Note over Client,Server: Real-time status updates
        Server->>Client: "Processing request..."
        Server->>Client: "Executing tools..."
        Server->>Client: Final result
    end
```

**Framework Extensibility Description:**

This diagram illustrates the framework's extensible architecture, highlighting two key aspects:

**Common Foundation:**
The initial communication flow between A2A Client, Server, and LangGraph Agent represents the core, standardized part of the framework. This common foundation ensures:
- Consistent protocol compliance across all implementations
- Standardized request/response handling
- Reliable state management and streaming support
- Interoperability between different agent implementations

**Customization Layer:**
The external tools and services represent the highly customizable part of the framework. This "Customization part" can be:
- **MCP Servers**: Model Context Protocol servers for standardized tool access
- **Custom APIs**: Direct integration with external services
- **Specialized Tools**: Domain-specific tools and utilities
- **Database Connections**: Direct database access for data retrieval
- **Cloud Services**: Integration with cloud-based APIs and services

**Key Extensibility Features:**

1. **Tool Agnostic**: The framework doesn't prescribe specific tools - any external service can be integrated
2. **Protocol Standard**: The A2A protocol ensures consistent communication regardless of the underlying tools
3. **Modular Design**: Components can be swapped and extended without affecting the core architecture
4. **Service Discovery**: The framework supports dynamic tool discovery and registration
5. **Error Handling**: Robust error handling for external service failures

**Implementation Examples:**

### 1. Tool Integration

The framework can easily integrate with any external tools or APIs:

```python
@tool
def custom_tool(param1: str, param2: str):
    """Custom tool description."""
    # Tool implementation
    return result
```

### 2. MCP Server Integration

Model Context Protocol (MCP) servers can be seamlessly integrated:

```python
async def _create_agent_with_mcp_tools(self):
    """Create agent with MCP tools loaded from math server"""
    # Get the path to the math MCP server
    current_dir = Path(__file__).parent.parent
    math_server_path = current_dir / "math_mcp_server.py"
    
    server_params = StdioServerParameters(
        command="python",
        args=[str(math_server_path)],
    )
    
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            
            # Load MCP tools
            tools = await load_mcp_tools(session)
            print(f"✅ Loaded {len(tools)} MCP tools:")
            for tool in tools:
                print(f"  - {tool.name}: {tool.description}")
            
            # Create agent with MCP tools
            self.agent = create_react_agent(self.model, tools)
            return session  # Return session to keep it alive
```

This extensible architecture allows developers to:
- **Integrate any external service** without modifying the core framework
- **Maintain protocol compliance** while adding custom functionality
- **Scale horizontally** by adding new tools and services
- **Ensure reliability** through standardized error handling and retry mechanisms
- **Support diverse use cases** from simple API calls to complex multi-service orchestration

The framework's design philosophy emphasizes that the core A2A + LangGraph foundation should remain stable and standardized, while the tool integration layer should be as flexible and extensible as possible to accommodate any external service or API.

## Conclusion

The combination of LangGraph and A2A protocol provides a powerful foundation for building sophisticated AI agents. This architecture offers:

- **Standardized Communication**: A2A protocol ensures interoperability
- **Flexible Workflows**: LangGraph enables complex reasoning patterns
- **Real-time Interaction**: Streaming support for responsive user experience
- **Extensible Design**: Easy integration with tools, MCP servers, and other agents
- **Production Ready**: Built-in error handling, monitoring, and deployment support

This framework represents a significant step forward in AI agent development, providing the tools and patterns needed to build the next generation of intelligent, collaborative AI systems.

## Resources

- [A2A Protocol Documentation](https://a2a-protocol.org/)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Sample Code Repository](https://github.com/a2aproject/a2a-samples)