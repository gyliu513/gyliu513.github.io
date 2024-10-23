---
layout: post
title:  "Instana Observability for watsonx.ai and CrewAI integration"
date:   2024-10-22 08:17:10 -0400
categories: jekyll update
tag: crewai
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Instana Observability for watsonx.ai and CrewAI integration](#instana-observability-for-watsonxai-and-crewai-integration)
  - [Background](#background)
  - [Why AI Agent Observability Matters for Integration](#why-ai-agent-observability-matters-for-integration)
  - [How Instana Observability Solves These Challenges](#how-instana-observability-solves-these-challenges)
  - [CrewAI Observability Architecture](#crewai-observability-architecture)
  - [Tutorial for CrewAI Observability](#tutorial-for-crewai-observability)
    - [Build Your CrewAI Application with Watsonx](#build-your-crewai-application-with-watsonx)
    - [Configuration Data Collection and Export](#configuration-data-collection-and-export)
    - [CrewAI Tracing Observability](#crewai-tracing-observability)
  - [Conclusion](#conclusion)
  - [Reference](#reference)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Instana Observability for watsonx.ai and CrewAI integration

## Background

With the integration of CrewAI and watsonx.ai, there are several distinct benefits:

- Enhanced collaboration: By orchestrating multiple AI agents, this partnership enables teams to solve problems collaboratively, rather than relying on individual agents to tackle isolated tasks. This creates a more efficient and intelligent approach to complex problem-solving.
- Scalability: Watsonx.ai’s IBM and third-party models can now be applied across multiple AI agents simultaneously, allowing organizations to scale their operations while maintaining precision and efficiency. This lowers time to market and enables organizations to handle more complex workflows.
- Adaptability: As business requirements evolve, so too can the AI workflows powered by this integration. CrewAI’s platform allows for real-time adjustments to agent behavior and interactions, helping ensure that AI systems remain agile and responsive to changing needs.
- Increased automation: The orchestration capabilities of CrewAI allow for the automation of previously manual or disjointed workflows. Combined with watsonx.ai’s AI modeling, this automation drives significant efficiency gains, freeing up teams to focus on strategic initiatives rather than operational tasks.

However, with this integration comes the challenge of ensuring seamless operation, real-time monitoring, and efficient troubleshooting of AI agents. This is where Instana Observability plays a crucial role.

In this blog, we’ll explore the challenges of AI agent observability during the integration of Watsonx.ai and CrewAI, and how Instana can provide the necessary tools and insights to overcome these challenges.

## Why AI Agent Observability Matters for Integration

AI agents within Watsonx.ai and CrewAI need to function together cohesively, with real-time data flowing between them. However, without observability, several issues can arise, such as:

- Performance Bottlenecks: AI models may slow down due to inefficient resource management, network latency, or heavy computational loads. Identifying and addressing these issues without observability can lead to degraded user experience or system crashes.
- Undetected Failures: AI agents might fail due to misconfigurations or system errors, leading to unexpected behavior that can go unnoticed if proper monitoring isn’t in place.
- Data Flow Issues: The integration of Watsonx.ai and CrewAI involves complex data exchanges. Data might be lost, delayed, or corrupted without visibility into the process, resulting in inaccurate outcomes.
- Security Risks: Integration without observability could expose the system to security vulnerabilities, as AI agents may act in unexpected ways, possibly due to unauthorized access or breaches.
- Resource Overconsumption: AI agents are resource-intensive. Without careful monitoring, they can overconsume CPU, GPU, or memory resources, leading to system instability.

## How Instana Observability Solves These Challenges

Instana is designed to provide real-time monitoring, tracing, and alerting for complex systems, making it an ideal tool for maintaining observability over AI agent integrations between Watsonx.ai and CrewAI. Here’s how Instana helps address the key challenges:

- Performance Monitoring and Optimization: Instana offers deep performance insights by monitoring key metrics such as processing time, latency, and resource utilization. For Watsonx.ai and CrewAI, this means:
  - Real-time tracking of AI model response times.
  - Monitoring network latency between the two systems.
  - Identifying bottlenecks during periods of high load or intensive tasks.

- Proactive Error Detection: Instana’s error detection and alerting mechanisms ensure that any failure in AI agents is captured instantly.
  - If a model running on Watsonx.ai experiences a misconfiguration or runtime failure, Instana can alert the team, allowing for immediate resolution.
  - Errors in data transfer between Watsonx.ai and CrewAI can be traced back to their source, facilitating quick troubleshooting.

- Data Flow Visibility: The seamless exchange of data is crucial for Watsonx.ai and CrewAI integration. Instana’s distributed tracing allows you to visualize the entire data flow between systems:
  - Detailed tracing of API calls between Watsonx.ai and CrewAI ensures data is processed accurately and efficiently.
  - You can detect any irregularities in the data flow, such as delays, errors, or missing information, and address them quickly.

- Security Monitoring and Compliance: With Instana, you can monitor AI agents for security anomalies:
  - Track unusual activity in real time, detecting unauthorized access or data breaches.
  - Ensure that AI agents are operating within predefined security parameters, and any deviation can trigger an alert.

- Resource Usage and Scalability: AI models are resource-hungry, often requiring significant CPU, GPU, and memory. Instana’s resource monitoring helps:
  - Monitor the resource consumption of each AI agent in Watsonx.ai and CrewAI.
  - Identify when and where auto-scaling is needed to prevent resource exhaustion.
  - Ensure that AI agents are operating efficiently without overloading the system.

## CrewAI Observability Architecture

![w](/images/crewai/crewai-observability-arch.png)

Here are some highlights for the above architecture:
- Instana is using [OpenLLMetry](https://github.com/traceloop/openllmetry) as the foundation for CrewAI Observability.
- CrewAI < 0.63.0 was based on LangChain, and Instana is using LangChain Instrumentation from [OpenLLMetry](https://github.com/traceloop/openllmetry) to get metrics, traces and logs
- CrewAI >= 0.63.0 was based on LiteLLM, LiteLLM is kind of LLM Gateway, and Instana is using different LLM Provider Instrumentation from [OpenLLMetry](https://github.com/traceloop/openllmetry) to get metrics, traces and logs
- Instana now support two pattern of data collection including Agent mode and Agentless mode.
  - Agent Mode: For this pattern, the CrewAI data will be send to Instana Agent first, and the LLM sensor running on the agent will help aggregate the data and send to Instana Backend.
  - Agentless Mode: For this pattern, the CrewAI data will be send to Instana Backend directly without going through the agent, the data will go to backend otel acceptor directly.

## Tutorial for CrewAI Observability

### Build Your CrewAI Application with Watsonx

There is a sample application in this blog [Leveraging CrewAI and IBM watsonx](https://developer.ibm.com/blogs/awb-leveraging-crewai-and-ibm-watsonx/), you can get the code with OpenLLMetry integration from [here](https://github.com/gyliu513/langX101/blob/main/crew/crewai_watsonx.py).

Here are some detail for how does the Agents and Tasks works for the CrewAI application:

- Data Collector Agent
  - Description: This agent is responsible for gathering raw data from various sources in CrewAI. It handles the initial phase of the workflow by collecting all necessary data points and ensuring their accuracy and completeness.
- Financial Analyst Agent
  - Description: This agent performs data analysis, particularly focused on financial data. It processes the raw data collected by the Data Collector and applies analytical models to generate insights, predictions, or recommendations based on the financial information.
- Report Writer Agent
  - Description: This agent is responsible for creating structured reports based on the output from the Financial Analyst. It takes the analyzed data and formats it into a comprehensive report, making it easily understandable for end-users or stakeholders.
- Data Collector Task
  - Description: This task is triggered by the Data Collector agent. It involves the execution of data retrieval operations, where the agent interacts with the data sources to collect and prepare the information needed for analysis.
- Financial Analyst Task
  - Description: This task is assigned to the Financial Analyst agent. It involves processing the collected data, running various analytical models (such as financial forecasting or risk assessment), and generating meaningful insights from the raw data.
- Report Writer Task
  - Description: This task is handled by the Report Writer agent. It formats the analytical results from the Financial Analyst into a structured report, which can be distributed to the necessary stakeholders for decision-making or further action.

### Configuration Data Collection and Export

Refer to [Instana LLM Observability](https://www.ibm.com/docs/en/instana-observability/current?topic=technologies-monitoring-llms) to get more detail for how to config, here is a configuration sample:

```
TRACELOOP_BASE_URL=https://otlp-orange-saas.instana.io:4318
TRACELOOP_LOGGING_ENDPOINT=https://otlp-orange-saas.instana.io:4318
TRACELOOP_HEADERS="x-instana-key=foo,x-instana-host=bar.fyre.ibm.com"
TRACELOOP_METRICS_ENDPOINT=https://otlp-orange-saas.instana.io:4318
```

- `TRACELOOP_BASE_URL` is used for sending trace info.
- `TRACELOOP_LOGGING_ENDPOINT` is used for sending log info, it is same as `TRACELOOP_BASE_URL`, as we are using same endpopint in this sample.
- `TRACELOOP_METRICS_ENDPOINT` is used for sending metrics info.

### CrewAI Tracing Observability

After all the configuration finished, we can run the CrewAI Application from [here](https://github.com/gyliu513/langX101/blob/main/crew/crewai_watsonx.py). We also defined the app name as `watsonx_crew_agent` at [here](https://github.com/gyliu513/langX101/blob/main/crew/crewai_watsonx.py#L9).

After the application running finished, we can navigate to Instana application page and will see there is a new service named as `watsonx_crew_agent` as below.

![w](/images/crewai/svc-name.png)

By navigating to the analytics page for this service, we can view span details, including the duration of each span. This allows us to identify which spans are consuming the most time and take action to improve performance.

![w](/images/crewai/crew-span.png)

Since the agent typically involves complex logic, such as agents, tasks, and tools, it's crucial to maintain visibility into these resources. With Instana, we can provide full tracing of the entire application, including the application topology and dependencies. At the same time, we enable customers to see tags for different resources like agents, tasks, and tools. This ensures that these resources are no longer a black box but are transparent, allowing customers to rely on the tags to gain deeper insights into what's happening with each resource and step.

![w](/images/crewai/crew-trace.png)

## Conclusion

As AI-driven platforms like Watsonx.ai and CrewAI continue to shape the future of intelligent systems, ensuring smooth integration is paramount. Instana’s observability tools provide the real-time monitoring, performance insights, and security features needed to keep this integration functioning optimally.

With Instana, teams can proactively address performance bottlenecks, detect errors before they escalate, monitor data flow, and ensure that AI agents are operating efficiently and securely. This ensures that businesses can fully leverage the potential of Watsonx.ai and CrewAI without encountering operational roadblocks.

Start building a reliable, scalable, and secure AI ecosystem today by integrating Instana Observability into your AI workflows!

## Reference

- [CrewAI for streamlined, multi-agent orchestration](https://www.ibm.com/new/announcements/announcing-new-crewai-integration-with-watsonx-ai-to-build-and-streamline-workflows-with-multiple-ai-agents)