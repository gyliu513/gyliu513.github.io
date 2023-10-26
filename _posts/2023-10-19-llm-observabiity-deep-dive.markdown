---
layout: post
title:  "LLM Observability Deep Dive"
date:   2023-10-18 08:17:10 -0400
categories: jekyll update
tag: Observability
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [LLM Observability Deep Dive](#llm-observability-deep-dive)
  - [Background](#background)
  - [Data Should be Observed](#data-should-be-observed)
  - [Key Benefits of LLM Observability](#key-benefits-of-llm-observability)
  - [Emerging LLM Observability Tools Intro](#emerging-llm-observability-tools-intro)
  - [Current LLM Observability Tools Comparison](#current-llm-observability-tools-comparison)
  - [Key Features for a Unified LLM Observability Platform](#key-features-for-a-unified-llm-observability-platform)
    - [Analytics](#analytics)
    - [Tracing](#tracing)
    - [Logging](#logging)
    - [User Tracking](#user-tracking)
    - [User Feedback](#user-feedback)
    - [Multi-Tenancy](#multi-tenancy)
    - [Unified Observability Platform](#unified-observability-platform)
  - [What Would be An Ideal Unified Observability Platform](#what-would-be-an-ideal-unified-observability-platform)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# LLM Observability Deep Dive

## Background

LLMs, or large language models, are a type of artificial intelligence (AI) that have been trained on massive datasets of text and code. This allows them to perform a wide range of tasks, including generating text, translating languages, writing different kinds of creative content, and answering your questions in an informative way.

Most of the LLMs are still under development, but they are already being used in a variety of applications, such as customer service chatbots, search engines, and creative writing tools. As LLMs become more sophisticated and widely used, it is increasingly important to be able to monitor and understand their behavior. The customer does not want to take LLMs as a black box but they want to know what is happening in this black box. This is where LLM observability comes in.

LLM observability is the practice of collecting and analyzing data about an LLM's performance and behavior. This data can be used to improve the LLM's performance, detect biases, diagnose issues, and ensure reliable and trustworthy AI outcomes.

![image](/images/llm-observability/mr-llmchain.png)

## Data Should be Observed

There are five main types of LLM observability data that we need to observe:

- Logs: Logs provide detailed information about the LLM's input and output, such as the prompts that are given to the LLM and the responses that it generates.
- Metrics: Metrics are quantitative measures of the LLM's performance, such as accuracy, latency, and throughput. This can enable the customer does some evaluation for different LLMs so as to select the best LLM for their use case.
- LLM Traces: Traces track the execution of individual LLM tasks. This information can be used to identify performance bottlenecks and to diagnose issues.
- Tenant Tracking: We are living in a multi-tenancy world, it is always important to track all of the tenants for the LLMs, including their cost, conversations and more.
- Feedback: User feedback is essential for improving the performance, reliability, and trustworthiness of LLMs. By understanding how users are interacting with the LLM and what their needs are, developers can make changes to improve the LLM and its user experience.

## Key Benefits of LLM Observability

Here is a short list of what will be the benefit of LLM Observability:

- Improved performance: By monitoring the LLM's performance on different tasks, organizations can identify areas where the model can be improved. For example, if the LLM is struggling to generate accurate translations for a particular language pair, organizations can retrain the model on a larger dataset of that language pair.
- Bias detection: LLMs can be biased, reflecting the biases in the data they are trained on. LLM observability can be used to detect these biases and take steps to mitigate them. For example, organizations can use LLM observability to identify which groups of people are more likely to receive inaccurate or misleading responses from the LLM.
- Issue diagnosis: If an LLM is producing unexpected or incorrect results, LLM observability can be used to diagnose the issue. For example, if the LLM is generating hallucinations (i.e., making up things that are not true), organizations can use LLM observability to identify the factors that are causing this behavior.
- Reliable and trustworthy AI outcomes: LLM observability is essential for ensuring that LLMs are producing reliable and trustworthy results. By monitoring and understanding the LLM's behavior, organizations can identify and mitigate potential risks.
- Enable your LLM Apps ready for production: As mentioned in my [previous blog](https://gyliu513.github.io/jekyll/update/2023/09/25/llm-analytics-paving-the-way-to-rpoduction-for-llm-apps.html), with LLM Observability/Analytics, it will help pave the way for production of your LLM applications.

## Emerging LLM Observability Tools Intro

There are many emerging different tools can help do LLM Observability.

- Open Source Project Tools
  - [Langfuse](https://langfuse.com/)
  - [llmonitor](https://llmonitor.com/)
  - [Helicone](https://www.helicone.ai/dashboard)
- Commercial Tools
  - [LangSmith](https://docs.smith.langchain.com/)
  - [PromptLayer](https://promptlayer.com/)
  - [Dynatrace](https://www.dynatrace.com/)
  - [Datadog](https://www.datadoghq.com/)

Most of them are providing similar features as follows for LLM Observability:

- Metrics Collection: This will include metrics such as accuracy, latency, usage, cost and throughput etc.
- Tracing: LLM apps use increasingly complex abstractions (chains, agents with tools, advanced prompts). The nested traces in those LLM Observability tools help to understand what is going on and get to the root cause of problems.
- Unified LLM Observability and Analytics Platform: Integration with different LLM Ops Platforms including [LangChain](https://python.langchain.com/docs/get_started/introduction), [Flowise](https://flowiseai.com/), [LiteLLM](https://litellm.ai/), [Langflow](https://docs.langflow.org/), [OpenAI](https://openai.com/) etc.

But for [Dynatrace](https://www.dynatrace.com/) and [Datadog](https://www.datadoghq.com/), both of them have very basic AI Observability capabilities just for OpenAI, and it does not support other LLM Ops Platforms like LangChain, Flowise etc. Please refer to [Dynatrace for OpenAI Observability](https://www.dynatrace.com/support/help/get-started/dynatrace-for-ai-observability/openai-observability) and [Datadog OpenAI Monitoring](https://www.datadoghq.com/solutions/openai/) for detail.

## Current LLM Observability Tools Comparison

| Comparison Points | Langfuse | LangSmith |llmonitor |helicone |PromptLayer |
| --- | ----------- |----------- |----------- |----------- |----------- |
| Open Source | Yes |No |Yes |Yes |No |
| License | MIT |NA |Apache |Apache |NA |
| Self Hostable | Yes |No |Yes |Yes |No |
| Tracing | Yes |Yes |Yes |No |No |
| Usage Analytics | Yes |Yes |Yes |Yes |Yes |
| Cost Analytics | Yes |Yes |Yes |Yes |Yes |
| User Tracking | Yes |Yes |Yes |Yes |No |
| Feedback Tracking | Yes |Yes |Yes |No |No |
| LangChain Support | Yes |Yes |Yes |Yes |Yes |
| LangFlow Support | Yes |No |No |No |No |
| Flowise Support | Yes |NA |No |No |No |
| LiteLLM Support | Yes |No |No |No |No |
| OpenAI Support | Yes |NA |Yes |Yes |Yes |
| Request Application Code Change for Observability | Yes |Yes |Yes |Yes |Yes |

NOTE: If you want to enable LLM Observability for your LLM Apps, you will need to make some code change to your LLM Apps to adapt the different LLM Observability tools, this seems to be a major problem for most of the LLM Observability tool now.

## Key Features for a Unified LLM Observability Platform

With above, our final target for LLM Observability is building a unified LLM Observability Platform which can cover most of the LLM Ops Platforms including LangChain, LangFuse, Flowise, LiteLLM etc, and some key features will be as following. I was trying to post a picture for each key feature from above listed LLM Observability tools to share a clear view of how does this feature will be look like.

### Analytics

Analytics allows admins to get insights into their costs and usage, it will help for improving the cost-effectiveness, performance, and capacity planning, as well for some billing and reporting purposes.

![image](/images/llm-observability/langfuse-analytics.png)

### Tracing

Tracing allows admins to debug their AI agents and identify issues. It will also help track the latency, accuracy etc for different models/agents, this can help the customer to do some evaluation for different models/agents.

![image](/images/llm-observability/langfuse-tracing.png)

### Logging

Logging allows admins to log and inspect the LLM requests and responses. By log tracking, developers can gain a better understanding of how LLMs work. This information can be used to improve the design and training of LLMs, and to develop new applications for LLMs.

![image](/images/llm-observability/llmonitor-logging.png)

### User Tracking

User tracking allows customer to identify your users, track their cost, conversations and more. It can also help improving the performance and capabilities of LLMs. By tracking how users interact with LLMs, developers can make LLMs more reliable, accurate, fair, and versatile.

![image](/images/llm-observability/llmonitor-user-tracking.png)

### User Feedback

User feedback can be collected in a variety of ways, such as through surveys, interviews, and user testing. It is important to collect feedback from a diverse range of users, in order to get a comprehensive understanding of the strengths and weaknesses of the LLM.

Once user feedback has been collected, it can be used to improve the LLM in a number of ways. For example, the feedback can be used to identify and fix bugs, to improve the training data, or to develop new training algorithms.

![image](/images/llm-observability/langfuse-user-feedback.png)

### Multi-Tenancy

Multi-tenancy can offer a number of benefits for LLM monitoring, including cost-effectiveness, scalability, security and privacy, better use of resources, and the ability to compare and contrast the performance of different LLMs, track their usage, and identify and troubleshoot LLM-specific issues.

![image](/images/llm-observability/langfuse-mt.png)

### Unified Observability Platform

The customer has many choice to build their LLM Apps, they can build their LLM Apps based on Langchain, Langflow, Flowise, LiteLLM etc. With that, we need to build a Unified Observability Platform to integrate with different LLM Orchestration Platforms.

![image](/images/llm-observability/unified-platform.png)

## What Would be An Ideal Unified Observability Platform

As we discussed above, the major issue for the current LLM Observability Tools is it will request the customer to update their LLM Apps code to adapt those tools, this is not convenient for the customer, as updating the code is kind of hack to their current LLM Apps, an ideal Unified Observability Platform should request no code change to existing LLM Apps.

Below is some thinking of how to enable the Unified Observability Platform can seamlessly integrate with customer LLM Apps on different LLM Orchestration Platforms. I was wondering maybe we can use an agent as a bridge to connect the Unified Observability Platform and LLM Orchestration Platforms. Stay tuned for some update of the Unified Agent in future blogs.

![image](/images/llm-observability/unified-agent.png)
