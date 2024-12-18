---
layout: post
title:  "Battle of AI Agent Frameworks"
date:   2024-12-17 08:17:10 -0400
categories: jekyll update
tag: Agent
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Battle of AI Agent Frameworks](#battle-of-ai-agent-frameworks)
  - [Introduction](#introduction)
  - [OpenAI Assistants](#openai-assistants)
    - [Overview](#overview)
    - [Key Concepts](#key-concepts)
    - [Key Features](#key-features)
    - [Best For](#best-for)
    - [Pros](#pros)
    - [Cons](#cons)
    - [Example](#example)
  - [OpenAI Swarm](#openai-swarm)
    - [Overview](#overview-1)
    - [Key Concepts](#key-concepts-1)
    - [Key Features](#key-features-1)
    - [Best For](#best-for-1)
    - [Pros](#pros-1)
    - [Cons](#cons-1)
    - [Example](#example-1)
  - [CrewAI](#crewai)
    - [Overview](#overview-2)
    - [Key Concepts](#key-concepts-2)
    - [Key Features](#key-features-2)
    - [Best For](#best-for-2)
    - [Pros](#pros-2)
    - [Cons](#cons-2)
    - [Example](#example-2)
  - [AutoGen](#autogen)
    - [Overview](#overview-3)
    - [Key Concepts](#key-concepts-3)
    - [Key Features](#key-features-3)
    - [Best For](#best-for-3)
    - [Pros](#pros-3)
    - [Cons](#cons-3)
    - [Example](#example-3)
  - [LangGraph](#langgraph)
    - [Overview](#overview-4)
    - [Key Concepts](#key-concepts-4)
    - [Key Features](#key-features-4)
    - [Best For](#best-for-4)
    - [Pros](#pros-4)
    - [Cons](#cons-4)
    - [Example](#example-4)
  - [Comparison Table](#comparison-table)
  - [Conclusion](#conclusion)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Battle of AI Agent Frameworks

## Introduction

The rise of AI agent frameworks has enabled developers to build autonomous systems capable of completing complex tasks. From orchestrating workflows to simulating multi-agent collaboration, these frameworks are critical for developing intelligent applications. In this blog, we compare five leading AI agent frameworks: OpenAI Assistants, OpenAI Swarm, CrewAI, AutoGen, and LangGraph. Each has unique strengths and trade-offs that cater to specific use cases.

## OpenAI Assistants

### Overview

OpenAI Assistants is OpenAI’s framework designed to integrate AI capabilities into applications. It allows developers to create assistants that can manage tasks such as answering questions, document summarization, and knowledge-based workflows.

### Key Concepts

- Assistant: The main agent performing tasks.
- Thread: Represents a conversation context.
- Message: An individual interaction within a thread.
- Thread Run: The execution of a specific task or workflow in a thread.

### Key Features

- Tool Use: Supports tools like code execution, file uploads, and API calling.
- API-driven: Easy to integrate into various platforms.
- Multi-turn Conversations: Maintains context-aware, multi-turn conversations.
- Pre-Built Functions: Simplifies workflows with predefined tools.

### Best For

- Building chatbots with structured workflows.
- Integrating LLMs into enterprise-level processes.
- Knowledge management and task automation.

### Pros

- Simple to set up and well-documented.
- Scalable for production use cases.
- Strong support for OpenAI GPT models.
- Well-suited for developers new to AI workflows.

### Cons

- Tightly coupled to OpenAI’s ecosystem.
- Lacks flexibility for custom multi-agent simulations.
- Limited to single-agent-based systems.

### Example

- Create an assistant

```python
from openai import OpenAI
client = OpenAI()

assistant = client.beta.assistants.create(
name="Math Tutor",
instructions="You are a personal math tutor. Write and run code to answer math questions.",
tools=[{"type": "code_interpreter"}],
model="gpt-4o",
)
```

- Create a Thread

```python
thread = client.beta.threads.create()
```

- Add a Message to the Thread

```python
message = client.beta.threads.messages.create(
thread_id=thread.id,
role="user",
content="I need to solve the equation `3x + 11 = 14`. Can you help me?"
)
```

- Create a Run

```python
run = client.beta.threads.runs.create_and_poll(
thread_id=thread.id,
assistant_id=assistant.id,
instructions="Please address the user as Jane Doe. The user has a premium account."
)
```

## OpenAI Swarm

### Overview

OpenAI Swarm builds on the assistant concept by enabling multi-agent collaboration. It supports distributed problem-solving by coordinating several agents that can exchange outputs and build on each other’s tasks.

### Key Concepts

- Swarm: A collective group of agents working together.
- Agent: An individual entity within the swarm responsible for specific subtasks.
- Communication Layer: Enables data sharing and coordination among agents.
- Orchestration: Defines the structure and flow of agent collaboration.

### Key Features

- Collaborative Agents: Simulates team behavior.
- Inter-Agent Communication: Agents dynamically share results.
- Task Decomposition: Breaks tasks into smaller, solvable components.
- High Scalability: Handles extensive computational tasks.

### Best For

- Research projects requiring agent collaboration.
- Decomposing complex tasks into modular solutions.
- Simulating teamwork in AI models.

### Pros

- Powerful for distributed workflows.
- Modular and scalable design for multi-agent simulations.
- Facilitates innovation in collaborative agent tasks.

### Cons

- Conceptual and still in development.
- Requires understanding of multi-agent orchestration.
- Limited real-world deployment examples.

### Example

```python
from swarm import Swarm, Agent

client = Swarm()

def transfer_to_agent_b():
    return agent_b


agent_a = Agent(
    name="Agent A",
    instructions="You are a helpful agent.",
    functions=[transfer_to_agent_b],
)

agent_b = Agent(
    name="Agent B",
    instructions="Only speak in Haikus.",
)

response = client.run(
    agent=agent_a,
    messages=[{"role": "user", "content": "I want to talk to agent B."}],
)

print(response.messages[-1]["content"])
```

## CrewAI

### Overview

CrewAI is a Python-based framework for building collaborative multi-agent systems. It defines agents with specific roles and coordinates tasks in complex workflows.

### Key Concepts

- Crew: A group of agents working together.
- Agent: An individual entity with a role.
- Task: The specific activity assigned to an agent.
- Orchestration: Coordination of agents within a crew.

### Key Features

- Role-Based Agents: Assigns agents unique roles with defined behavior.
- Task Execution: Supports hierarchies and dependencies.
- Extensibility: Customize agent behavior and task chains.
- Open-Source: Community-driven improvements and flexibility.

### Best For

- Orchestrating multi-step workflows.
- Building team-based AI systems for automation.
- Prototyping open-source, agent-driven applications.

### Pros

- Highly flexible and customizable.
- Open-source, encouraging community collaboration.
- Well-documented and integrates seamlessly with Python.

### Cons

- Requires strong programming knowledge.
- Limited out-of-the-box features for beginners.

### Example

- Create Your Crew

```python
from crewai import Agent, Task, Crew, Process, LLM
from crewai_tools import SerperDevTool
import os

llm = LLM(model="gpt-4", temperature=0.5,
          api_key=os.environ.get("OPENAI_API_KEY"))

# Agent definition
researcher = Agent(
    role="{topic} Senior Researcher",
    goal="""Uncover groundbreaking technologies in {topic} for year 2024""",
    backstory="""Driven by curiosity, you explore and share the latest innovations.""",
    tools=[SerperDevTool()],
    llm=llm
)
```

- Define Tasks

```python
# Define a research task for the Senior Researcher agent
research_task = Task(
    description="""Identify the next big trend in {topic} with pros and cons.""",
    expected_output="""A 3-paragraph report on emerging {topic} technologies.""",
    agent=researcher
)
```

- Kickoff

```python
def main():
    # Forming the crew and kicking off the process
    crew = Crew(
        agents=[researcher],
        tasks=[research_task],
        process=Process.sequential,
        verbose=True
    )

    result = crew.kickoff(inputs={'topic': 'AI Agents'})
    print(result)


if __name__ == "__main__":
    main()
```

## AutoGen

### Overview

AutoGen is a Microsoft framework for building collaborative, multi-agent workflows. It automates task execution and enables LLM agents to communicate dynamically.

### Key Concepts

- Agent: The basic unit of operation. AssistantAgent is one of the specialized agent for user-facing tasks.
- Team: A group of agents working together. RoundRobinGroupChat is one of the communication strategy within a team for task distribution.

### Key Features

- Agent Coordination: Facilitates autonomous inter-agent communication.
- Workflow Automation: Handles repetitive, rule-based tasks.
- Multi-Agent Chat: Allows for real-time agent conversations.
- Programmable Logic: Customize how agents interact.

### Best For

- Automating coding, debugging, and data tasks.
- Enterprise workflows requiring agent collaboration.
- Dynamic agent communication pipelines.

### Pros

- Strong scalability for large workflows.
- High degree of programmability.
- Integrates well with enterprise-level applications.

### Cons

- Steeper learning curve.
- Python-centric, requiring programming expertise.

### Example

```python
import asyncio
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.ui import Console
from autogen_agentchat.conditions import TextMentionTermination
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_ext.models.openai import OpenAIChatCompletionClient

# Define a tool
async def get_weather(city: str) -> str:
    return f"The weather in {city} is 73 degrees and Sunny."

async def main() -> None:
    # Define an agent
    weather_agent = AssistantAgent(
        name="weather_agent",
        model_client=OpenAIChatCompletionClient(
            model="gpt-4o-2024-08-06",
            # api_key="YOUR_API_KEY",
        ),
        tools=[get_weather],
    )

    # Define termination condition
    termination = TextMentionTermination("TERMINATE")

    # Define a team
    agent_team = RoundRobinGroupChat([weather_agent], termination_condition=termination)

    # Run the team and stream messages to the console
    stream = agent_team.run_stream(task="What is the weather in New York?")
    await Console(stream)

asyncio.run(main())
```

## LangGraph

### Overview

LangGraph combines LangChain’s capabilities with graph-based execution, making it ideal for structured agent workflows. It manages tasks through nodes and edges, visualizing interactions.

### Key Concepts

- Node: Represents a task in the workflow.
- Edge: Defines relationships between nodes.
- Graph Execution: Ensures tasks are completed in the correct order.
- Visualization: Simplifies understanding of complex workflows.

### Key Features

- Graph Workflows: Represent tasks as nodes and edges.
- LangChain Integration: Leverages LangChain tools and models.
- Conditional Logic: Supports complex task flows with decision-making.
- Highly Visual: Graph-based visualization simplifies workflows.

### Best For

- Complex workflows with branching logic.
- Visualizing multi-agent task execution.
- AI-powered decision trees.

### Pros

- Intuitive graph-based workflow management.
- Flexible integration with LangChain tools.
- Excellent for highly structured task execution.

### Cons

- Requires familiarity with LangChain concepts.
- Complex to set up for beginners.

### Example

```python
from typing import Annotated, Literal, TypedDict

from langchain_core.messages import HumanMessage
from langchain_anthropic import ChatAnthropic
from langchain_core.tools import tool
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph, MessagesState
from langgraph.prebuilt import ToolNode


# Define the tools for the agent to use
@tool
def search(query: str):
    """Call to surf the web."""
    # This is a placeholder, but don't tell the LLM that...
    if "sf" in query.lower() or "san francisco" in query.lower():
        return "It's 60 degrees and foggy."
    return "It's 90 degrees and sunny."


tools = [search]

tool_node = ToolNode(tools)

model = ChatAnthropic(model="claude-3-5-sonnet-20240620", temperature=0).bind_tools(tools)

# Define the function that determines whether to continue or not
def should_continue(state: MessagesState) -> Literal["tools", END]:
    messages = state['messages']
    last_message = messages[-1]
    # If the LLM makes a tool call, then we route to the "tools" node
    if last_message.tool_calls:
        return "tools"
    # Otherwise, we stop (reply to the user)
    return END


# Define the function that calls the model
def call_model(state: MessagesState):
    messages = state['messages']
    response = model.invoke(messages)
    # We return a list, because this will get added to the existing list
    return {"messages": [response]}


# Define a new graph
workflow = StateGraph(MessagesState)

# Define the two nodes we will cycle between
workflow.add_node("agent", call_model)
workflow.add_node("tools", tool_node)

# Set the entrypoint as `agent`
# This means that this node is the first one called
workflow.add_edge(START, "agent")

# We now add a conditional edge
workflow.add_conditional_edges(
    # First, we define the start node. We use `agent`.
    # This means these are the edges taken after the `agent` node is called.
    "agent",
    # Next, we pass in the function that will determine which node is called next.
    should_continue,
)

# We now add a normal edge from `tools` to `agent`.
# This means that after `tools` is called, `agent` node is called next.
workflow.add_edge("tools", 'agent')

# Initialize memory to persist state between graph runs
checkpointer = MemorySaver()

# Finally, we compile it!
# This compiles it into a LangChain Runnable,
# meaning you can use it as you would any other runnable.
# Note that we're (optionally) passing the memory when compiling the graph
app = workflow.compile(checkpointer=checkpointer)

# Use the Runnable
final_state = app.invoke(
    {"messages": [HumanMessage(content="what is the weather in sf")]},
    config={"configurable": {"thread_id": 42}}
)
final_state["messages"][-1].content
```

## Comparison Table

| Feature             | OpenAI Assistants | OpenAI Swarm | CrewAI         | AutoGen        | LangGraph       |
|---------------------|-------------------|-------------|----------------|----------------|-----------------|
| Multi-Agent Support | Limited           | High        | High           | High           | High            |
| Ease of Use         | Easy              | Moderate    | Moderate       | Moderate       | Moderate        |
| Customization       | Low               | Moderate    | High           | High           | High            |
| Programming Need    | Low               | High        | High           | High           | High            |
| Visualization       | None              | None        | None           | None           | Graph-based     |
| Best Use Case       | Chatbots, APIs    | Collaboration | Teams, Workflows | Automation | Graph Workflows |

## Conclusion

Each AI agent framework has its strengths:

- OpenAI Assistants is ideal for simple tasks and chat integrations.
- OpenAI Swarm focuses on collaborative agent systems.
- CrewAI excels in role-based team workflows.
- AutoGen automates complex workflows with a strong multi-agent focus.
- LangGraph brings structure and visualization to multi-agent logic.

Choosing the right framework depends on your specific needs—from ease of use to task complexity and agent orchestration requirements. For developers seeking custom workflows, CrewAI and AutoGen are strong contenders, while LangGraph is ideal for those prioritizing structured visualization. For simpler, API-driven implementations, OpenAI Assistants remains an excellent choice.