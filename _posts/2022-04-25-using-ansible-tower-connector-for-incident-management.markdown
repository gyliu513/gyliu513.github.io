---
layout: post
title:  "Using Ansible Tower Connector for Incident Management"
date:   2022-04-25 15:17:10 -0400
categories: jekyll update
tag: Ansible
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Using Ansible Tower Connector for Incident Management](#using-ansible-tower-connector-for-incident-management)
  - [Background](#background)
  - [Demo Case](#demo-case)
  - [Key Concepts for the Demo](#key-concepts-for-the-demo)
  - [As an SRE](#as-an-sre)
    - [Connect To Ansible Tower](#connect-to-ansible-tower)
    - [Create An Automation Runbook to Perform Memory Leak Analysis](#create-an-automation-runbook-to-perform-memory-leak-analysis)
    - [Create Automation Policy to Execute the Runbook](#create-automation-policy-to-execute-the-runbook)
  - [As a Developer](#as-a-developer)
  - [Summary](#summary)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Using Ansible Tower Connector for Incident Management

## Background

In CP4WAIOPS 3.3 release, we have a new feature of integration with [Red Hat Ansible Tower](https://access.redhat.com/products/ansible-tower-red-hat) for incidenet management.

With the [Ansible Tower Automation Provider](https://www.ibm.com/docs/en/cloud-paks/cloud-pak-watson-aiops/3.3.0?topic=connections-ansible), the CP4WAIOPS are able to connect to the remote Ansible Tower, and retrive all of the playbooks from Ansible Tower, and take those playbooks as automation actions for CP4WAIOPS RunBook Automation.

As [Ansible Tower can also use Ansible Collections from Ansible Galaxy](https://www.ansible.com/blog/installing-and-using-collections-on-ansible-tower) and [Ansible Galaxy](https://galaxy.ansible.com/) is the upstream community for sharing Ansible Collections, so the CP4WAIOPS can also leverage the Ansible Collections from Ansible Galaxy as well via Ansible Tower Integration.

## Demo Case

In this demo, I will share a use cases of using CP4WAIOPS policy to monitor a liberty app, and if there are some memory leak of the liberty app, the policy will trigger a github issue to report the memory leak by ansible tower integration.

There will be two roles in this demo, including a SRE and a Developer.

## Key Concepts for the Demo

Before we go through the demo, I'd like to share some key concepts that will be used in this dmeo.

- Policies: Policies are rules that contain multiple condition and action sets. They can be triggered to automatically promote events to alerts, reduce noise by grouping alerts into a story, and assign runbooks to remediate alerts.
- Runbooks: Use Runbook Automation to build and execute runbooks that can help IT staff to solve common operational problems. Runbook Automation can automate procedures that do not require human interaction, thereby increasing the efficiency of IT operations processes. Operators can spend more time innovating and are freed from performing time-consuming manual tasks.
- Actions: In runbooks, actions are the collection of several manual steps into a single automated entity. An action improves runbook efficiency by automatically performing procedures and operations.

## As an SRE

As an SRE, I'd like to start an automated memory leak investigation for liberty server in case of any memory leak issue for someone's liberty.

### Connect To Ansible Tower

- First, let us create an Ansible connector to connect our AIOps with the Ansible tower. Goto Aiops UI `Define - Data and tool connections` -> `add connection`

![](/images/mlk-images/data-and-connections.png)

- Select `Ansible Tower` and create Ansible Tower Connection as follows.

![](/images/mlk-images/Add-Ansible-Tower-Connection.png)

![](/images/mlk-images/Add-Ansible-Tower-Connection-02.png)

- Config Ansible Tower Connection, you need to config URL for Ansbile Tower, User Name and Password to connect to Ansible Tower.

![](/images/mlk-images/Ansible-Tower-Connection-add-panel.png)

- After this finished, you will have CP4WAIOPS connected to your Ansible Tower.

### Create An Automation Runbook to Perform Memory Leak Analysis

- Navigate to `Runbooks` via `Operate -> Automations -> Runbooks Tab -> Create Runbook`.

![](/images/mlk-images/Click-on-Create-Runbook.png)

- Create a runbook for Memory Leak Analysis for Liberty. Please note that we are using playbooks from Ansbile Tower, and as we already connect the CP4WAIOPS to Ansible Tower, when create Runbooks, the CP4WAIOPS can retrive all of the playbooks from Ansible Tower and the SRE can select the playbook for Memory Leak Analysis and use this playbook to create Runbook.

![](/images/mlk-images/Create-Runbook-Panel.png)

- OK, now, we have the Runbook ready to use.

### Create Automation Policy to Execute the Runbook

- Now we need to create a automation policy to associate the runbook with the incoming alert. Click `Policies -> Create Policy`

![](/images/mlk-images/Create-Policy.png)

- When `Create policy`, select `Assign a runbook to alerts`, this will enable that we can trigger the policy via some alerts.

![](/images/mlk-images/Create-Policy-Assign-Runbook-to-Alert.png)

- A new window will be pop up and asking you to assign a Runbook to Alerts, this is actually creating a CP4WIAOPS Policy.

![](/images/mlk-images/Create-Policy-panel-name.png)

- When creating the policy, you are also requested to input some conditions, those conditions means when the Runbook will be triggered. For the following case, we are using three conditions:
  - `summary`, `contains`, `all of`, `Log Anomaly found` and `demo-liberty-server1`, this is our server name.
  - `state`, `equals to`, `only`, `open`
  - `details`, `contains`, `any of`, `OutOfMemoryError`.

- Now we need to select which Runbook to use, select the Runbook we just created, and select `Automatically run the runbook`.

![](/images/mlk-images/Create-Policy-Panel-conditions.png)

- OK, now have have created both Runbook and policy, once there's `OutOfMemory` alert will trigger the automated memory leak investigation to that server.

- Now I have a liberty app registered to my WebSphere Automation, will share more detail for how to register apps to WebSphere Automation in next blog. After my liberty running for a while, I realized something went wrong with the Liberty server, the Liberty server became really slow in response. Then I check the Humio Liberty log, the log indicate that there was a `OutOfMemoryError`.

![](/images/mlk-images/Humio-OutOfMemory.png)

- I want to know what is wrong with my Liberty, I'll goto check CP4WAIOPS to get the answer. Then I switch to `CP4WAIOPS UI` -> `Operate` -> `Stories and alerts`

![](/images/mlk-images/Alert-triggered.png)

- There's a alert sent out, for the server `demo-liberty-server1`. Now I will check the Runbook activities via `CP4WAIOPS UI` -> `Operate` -> `Automations` -> `Runbooks` -> `Activities`

![](/images/mlk-images/runbook-activities-to-check.png)

- Till now, the overall callstack in CP4WAIOPS is as follows, and the alerts has triggered the ansible playbook from ansible tower to take actions for the Liberty Memory Leak Issue.

![](/images/mlk-images/callstack.png)

- We can see the memory leak investigation Runbook has been triggered by the alert and it has been finshed and succeed, click the `Details` to get some detail of the issue.

![](/images/mlk-images/runbook-activities-details.png)

## As a Developer

- As a Liberty Developer, I was assigned by a Github issue which was opened by CP4WAIOPS Runbook Automation and the Github issue include all the info for the Memory Leak: Java Class, Heap Size and also the full analysis report file. I can download and check the detail of the log to see what is wrong with Liberty, and try to fix the issue based on those info.

![](/images/mlk-images/git-issue-details.png)

## Summary

The above scenario is a very typical use case of using Cp4WAIOPS and Ansible Tower to help detect and fix some incidents for the applications running in your environments. The demo scenario can be extended to manage many other applications as you want as long as you already have some ansible playbooks, please refer to our official knowledge center to get more detail for how to leverage [Ansible Tower Automation Provider](https://www.ibm.com/docs/en/cloud-paks/cloud-pak-watson-aiops/3.3.0?topic=connections-ansible) for more scenarios.