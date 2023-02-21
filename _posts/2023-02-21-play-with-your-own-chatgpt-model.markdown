---
layout: post
title:  "Play With Your Own ChatGPT Model"
date:   2023-02-21 11:17:10 -0400
categories: jekyll update
tag: ChatGPT
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Play With Your Own ChatGPT Model](#play-with-your-own-chatgpt-model)
  - [Pre-req](#pre-req)
    - [requirements.txt](#requirementstxt)
    - [test.jsonl](#testjsonl)
  - [Activate venv](#activate-venv)
  - [Build Your Own Model](#build-your-own-model)
  - [Test Your Own Model](#test-your-own-model)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Play With Your Own ChatGPT Model

## Pre-req

If you don’t have Python installed, [install it from here](https://www.python.org/downloads/). Then prepare two files `requirements.txt` and `test.jsonl` as follows in a folder named as `byo-chatgpt`.

### requirements.txt

```console
guangyaliu@Guangyas-MacBook-Pro-2 byo-chatgpt % cat requirements.txt
autopep8==1.6.0
certifi==2021.10.8
charset-normalizer==2.0.7
click==8.0.3
et-xmlfile==1.1.0
Flask==2.0.2
idna==3.3
itsdangerous==2.0.1
Jinja2==3.0.2
MarkupSafe==2.0.1
numpy==1.21.3
openai==0.19.0
openpyxl==3.0.9
pandas==1.3.4
pandas-stubs==1.2.0.35
pycodestyle==2.8.0
python-dateutil==2.8.2
python-dotenv==0.19.2
pytz==2021.3
requests==2.26.0
six==1.16.0
toml==0.10.2
tqdm==4.62.3
urllib3==1.26.7
Werkzeug==2.0.2
```

### test.jsonl

This will be the data that you will feed to ChatGPT and build your own model, it is in the format of following:

```json
{"prompt": "your question", "completion": "your answer"}
{"prompt": "your question", "completion": "your answer"}
{"prompt": "your question", "completion": "your answer"}
```

- Ensure that the prompt + completion doesn't exceed 2048 tokens, including the separator
- Aim for at least ~100 examples per class

## Activate venv

```console
python3 -m venv venv
. venv/bin/activate
pip install -r requirements.txt
```

## Build Your Own Model

```console
export OPENAI_API_KEY=<Your API Key>
```

```console
(venv) guangyaliu@Guangyas-MacBook-Pro-2 Downloads % openai api fine_tunes.create -t test.jsonl -m ada --suffix “custom model name”
[2023-02-10 08:06:40] Created fine-tune: ft-TUsYXqV7LeFjfusDvA3THkmq
[2023-02-10 08:13:59] Fine-tune costs $0.00
[2023-02-10 08:14:00] Fine-tune enqueued
[2023-02-10 08:34:49] Fine-tune is in the queue. Queue number: 31
[2023-02-10 08:34:50] Fine-tune is in the queue. Queue number: 30
[2023-02-10 08:35:55] Fine-tune is in the queue. Queue number: 29
[2023-02-10 08:38:18] Fine-tune is in the queue. Queue number: 28
[2023-02-10 08:40:13] Fine-tune is in the queue. Queue number: 27
[2023-02-10 08:40:54] Fine-tune is in the queue. Queue number: 26
[2023-02-10 08:40:55] Fine-tune is in the queue. Queue number: 25
[2023-02-10 08:40:56] Fine-tune is in the queue. Queue number: 24
[2023-02-10 08:40:56] Fine-tune is in the queue. Queue number: 23
[2023-02-10 08:41:40] Fine-tune is in the queue. Queue number: 22
[2023-02-10 08:41:41] Fine-tune is in the queue. Queue number: 21
[2023-02-10 08:41:42] Fine-tune is in the queue. Queue number: 20
[2023-02-10 08:41:42] Fine-tune is in the queue. Queue number: 19
[2023-02-10 08:42:16] Fine-tune is in the queue. Queue number: 18
[2023-02-10 08:44:42] Fine-tune is in the queue. Queue number: 17
[2023-02-10 08:45:16] Fine-tune is in the queue. Queue number: 16
[2023-02-10 08:46:44] Fine-tune is in the queue. Queue number: 15
[2023-02-10 08:52:56] Fine-tune is in the queue. Queue number: 14
[2023-02-10 08:54:03] Fine-tune is in the queue. Queue number: 13
[2023-02-10 08:59:57] Fine-tune is in the queue. Queue number: 12
[2023-02-10 09:01:07] Fine-tune is in the queue. Queue number: 11
[2023-02-10 09:09:07] Fine-tune is in the queue. Queue number: 10
[2023-02-10 09:12:31] Fine-tune is in the queue. Queue number: 9
[2023-02-10 09:14:08] Fine-tune is in the queue. Queue number: 8
[2023-02-10 09:14:09] Fine-tune is in the queue. Queue number: 7
[2023-02-10 09:15:54] Fine-tune is in the queue. Queue number: 6
[2023-02-10 09:16:11] Fine-tune is in the queue. Queue number: 5
[2023-02-10 09:16:12] Fine-tune is in the queue. Queue number: 4
[2023-02-10 09:16:51] Fine-tune is in the queue. Queue number: 3
[2023-02-10 09:16:52] Fine-tune is in the queue. Queue number: 2
[2023-02-10 09:19:34] Fine-tune is in the queue. Queue number: 1
[2023-02-10 09:21:41] Fine-tune is in the queue. Queue number: 0
[2023-02-10 09:21:43] Fine-tune started
[2023-02-10 09:22:13] Completed epoch 1/4
[2023-02-10 09:22:30] Completed epoch 2/4
[2023-02-10 09:22:47] Completed epoch 3/4
[2023-02-10 09:23:04] Completed epoch 4/4
[2023-02-10 09:23:25] Uploaded model: ada:ft-personal:custom-model-name-xxxx-xx-xx-xx-xx-xx
[2023-02-10 09:23:25] Uploaded result file: file-RCNoYOhtEhfvvvk95OWjhnnk
[2023-02-10 09:23:25] Fine-tune succeeded

Job complete! Status: succeeded 🎉
Try out your fine-tuned model:

openai api completions.create -m ada:ft-personal:custom-model-name-xxxx-xx-xx-xx-xx-xx -p <YO
R_PROMPT>
```

## Test Your Own Model

```console
(venv)root@gyliu-dev21:~/go/src/github.com/gyliu/byo-chatgpt# openai api completions.create -m ada:ft-personal:custom-model-name-xxxx-xx-xx-xx-xx-xx -p "your question"
===> Guess the Magic...
```