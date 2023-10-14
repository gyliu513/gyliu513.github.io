---
layout: post
title:  "Langflow Developer Quick Start"
date:   2023-10-13 08:17:10 -0400
categories: jekyll update
tag: langflow
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [LangFlow Developer Quick Start](#langflow-developer-quick-start)
  - [Setup Python Virtual Environment](#setup-python-virtual-environment)
  - [Fork and Clone The LangFlow Code](#fork-and-clone-the-langflow-code)
  - [Init the Dev Environment](#init-the-dev-environment)
  - [Option 1: Run Langflow via Build and Install](#option-1-run-langflow-via-build-and-install)
    - [Build and Install Langflow](#build-and-install-langflow)
    - [Run Langflow](#run-langflow)
    - [Debug the Code](#debug-the-code)
  - [Option 2: Run Langflow via make backend and frontend](#option-2-run-langflow-via-make-backend-and-frontend)
    - [make backend](#make-backend)
    - [make frontend](#make-frontend)
    - [Debug the Code](#debug-the-code-1)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# LangFlow Developer Quick Start

LangFlow is a no-code solution for seamless exploration and deployment of powerful LLM apps. It brings a UI for LangChain components, making it easy to experiment and prototype flows.

If you want to contribute to Langflow or want to build Langflow and enable it run locally, here is a short tutorial you may want to follow to start .

## Setup Python Virtual Environment
In a nutshell, Python virtual environments help decouple and isolate Python installs and associated pip packages. This allows end-users to install and manage their own set of packages that are independent of those provided by the system or used by other projects.

Langflow was written in Python, it is strongly recommended to use venv as your development environment. Check out Virtual Environments and Packages as example.

This is my local python virtual environment.

```console
guangyaliu@Guangyas-MacBook-Pro-2 ~ % . ycliu/bin/activate
(ycliu) guangyaliu@Guangyas-MacBook-Pro-2 ~ %
```

## Fork and Clone The LangFlow Code

Langflow source code is at https://github.com/logspace-ai/langflow , and you may want to fork it first and clone to your local host.

In my environment, it was cloned to my localhost as follows:

```console
(ycliu) guangyaliu@Guangyas-MacBook-Pro-2 langflow % pwd
/Users/guangyaliu/go/src/github.com/logspace-ai/langflow
```
```console
(ycliu) guangyaliu@Guangyas-MacBook-Pro-2 langflow % ls
CODE_OF_CONDUCT.md       LICENSE                  coverage.xml             docker-compose.yml       lcserve.Dockerfile       render.yaml
CONTRIBUTING.md          Makefile                 deploy                   docker_example           logs                     scripts
Dockerfile               README.md                dev.Dockerfile           docs                     poetry.lock              src
GCP_DEPLOYMENT.md        base.Dockerfile          docker-compose.debug.yml img                      pyproject.toml           tests
```
```console
(ycliu) guangyaliu@Guangyas-MacBook-Pro-2 langflow % git branch -l
* dev
```
## Init the Dev Environment

Langflow depend on many Python packages and libraries, you can use make init to install all of the dependencies.

```console
(ycliu) guangyaliu@Guangyas-MacBook-Pro-2 langflow % make init
Installing pre-commit hooks
git config core.hooksPath .githooks
Making pre-commit hook executable
chmod +x .githooks/pre-commit
Installing backend dependencies
make install_backend
poetry install --extras deploy
Installing dependencies from lock file

No dependencies to install or update

Installing the current project: langflow (0.5.1)
Installing frontend dependencies
make install_frontend
cd src/frontend && npm install

up to date, audited 851 packages in 2s

257 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

## Option 1: Run Langflow via Build and Install

### Build and Install Langflow

After init finished, you can build and install langflow to your localhost via make build_and_install as follows, it may take 2 mins to finish the whole build and install. In my env, it was installed to /Users/guangyaliu/ycliu/lib/python3.10/site-packages/langflow

```console
(ycliu) guangyaliu@Guangyas-MacBook-Pro-2 langflow % make build_and_install
```

### Run Langflow

You can now run Langflow via langflow run , and after it finished, you will see Langflow is running on your localhost with port 7860, and a web page will be opened automatically on your default browser.

```console
(ycliu) guangyaliu@Guangyas-MacBook-Pro-2 langflow % langflow run
[10/13/23 21:33:52] INFO     2023-10-13 21:33:52 - INFO     - logger - Log file: /Users/guangyaliu/Library/Caches/langflow/langflow.log                         logger.py:69
[10/13/23 21:34:01] INFO     2023-10-13 21:34:01 - INFO     - logger - Log file: /Users/guangyaliu/Library/Caches/langflow/langflow.log                         logger.py:69
[2023-10-13 21:34:01 -0400] [95413] [INFO] Starting gunicorn 21.2.0
[2023-10-13 21:34:01 -0400] [95413] [INFO] Listening at: http://127.0.0.1:7860 (95413)
[2023-10-13 21:34:01 -0400] [95413] [INFO] Using worker: uvicorn.workers.UvicornWorker
[2023-10-13 21:34:01 -0400] [95414] [INFO] Booting worker with pid: 95414
[2023-10-13 21:34:02 -0400] [95414] [INFO] Started server process [95414]
[2023-10-13 21:34:02 -0400] [95414] [INFO] Waiting for application startup.
[10/13/23 21:34:02] INFO     2023-10-13 21:34:02 - INFO     - manager - Running DB migrations in                                                              manager.py:119
                             /Users/guangyaliu/ycliu/lib/python3.10/site-packages/langflow/alembic
                    INFO     2023-10-13 21:34:02 - INFO     - utils - No LLM cache set.                                                                          utils.py:92
[2023-10-13 21:34:02 -0400] [95414] [INFO] Application startup complete.
╭───────────────────────────────────────────────────╮
│ Welcome to ⛓ Langflow                             │
│                                                   │
│ Access http://127.0.0.1:7860                      │
│ Collaborate, and contribute at our GitHub Repo 🚀 │
╰───────────────────────────────────────────────────╯
```

If you want to run Langflow with some Custom Component, you can run with option as components-path which specify the customer component path and langflow will load that when start up.

When I was doing some [test with Watsonx Custom Componet](https://gyliu513.github.io/jekyll/update/2023/10/02/ibm-watsonx-as-a-custom-component-for-langflow.html), I will run with following command:

```
langflow run --components-path=/Users/guangyaliu/go/src/github.ibm.com/katamari/langflow-watsonx/langflow-components
```

### Debug the Code

As the python code was deployed to /Users/guangyaliu/ycliu/lib/python3.10/site-packages/langflow , so you can update the python code directly there by adding your chages and restart langflow, this will pick up your latest code change. But please make sure save your changes to some other places or create a PR to Langflow, otherwise, your local code will be overwrite by make build_and_install.

## Option 2: Run Langflow via make backend and frontend

This option can enable you can debug via your source code directly.

### make backend

This will run the Langflow backend.

```console
(ycliu) guangyaliu@Guangyas-MacBook-Pro-2 langflow % make backend
make install_backend
poetry install --extras deploy
Installing dependencies from lock file

No dependencies to install or update

Installing the current project: langflow (0.5.1)
Running backend with autologin
LANGFLOW_AUTO_LOGIN=True poetry run langflow run --backend-only --port 7860 --host 0.0.0.0 --no-open-browser
[10/13/23 21:45:24] INFO     2023-10-13 21:45:24 - INFO     - logger - Log file: /Users/guangyaliu/Library/Caches/langflow/langflow.log                         logger.py:69
[10/13/23 21:45:31] INFO     2023-10-13 21:45:31 - INFO     - logger - Log file: /Users/guangyaliu/Library/Caches/langflow/langflow.log                         logger.py:69
[2023-10-13 21:45:31 -0400] [96781] [INFO] Starting gunicorn 21.2.0
[2023-10-13 21:45:31 -0400] [96781] [INFO] Listening at: http://0.0.0.0:7860 (96781)
[2023-10-13 21:45:31 -0400] [96781] [INFO] Using worker: uvicorn.workers.UvicornWorker
[2023-10-13 21:45:31 -0400] [96782] [INFO] Booting worker with pid: 96782
[2023-10-13 21:45:31 -0400] [96782] [INFO] Started server process [96782]
[2023-10-13 21:45:31 -0400] [96782] [INFO] Waiting for application startup.
                    INFO     2023-10-13 21:45:31 - INFO     - manager - Running DB migrations in                                                              manager.py:119
                             /Users/guangyaliu/go/src/github.com/logspace-ai/langflow/src/backend/langflow/alembic
                    INFO     2023-10-13 21:45:31 - INFO     - utils - No LLM cache set.                                                                          utils.py:92
[2023-10-13 21:45:32 -0400] [96782] [INFO] Application startup complete.
╭───────────────────────────────────────────────────╮
│ Welcome to ⛓ Langflow                             │
│                                                   │
│ Access http://0.0.0.0:7860                        │
│ Collaborate, and contribute at our GitHub Repo 🚀 │
╰───────────────────────────────────────────────────╯
```

### make frontend

This will run the Langflow frontend and you can also login to the frontend UI to access Langflow.

```console
(ycliu) guangyaliu@Guangyas-MacBook-Pro-2 langflow % make frontend
cd src/frontend && npm install

up to date, audited 851 packages in 2s

257 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
cd src/frontend && npm start

> langflow@0.1.2 start
> vite


  VITE v4.4.11  ready in 319 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help

╭── 🌼 daisyUI 3.9.2 https://daisyui.com
│
├── 2 themes are enabled. How to add more themes:
│   https://daisyui.com/docs/themes
│
╰── ⭐️ Star daisyUI project on GitHub: https://github.com/saadeghi/daisyui


╭── 🌼 daisyUI 3.9.2 https://daisyui.com
│
├── 2 themes are enabled. How to add more themes:
│   https://daisyui.com/docs/themes
│
╰── ⭐️ Star daisyUI project on GitHub: https://github.com/saadeghi/daisyui


╭── 🌼 daisyUI 3.9.2 https://daisyui.com
│
├── 2 themes are enabled. How to add more themes:
│   https://daisyui.com/docs/themes
│
╰── ⭐️ Star daisyUI project on GitHub: https://github.com/saadeghi/daisyui
```

With this option, you can login to Langflow via http://localhost:3000/ , please note the default port here is 3000.

### Debug the Code

You can now use with VSCode or some other tools to edit the code and debug.

Perfect, you are all set, enjoy the hacking with Langflow, good luck!