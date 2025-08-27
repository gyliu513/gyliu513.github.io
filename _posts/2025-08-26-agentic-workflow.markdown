---
layout: post
title:  "Building Robust AI Agents with LangGraph: The Agentic Workflow Pattern"
date:   2025-08-21 08:17:10 -0400
categories: jekyll update
tag: [Agentic, Workflow, LangGraph]
---

In the rapidly evolving landscape of AI applications, creating agents that can solve complex problems through structured reasoning and dynamic adaptation has become increasingly important. This blog post explores the implementation of the **Agentic Workflow** pattern using LangGraph, a powerful framework for building stateful, multi-step AI applications.

## Why We Need Agentic Workflows

Traditional AI systems often struggle with complex, multi-step problems that require:

1. **Decomposition of complex tasks** into manageable steps
2. **Adaptation to unexpected outcomes** during execution
3. **Reflection on intermediate results** to guide further actions
4. **Structured reasoning** that mimics human problem-solving approaches

The agentic workflow pattern addresses these challenges by implementing a deliberate, step-by-step approach to problem-solving that includes planning, execution, reflection, and adaptation.

## The Agentic Workflow Architecture

At its core, the agentic workflow follows a cyclical pattern of planning, execution, reflection, and decision-making. Here's a visualization of this architecture:

```mermaid
graph LR
    subgraph "AI Agent"
        subgraph "Planning"
            A["Make a plan"]
        end
        
        subgraph "Execution"
            B["Execute actions with tools"]
        end
        
        subgraph "Reflection"
            C["Reflect on results of actions"]
        end
    end
    
    Z["User query"] --> A
    A --> B
    B --> C
    C -->|"Result OK"| B
    C -->|"Result not OK"| A
    C -->|"Final result"| Y["Response"]
    
    style A fill:#b3e0ff,stroke:#4da6ff
    style B fill:#b3e0ff,stroke:#4da6ff
    style C fill:#b3e0ff,stroke:#4da6ff
    style Z fill:#f9f9f9,stroke:#ccc
    style Y fill:#f9f9f9,stroke:#ccc
```

This diagram illustrates the core components and flow of the agentic workflow:

1. **User Query**: The process begins when a user submits a query or problem to the AI agent.

2. **Planning Phase**: The agent first creates a structured plan to address the user's query. This involves breaking down complex problems into manageable steps and determining the best approach.

3. **Execution Phase**: The agent carries out the planned actions using appropriate tools. These tools might include search engines, calculators, code interpreters, or other specialized utilities depending on the task.

4. **Reflection Phase**: After executing an action, the agent evaluates the results against expected outcomes. This critical thinking step determines the next course of action.

5. **Decision Branches**:
   - If the reflection determines the result is satisfactory (**"Result OK"**), the agent proceeds to execute the next step in the plan.
   - If the reflection identifies issues (**"Result not OK"**), the agent returns to the planning phase to revise its approach.
   - When all steps are completed successfully, the agent delivers the **"Final result"** as a comprehensive response to the user.

The color coding (blue for agent processes, gray for external interactions) helps distinguish between the agent's internal reasoning processes and its interactions with the user.

This architecture enables AI agents to:

- **Plan ahead** before taking actions
- **Execute steps systematically** using appropriate tools
- **Evaluate results** against expected outcomes
- **Replan when necessary** to adapt to new information or failed steps
- **Deliver comprehensive solutions** that address the original query

## Implementation with LangGraph

Our implementation uses LangGraph, a library built on top of LangChain that makes it easy to create stateful, multi-step AI workflows. Let's explore the key components of our implementation.

### State Management

The foundation of our agentic workflow is a well-defined state that tracks the progress of the agent. This state management is crucial for maintaining context and enabling the agent to make informed decisions throughout the workflow:

```python
class AgenticWorkflow(TypedDict):
    """State for the agentic workflow with planning, execution, and reflection."""
    messages: List[Any]  # History of all messages exchanged during the workflow
    plan: str            # The current plan being executed
    current_step: str    # The step number currently being executed
    results: List[str]   # Results from each executed step
    reflection_results: List[str]  # Reflections on each step's results
    replan_count: int    # Number of times the plan has been revised
    max_replans: int     # Maximum allowed replanning attempts
    workflow_phase: str  # Current phase: "planning", "execution", "reflection", "decision"
```

Let's examine each component of this state in detail:

1. **messages**: A chronological record of all messages exchanged during the workflow, including user inputs, LLM responses, and intermediate results. This provides a complete conversation history that helps maintain context.

2. **plan**: The structured, step-by-step plan generated by the planning phase. This serves as the roadmap for the entire workflow and is updated during replanning.

3. **current_step**: A string indicating which step number in the plan is currently being executed. This allows the agent to track progress through the plan.

4. **results**: A list containing the outcomes of each executed step. Each entry corresponds to a specific step in the plan, providing a record of what has been accomplished.

5. **reflection_results**: A list of reflections on each step's execution. These reflections contain the agent's analysis of whether each step was successful or needs revision.

6. **replan_count**: A counter tracking how many times the agent has revised its plan. This helps prevent infinite replanning loops.

7. **max_replans**: The maximum number of replanning attempts allowed before the agent must deliver its best available result. This is a safety mechanism to ensure the workflow eventually terminates.

8. **workflow_phase**: A string indicating which phase of the workflow is currently active. This helps coordinate the transition between different phases and ensures the correct functions are called at the right time.

This comprehensive state design enables several key capabilities:

- **Persistence**: The agent can maintain context across multiple steps and iterations
- **Adaptability**: The agent can revise its approach based on previous results
- **Safety**: Limits on replanning prevent infinite loops
- **Traceability**: The complete history of the workflow is preserved for analysis
- **Phase awareness**: The agent always knows which phase of the workflow it's in

By maintaining this rich state, the agent can make informed decisions at each step, building on previous work rather than starting from scratch with each new action.

### Workflow Graph

The workflow is implemented as a directed graph using LangGraph's `StateGraph`:

```mermaid
stateDiagram-v2
    [*] --> make_plan
    make_plan --> execute_actions
    execute_actions --> reflect
    
    state reflect_decision <<choice>>
    reflect --> reflect_decision
    
    reflect_decision --> next_step : Result OK
    reflect_decision --> replan : Result NOT OK
    
    state should_end <<choice>>
    next_step --> should_end
    should_end --> execute_actions : More steps
    should_end --> [*] : All steps completed
    
    replan --> execute_actions
```

This state diagram illustrates the concrete implementation of our workflow using LangGraph's `StateGraph`. Let's examine each component in detail:

1. **Initial State [*]**: The entry point of the workflow, triggered when a user submits a query.

2. **make_plan**: The first state that creates a structured plan to address the user's query. This state uses an LLM to generate a step-by-step approach.

3. **execute_actions**: The state responsible for carrying out the current step in the plan, potentially using specialized tools when needed.

4. **reflect**: After execution, this state evaluates the results against expected outcomes.

5. **Decision Points**:
   - **reflect_decision**: A choice node that determines the next path based on reflection results:
     - If "Result OK", proceeds to the next_step state
     - If "Result NOT OK", transitions to the replan state
   
   - **should_end**: A choice node that checks if all steps have been completed:
     - If "More steps" remain, returns to execute_actions for the next step
     - If "All steps completed", transitions to the final state [*]

6. **replan**: A state that revises the approach when results don't meet expectations, then returns to execute_actions

This state-based approach enables the agent to maintain context throughout the problem-solving process while adapting to unexpected outcomes through its decision branches.

### Core Components

#### 1. Planning Phase

The planning phase uses an LLM to create a detailed, step-by-step plan based on the user's query:

```python
def make_plan(state: AgenticWorkflow) -> AgenticWorkflow:
    """
    Planning phase that creates a detailed execution plan.
    This function takes the user's query and generates a structured plan with discrete steps.
    """
    print("🤔 Planning Phase: Making a plan...")
    
    # Get the user's input from the last message
    messages = state.get("messages", [])
    if not messages:
        print("❌ No messages found in state")
        return state
    
    user_input = messages[-1].content if messages else ""
    
    # Create the planning prompt
    prompt = PLANNER_PROMPT.format(input=user_input)
    
    # Generate the plan
    response = llm.invoke(prompt)
    
    # Extract the plan from the response
    plan = response.content
    
    print(f"📋 Generated plan:\n{plan}")
    
    # Update state with the new plan and initialize execution tracking
    state["plan"] = str(plan)
    state["current_step"] = "1"  # Start with the first step
    state["workflow_phase"] = "execution"  # Transition to execution phase
    state["messages"] = messages + [response]  # Track messages for context
    
    return state
```

The planner is a critical component that determines the overall approach to solving the problem. The `PLANNER_PROMPT` template instructs the LLM to:

1. **Analyze the problem** to understand its requirements and constraints
2. **Break it down** into a sequence of logical, manageable steps
3. **Number each step** to enable systematic execution
4. **Specify tools needed** for each step (like search, calculation, etc.)
5. **Define success criteria** for each step to enable effective reflection

This structured planning approach enables the agent to tackle complex problems methodically rather than attempting to solve everything at once, which often leads to more robust solutions.

#### 2. Execution Phase

The execution phase carries out each step of the plan, using tools when necessary:

```python
def execute_actions_with_tools(state: AgenticWorkflow) -> AgenticWorkflow:
    """
    Execution phase that executes the current step in the plan using available tools.
    This function implements the current step and integrates with external tools as needed.
    """
    # Extract the current step from the plan
    current_step_num = int(state.get("current_step", "1"))
    
    # Parse the plan to get the current step - this is a simplified version
    # of the actual implementation which handles various formatting patterns
    plan_lines = state.get("plan", "").split('\n')
    step_content = []
    in_current_step = False
    
    # Find the current step in the plan
    for line in plan_lines:
        line = line.strip()
        if not line:
            continue
            
        # Check for step start patterns
        if line.startswith(f"{current_step_num}."):
            in_current_step = True
            step_content = [line]
        elif in_current_step:
            # Check if we've reached the next step
            next_step_num = current_step_num + 1
            if line.startswith(f"{next_step_num}."):
                break
            else:
                step_content.append(line)
    
    # Combine all content for the current step
    full_step_text = "\n".join(step_content)
    
    # Execute the step using the LLM with context from previous results
    response = llm.invoke(EXECUTOR_PROMPT.format(
        plan=state.get("plan", ""),
        current_step=full_step_text,
        results="\n".join(state.get("results", []))
    ))
    
```

This phase handles the actual work of solving the problem. Key aspects of this implementation include:

1. **Context-aware execution**: The executor has access to the full plan and all previous results, enabling it to build upon earlier steps.

2. **Dynamic tool selection**: The code detects when specialized tools are needed based on keywords in the step description.

3. **Structured result tracking**: Each step's results are stored with clear numbering to maintain the relationship between the plan and outcomes.

#### 3. Reflection Phase

The reflection phase evaluates the results of each step to determine if they meet expectations:

```python
def reflect_on_results(state: AgenticWorkflow) -> AgenticWorkflow:
    """
    Reflection phase that evaluates the results of the current step execution.
    This function implements metacognitive capabilities by analyzing execution outcomes.
    """
    print("🔍 Reflection Phase: Reflecting on results of actions...")
    
    # Get the current step and its result
    current_step = state.get("current_step", "")
    results = state.get("results", [])
    
    if not results:
        print("❌ No results to reflect on")
        return state
    
    # Get the most recent result
    current_result = results[-1]
    
    # Create reflection prompt
    prompt = REFLECTION_PROMPT.format(
        current_step=current_step,
        step_result=current_result,
        plan=state.get("plan", ""),
        results="\n".join(results[:-1]) if len(results) > 1 else "None"
    )
    
    # Generate reflection
    response = llm.invoke(prompt)
    
    print(f"🤔 Reflection:")
    print(f"   {response.content}")
    
    # Update state with reflection and prepare for decision
    reflection_content = str(response.content)
    state["reflection_results"] = state.get("reflection_results", []) + [reflection_content]
    state["workflow_phase"] = "decision"
    state["messages"] = state.get("messages", []) + [response]  # Track messages for context
    
    return state
```

This critical phase implements metacognitive capabilities that allow the agent to:

1. **Evaluate success**: Determine if the step's outcome matches the expected result
2. **Identify errors**: Recognize when execution has failed or produced unexpected results
3. **Analyze quality**: Assess the completeness and accuracy of the information obtained
4. **Consider implications**: Understand how the current result affects subsequent steps
5. **Suggest improvements**: Recommend adjustments when results are suboptimal

The `REFLECTION_PROMPT` guides the LLM to perform structured analysis rather than simple pass/fail judgments, enabling nuanced reasoning about the execution results.

#### 4. Decision Phase

The decision phase determines whether to continue with the next step or replan:

```python
def make_decision(state: AgenticWorkflow) -> str:
    """
    Decision phase that determines whether to continue execution or replan.
    This function acts as a router in the workflow graph, directing the flow based on reflection.
    """
    # Get the latest reflection
    reflection_results = state.get("reflection_results", [])
    if not reflection_results:
        print("❌ No reflection results found")
        return "replan"
    
    latest_reflection = reflection_results[-1].lower()
    
    # Check if the result is OK based on reflection
    if "result ok" in latest_reflection or "result is ok" in latest_reflection:
        print("✅ Result is OK - continuing to next step")
        return "next_step"  # Continue to the next step in the plan
    else:
        print("❌ Result is NOT OK - need to replan")
        return "replan"  # Go back to planning to revise the approach
```

This phase is the critical junction point in the workflow that enables adaptive behavior:

1. **Binary decision making**: The function implements a simple but effective decision mechanism based on the reflection output
2. **Graph routing**: By returning a string value, it directs the LangGraph state machine to the appropriate next node
3. **Failure recovery**: When results don't meet expectations, it triggers replanning rather than continuing with a flawed approach
4. **Progress advancement**: When results are satisfactory, it allows the workflow to advance to the next step

This simple decision mechanism could be extended to support more complex routing logic, such as:
- Partial success scenarios that require only minor adjustments
- Escalation to human assistance for particularly challenging steps
- Branching paths based on different types of outcomes

### Tool Integration

Our implementation includes a flexible approach to tool integration, particularly for search capabilities. In this example, we use the LLM to simulate search functionality:

```python
# The actual search implementation from plan_and_execute.py
# This code is extracted from the execute_actions_with_tools function

# Check if tools are needed
if "search" in full_step_text.lower() or "research" in full_step_text.lower():
    print("🔍 Research step detected, using search tool...")
    try:
        # For this general agent, we use the LLM to simulate search results
        # We include previous results for context if available
        if state.get("results"):
            full_step_text = (
                f"{full_step_text}\n with the following results:\n" +
                "\n".join(state["results"])
            )
        
        # Use the LLM as a search simulator
        search_response = llm.invoke(
            f"You are a search engine. Provide relevant information for: {full_step_text}"
        )
        response = AIMessage(content=f"Research completed: {search_response.content}")
    except Exception as e:
        # Handle any errors gracefully
        response = AIMessage(content=f"Research step completed (simulated): {response.content}")
```

This approach demonstrates how the agentic workflow can maintain its structure even when external tools aren't available. In a production environment, you might integrate with actual search APIs like:

1. **Web search APIs** (Google Custom Search, Bing Search, etc.)
2. **Specialized research tools** (like Tavily, SerpAPI, or WebScraper)
3. **Internal knowledge bases** (vector databases with your organization's documents)

The key advantage of this design is that the workflow remains consistent regardless of which search implementation is used, allowing for easy swapping of tools without changing the core agent logic.

## The Complete Workflow in Action

Let's visualize the complete workflow with a more detailed diagram:

```mermaid
flowchart TD
    start([Start]) --> init[Initialize State]
    init --> plan[Make Plan]
    plan --> exec[Execute Current Step]
    exec --> reflect[Reflect on Results]
    
    reflect --> decision{Result OK?}
    decision -->|Yes| next[Move to Next Step]
    decision -->|No| replan[Replan]
    
    next --> end_check{All Steps\nCompleted?}
    end_check -->|No| exec
    end_check -->|Yes| finish([End])
    
    replan --> max_check{Max Replans\nReached?}
    max_check -->|No| exec
    max_check -->|Yes| finish
    
    classDef phase fill:#e1f5fe,stroke:#01579b
    classDef decision fill:#fff9c4,stroke:#f57f17
    classDef terminal fill:#e8f5e9,stroke:#2e7d32
    
    class plan,exec,reflect,replan phase
    class decision,end_check,max_check decision
    class start,finish terminal
```

This comprehensive flowchart illustrates the complete agentic workflow implementation with all decision points and safety mechanisms. Let's examine each component:

1. **Start & Initialization**:
   - **Start**: The entry point when a user submits a query
   - **Initialize State**: Sets up the initial state object with empty lists for messages, results, and reflections

2. **Core Processing Phases** (highlighted in blue):
   - **Make Plan**: Creates a structured, step-by-step approach to solve the problem
   - **Execute Current Step**: Implements the current step using appropriate tools
   - **Reflect on Results**: Evaluates the outcome against expectations
   - **Replan**: Revises the approach when results don't meet expectations

3. **Decision Points** (highlighted in yellow):
   - **Result OK?**: Determines if the execution result meets expectations
   - **All Steps Completed?**: Checks if all planned steps have been completed
   - **Max Replans Reached?**: Safety mechanism to prevent infinite replanning loops

4. **Flow Control**:
   - When a step executes successfully, the agent moves to the next step
   - When a step fails, the agent replans its approach
   - When all steps complete successfully, the agent delivers the final response
   - If too many replanning attempts occur, the agent terminates with its best result

5. **Terminal States** (highlighted in green):
   - **Start**: Beginning of the workflow
   - **End**: Completion of the workflow with a response to the user

This workflow combines the flexibility of dynamic replanning with the safety of maximum attempt limits, ensuring the agent can adapt to challenges while still completing tasks in a reasonable timeframe.

## Benefits of the Agentic Workflow

The agentic workflow pattern offers several key benefits:

1. **Improved reasoning**: By breaking problems down into steps and planning ahead, the agent can tackle complex problems more effectively.

2. **Adaptability**: The reflection and replanning phases allow the agent to adapt to unexpected outcomes and failures.

3. **Transparency**: The structured workflow makes it easier to understand and debug the agent's reasoning process.

4. **Tool integration**: The execution phase can seamlessly incorporate various tools, enhancing the agent's capabilities.

5. **Reliability**: The systematic approach reduces the likelihood of errors and improves the quality of results.

## Conclusion

The agentic workflow pattern represents a powerful approach to building AI agents that can solve complex problems through structured reasoning and dynamic adaptation. By implementing this pattern with LangGraph, we can create agents that plan, execute, reflect, and adapt in a way that mimics human problem-solving approaches.

This implementation demonstrates how modern AI frameworks can be used to create agents that go beyond simple question-answering to tackle multi-step problems that require research, reasoning, and adaptation. As AI continues to evolve, patterns like the agentic workflow will become increasingly important for building systems that can handle the complexity of real-world problems.

Refer to [LangGraph Plan and Execute](https://github.com/gyliu513/langX101/tree/main/langgraph/plan-and-execute) to get the runnable code for this example, happy hacking!
