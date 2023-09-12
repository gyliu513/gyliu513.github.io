---
layout: post
title:  "Building an AI ChatBot for Private Knowledge Base with LangFlow"
date:   2023-09-10 08:17:10 -0400
categories: jekyll update
tag: langflow
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Building an AI ChatBot for Private Knowledge Base with LangFlow](#building-an-ai-chatbot-for-private-knowledge-base-with-langflow)
  - [Background](#background)
  - [Building a Private Knowledge Base](#building-a-private-knowledge-base)
  - [How LangFlow Helps for an AI ChatBot](#how-langflow-helps-for-an-ai-chatbot)
    - [Fork a PDF Loader](#fork-a-pdf-loader)
    - [Upload your local PDF File](#upload-your-local-pdf-file)
  - [How LangFlow can Help Us](#how-langflow-can-help-us)
  - [Have a Try for LangFlow](#have-a-try-for-langflow)
    - [Docker Compose](#docker-compose)
    - [HuggingFace Space](#huggingface-space)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Building an AI ChatBot for Private Knowledge Base with LangFlow

## Background

In today’s fast-paced world, the need for instant access to information has become paramount. Whether you’re a business owner, a customer support agent, or a knowledge worker, having a reliable tool to access and manage your private knowledge base can significantly streamline your workflow. That’s where AI ChatBots come into play.

Nowerdays, most of the LLMs focusing on getting data from public internet, also the data is not up-to-date. Like ChatGPT’s knowledge is still limited to 2021 data, which means it can’t answer current questions.

For some enterprise customers, enabling them manage their private data is important, as each customer may also have massive private data and they need to enable a ChatBot can work with their private data, such as local file systems, Git, Jira etc.

With LangFlow, the customer can build an AI ChatBot with Private Knowledge via the Drag-and-Drop UI.

## Building a Private Knowledge Base

![image](/images/ai-chatbot/pkb.png)

Let’s dive into the process of how to build a local private knowledge base and how does the ChatBot works. We are using local PDF file as an example here, but it can also be a website, GitHub issues, salesforce tickets, slack message etc.

- Begin by breaking down the entire knowledge base into smaller, manageable chunks. Each chunk should represent a distinct piece of information that can be queried.
- Utilize OpenAI Embedding model to transform each chunk of text into a vector representation. This will help convert the chunks into a numerical format suitable for querying.
- Save all the vector embeddings obtained from the embedding model in a Vector Database, we will use Chroma in our case.
- A user query the Vector Database using the vector embedding generated from the question.
- An Approximate Nearest Neighbor (ANN) search will be performed in the Vector Database to find the most similar vectors to the query embedding.
- The retrieved vectors will be associated with their corresponding text chunks.
- The user question and the retrieved context text chunks will be passed to LLM as a prompt and LLM will return the answer to the user.

## How LangFlow Helps for an AI ChatBot

- LangFlow is a free, no-code solution for seamless exploration and deployment of powerful LLM apps.
- LangFlow brings a UI for LangChain components.
- The drag-and-drop feature provides a quick and effortless way to experiment and prototype
- The built-in chat interface enables real-time interaction. With LangFlow, you can edit prompt parameters, create chains and agents, track the agent’s thought process, and export your flow.
- You can also import a flow from outside if created by others
- LangFlow has some build-in AI Model Templates, you can select and build your own AI Model Apps based on existing tempaltes

With LangFlow, you can build an embed LLM app with no code.

### Fork a PDF Loader

![image](/images/ai-chatbot/community-examples.png)

From the “Community Examples”, select “PDF Loader”, and click “Fork Example”.

### Upload your local PDF File

After the fork finished, you will be navigated to a flow of pdf loader as follows:

![image](/images/ai-chatbot/pdf-loader.png)

You need to update three parameters to make it works:

- Upload your pdf file via “PyPDFLoader” by updating “File Path”.
- Update “OpenAI API Key” in “OpenAIEmbeddings”.
- Update “OpenAI API Key” in “ChatOpenAI”.
- Click the bottom right top button to build the application.
- Once build finished, the color of all small circles for each box will turn to green.
- Click the bottom right button to run the application.
- A chat window will be pop up.

For my case, I was using my spectrum billing report as an example PDF file.

![image](/images/ai-chatbot/spectrum.png)

After the chat window was popped up, I will post questions and get answers as follows:

![image](/images/ai-chatbot/chat-box.png)

## How LangFlow can Help Us

LangFlow can be treated as a no-code LLMOps Platform and we can leverage it to build an enterprise solution with LLMs.

One typical use case is for product support. For Support Team, when get a call from customer, support team need to answer the question for the customer by retrieving from product documentation, GitHub Issues, Salesforce Tickets etc to help answer customer question.

With LangFlow, we can aggregate the data from product documentation, GitHub Issues and Salesforce Tickets. After the data aggregated, it will be persisted into Vector Database for support team to query via AI ChatBot which can improve the efficiency for support team.

## Have a Try for LangFlow

Want to have a try for LangFlow? You can either user docker compose to spin up your own LangFlow cluster or you can use HuggingFace build a service for you.

### Docker Compose

Refer to https://gyliu513.medium.com/langflow-quick-start-bf64d1db9066 for detail.

### HuggingFace Space

- Refer to https://huggingface.co/spaces/gyliu513/langflow as a HuggingFace LangFlow example
- Refer to https://huggingface.co/spaces/gyliu513/langflow/tree/main for how to build your own HuggingFace LangFlow Service.