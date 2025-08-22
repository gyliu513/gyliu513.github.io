---
layout: post
title:  "MCP Sampling: Architecture, Workflow, and Practical Guide"
date:   2025-08-21 08:17:10 -0400
categories: jekyll update
tag: [MCP, Sampling]
---

## Background

Model Context Protocol (MCP) defines a standard way for clients and servers to interoperate around tools, prompts, and data. A common requirement in tool implementations is “ask an LLM to help,” but bundling inference into the server creates deployment, cost, and vendor-lock challenges.

MCP Sampling addresses this by letting the server delegate language generation to the client. The client owns LLM selection and billing, while the server stays focused on deterministic business logic.

Further reading: [Servers: Sampling](https://gofastmcp.com/servers/sampling), [Clients: Sampling](https://gofastmcp.com/clients/sampling).

## What is MCP Sampling

MCP Sampling is a request/response mechanism where server-side tool code calls `ctx.sample(...)` to request text (or structured) generation. The request is transported to the MCP client, which executes the actual model call via its configured provider (OpenAI, Anthropic, local Ollama, etc.) and returns the result back to the server.

Key ideas:

- `ctx.sample(...)` suspends the server tool coroutine until the client replies, enabling asynchronous LLM integration.
- The client implements a `sampling_handler` that receives messages and generation parameters, then returns model output.
- Messages can be a single string or a chat-style list of role/content messages; parameters typically include `model`, `temperature`, `max_tokens`, `top_p`, `frequency_penalty`, etc.
- The sampling request follows the MCP protocol specification for tool execution and response handling.

## Why MCP Sampling

- **Server Architecture**: Eliminates server-side model runtime dependencies, GPU requirements, and credential management.
- **Cost Optimization**: Clients bear inference costs and manage their own rate limiting, token budgets, and provider contracts.
- **Model Flexibility**: Each client can select optimal models for their environment (local vs. cloud, model size vs. latency trade-offs).
- **Context Consistency**: The same client LLM that handles user interactions can process server sampling requests, maintaining conversation coherence.
- **Deployment Simplicity**: Servers remain stateless and portable across different hosting environments.

## MCP Sampling Architecture

```mermaid
graph TD
  U[User or System] --> S[MCP Server - tool logic]
  S --> CS[ctx.sample]
  CS --> CL[Client sampling handler]
  CL --> LLM[Client LLM]
  LLM --> CL
  CL --> S
  S --> R[Return tool result]
```

**Architecture Overview**: This diagram illustrates the data flow and component interactions in MCP Sampling. The architecture demonstrates how server-side tool execution delegates language generation tasks to client-side LLM providers through the sampling interface. The bidirectional flow between client and server enables asynchronous processing while maintaining tool execution context.

**Component Responsibilities**:
- **User/System**: Initiates tool execution requests through the MCP client interface
- **MCP Server**: Hosts deterministic business logic and orchestrates sampling requests
- **ctx.sample**: Acts as the sampling rendezvous point, suspending tool execution until LLM response
- **Client Handler**: Implements the sampling interface and manages LLM provider communication
- **Client LLM**: Executes the actual language model inference based on sampling parameters

**Data Flow Characteristics**: The architecture supports non-blocking tool execution through coroutine suspension, enabling efficient resource utilization while maintaining request-response semantics.

## MCP Sampling Workflow

```mermaid
sequenceDiagram
  participant U as User
  participant S as Server
  participant C as ctx.sample
  participant CL as Client
  participant L as LLM
  U ->> S: Invoke tool
  S ->> C: ctx.sample(messages, params)
  C ->> CL: Sampling request
  CL ->> L: Call model
  L -->> CL: Output
  CL -->> C: Response
  C -->> S: Resume tool
  S -->> U: Final result
```

**Workflow Dynamics**: This sequence diagram captures the temporal execution flow of MCP Sampling, illustrating the asynchronous communication patterns between system components. The workflow demonstrates how tool execution state is preserved during LLM inference and resumed upon completion.

**Execution Phases**:
- **Tool Initialization**: Server receives tool invocation and begins deterministic processing
- **Sampling Request**: Server issues sampling call with message payload and generation parameters
- **LLM Execution**: Client-side handler performs model inference with specified parameters
- **Response Processing**: Generated content is returned through the sampling interface
- **Tool Resumption**: Server resumes execution context and produces final output

**Protocol Characteristics**: The workflow maintains MCP protocol compliance while enabling seamless integration of probabilistic language generation into deterministic tool execution flows.

Parameters and contracts:

- Messages: string or list of role/content messages.
- Params: typically `model`, `temperature`, `max_tokens`, etc.
- Return: text (and optionally structured fields) consumed by server logic.

## Practical Use Cases

- **Content Processing**: Summarization of documents, logs, or transcripts with configurable length and style parameters.
- **Classification Tasks**: Sentiment analysis, intent detection, content moderation, and multi-label categorization.
- **Language Operations**: Translation, tone/style rewriting, grammar correction, and language detection.
- **Code Intelligence**: Code explanation, inline commenting, documentation generation, and code review assistance.
- **Analytics Narrative**: Transform time-series metrics, logs, and structured data into human-readable reports.
- **Communication**: Draft context-aware replies, email summaries, and chat responses based on conversation history.
- **Educational Content**: Generate explanations at different complexity levels, create study materials, and provide step-by-step guidance.

## Production Notes & Gotchas

- **Client Implementation**: Sampling handlers are mandatory; `ctx.sample()` will throw an error if the client doesn't implement the required interface.
- **Transport Layer**: Sampling operates over stdio and Server-Sent Events (SSE); evaluate latency characteristics and implement appropriate backpressure handling.
- **HTTP Deployment**: Some stateless HTTP deployments experience hanging issues; verify behavior in your target environment and consider stateful alternatives.
- **Multi-Server Routing**: Ensure proper session management when clients connect to multiple servers to avoid sampling request misrouting.
- **Error Handling**: Implement comprehensive timeout handling, retry logic, and fallback mechanisms around `ctx.sample(...)` calls.
- **Parameter Design**: Expose `model`, `temperature`, `max_tokens`, `top_p`, and other generation parameters to maintain provider-agnostic server logic.
- **Observability**: Implement structured logging for request/response times, token consumption, and cost tracking; consider OpenTelemetry integration for distributed tracing.
- **Rate Limiting**: Coordinate with client-side rate limiting policies to prevent sampling request throttling.

## Takeaways

- **Architectural Benefits**: Sampling provides clean separation of concerns between deterministic business logic and probabilistic language generation.
- **Operational Advantages**: Clients maintain full control over model selection, cost management, and compliance policies.
- **Deployment Benefits**: Servers achieve enhanced portability, security through credential isolation, and simplified operational complexity.
- **Scalability**: Enables horizontal scaling of server instances without LLM resource constraints.

## Appendix: Minimal Server Example (`ctx.sample`)

```python
from fastmcp import FastMCP, Context, schema

mcp = FastMCP("SamplingDemo")

class SentimentResult(schema.BaseModel):
    text: str
    sentiment: str

@mcp.tool
async def analyze_sentiment(text: str, ctx: Context) -> SentimentResult:
    prompt = (
        "Classify the following text as 'positive', 'negative', or 'neutral'. "
        "Return only one word.\n\n" f"Text: {text}"
    )
    resp = await ctx.sample(
        messages=prompt,
        temperature=0.0,
        max_tokens=8,
    )
    label = (resp.text or "").strip().lower()
    if label not in {"positive", "negative", "neutral"}:
        label = "neutral"
    return SentimentResult(text=text, sentiment=label)

if __name__ == "__main__":
    mcp.run()
```

For a complete working example including client implementation, error handling, and production-ready patterns, visit the [full MCP Sampling example repository](https://github.com/gyliu513/langX101/tree/main/fastmcp/sampling).