---
layout: post
title:  "Building a Local-First Multi-Agent System with LangGraph and Ollama"
date:   2025-08-10 08:17:10 -0400
categories: jekyll update
tag: [LangGraph, ollama]
---

# Building a Local-First Multi-Agent System with LangGraph and Ollama

In the world of AI, multi-agent systems are all the rage. They promise to tackle complex problems by breaking them down and assigning specialized AI agents to each piece. But as we build these powerful systems, concerns about data privacy, API costs, and vendor lock-in are growing. What if you could build and run a sophisticated multi-agent system entirely on your own machine?

Thanks to the combination of **LangGraph** for agent orchestration and **Ollama** for local model inference, this is not just possible—it's surprisingly straightforward.

In this post, we'll walk through how to build a multi-agent system that uses a supervisor to intelligently route tasks. The best part? It runs completely locally, using Ollama for both language model inference and generating the embeddings that power the routing logic.

## The Architecture: A Supervisor with a Team of Specialists

Our system is built around a "supervisor" pattern. Imagine a project manager who receives a request and, based on its content, decides which expert (or experts) on their team is best suited to handle it.

Here's how it works:
1.  A user sends a query.
2.  A **Supervisor** node analyzes the query.
3.  Using **vector embeddings**, the supervisor calculates the semantic similarity between the query and the described capabilities of each specialized agent.
4.  It selects the most appropriate agent(s).
5.  If one agent is selected, the task is routed directly to them.
6.  If multiple agents are selected (for a complex query), a **Multi-Agent Handler** coordinates their responses and synthesizes a single, comprehensive answer.

Our team of specialized agents includes:
*   **General Conversation Agent**: For chit-chat and general questions.
*   **Technical Support Agent**: For coding, debugging, and IT problems.
*   **Creative Writing Agent**: For stories, poems, and brainstorming.
*   **Business Consultant Agent**: For strategy, marketing, and career advice.
*   **Health & Wellness Agent**: For fitness, nutrition, and lifestyle tips.

### System Architecture Diagram

The following diagram illustrates the high-level architecture of our multi-agent system. It shows how a user query flows through the LangGraph supervisor, gets routed based on Ollama-powered embeddings, and is ultimately handled by one or more specialized agents.

```mermaid
graph TD
    A[User Query] --> B{Supervisor Node};
    B --> C[Agent Selector];
    C -- "Uses" --> D[Ollama Embeddings];
    C -- "Calculates Similarity" --> B;

    B -- "Routes to one agent" --> E[Specialized Agent];
    B -- "Routes to multiple agents" --> F[Multi-Agent Handler];

    subgraph "Local Inference (Ollama)"
        D
        G[Ollama LLM]
    end

    E -- "Uses" --> G;
    F -- "Coordinates agents" --> E;
    F -- "Synthesizes response" --> G;

    G --> H[Final Response];
    E --> H;

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style H fill:#ccf,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
```

**Key Components:**
*   **User Query**: The starting point of the interaction.
*   **Supervisor Node**: The central router in our LangGraph graph. It receives the query and decides the next step.
*   **Agent Selector**: A helper class that uses **Ollama Embeddings** to determine which agent(s) are best suited for the query. This is the "brain" of the routing logic.
*   **Specialized Agent**: One of the individual agents (e.g., Technical Support, Creative Writing) that performs a specific task.
*   **Multi-Agent Handler**: A special node that is activated when a query requires input from multiple agents. It coordinates their work and synthesizes their responses.
*   **Ollama Services**: Both the **Embeddings** model (for semantic understanding) and the **LLM** (for generating text) are served locally by Ollama.

### The Decision-Making Flow

To understand the logic inside the supervisor, let's look at a flowchart that details the step-by-step process from receiving a query to routing it to the correct handler.

```mermaid
graph TD
    Start((Start)) --> UserInput["User sends a query"];
    UserInput --> Supervisor["Supervisor receives the query"];
    Supervisor --> CreateEmbedding["Create vector embedding for the query using Ollama"];
    CreateEmbedding --> CalculateSimilarity["Calculate cosine similarity against pre-computed agent embeddings"];
    CalculateSimilarity --> SelectAgents["Select agents where similarity > threshold (e.g., 0.3)"];
    SelectAgents --> CheckCount{How many agents selected?};

    CheckCount -- "One" --> RouteSingle["Route to the single selected agent"];
    CheckCount -- "Multiple" --> RouteMulti["Route to Multi-Agent Handler"];
    CheckCount -- "Zero (Fallback)" --> RouteFallback["Route to the top agent with the highest similarity"];

    RouteSingle --> InvokeAgent["Agent generates response using Ollama LLM"];
    RouteFallback --> InvokeAgent;
    InvokeAgent --> End((End));

    RouteMulti --> InvokeMultiple["Handler invokes each selected agent for its perspective"];
    InvokeMultiple --> CollectResponses["Collect all individual responses"];
    CollectResponses --> Synthesize["Synthesize responses into a single, cohesive answer using Ollama LLM"];
    Synthesize --> End;
```

**Flow Breakdown:**
1.  **Query & Embedding**: The process starts with the user's query. The system immediately converts this text into a numerical vector (an embedding) using Ollama.
2.  **Similarity Calculation**: This new embedding is compared against the stored embeddings of each agent's capabilities. The result is a similarity score for each agent.
3.  **Selection & Routing**:
    *   If **one agent** meets the similarity threshold, the task is routed directly to them.
    *   If **multiple agents** meet the threshold, the `Multi-Agent Handler` is called to coordinate them.
    *   If **no agents** meet the threshold, the system falls back to selecting the single agent with the highest score to ensure a response is always generated.
4.  **Response Generation**: The selected agent(s) use the Ollama LLM to process the request and generate a final, synthesized response for the user.

## The Magic Ingredient: Ollama for Local Inference and Embeddings

The key to running this entire system locally is [Ollama](https://ollama.ai). It allows you to run open-source large language models, like Llama 2, Mistral, or Code Llama, right on your own computer.

Crucially, Ollama provides two key services for our project:
1.  **LLM Inference**: It serves the language model that our agents use to think and generate responses.
2.  **Embeddings**: It creates the numerical vector representations of text that our supervisor uses to understand the meaning of the user's query and the agents' skills.

### From Cloud to Local: A Simple Switch

If you've used LangChain with services like OpenAI, you'll be amazed at how easy it is to switch to a local setup with Ollama.

Here's a comparison. A typical setup using OpenAI might look like this:

```python
# Using OpenAI (Cloud-based)
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

model = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.1)
embeddings = OpenAIEmbeddings()
```

Now, here's the equivalent code using Ollama. All we do is swap out the classes and point them to our local Ollama server.

```python
# Using Ollama (Local)
from langchain_community.llms import Ollama
from langchain_community.embeddings import OllamaEmbeddings

model = Ollama(
    model="llama2",  # Or any model you have downloaded
    base_url="http://localhost:11434",
    temperature=0.1
)

embeddings = OllamaEmbeddings(
    model="llama2",
    base_url="http://localhost:11434"
)
```

With just a few lines of code, we've moved our entire AI backend from the cloud to our local machine, eliminating API keys and external data transfer.

## Under the Hood: The Code

Let's look at the key pieces of Python code from `main.py` that make this work.

### 1. The Agent Selector

The `AgentSelector` class is the brain of our supervisor. It's responsible for figuring out which agent should handle a request.

During initialization, it creates an embedding for each agent's description and example queries. This captures the "semantic fingerprint" of each agent.

```python
class AgentSelector:
    def __init__(self, similarity_threshold: float = 0.3, max_agents: int = 3):
        # Uses OllamaEmbeddings instance
        self.embeddings = embeddings 
        self.agent_embeddings = {}
        self.similarity_threshold = similarity_threshold
        self.max_agents = max_agents
        self._initialize_agent_embeddings()
    
    def _initialize_agent_embeddings(self):
        """Create embeddings for all agent descriptions"""
        print("🔧 Initializing agent embeddings...")
        for agent_id, agent_info in AGENTS.items():
            # Combine name, description, and examples for a rich embedding
            description = f"{agent_info['name']}: {agent_info['description']}"
            examples_text = "Examples of queries I handle: " + "; ".join(agent_info['examples'])
            full_description = f"{description} {examples_text}"
            
            # Create embedding using Ollama
            embedding = self.embeddings.embed_query(full_description)
            self.agent_embeddings[agent_id] = embedding
```

When a user query comes in, the `select_multiple_agents` method creates an embedding for the query and uses cosine similarity to find the best-matching agents.

```python
    def select_multiple_agents(self, user_message: str) -> List[str]:
        """Select multiple appropriate agents based on user message similarity"""
        # Create embedding for user message using Ollama
        user_embedding = self.embeddings.embed_query(user_message)
        
        # Calculate similarities with all agents
        similarities = {}
        for agent_id, agent_embedding in self.agent_embeddings.items():
            similarity = self._cosine_similarity(user_embedding, agent_embedding)
            similarities[agent_id] = similarity
        
        # Select agents that meet the similarity threshold
        sorted_agents = sorted(similarities.items(), key=lambda x: x[1], reverse=True)
        selected_agents = [
            agent_id for agent_id, similarity in sorted_agents 
            if similarity >= self.similarity_threshold
        ][:self.max_agents]
        
        # Fallback to the top agent if none meet the threshold
        if not selected_agents and sorted_agents:
            selected_agents = [sorted_agents[0][0]]
            
        return selected_agents
```

### 2. An Agent Node

Each specialized agent is a node in our LangGraph graph. Here's a simplified look at the `technical_support` agent. Notice how it constructs a prompt and calls the local `model.invoke()`.

```python
def technical_support(state: AgentState) -> Command[Literal[END]]:
    """Technical support agent."""
    agent_info = AGENTS["technical_support"]
    last_message = state["messages"][-1].content
    
    # The system prompt gives the agent its identity and instructions
    system_prompt = f"""You are {agent_info['name']}. {agent_info['description']}
Provide clear, practical technical solutions."""
    
    # Combine system prompt and user message for the local model
    full_prompt = f"{system_prompt}\n\nUser: {last_message}\nAssistant:"
    
    # Invoke the local Ollama model
    response = model.invoke(full_prompt)
    response_message = HumanMessage(content=response)
    
    return Command(goto=END, update={"messages": [response_message]})
```

### 3. The Multi-Agent Handler

When a query is complex, like "Help me write a creative story about a health-conscious entrepreneur," the supervisor selects multiple agents (Creative Writing, Health & Wellness, and Business Consultant).

The `multi_agent_handler` node then does the following:
1.  Invokes each selected agent, asking for their specialized perspective.
2.  Collects all the individual responses.
3.  Uses a final LLM call to a "coordination agent" to synthesize the individual responses into one cohesive, well-structured answer.

This ensures that you get a rich, multi-faceted response without the user having to talk to each agent individually.

## Running the System

Getting this up and running is simple.

1.  **Install and start Ollama:**
    ```bash
    # Install on macOS, Windows, or Linux
    # See: https://ollama.ai
    ollama serve
    ```

2.  **Pull a model:**
    ```bash
    ollama pull llama2
    ```

3.  **Run the application:**
    ```bash
    # After setting up the Python environment
    uv run main.py
    ```

Now you can chat with your fully local, multi-agent system!

## Why Go Local?

Building with a local-first stack like LangGraph and Ollama offers significant advantages:
*   **Privacy:** Your data and conversations never leave your machine. This is critical for sensitive or proprietary information.
*   **Cost-Effectiveness:** Say goodbye to API bills. Experiment, iterate, and run your application as much as you want for free.
*   **Offline Capability:** Once your models are downloaded, the system can run without an internet connection.
*   **Flexibility:** Easily swap out different open-source models from the vast Ollama library to find the one that best fits your needs for speed, size, and capability.

This project demonstrates that powerful, intelligent, and stateful AI systems are no longer the exclusive domain of large cloud providers. With tools like LangGraph and Ollama, developers can now build and deploy sophisticated multi-agent applications with a focus on privacy, cost, and control.

You can find the complete running code on my GitHub [here](https://github.com/gyliu513/langX101/tree/main/langgraph/ollama). Happy hacking!
