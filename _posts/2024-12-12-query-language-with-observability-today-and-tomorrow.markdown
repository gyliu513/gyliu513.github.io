---
layout: post
title:  "Query Language with Observability: Today and Tomorrow"
date:   2024-12-12 08:17:10 -0400
categories: jekyll update
tag: QLS
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Query Language with Observability: Today and Tomorrow](#query-language-with-observability-today-and-tomorrow)
  - [Introduction](#introduction)
  - [The Current State of Query Languages in Observability](#the-current-state-of-query-languages-in-observability)
    - [Domain-Specific Query Languages](#domain-specific-query-languages)
    - [Challenges with Current Query Languages](#challenges-with-current-query-languages)
  - [What We Are Doing Now To Fix Those Challenges](#what-we-are-doing-now-to-fix-those-challenges)
    - [Query Language Specification (QLS) Working Group](#query-language-specification-qls-working-group)
    - [Key Objectives of the QLS Working Group](#key-objectives-of-the-qls-working-group)
    - [Updates from the Working Group](#updates-from-the-working-group)
  - [The Future of Querying in Observability](#the-future-of-querying-in-observability)
    - [What's Next for QLS Working Group](#whats-next-for-qls-working-group)
    - [Emerging Trends and Innovations](#emerging-trends-and-innovations)
  - [Technical Implications of Unified Query Language](#technical-implications-of-unified-query-language)
    - [Simplified Telemetry Data Access](#simplified-telemetry-data-access)
    - [Enhanced Developer Productivity](#enhanced-developer-productivity)
    - [Standardized APIs for Query Execution](#standardized-apis-for-query-execution)
    - [Scalability and Performance](#scalability-and-performance)
    - [AI-Powered Query Assistance](#ai-powered-query-assistance)
    - [Holistic Observability Across Federated Environments](#holistic-observability-across-federated-environments)
  - [Conclusion: Shaping the Future of Observability](#conclusion-shaping-the-future-of-observability)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Query Language with Observability: Today and Tomorrow

## Introduction

Modern cloud-native systems demand robust observability to maintain reliability, performance, and scalability. Observability hinges on the ability to query vast amounts of telemetry data—metrics, logs, and traces—collected from distributed systems. Query languages serve as the linchpin, enabling developers, operators, and SREs to extract actionable insights efficiently.

This blog explores the evolution of query languages in observability, their current state, and emerging trends that are transforming how we interact with telemetry data. We'll delve into popular query languages like PromQL, LogQL, and trace query tools, examine their limitations, and look ahead to the future, where AI-driven natural language interfaces and unified telemetry queries promise to redefine the observability experience.

## The Current State of Query Languages in Observability

### Domain-Specific Query Languages

Query languages tailored for specific telemetry types dominate the observability landscape:

- PromQL (Prometheus Query Language): PromQL has become a standard for metrics observability, offering a flexible and powerful syntax for querying time-series data. It excels in enabling SREs to monitor performance metrics, define alerts, and troubleshoot issues efficiently.

- LogQL: LogQL, the query language for Grafana Loki, extends observability to logs. It integrates well with PromQL, allowing users to correlate metrics and logs to gain deeper insights into application behavior.

- Trace Query Languages: Distributed tracing tools like Jaeger and Tempo provide basic query interfaces for exploring traces. These tools, while valuable, often lack the depth and maturity seen in metrics and log querying.

There are also some new entrants such a Instana Dynamic Focus Queries (DFQ), Datadog Query Language (DQL), New Relic Query Language (NRQL), Dynatrace's Custom Queries, and Lightstep's Unified Query Language (UQL) are broadening the scope of what's possible. The following table is a comparison ofQuery Languages for those new entrants.

| Feature                          | Instana DFQ (Lucene-Based)                                             | Datadog Query Language (DQL)                                     | New Relic Query Language (NRQL)                                 | Dynatrace Query Language (DQL)                                 | Lightstep Unified Query Language (UQL)                          |
|----------------------------------|------------------------------------------------------------------------|-------------------------------------------------------------------|-----------------------------------------------------------------|-----------------------------------------------------------------|-----------------------------------------------------------------|
| **Primary Focus**                | Detailed, customizable searches within Instana's Dynamic Graph         | Unified querying across metrics, logs, and traces               | SQL-like querying for application performance monitoring        | Automated analytics with a focus on metrics and traces         | Unified querying across metrics, logs, and traces              |
| **Syntax Style**                 | Lucene query syntax                                                   | Simplified and intuitive                                          | SQL-inspired                                                   | Template-driven                                                | Unified syntax for all telemetry data                          |
| **Ease of Use**                  | Moderate; requires familiarity with Lucene syntax                     | High; user-friendly with interactive query builder               | High; accessible for users with SQL knowledge                  | Medium; relies on templates and automation                     | High; simplifies cross-domain querying                         |
| **Cross-Domain Querying**        | Limited; primarily within Instana's data contexts                     | Full support for metrics, logs, and traces correlation           | Partial; primarily metrics and events                          | Partial; metrics and traces                                    | Full support for metrics, logs, and traces correlation         |
| **Real-Time Querying**           | Yes                                                                   | Yes                                                               | Yes                                                            | Yes                                                            | Yes                                                            |
| **Visualization Integration**    | Integrated with Instana's dashboards                                  | Built-in dashboards and graphs                                   | Strong integration with custom dashboards                      | Automated visualization with root cause insights               | Seamless integration with Lightstep visualizations             |
| **AI-Powered Features**          | Limited; focuses on detailed search capabilities                      | Anomaly detection, query recommendations                         | AI-driven anomaly detection                                    | AI-powered root cause analysis                                | Context-aware telemetry analysis                              |
| **Declarative Support**          | Limited; relies on manual query construction                          | Limited; relies on manual definitions                            | Limited; manual configurations required                        | Limited; semi-automated                                       | High potential with unified querying                          |
| **Learning Curve**               | Moderate; requires learning Lucene syntax                             | Low; suitable for beginners and advanced users                   | Low for SQL-savvy users; moderate otherwise                    | Low; deep features may require experience                      | Low; intuitive for all users                                  |
| **Advanced Filtering**           | Supports complex queries with Boolean operators                       | Rich filtering and aggregation support                           | Advanced filtering with SQL-like WHERE clauses                 | Pre-configured filters; limited customizations                | Strong filtering across telemetry domains                     |
| **Integration with Ecosystem**   | Deep integration within Instana's monitoring environment              | Deep integration across Datadog tools                            | Focused on New Relic’s ecosystem                               | Strong integration within Dynatrace ecosystem                 | Works well with Lightstep ecosystem                           |
| **Best For**                     | Users needing detailed, customizable searches within Instana's platform | Comprehensive, unified observability needs                       | Application performance monitoring and alerting                | Automated diagnostics and AIOps                                | Distributed systems and microservices observability            |

### Challenges with Current Query Languages

Despite their strengths, domain-specific query languages face several limitations:

- Lack of Standardization: Each observability platform has its own query language, leading to inconsistencies and the need to learn multiple syntaxes when using different tools. This fragmentation hinders interoperability and increases cognitive load for teams using diverse observability stacks.
- Vendor Lock-In: The proprietary nature of many query languages ties users to specific platforms, making it difficult to switch to another tool without significant retraining and migration effort.
- Limited Cross-Domain Integration: Many query languages are optimized for a single type of telemetry (metrics, logs, or traces), making it difficult to correlate data across domains without switching between tools or manually combining results.
- Manual Query Optimization: Most query languages require users to understand the underlying data model and infrastructure to optimize queries for performance. This dependency on manual tuning can lead to inefficiencies and missed insights.
- Steep Onboarding Curve for New Users: For organizations onboarding new developers or SREs, the complexity of query languages can be a significant hurdle, slowing down their ability to contribute effectively.
- Limited Support for Natural Language Interaction: Current query languages are typically designed for technical users, excluding stakeholders without deep technical knowledge. This limitation reduces accessibility for broader teams, such as product managers or business analysts.

## What We Are Doing Now To Fix Those Challenges

### Query Language Specification (QLS) Working Group

At KubeCon North America 2024, the CNCF Observability TAG (Technical Advisory Group) unveiled significant advancements in their efforts to simplify and unify observability practices. Central to their update is the Query Language Specification (QLS) Working Group, which aims to address the fragmented landscape of observability query languages by recommending a standard, unified language.

### Key Objectives of the QLS Working Group

- Evaluation Reports
  - Surveys and interviews with end users.
  - Detailed use cases and examples.
  - Semantic descriptions of existing query languages, including Datadog Query Language (DQL), New Relic Query Language (NRQL), Dynatrace's Custom Queries, and Lightstep's Unified Query Language (UQL) etc.

- Standard Query Recommendations
  - Design goals for a unified language.
  - Base data model definitions for telemetry data types.
  - Semantic definitions for operations on observability data.
  - A schema for query results.
  - Recommended APIs and query syntax.

### Updates from the Working Group

- Semantic Feature Rubric: The group released the first draft of a Semantic Feature Rubric, providing a framework for evaluating and comparing query languages. This rubric will guide the selection of essential features for the standard language.
- Survey Collaboration with OTel SIG: The group plans to collaborate with the OpenTelemetry End Users SIG to survey industry users about desired features and their affinity for specific DSLs.
- Industry Trends: Big tech companies are increasingly standardizing on SQL for federated data processing. This trend highlights the potential of a SQL-inspired query language for observability.

## The Future of Querying in Observability

### What's Next for QLS Working Group

- User Surveys and Feedback: Engage with end users to gather feedback on feature preferences and affinity for different DSLs.
- Refining the Rubric: Enhance the semantic feature rubric to ensure it captures the nuances of modern observability needs.
- Prototyping and Recommendations: Develop a draft query language specification, incorporating insights from surveys, interviews, and industry presentations.

### Emerging Trends and Innovations

- Simplifying User Experience
  - UI Query Builders: Graphical interfaces to help users construct queries without needing in-depth syntax knowledge.
  - Auto-Surfacing Relevant Telemetry: Platforms that proactively display the most critical telemetry data.

- Multi-Dialect Gateways
  - Query gateways capable of handling multiple query languages or dialects, allowing users to query data seamlessly across tools, like Instana, Dynatrace, Datadog, New Relic etc.

- Natural Language Interfaces
  - Advancements in AI and natural language processing (NLP) are making observability more accessible.
  - AI-powered query interfaces allow users to interact with telemetry data in plain language, breaking down barriers for non-technical stakeholders.
  - Query Assistance: Suggesting optimal query syntax based on historical patterns.
  - Anomaly Detection: Generating queries to pinpoint the root causes of system anomalies.
  - Predictive Insights: Crafting queries to forecast trends and preempt potential issues.

- Cross-Domain and Declarative Querying
  - The future of observability lies in cross-domain querying, where users can interact with metrics, logs, traces, and events through a single interface. Declarative observability, inspired by Kubernetes’ declarative model, allows users to define desired states (e.g., SLA compliance) and let the system generate queries to monitor and maintain these states automatically.

- Federated Observability Queries
  - Organizations increasingly adopt multi-cloud and hybrid-cloud architectures, necessitating federated query capabilities. These enable users to query distributed telemetry systems cohesively, overcoming challenges like data locality and query consistency.

## Technical Implications of Unified Query Language

### Simplified Telemetry Data Access

- A unified query language will abstract the complexities of individual telemetry domains, providing a single syntax for querying metrics, logs, and traces.
- Tools can adopt a standardized interface, enabling seamless transitions between telemetry types and cross-domain correlations.

Example: Instead of switching between PromQL for metrics, LogQL for logs, and trace-specific DSLs, users could write a single query to analyze relationships across all three domains:

```sql
SELECT avg(metrics.latency), count(logs.errors), trace.latency_distribution 
FROM telemetry_data 
WHERE service = 'checkout-service' AND time_window = 'last 1 hour';
```

### Enhanced Developer Productivity

- Developers and SREs can focus on solving problems rather than learning tool-specific languages, accelerating onboarding and productivity.
- Declarative observability configurations based on a unified query language can simplify monitoring setups and CI/CD integration.

Example: A Kubernetes manifest could include declarative observability goals directly linked to queries:

```yaml
apiVersion: observability.v1
kind: Query
metadata:
  name: latency-and-errors
spec:
  query: >
    SELECT avg(metrics.latency), count(logs.errors)
    WHERE service = 'frontend' AND time_window = 'last 5 minutes';
  thresholds:
    latency: 200ms
    errors: 5
  alert: true
```

### Standardized APIs for Query Execution

- Recommended APIs for the unified language will simplify query execution across platforms, fostering interoperability and integration.
- A common schema for query results will enable consistent processing, visualization, and alerting across tools.

Example: A standardized API might look like:

```json
POST /query
{
  "query": "SELECT count(logs.errors) WHERE service = 'database-service'",
  "time_window": "last 1 hour"
}
```

The response could follow a common schema:

```json
{
  "data": [
    {
      "service": "database-service",
      "errors": 42
    }
  ],
  "metadata": {
    "query_id": "12345",
    "execution_time_ms": 150
  }
}
```

### Scalability and Performance

- A unified query language will promote optimization techniques like query pruning, pre-aggregated data retrieval, and distributed query execution.
- Platforms can leverage query gateways to process queries efficiently across federated environments, reducing latency.

Example: A query gateway might split a cross-environment query into sub-queries for execution in localized data stores, then aggregate the results:

```sql
SELECT avg(latency)
FROM telemetry_data
WHERE region IN ('us-east', 'us-west') AND time_window = 'last 24 hours';
```

### AI-Powered Query Assistance

- Integrating large language models (LLMs) can assist users in generating queries based on natural language descriptions, lowering the barrier for non-technical stakeholders.
- AI-driven recommendations can optimize query execution by analyzing historical patterns and telemetry data relationships.

Example: User input: `Show me average latency and error counts for the checkout service in the last hour.`

Generated query:

```sql
SELECT avg(metrics.latency), count(logs.errors)
FROM telemetry_data
WHERE service = 'checkout-service' AND time_window = 'last 1 hour';
```

### Holistic Observability Across Federated Environments

- A unified query language will enable federated queries across diverse environments, with support for distributed execution and result aggregation.
- Data gateways can handle language translation and execution in localized environments.

```sql
SELECT avg(cpu.usage), sum(memory.usage)
FROM telemetry_data
WHERE environment IN ('cloud1', 'cloud2') AND time_window = 'last 6 hours';
```

## Conclusion: Shaping the Future of Observability

Query languages have evolved significantly, but their journey is far from over. As observability tools integrate AI and unify telemetry data streams, the way we interact with telemetry data will become more intuitive, accessible, and powerful. The future promises seamless, natural language-driven queries, cross-domain observability, and federated capabilities tailored for complex cloud environments.

The call to action is clear: embrace these advancements, contribute to open standards like [TAG(Technical Advisory Group) Observability](https://github.com/cncf/tag-observability), and explore AI-driven tools to stay ahead in the ever-evolving observability landscape. By doing so, you’ll not only enhance your systems' reliability but also unlock new opportunities for innovation and collaboration.