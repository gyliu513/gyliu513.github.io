---
layout: post
title:  "kagent quick start"
date:   2025-06-29 08:17:10 -0400
categories: jekyll update
tag: MCP
---

# Getting Started with kagent: Your Gateway to Agentic AI in Cloud-Native Environments

## Introduction to kagent

**kagent** is an open-source framework that brings the power of agentic AI to cloud-native environments. As a [Cloud Native Computing Foundation sandbox project](https://kagent.dev/docs/getting-started/quickstart), kagent enables you to deploy and manage AI agents directly within Kubernetes clusters, making it easier than ever to integrate intelligent automation into your cloud-native workflows.

What makes kagent special is its cloud-native approach to AI agents. Instead of running agents as standalone applications, kagent allows you to deploy them as Kubernetes-native resources, complete with observability, scaling, and management capabilities that you'd expect from modern cloud infrastructure.

Key features of kagent include:
- **Cloud-native deployment**: Deploy AI agents as Kubernetes resources
- **Built-in observability**: Monitor and trace agent interactions
- **Multi-provider support**: Works with OpenAI, Anthropic, Google Vertex AI, Azure OpenAI, and more
- **Extensible tooling**: Easy integration with existing Kubernetes tools and workflows
- **Web dashboard**: User-friendly interface for managing and interacting with agents

## Prerequisites

Before diving into kagent, make sure you have the following tools installed and ready:

### Required Tools
- **[kind](https://kind.sigs.k8s.io/)**: For creating and running a local Kubernetes cluster
- **[Helm](https://helm.sh/)**: For installing the kagent chart
- **[kubectl](https://kubernetes.io/docs/tasks/tools/)**: For interacting with your Kubernetes cluster

### API Access
You'll also need an **OpenAI API key** to power the AI agents. You can obtain one from the [OpenAI platform](https://platform.openai.com/api-keys).

## Installation Guide

Getting kagent up and running is straightforward. Follow these steps to install kagent in your local Kubernetes environment:

### Step 1: Set Your OpenAI API Key

First, export your OpenAI API key as an environment variable:

```bash
export OPENAI_API_KEY="your-api-key-here"
```

### Step 2: Download the kagent CLI

Download and install the kagent CLI using the provided install script:

```bash
# Download and run the install script
curl https://raw.githubusercontent.com/kagent-dev/kagent/refs/heads/main/scripts/get-kagent | bash
```

This script will download the kagent CLI binary and make it available in your system PATH.

### Step 3: Install kagent to Your Cluster

With the CLI ready, install kagent to your Kubernetes cluster:

```bash
kagent install
```

You should see confirmation that kagent has been installed successfully:

```
kagent installed successfully
```

## Playing with kagent

Now comes the fun part! Let's explore what kagent can do and how to interact with your AI agents.

### Accessing the kagent Dashboard

The easiest way to get started is through the web dashboard:

```bash
kagent dashboard
```

This command will:
- Set up port-forwarding to the kagent service in your cluster  
- Open the dashboard in your default browser
- Display: `kagent dashboard is available at http://localhost:8082`

The dashboard provides a user-friendly interface where you can:
- View all available agents
- Click on agent cards to see details
- Start conversations with agents
- Monitor agent activities

### Using the CLI Interface

For those who prefer command-line interactions, kagent offers a powerful REPL (Read-Eval-Print Loop) environment:

```bash
kagent
```

This opens the kagent prompt where you can run various commands. Get help with:

```bash
kagent >> help
```

Available commands include:
- `clear`: Clear the screen
- `dashboard`: Open the kagent dashboard
- `get`: Get kagent resources
- `run`: Run a kagent agent
- `install`/`uninstall`: Manage kagent installation

### Exploring Pre-configured Agents

List the available agents in your cluster:

```bash
kagent >> get agents
```

You'll see output similar to:

```
+---+---------------------+----+----------------------------+
| # | NAME                | ID | CREATED                    |
+---+---------------------+----+----------------------------+
| 0 | helm-agent          | 2  | 2025-03-13T19:08:14.527935 |
| 1 | observability-agent | 3  | 2025-03-13T19:08:14.348957 |
| 2 | istio-agent         | 1  | 2025-03-13T19:08:13.794848 |
+---+---------------------+----+----------------------------+
```

### Starting Your First Agent Conversation

Start an interactive chat with an agent:

```bash
kagent >> run chat [agent-name] [session-name] [initial-task]
```

Or run it without parameters to get interactive prompts:

```bash
kagent >> run chat
```

The system will guide you through:
1. Selecting an agent (e.g., helm-agent, observability-agent, istio-agent)
2. Choosing or creating a session
3. Entering your initial task

### Example: Working with the Helm Agent

Let's try the helm-agent with a practical example:

1. **Start the conversation**:
   ```bash
   kagent >> run chat
   ```

2. **Select helm-agent** from the list

3. **Create a new session** named "test"

4. **Ask a question**: "What helm charts are installed in my cluster?"

The agent will execute the necessary commands and respond with detailed information about your Helm releases. Here's what a typical interaction looks like:

```
Event Type: ToolCall(s)
Source: helm_agent
+---+--------------------+-----------------------------------------+
| # | NAME               | ARGUMENTS                               |
+---+--------------------+-----------------------------------------+
| 0 | helm_list_releases | {"all_namespaces":true,"deployed":true} |
+---+--------------------+-----------------------------------------+

Event Type: TextMessage
Source: helm_agent

I found the following Helm release deployed across all namespaces:

- **Release Name:** kagent
  - **Namespace:** kagent  
  - **Revision:** 11
  - **Updated:** 2025-03-13 19:18:49 UTC
  - **Status:** Deployed
  - **Chart:** kagent-v0.0.18-4-g4926e59-dirty

If you need more details about any specific release, let me know!
```

## What Makes kagent Powerful

What you've just experienced showcases kagent's key strengths:

1. **Tool Integration**: Agents can execute real Kubernetes and Helm commands
2. **Observability**: Every action is traced and logged
3. **Natural Language Interface**: Complex operations through simple conversations
4. **Session Management**: Persistent conversations across multiple interactions

## Next Steps and Resources

Now that you've got kagent running, here are some directions to explore:

- **Create Custom Agents**: Learn to build agents tailored to your specific needs
- **Explore Core Concepts**: Understand kagent's architecture and design principles
- **Join the Community**: Connect with other kagent users and contributors

### Helpful Resources

- **Official Documentation**: [kagent.dev](https://kagent.dev)
- **GitHub Repository**: [kagent-dev/kagent](https://github.com/kagent-dev/kagent)
- **Community Discord**: Join discussions and get support
- **Examples and Tutorials**: Explore advanced use cases and integrations

## Conclusion

kagent represents a new paradigm in cloud-native AI, making it incredibly easy to deploy intelligent agents that can interact with your Kubernetes infrastructure. Whether you're managing Helm charts, monitoring observability metrics, or configuring service meshes, kagent's agents can help automate and streamline these tasks through natural language interactions.

The combination of Kubernetes-native deployment, comprehensive tooling support, and intuitive interfaces makes kagent an excellent choice for teams looking to integrate AI-powered automation into their cloud-native workflows. Give it a try and see how it can transform your infrastructure management experience!