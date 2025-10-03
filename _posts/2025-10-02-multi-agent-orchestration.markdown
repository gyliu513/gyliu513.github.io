---
layout: post
title:  "Building an Intelligent Agent Orchestrator with LangGraph and Ollama"
date:   2025-10-02 08:17:10 -0400
categories: jekyll update
tag: [langgraph, ollam, orchestration]
---

## Introduction

In today's rapidly evolving AI landscape, Large Language Models (LLMs) have become powerful tools for solving complex problems. However, using a single LLM for all tasks often leads to suboptimal results. Different tasks require different specialized capabilities, and a one-size-fits-all approach doesn't always deliver the best outcomes.

This blog post introduces the **Agent Orchestrator** - a sophisticated system that combines task decomposition with intelligent agent selection to solve complex problems more effectively. By breaking down complex queries into manageable steps and assigning the most appropriate specialized agent to each step, the Agent Orchestrator delivers superior results compared to using a single general-purpose agent.

## Background

### The Problem with Single-Agent Systems

Traditional LLM applications often use a single model to handle all user queries. While this approach works for simple tasks, it falls short when dealing with complex, multi-step problems that require different types of expertise. For example, a query like "Help me create a personal finance app" involves multiple domains:

1. Understanding user requirements
2. Technical architecture design
3. UI/UX considerations
4. Implementation strategies
5. Testing methodologies

A single agent might be strong in some areas but weak in others, leading to inconsistent quality across the solution.

### The Power of Task Decomposition

Task decomposition is a problem-solving technique where complex problems are broken down into smaller, more manageable sub-problems. This approach has several advantages:

- **Reduced complexity**: Each sub-problem is simpler to solve
- **Specialized handling**: Different sub-problems can be tackled with different approaches
- **Better organization**: The solution process becomes more structured and trackable
- **Improved quality**: Each component receives focused attention

### Agent Specialization

Different LLM agents can be specialized for different types of tasks. By creating agents with specific "personalities" and areas of expertise, we can leverage their strengths for particular sub-tasks:

- **Technical Support Agent**: Excels at programming and technical implementation
- **Creative Writing Agent**: Specializes in generating creative content and narratives
- **Business Consultant Agent**: Focuses on business strategy and planning
- **Health & Wellness Agent**: Provides health-related advice and information
- **General Conversation Agent**: Handles everyday conversation and general queries

## Architecture

The Agent Orchestrator combines task decomposition with intelligent agent selection in a powerful workflow. Let's examine its architecture:

```mermaid
graph TD
    User[User Query] --> Orchestrator
    
    subgraph Orchestrator[Agent Orchestrator]
        Planning[Planning Phase] --> AgentSelection[Agent Selection Phase]
        AgentSelection --> Execution[Execution Phase]
        Execution --> Reflection[Reflection Phase]
        Reflection --> Decision{Decision Phase}
        Decision -->|Success| NextStep[Next Step]
        Decision -->|Failure| Replan[Replanning Phase]
        Replan --> AgentSelection
        NextStep -->|More Steps| AgentSelection
        NextStep -->|Complete| Summary[Summary Phase]
    end
    
    subgraph Agents[Specialized Agents]
        TechAgent[Technical Support Agent]
        CreativeAgent[Creative Writing Agent]
        BusinessAgent[Business Consultant Agent]
        HealthAgent[Health & Wellness Agent]
        GeneralAgent[General Conversation Agent]
    end
    
    AgentSelection --> Agents
    Agents --> Execution
    
    Summary --> Result[Final Result]
    Result --> User
```

### Key Components

1. **State Management**: The system uses a `OrchestratorState` TypedDict to maintain the workflow state, including:
   - Messages history
   - Current plan
   - Current step and progress
   - Results from each step
   - Selected agents for each step

2. **Agent Selection**: Uses embeddings-based similarity matching to select the most appropriate agent for each step:
   - Embeds agent descriptions and capabilities
   - Embeds the current step's requirements
   - Calculates cosine similarity to find the best match

3. **LLM Integration**: Uses Ollama for local LLM execution:
   - Planning and replanning
   - Step execution
   - Reflection and evaluation
   - Summary generation

4. **Workflow Orchestration**: Uses LangGraph for defining and executing the workflow graph

## Workflow

The Agent Orchestrator follows a structured workflow to process complex queries:

```mermaid
sequenceDiagram
    participant User
    participant Planner
    participant AgentSelector
    participant SpecializedAgent
    participant Reflector
    participant Replanner
    participant Summarizer
    
    User->>Planner: Complex Query
    Planner->>Planner: Break down into steps
    
    loop For each step
        Planner->>AgentSelector: Current Step
        AgentSelector->>AgentSelector: Analyze step requirements
        AgentSelector->>SpecializedAgent: Select best agent
        SpecializedAgent->>SpecializedAgent: Execute step
        SpecializedAgent->>Reflector: Step result
        Reflector->>Reflector: Evaluate result
        
        alt Result OK
            Reflector->>Planner: Continue to next step
        else Result NOT OK
            Reflector->>Replanner: Request replan
            Replanner->>Planner: Updated plan
        end
    end
    
    Planner->>Summarizer: All steps completed
    Summarizer->>User: Comprehensive summary
```

### Detailed Workflow Phases

1. **Planning Phase**:
   - Takes the user's complex query as input
   - Uses the LLM to create a detailed, step-by-step plan
   - Formats the plan as a numbered list of steps
   - Each step has clear success criteria

2. **Agent Selection Phase**:
   - Analyzes the current step's requirements
   - Calculates embedding similarity with each agent's capabilities
   - Selects the agent with the highest similarity score
   - Provides detailed selection reasoning

3. **Execution Phase**:
   - The selected agent executes the current step
   - Receives context from previous steps
   - Focuses on the specific action required
   - Returns a structured result

4. **Reflection Phase**:
   - Evaluates the step execution result
   - Checks for completeness, accuracy, relevance, and quality
   - Provides a clear assessment: "Result OK" or "Result NOT OK"
   - Includes detailed reasoning

5. **Decision Phase**:
   - Determines whether to continue to the next step or replan
   - Based on the reflection assessment
   - Handles success and failure paths

6. **Replanning Phase** (if needed):
   - Analyzes why the previous attempt failed
   - Creates a new plan that addresses the issues
   - Builds on successful steps already completed
   - Provides alternative approaches for the failed step

7. **Summary Phase**:
   - Generates a comprehensive summary of the entire workflow
   - Includes the original query, plan, results, and agents used
   - Highlights key insights and outcomes
   - Presents a cohesive final response

## Implementation Details

### Agent Definition

Each agent is defined with specific characteristics:

```python
AGENTS: dict[str, dict[str, Any]] = {
    "general_conversation": {
        "name": "General Conversation Agent",
        "description": """I am a friendly and engaging conversational agent...""",
        "examples": [
            "How are you today?",
            "Tell me a joke",
            # More examples...
        ]
    },
    "technical_support": {
        "name": "Technical Support Agent",
        "description": """I am a technical expert specializing in...""",
        # More details...
    },
    # More agents...
}
```

### Embedding-Based Agent Selection

The system uses embeddings to match steps with the most appropriate agent:

```python
def select_agent(self, task_description: str) -> str:
    """Select the most appropriate agent based on task similarity"""
    
    # Create embedding for task description
    task_embedding = self.embeddings.embed_query(task_description)
    
    # Calculate similarities with all agents
    similarities = {}
    for agent_id, agent_embedding in self.agent_embeddings.items():
        similarity = self._cosine_similarity(task_embedding, agent_embedding)
        similarities[agent_id] = similarity
    
    # Find the agent with highest similarity
    best_agent = max(similarities.items(), key=lambda x: x[1])
    
    # Log selection results
    print(f"🔍 Agent selection results for task: '{task_description}'")
    for agent_id, similarity in sorted(similarities.items(), key=lambda x: x[1], reverse=True):
        agent_name = AGENTS[agent_id]["name"]
        print(f"  {agent_name}: {similarity:.3f}")
    
    return best_agent[0]
```

### Step Detection Logic

The system uses sophisticated pattern matching to identify steps in various formats:

```python
# Check for various step formats: "1.", "Step 1:", "**Step 1:**"
if (line and line[0].isdigit() and "." in line) or \
   (line.lower().startswith("step") and any(c.isdigit() for c in line)) or \
   (line.startswith("**") and "step" in line.lower() and any(c.isdigit() for c in line)):
    step_count += 1
    print(f"  Step {step_count}: {line}")
```

### Reflection and Decision Making

The system evaluates each step's results and decides whether to continue or replan:

```python
def make_decision(state: OrchestratorState) -> str:
    """
    Decision phase that determines whether to continue execution or replan.
    """
    print("🎯 Decision Phase: Evaluating if result is OK...")
    
    # Get the latest reflection
    reflection_results = state.get("reflection_results", [])
    if not reflection_results:
        print("❌ No reflection results found")
        return "replan"
    
    latest_reflection = reflection_results[-1].lower()
    
    # Check if the result is OK based on reflection
    if "result ok" in latest_reflection or "result is ok" in latest_reflection:
        print("✅ Result is OK - continuing to next step")
        return "next_step"
    else:
        print("❌ Result is NOT OK - need to replan")
        return "replan"
```

## Benefits and Use Cases

### Benefits

1. **Improved Quality**: By using specialized agents for each step, the overall quality of the solution improves
2. **Better Problem Decomposition**: Complex problems are broken down into manageable steps
3. **Transparency**: The workflow provides clear visibility into the reasoning process
4. **Adaptability**: The system can replan when steps fail, making it more robust
5. **Privacy-Preserving**: All processing happens locally using Ollama models

### Use Cases

1. **Complex Research Tasks**: Breaking down research questions into investigation steps
2. **Technical Project Planning**: Creating detailed implementation plans for software projects
3. **Content Creation**: Generating structured, multi-faceted content
4. **Business Strategy Development**: Creating comprehensive business plans
5. **Educational Content**: Creating lesson plans and educational materials

## Conclusion

The Agent Orchestrator represents a significant advancement in LLM application design. By combining task decomposition with intelligent agent selection, it creates a system that's greater than the sum of its parts. The structured workflow ensures that complex problems are approached methodically, with each step handled by the most appropriate specialized agent.

This architecture demonstrates how we can move beyond the limitations of single-agent systems to create more powerful, flexible, and effective AI solutions. As LLM technology continues to evolve, approaches like the Agent Orchestrator will become increasingly important for tackling complex real-world problems.

The future plan is integrate with A2A, and let agents can report its capabilities via agentCard, and this orchestrator can leverage agentCard to select the best agent, stay tuned for an update.

You can get the full runnable code from [here](https://github.com/gyliu513/langX101/tree/main/langgraph/agent-orchestrator), happy hacking!