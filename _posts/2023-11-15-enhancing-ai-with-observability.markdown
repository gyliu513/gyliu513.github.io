---
layout: post
title:  "Enhancing AI with Observability: Using OpenTelemetry in IBM Watsonx.ai Applications"
date:   2023-11-15 08:17:10 -0400
categories: jekyll update
tag: Watsonx
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Enhancing AI with Observability: Using OpenTelemetry in IBM Watsonx.ai Applications](#enhancing-ai-with-observability-using-opentelemetry-in-ibm-watsonxai-applications)
  - [Introduction](#introduction)
  - [Understanding Observability in AI](#understanding-observability-in-ai)
  - [Introduction to OpenTelemetry](#introduction-to-opentelemetry)
  - [Integrating OpenTelemetry with IBM Watsonx.ai](#integrating-opentelemetry-with-ibm-watsonxai)
    - [Prepare](#prepare)
    - [Prepare OTEL](#prepare-otel)
    - [Install OTEL Packages](#install-otel-packages)
    - [Programmatically Instrumentation for Watsonx.ai](#programmatically-instrumentation-for-watsonxai)
  - [Observing and Analyzing AI Performance](#observing-and-analyzing-ai-performance)
  - [Reference](#reference)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Enhancing AI with Observability: Using OpenTelemetry in IBM Watsonx.ai Applications

## Introduction

Watsonx.ai is part of the IBM watsonx platform that brings together new generative AI capabilities, powered by foundation models and traditional machine learning into a powerful studio spanning the AI lifecycle. With watsonx.ai, you can train, validate, tune and deploy generative AI, foundation models and machine learning capabilities with ease and build AI applications in a fraction of the time with a fraction of the data.

However, leveraging these foundation models effectively in IBM Watsonx AI requires not just technical know-how but also keen monitoring of their performance and behavior. That's where OpenTelemetry comes in. This blog explores how OpenTelemetry can be integrated with IBM Watsonx.ai applications to achieve comprehensive observability.

## Understanding Observability in AI

Observability in AI is crucial for maintaining model performance, ensuring efficient resource usage, and troubleshooting issues quickly. Unlike traditional applications, AI systems deal with complex data and predictions, making their monitoring uniquely challenging. Observability helps in understanding these complexities and provides insights into the model's decision-making process.

For more detail of LLM Observability, please refer to my previous blogs as follows:
- [LLM Analytics — Paving the way to Production for LLM Apps](https://gyliu513.github.io/jekyll/update/2023/09/25/llm-analytics-paving-the-way-to-rpoduction-for-llm-apps.html)
- [LLM Observability Deep Dive](https://gyliu513.github.io/jekyll/update/2023/10/18/llm-observabiity-deep-dive.html)

## Introduction to OpenTelemetry

OpenTelemetry is an open-source observability framework that provides tools for collecting and exporting telemetry data like traces, metrics, and logs. It's particularly beneficial for cloud-native applications, offering a unified approach to gather and manage operational data. This framework is versatile enough to be applied to AI applications, providing critical insights into their performance.

The following are core concepts in OpenTelemetry:

- Instrumentation
  - Client Libraries/SDKs: These are integrated into your application code. They automatically collect telemetry data such as traces, metrics, and logs.
  - Auto-instrumentation Agents: For some languages and frameworks, OpenTelemetry provides agents that can automatically instrument your application without modifying the code.
- Telemetry Data
  - Traces: Records of individual operations, providing insights into the request's journey through your application.
  - Metrics: Numerical data points that are collected over time, representing various dimensions of system performance.
  - Logs: Text records of events occurring within the application.
- Collector:
  - OpenTelemetry Collector: A standalone service that receives, processes, and exports telemetry data. It can be configured to receive data from multiple sources and send it to various backends.
- Exporters:
  - Trace Exporters: Send trace data to monitoring tools like Jaeger, Zipkin, or any observability platform that supports trace data.
  - Metric Exporters: Send metric data to databases or monitoring systems like Prometheus, Graphite, etc.
  - Log Exporters: Forward logs to centralized logging platforms like Elasticsearch, Splunk, etc.
- Backend Systems:
  - Monitoring and Visualization Tools: Tools like Grafana, Kibana (for logs in Elasticsearch), etc., for visualizing and analyzing the telemetry data.
  - Data Storage: Databases and storage systems where telemetry data is stored, such as Prometheus for metrics or Elasticsearch for logs and traces.
- Analysis and Alerting:
  - Alerting Tools: Integrated tools or services for alerting based on specific triggers or anomalies in telemetry data.
  - Data Analysis: Advanced analysis of collected data for insights, trends, and anomaly detection.

```
[ Application Code ] -- (Instruments with Client Libraries/SDKs or Auto-instrumentation Agents)
               |
               |--- [ Traces, Metrics, Logs ]
               |
[ OpenTelemetry Collector ] -- (Processes and exports data)
               |
               |--- [ Trace Exporters ] ---> [ Trace Monitoring Tools (e.g., Jaeger) ]
               |
               |--- [ Metric Exporters ] ---> [ Metric Monitoring Tools (e.g., Prometheus) ]
               |
               |--- [ Log Exporters ] ---> [ Log Monitoring Platforms (e.g., Elasticsearch) ]
               |
               |--- [ Data Storage ] ---> [ Databases for Long-term Storage ]
               |
               |--- [ Analysis and Alerting ] ---> [ Alerting Tools & Advanced Analysis ]
```

In the above diagram, the major dataflow is as follows:

- The application is instrumented to produce telemetry data.
- This data is collected and processed by the OpenTelemetry Collector.
- The Collector then sends the data to appropriate exporters.
- The exported data is used by backend systems for monitoring, analysis, and alerting.

## Integrating OpenTelemetry with IBM Watsonx.ai

There are three patterns to instrument IBM Watsonx.ai applications, including auto instrument, manual instrument and programmatically instrument, check [here](https://opentelemetry.io/docs/instrumentation/python/automatic/example/) for instrumentation examples. We will focus on programmatically instrumentation, as programmatically instrumentation can collect more customized metrics.

### Prepare

For python development and test, it is always recommended to use venv for better isolation with different python environments. In my host, I was using a venv named as `py311`.

```
. py311/bin/activate
```

### Prepare OTEL
Before the demo, we need to prepare a cluster which run with otel collector and some otel backend including Jaeger, Zipkin and Prometheus, we can run this via a [demo](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/examples/demo) here.

You can run all of the components via `docker compose up -d`, after the command finsihed, you will see some containers as follows will be running in your computer.

```console
(py311) guangyaliu@Guangyas-MacBook-Pro-2 byo-genai % docker ps
CONTAINER ID   IMAGE                                 COMMAND                  CREATED      STATUS                    PORTS                                                                                                                                             NAMES
a5af44f4aa4b   demo-demo-client                      "/app/main"              4 days ago   Up 10 hours                                                                                                                                                                 demo-demo-client-1
3ad7d6882c99   demo-demo-server                      "/app/main"              4 days ago   Up 10 hours               0.0.0.0:63757->7080/tcp                                                                                                                           demo-demo-server-1
9223720845ab   otel/opentelemetry-collector:0.88.0   "/otelcol --config=/…"   4 days ago   Up 10 hours               0.0.0.0:1888->1888/tcp, 0.0.0.0:4317->4317/tcp, 0.0.0.0:8888-8889->8888-8889/tcp, 0.0.0.0:13133->13133/tcp, 0.0.0.0:55679->55679/tcp, 55678/tcp   demo-otel-collector-1
878b019dd893   jaegertracing/all-in-one:latest       "/go/bin/all-in-one-…"   4 days ago   Up 10 hours               4317-4318/tcp, 5775/udp, 5778/tcp, 9411/tcp, 6831-6832/udp, 0.0.0.0:16686->16686/tcp, 0.0.0.0:63758->14250/tcp, 0.0.0.0:63759->14268/tcp          demo-jaeger-all-in-one-1
4fa5de19cb4d   prom/prometheus:latest                "/bin/prometheus --c…"   4 days ago   Up 10 hours               0.0.0.0:9090->9090/tcp                                                                                                                            demo-prometheus-1
97f1bc4a8e31   openzipkin/zipkin:latest              "start-zipkin"           4 days ago   Up 45 minutes (healthy)   9410/tcp, 0.0.0.0:9411->9411/tcp                                                                                                                  demo-zipkin-all-in-one-1
```

### Install OTEL Packages

```
pip install opentelemetry-distro
opentelemetry-bootstrap -a install
pip install opentelemetry-exporter-otlp
```

### Programmatically Instrumentation for Watsonx.ai

You can refer to [IBM Watsonx.ai Instrumentation](https://github.com/gyliu513/langX101/tree/main/otel/opentelemetry-instrumentation-watsonx) to run the script. This code sets up a basic tracer that logs spans to Jaeger, giving visibility into the API requests, input attributes and response attributes.

You may want to pay attentision to the following three parts in the code:

- Tracer Wrapper
  - `_with_tracer_wrapper`: A decorator function that provides a tracer for wrapper functions.
  - `_wrap`: This function is used to instrument and call every function defined in `TO_WRAP`. It starts a span, sets various attributes, calls the wrapped function, and then ends the span.

```python
def _with_tracer_wrapper(func):
    """Helper for providing tracer for wrapper functions."""

    def _with_tracer(tracer, to_wrap):
        def wrapper(wrapped, instance, args, kwargs):
            return func(tracer, to_wrap, wrapped, instance, args, kwargs)

        return wrapper

    return _with_tracer

@_with_tracer_wrapper
def _wrap(tracer, to_wrap, wrapped, instance, args, kwargs):
    """Instruments and calls every function defined in TO_WRAP."""
    if context_api.get_value(_SUPPRESS_INSTRUMENTATION_KEY):
        return wrapped(*args, **kwargs)

    name = to_wrap.get("span_name")

    span = tracer.start_span(
        name,
        kind=SpanKind.CLIENT,
        attributes={
            SpanAttributes.LLM_VENDOR: "Watsonx",
            SpanAttributes.LLM_REQUEST_TYPE: "watsonx.ai",
        },
    )

    _set_api_attributes(span)
    _set_input_attributes(span, "watsonx.ai", instance, kwargs)

    response = wrapped(*args, **kwargs)

    _set_response_attributes(span, "watsonx.ai", response)

    span.end()
    return response
```

- WatsonxInstrumentor Class
  - Inherits from `BaseInstrumentor`.
  - Implements `_instrument` and `_uninstrument` methods to add and remove instrumentation from the WatsonX library.

```python
class WatsonxInstrumentor(BaseInstrumentor):
    """An instrumentor for Watsonx's client library."""

    def instrumentation_dependencies(self) -> Collection[str]:
        return _instruments

    def _instrument(self, **kwargs):
        print("calling instrument")
        tracer_provider = kwargs.get("tracer_provider")
        tracer = get_tracer(__name__, __version__, tracer_provider)

        wrapped_methods = (
            WRAPPED_METHODS_VERSION_1
        )
        for wrapped_method in wrapped_methods:
            wrap_module = wrapped_method.get("module")
            wrap_object = wrapped_method.get("object")
            wrap_method = wrapped_method.get("method")
            wrap_function_wrapper(
                wrap_module,
                f"{wrap_object}.{wrap_method}",
                _wrap(tracer, wrapped_method),
            )

    def _uninstrument(self, **kwargs):
        wrapped_methods = (
            WRAPPED_METHODS_VERSION_1
        )
        for wrapped_method in wrapped_methods:
            wrap_object = wrapped_method.get("object")
            unwrap(f"openai.{wrap_object}", wrapped_method.get("method"))
```

- Test Program
  - The script includes a test program that demonstrates how to use the `WatsonxInstrumentor` to instrument a WatsonX `Model` object.
  - It sets up OpenTelemetry tracing, including an OTLP exporter, and then uses the instrumented Model object to generate a response to a prompt.

After the program run successfully, if you login to Jaeger UI, you will see all of the tracing info for IBM Watsohx as follows:

![](/images/watsonx-otel/watsonx-otel-jaeger.png)

As this is just a PoC instrumentor for IBM Wasonx.ai, it does not collect all of the metrics and tracing yet, but will add more later. You can also follow same pattern to build your own instrumentors.

## Observing and Analyzing AI Performance

Once OpenTelemetry is integrated, it starts collecting data that can be used to analyze the performance of your IBM Watsonx.ai model. This data includes the duration of API requests, error rates, and custom metrics like the number of tokens processed. Tools like Prometheus for metrics collection, Grafana for visualization, Jaeger for tracing can then be used to create dashboards that provide real-time insights.

For more in-depth analysis, OpenTelemetry supports custom metrics and traces. For instance, you can track specific AI model parameters or response times for different types of queries. This level of detail is invaluable for fine-tuning model performance and identifying bottlenecks.

## Reference

- [OpenTelemetry Instrumentation for Python Documentation](https://opentelemetry.io/docs/instrumentation/python/)
- [IBM Wastsonx.ai](https://www.ibm.com/products/watsonx-ai)
