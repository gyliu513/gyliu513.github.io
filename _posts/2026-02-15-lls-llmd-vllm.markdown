---
layout: post
title:  "A Practical Deep Dive into LlamaStack, MaaS, llm-d, and vLLM"
date:   2026-02-15 08:17:10 -0400
categories: jekyll update
tags:
  - llamastack
  - maas
  - llm-d
  - vllm
---

As AI systems transition from proof-of-concept to production, architectural complexity increases significantly. Responsibilities that appear well-defined in isolation, authentication, rate limiting, request routing, often become duplicated or conflated across multiple layers. The result is not a shortage of capable components, but a lack of clearly delineated boundaries between them.

When the model serving layer, API gateway, orchestration platform, and runtime each intercept the same inference request, overlapping concerns are inevitable. Debugging in these environments frequently traces back to architectural ambiguity rather than implementation defects.

This post presents a structured reference model for the modern AI inference stack, organized around four distinct layers:

- **Control Plane**: governance and policy enforcement
- **Data Plane**: intelligent request routing
- **Runtime**: efficient execution
- **Platform Layer**: workflow orchestration

The discussion examines where **LlamaStack**, **MaaS**, **llm-d**, and **vLLM** fit within this architecture, and why maintaining clear separation of concerns is essential for building scalable, maintainable AI infrastructure.

---

## Why the Confusion Exists

Traditional cloud architectures have well-established patterns. Kubernetes handles container orchestration. API gateways deal with authentication and routing. Application code implements business logic. These boundaries are clear because each layer operates on different abstractions.

AI infrastructure doesn't play by the same rules. Consider what happens during a single inference request:

- The runtime needs to inspect the prompt for batching decisions
- The scheduler examines model type and payload size for routing
- The orchestration layer might track conversation state
- The control plane enforces quotas based on token counts
- Safety systems scan content at multiple checkpoints

Every layer touches the request. Every layer "cares" about what's inside. This creates natural tension: should the runtime handle rate limiting since it knows about token throughput? Should the orchestration layer manage GPU selection since it understands workload patterns?

The answer isn't to merge everything into a monolithic system. Experience from distributed systems teaches us that consolidation trades flexibility for short-term convenience. What we need instead is deliberate separation of concerns, even when those concerns operate on the same data.

Here's a visual representation of how a single inference request flows through each layer, and what each layer extracts or modifies:

```mermaid
flowchart LR
    subgraph Request_Journey
        R1["User Query:<br/>'Explain quantum computing'"]
        R2["+ API Key:<br/>tenant-abc-123"]
        R3["+ Routing Hints:<br/>model=llama3-70b<br/>prefix_hash=7a3f2b"]
        R4["+ Batch Context:<br/>tokens=[15234, 8991, ...]<br/>kv_pages=[0x2A, 0x3B]"]
        R5["Response:<br/>'Quantum computing...'"]
    end

    R1 -->|LlamaStack adds| R2
    R2 -->|MaaS validates & adds| R3
    R3 -->|llm-d routes to best replica| R4
    R4 -->|vLLM executes efficiently| R5

    style R1 fill:#e1f5ff
    style R2 fill:#fff3e0
    style R3 fill:#f3e5f5
    style R4 fill:#e8f5e9
    style R5 fill:#fce4ec
```

Each layer enriches the request with metadata needed for downstream processing, then strips unnecessary information on the return path. This keeps interfaces clean and prevents information leakage across security boundaries.

---

## The Four-Layer Architecture

Here's the mental model I've found most useful when thinking about production AI infrastructure:

```mermaid
flowchart TB
    App[Applications / Agents]

    subgraph Platform_Layer
        LS[LlamaStack]
    end

    subgraph Control_Plane
        MAAS[MaaS]
    end

    subgraph Data_Plane
        LLD[llm-d]
    end

    subgraph Runtime
        VLLM[vLLM]
        GPU[GPU Nodes]
    end

    App --> LS
    LS --> MAAS
    MAAS --> LLD
    LLD --> VLLM
    VLLM --> GPU
```

Reading from top to bottom: applications interact with LlamaStack for workflow orchestration. MaaS enforces governance policies. llm-d makes intelligent routing decisions. vLLM handles efficient execution on GPU hardware.

Think of each layer as answering a single question:

| Layer | Primary Responsibility |
|-------|------------------------|
| LlamaStack | What intelligent workflow is being executed? |
| MaaS | Who is allowed and under what policy? |
| llm-d | Where should this request run? |
| vLLM | How should it execute efficiently? |

When each component owns exactly one concern, the system becomes easier to reason about, debug, and scale. This isn't theoretical, these boundaries emerge naturally from production experience.

To make the separation concrete, here's what each layer "sees" and what it deliberately ignores:

```mermaid
graph TB
    subgraph LlamaStack_View
        LS1[Agent Workflow State]
        LS2[Tool Invocation History]
        LS3[Memory Context]
        LS4[RAG Retrieval Results]
        LS_NO[❌ GPU Utilization<br/>❌ Token Quotas<br/>❌ KV Cache State]
    end

    subgraph MaaS_View
        M1[API Keys & Tenants]
        M2[Token Usage Counters]
        M3[Rate Limit Windows]
        M4[SLA Thresholds]
        M_NO[❌ Prompt Content<br/>❌ GPU Selection<br/>❌ Batch Composition]
    end

    subgraph llmd_View
        L1[Replica Telemetry]
        L2[KV Cache Occupancy]
        L3[Prompt Prefix Hashes]
        L4[Queue Lengths]
        L_NO[❌ User Identity<br/>❌ Billing Data<br/>❌ GPU Kernels]
    end

    subgraph vLLM_View
        V1[Active Batches]
        V2[KV Page Tables]
        V3[Token Generation State]
        V4[GPU Memory Layout]
        V_NO[❌ Authorization<br/>❌ Routing Logic<br/>❌ Agent Workflows]
    end
```

This separation isn't arbitrary; it's what allows teams to work independently. The LlamaStack team can add new agent patterns without understanding vLLM internals. The MaaS team can update quota logic without touching the scheduler. The vLLM maintainers can optimize GPU kernels without breaking the control plane.

---

## Control Plane: MaaS

Once AI moves from a team experiment to an organizational capability, governance becomes non-negotiable. You need to know who's calling what, how much they're using, and whether they're allowed to do so.

Model as a Service ([MaaS](https://www.redhat.com/en/topics/ai/what-is-models-as-a-service)) provides this control layer by hosting pre-trained models on shared infrastructure and exposing them through governed APIs. The control plane handles everything you'd expect from enterprise infrastructure:

- Authentication and authorization
- Multi-tenant isolation
- Rate limiting and quotas
- Usage tracking and chargeback
- SLA enforcement
- Audit logging

According to Red Hat's [enterprise AI documentation](https://developers.redhat.com/articles/2025/07/17/expand-model-service-secure-enterprise-ai), MaaS implementations typically integrate an API gateway with the AI infrastructure to "manage and monitor AI use at a very granular level." This centralization streamlines operations while maintaining the security focus and compliance requirements that enterprises demand.

Here's how the control plane components interact:

```mermaid
flowchart TB
    Client[Client Request] --> APIGateway[API Gateway]
    APIGateway --> Auth[Authentication Service]
    Auth --> AuthZ[Authorization & Policy Engine]
    AuthZ --> Quota[Quota Manager]
    Quota --> RateLimit[Rate Limiter]
    RateLimit --> Metrics[Usage Metrics Collector]
    Metrics --> Forward[Forward to Data Plane]

    subgraph MaaS_Control_Plane
        APIGateway
        Auth
        AuthZ
        Quota
        RateLimit
        Metrics
    end

    AuthDB[(Auth DB)] -.-> Auth
    PolicyDB[(Policy DB)] -.-> AuthZ
    QuotaDB[(Quota DB)] -.-> Quota
    MetricsDB[(Metrics DB)] -.-> Metrics

    Forward --> DataPlane[llm-d Scheduler]
```

Each control plane component has a specific role: the API gateway terminates TLS and validates request format, authentication verifies identity, authorization checks permissions against policies, quota management enforces consumption limits, rate limiting prevents abuse, and metrics collection enables billing and monitoring.

What MaaS explicitly does **not** handle:

- GPU replica selection
- KV cache management
- Request batching optimization
- Agent workflow execution

These concerns belong in other layers. The control plane makes authorization decisions before the request enters the data plane. This separation prevents governance logic from leaking into performance-critical code paths. You don't want authentication checks mixed with GPU scheduling decisions.

---

## Data Plane: llm-d

After authorization clears, you face a different problem: which GPU should handle this request?

At small scale, round-robin load balancing works fine. But as you add replicas, increase concurrency, and mix different workload types (chat, embeddings, structured generation), naive scheduling leaves performance on the table.

[llm-d](https://github.com/llm-d/llm-d) is a Kubernetes-native inference scheduler built specifically for LLM workloads. Developed collaboratively by IBM, Google, and Red Hat, it makes routing decisions based on inference-specific signals rather than generic infrastructure metrics.

```mermaid
flowchart LR
    Req[Request] --> Analyze[Inspect Model & Prompt]
    Analyze --> Score[Score Replicas]
    Score --> Route[Select Optimal Instance]
    Route --> Execute[vLLM Instance]
```

The scheduling process works like this:

**Inspect Model & Prompt**: The scheduler extracts routing signals from the request without full deserialization. It identifies the target model, prompt prefix patterns, and generation parameters.

**Score Replicas**: Available instances get scored using inference-aware metrics: current KV cache occupancy, decode queue backlog, prompt prefix overlap, and recent token latency. [Recent llm-d benchmarks](https://developers.redhat.com/articles/2025/10/07/master-kv-cache-aware-routing-llm-d-efficient-ai-inference) show that cache-aware routing achieves ~90% KV cache hit rates compared to ~45% with standard load balancing, a 70% reduction in compute time for repeated prompts.

**Select Optimal Instance**: The replica with the best score gets the request. This often means routing to the instance already holding relevant cached prefixes, dramatically improving both latency and throughput.

The [llm-d 0.5 release](https://llm-d.ai/blog/llm-d-v0.5-sustaining-performance-at-scale) adds hierarchical KV offloading, which decouples cache capacity from GPU memory by using CPU and filesystem tiers. This enables much larger effective cache pools without proportionally increasing GPU costs.

Here's a detailed view of the llm-d scheduling decision process:

```mermaid
flowchart TD
    Request[Incoming Request] --> Extract[Extract Routing Metadata]
    Extract --> ModelID[Model ID]
    Extract --> PrefixHash[Prompt Prefix Hash]
    Extract --> GenParams[Generation Parameters]

    ModelID --> Filter[Filter Compatible Replicas]
    Filter --> Replica1[vLLM Replica 1]
    Filter --> Replica2[vLLM Replica 2]
    Filter --> Replica3[vLLM Replica 3]

    Replica1 --> Score1[Score Calculation]
    Replica2 --> Score2[Score Calculation]
    Replica3 --> Score3[Score Calculation]

    subgraph Scoring_Factors
        KVHit[KV Cache Hit Probability: +50]
        QueueLen[Queue Length: -20]
        DecodeLoad[Decode Backlog: -15]
        TokenLat[Recent Token Latency: -10]
    end

    Score1 -.-> Scoring_Factors
    Score2 -.-> Scoring_Factors
    Score3 -.-> Scoring_Factors

    Score1 --> Compare{Compare Scores}
    Score2 --> Compare
    Score3 --> Compare

    Compare -->|Highest Score| Selected[Selected Replica]
    Selected --> Route[Route Request]
```

Kubernetes schedules pods based on CPU and RAM. llm-d schedules inference based on token generation dynamics. That's the fundamental difference.

---

## Runtime: vLLM

Once a request lands on a GPU, the runtime determines how efficiently that hardware gets used. This is where the actual model execution happens: prompt processing, KV cache management, token generation, and response streaming.

[vLLM](https://github.com/vllm-project/vllm) is a high-throughput, memory-efficient inference engine originally developed at UC Berkeley's Sky Computing Lab. It's become the de facto standard for LLM serving, offering [up to 24x throughput improvements](https://blog.vllm.ai/) compared to naive implementations.

```mermaid
flowchart TB
    Request --> Queue
    Queue --> Batch
    Batch --> KVCache
    KVCache --> TokenLoop
    TokenLoop --> Response
```

The execution flow:

Requests enter a queue managed by the vLLM scheduler. Continuous batching dynamically groups compatible requests. Unlike traditional batching that waits for a full batch to form, continuous batching adds and removes requests as they arrive and complete.

PagedAttention, vLLM's core innovation, treats KV cache as pageable memory blocks rather than contiguous tensors. This eliminates fragmentation and allows much higher effective batch sizes. Cache pages get reused across requests when prompts share prefixes.

Token generation runs iteratively, with the scheduler making batching decisions at each step. As tokens stream back, completed requests leave the batch and new ones enter, keeping GPU utilization high.

Recent work on NVIDIA's Blackwell architecture shows [38% throughput gains and 13% latency improvements](https://blog.vllm.ai/2026/02/01/gpt-oss-optimizations.html) through kernel fusion via `torch.compile` and tight FlashInfer integration.

Here's how vLLM's internal architecture handles concurrent requests efficiently:

```mermaid
flowchart TB
    subgraph Request_Lifecycle
        Req1[Request 1: Prefill] --> Queue[Request Queue]
        Req2[Request 2: Decode] --> Queue
        Req3[Request 3: Prefill] --> Queue
        Req4[Request 4: Decode] --> Queue
    end

    Queue --> Scheduler[vLLM Scheduler]
    Scheduler --> BatchDecision{Batching Decision}

    BatchDecision --> Batch[Active Batch]

    subgraph GPU_Execution
        Batch --> PagedAttn[PagedAttention]
        PagedAttn --> KVMgr[KV Cache Manager]

        KVMgr --> GPUMem[GPU Memory Pages]
        KVMgr --> Reuse[Prefix Reuse]

        GPUMem --> Compute[GPU Kernel Execution]
        Reuse --> Compute

        Compute --> TokenGen[Token Generation]
    end

    TokenGen --> StreamOut[Stream Output]
    TokenGen --> Continue{More Tokens?}

    Continue -->|Yes| Batch
    Continue -->|No| Complete[Request Complete]

    Complete --> FreePages[Free KV Pages]
    FreePages --> KVMgr

    StreamOut --> Client[Client Response]
```

The diagram shows how vLLM continuously manages multiple requests in different states: some in prefill (processing the initial prompt), others in decode (generating tokens). The PagedAttention mechanism allows efficient memory sharing and reuse, while the scheduler makes per-iteration decisions about which requests to include in the current batch.

vLLM optimizes execution **within a single instance**. It doesn't make routing decisions; that's the data plane's job. It doesn't enforce quotas; that's the control plane's responsibility. It focuses entirely on extracting maximum performance from available GPU resources.

---

## Platform Layer: LlamaStack

The layers we've discussed so far (control, data, and runtime) handle the mechanics of serving models. But modern AI applications need more than raw inference. They need multi-step reasoning, tool use, memory management, and RAG patterns.

[LlamaStack](https://llamastack.github.io) is an open-source platform designed to define and standardize the core building blocks for AI application development, exposing them through a unified, consistent interface.

The platform handles:

- **Agent workflows**: multi-step task decomposition and planning
- **Tool invocation**: structured calling of external APIs and functions
- **Memory systems**: conversation history and context management
- **RAG orchestration**: retrieval and generation coordination
- **Provider abstraction**: swappable backends for different deployment scenarios

```mermaid
flowchart TB
    User --> AgentPlan
    AgentPlan --> ToolCall
    ToolCall --> Memory
    Memory --> Model_Invocation
    Model_Invocation --> Response
```

An agent receives a task and breaks it into steps. It might call external tools, retrieve relevant memory, and invoke models multiple times before synthesizing a response. The key is that LlamaStack operates at the workflow level, not the infrastructure level.

LlamaStack doesn't manage GPUs; that's the runtime's job. It doesn't enforce quotas; that's the control plane. It orchestrates intelligent behavior by composing lower-level primitives into coherent applications.

---

## How the Layers Collaborate

Theory aside, let's trace what actually happens when a user sends a request through this stack.

```mermaid
flowchart LR
    User --> LlamaStack
    LlamaStack --> MaaS
    MaaS --> llm-d
    llm-d --> vLLM
    vLLM --> GPU
    GPU --> vLLM
    vLLM --> LlamaStack
    LlamaStack --> User
```

A user asks a complex question that requires multi-step reasoning. LlamaStack receives this, identifies it as an agent task, and begins orchestrating a plan. That plan includes calling an LLM for reasoning.

Before the inference happens, the request passes through MaaS. The control plane validates the API key, checks that this user hasn't exceeded their monthly quota, and confirms they're authorized for this model tier. If everything checks out, it forwards the request with minimal added latency.

Now llm-d gets involved. It inspects the request metadata (target model, prompt prefix, expected output length) and scores the available vLLM replicas. One replica already has a relevant prefix cached from a similar recent query. That replica gets the request.

vLLM receives it, recognizes the prefix cache hit, skips re-processing those tokens, and begins generation. Continuous batching lets it handle this alongside other active requests. Tokens stream back as they're generated.

The response flows back through LlamaStack, which incorporates it into the agent's workflow. Depending on the result, the agent might trigger additional tool calls or more inference requests, each following the same path.

Notice what didn't happen: no layer tried to do another layer's job. MaaS didn't attempt scheduling. llm-d didn't manage KV cache. vLLM didn't enforce quotas. LlamaStack didn't optimize GPU kernels. Clean separation of concerns scales far better than clever consolidation.

Here's a detailed sequence diagram showing the timing and interactions:

```mermaid
sequenceDiagram
    participant User
    participant LlamaStack
    participant MaaS
    participant llmd as llm-d
    participant vLLM
    participant GPU

    User->>LlamaStack: Complex query requiring reasoning
    activate LlamaStack
    Note over LlamaStack: Decompose into agent workflow<br/>Identify LLM inference needed

    LlamaStack->>MaaS: Inference request + API key
    activate MaaS
    Note over MaaS: Validate API key<br/>Check quota (tokens/month)<br/>Verify model access<br/>Record usage
    MaaS-->>LlamaStack: Authorized ✓
    deactivate MaaS

    LlamaStack->>llmd: Inference request + metadata
    activate llmd
    Note over llmd: Extract model ID<br/>Hash prompt prefix<br/>Query replica telemetry<br/>Score candidates<br/>Select best replica
    llmd-->>LlamaStack: Route to Replica 2
    deactivate llmd

    LlamaStack->>vLLM: Execute inference on Replica 2
    activate vLLM
    Note over vLLM: Add to request queue<br/>Prefix cache HIT<br/>Add to active batch
    vLLM->>GPU: Batch execution
    activate GPU
    Note over GPU: Process batch<br/>Generate tokens<br/>Update KV cache
    GPU-->>vLLM: Token stream
    deactivate GPU
    vLLM-->>LlamaStack: Stream tokens
    deactivate vLLM

    LlamaStack->>LlamaStack: Incorporate into workflow<br/>May trigger tool calls<br/>or additional inference
    LlamaStack-->>User: Final response
    deactivate LlamaStack
```

This sequence illustrates several key points: authorization happens before expensive operations, routing decisions use real-time telemetry, cache hits avoid redundant computation, and each layer completes its work before the next layer takes over. The total latency is the sum of these steps, which is why keeping each layer focused and efficient matters.

---

## Deployment Modes

Not every deployment needs every layer. The architecture should match your current scale and complexity, not some theoretical future state.

### Development & Prototyping

```mermaid
flowchart LR
    App --> LlamaStack --> vLLM
```

When you're building a prototype or running local development, just connect your application to LlamaStack backed by a single vLLM instance. No governance layer, no scheduler, no complexity.

This works perfectly fine for:
- Individual developer workflows
- Proof-of-concept demos
- Small team experiments
- Single-user applications

You're trading operational simplicity for features you don't need yet. That's a good trade.

### Multi-Replica Production

```mermaid
flowchart LR
    App --> LlamaStack --> llm-d --> vLLM
```

As traffic grows and you add GPU replicas, naive load balancing starts showing cracks. You see high P99 latencies despite available capacity. GPU utilization is uneven. Cache hit rates are poor.

This is when llm-d makes sense. You get:
- Inference-aware request routing
- KV cache affinity scheduling
- Better resource utilization across replicas
- Lower tail latencies under load

The added complexity pays for itself through efficiency gains.

### Enterprise Deployment

```mermaid
flowchart LR
    App --> LlamaStack --> MaaS --> llm-d --> vLLM --> GPU
```

Multi-tenant environments, chargeback requirements, compliance mandates, and SLA contracts all point toward needing a proper control plane. This is the full stack.

MaaS gives you:
- Per-tenant quota enforcement
- Usage-based billing data
- Audit trails for compliance
- SLA monitoring and alerting
- Multi-tier access controls

Deploy all four layers when organizational requirements demand it, not before.

Here's a comprehensive architectural diagram showing all components and their interactions in an enterprise deployment:

```mermaid
flowchart TB
    subgraph Client_Applications
        App1[Web App]
        App2[Mobile App]
        App3[CLI Tool]
    end

    subgraph Platform_Layer [" Platform Layer: LlamaStack "]
        Agent[Agent Orchestrator]
        Tools[Tool Registry]
        Memory[Memory Manager]
        RAG[RAG Coordinator]
    end

    subgraph Control_Plane [" Control Plane: MaaS "]
        Gateway[API Gateway]
        AuthN[Authentication]
        AuthZ[Authorization]
        Quota[Quota Manager]
        Billing[Billing & Metrics]
    end

    subgraph Data_Plane [" Data Plane: llm-d "]
        InfGW[Inference Gateway]
        Scheduler[Request Scheduler]
        Telemetry[Telemetry Collector]
        Router[Replica Router]
    end

    subgraph Runtime_Layer [" Runtime Layer: vLLM "]
        direction LR
        subgraph Replica1 [" vLLM Replica 1 "]
            R1Sched[Scheduler]
            R1KV[KV Manager]
            R1GPU1[GPU 0]
        end

        subgraph Replica2 [" vLLM Replica 2 "]
            R2Sched[Scheduler]
            R2KV[KV Manager]
            R2GPU2[GPU 1]
        end

        subgraph Replica3 [" vLLM Replica 3 "]
            R3Sched[Scheduler]
            R3KV[KV Manager]
            R3GPU3[GPU 2]
        end
    end

    App1 & App2 & App3 --> Agent
    Agent --> Tools & Memory & RAG
    Agent --> Gateway

    Gateway --> AuthN --> AuthZ --> Quota --> Billing
    Billing --> InfGW

    InfGW --> Scheduler --> Telemetry --> Router

    Router -->|High KV hit| Replica1
    Router -->|Low queue| Replica2
    Router -->|Best latency| Replica3

    R1Sched --> R1KV --> R1GPU1
    R2Sched --> R2KV --> R2GPU2
    R3Sched --> R3KV --> R3GPU3

    R1GPU1 & R2GPU2 & R3GPU3 -.->|Metrics| Telemetry

    style Platform_Layer fill:#e3f2fd
    style Control_Plane fill:#fff3e0
    style Data_Plane fill:#f3e5f5
    style Runtime_Layer fill:#e8f5e9
```

This complete view shows how independent scaling works: you can add more vLLM replicas without touching the control plane, update quota policies without redeploying the scheduler, or enhance agent capabilities without modifying the runtime layer.

---

## Common Questions

**"Doesn't vLLM only handle chat completion?"**

No. vLLM supports multiple inference modes: chat completion, text generation, embeddings, structured output generation, and streaming. It's a general-purpose LLM runtime, not a chat-specific server.

**"Why does llm-d need to inspect request payloads? Isn't that a security concern?"**

llm-d extracts lightweight routing metadata (target model, prompt prefix patterns, expected output length) without logging or persisting sensitive content. It needs just enough information to make intelligent scheduling decisions. Think of it like a Layer 7 load balancer that routes based on HTTP headers without storing request bodies.

**"Isn't LlamaStack competing with MaaS?"**

They solve different problems. LlamaStack orchestrates intelligent workflows (agents, tools, memory). MaaS enforces governance (quotas, auth, billing). You'd typically use both: LlamaStack for application logic, MaaS for operational control.

**"Can't Kubernetes handle scheduling instead of llm-d?"**

Kubernetes schedules pods based on CPU, memory, and custom resource requests. It doesn't understand KV cache occupancy, prompt prefix overlap, or decode queue backlog. llm-d makes decisions based on inference-specific telemetry that Kubernetes can't see. They're complementary: Kubernetes manages the pod lifecycle, llm-d routes requests within those pods.

---

## Closing Thoughts

Production AI infrastructure works best when it's organized around clear architectural boundaries. The four-layer model presented here (platform, control, data, and runtime) emerges naturally from the distinct concerns that real deployments face.

**LlamaStack** orchestrates intelligent workflows at the application level. **MaaS** enforces governance and policy. **llm-d** makes inference-aware routing decisions. **vLLM** optimizes GPU execution efficiency.

None of these components is particularly complicated on its own. The complexity comes from unclear boundaries: when scheduling logic leaks into the runtime, when governance checks scatter across layers, when each component tries to solve problems outside its core responsibility.

Getting the architecture right doesn't eliminate complexity, but it contains it. Each layer can evolve independently. Teams can debug issues without understanding the entire stack. New capabilities slot into the appropriate layer without sprawling refactors.

If you're building AI infrastructure, start simple. Add layers as actual requirements emerge. But when you do add them, put them in the right place. The architectural clarity pays compounding dividends as the system scales.

---

## Sources & Further Reading

- [vLLM GitHub Repository](https://github.com/vllm-project/vllm)
- [vLLM Performance on NVIDIA Blackwell](https://blog.vllm.ai/2026/02/01/gpt-oss-optimizations.html)
- [llm-d Project Page](https://github.com/llm-d/llm-d)
- [llm-d v0.5 Release Notes](https://llm-d.ai/blog/llm-d-v0.5-sustaining-performance-at-scale)
- [KV Cache-Aware Routing with llm-d](https://developers.redhat.com/articles/2025/10/07/master-kv-cache-aware-routing-llm-d-efficient-ai-inference)
- [LlamaStack Official Site](https://llamastack.github.io)
- [Meta's LlamaCon Announcement](https://ai.meta.com/blog/llamacon-llama-news/)
- [Model as a Service Overview: Red Hat](https://www.redhat.com/en/topics/ai/what-is-models-as-a-service)
- [Expanding MaaS for Enterprise AI](https://developers.redhat.com/articles/2025/07/17/expand-model-service-secure-enterprise-ai)