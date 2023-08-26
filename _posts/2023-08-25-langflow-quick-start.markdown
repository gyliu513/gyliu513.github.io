---
layout: post
title:  "LangFlow Quick Start"
date:   2023-08-23 08:17:10 -0400
categories: jekyll update
tag: langflow
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [LangFlow Quick Start](#langflow-quick-start)
  - [Background](#background)
  - [Install](#install)
  - [Run with a Conversation Chain](#run-with-a-conversation-chain)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# LangFlow Quick Start

## Background

- LangFlow is a free, no-code solution for seamless exploration and deployment of powerful LLM apps. 
- LangFlow brings a UI for LangChain components.
- The drag-and-drop feature provides a quick and effortless way to experiment and prototype
- The built-in chat interface enables real-time interaction. With LangFlow, you can edit prompt parameters, create chains and agents, track the agent’s thought process, and export your flow.
- You can also import a flow from outside if created by others
- LangFlow has some build-in AI Model Templates, you can select and build your own AI Model Apps based on existing tempaltes

With LangFlow, you can build an embed LLM app with no code.

## Install

LangFlow support running on Docker, check out https://github.com/logspace-ai/langflow/blob/dev/docker_example/README.md for detail. 

You can run following commands to install LangFlow quickly. It will take about 20min to build and run the LangFlow container.

```
git clone git@github.com:logspace-ai/langflow.git
cd langflow/docker_example
docker compose up
```

The web UI will be accessible on port [7860](http://localhost:7860/)

You will also see a container which is hosting LangFlow service running on your host.

```console
root@gyliu-d51:~# docker ps
CONTAINER ID   IMAGE                     COMMAND                  CREATED        STATUS        PORTS                    NAMES
aaee833b7b8b   docker_example-langflow   "langflow --host 0.0…"   14 hours ago   Up 14 hours   0.0.0.0:7860->7860/tcp   docker_example-langflow-1
```

## Run with a Conversation Chain

### Open LangFlow UI

Open the langflow UI, and click `New Project` to build a new app based on LLM and other components.

![image](/images/langflow/new-project.png)

### Select LLM and Chain

For the Conversation Chat example, we can select two components as follows:

- From `LLM`, select `ChatOpenAI` and drag it to the canvas
- From `Chains`, select `ConversationChain` and drag it to the canvas

After you select those two components and put them to the canvas, connect the two components as the following picture. This means the `ChatOpenAI` is a input LLM parameter for `ConversationChain`.

![image](/images/langflow/build-app.png)

And also you can see the right top of each component box has a yellow circle, this means the chain has not build yet, and you need build it first.

### Build the App

![image](/images/langflow/build-finished.png)

Click the build button in the right bottom to trigger the app build process, after build finisihed, you will see the circle on the right top of each component box turned to green, this means build succeeded.

### Run the App

After you click the run button in the right bottom, a chat window will be pop up as below and you can ask questions in the chat box.

![image](/images/langflow/chat.png)

## Reference

- [LangFlow Document](https://docs.langflow.org/)