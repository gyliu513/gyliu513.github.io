---
layout: post
title:  "Using a Serverless Model to Reduce Footprint for Your Kubernetes/OpenShift Platform"
date:   2021-07-06 23:17:10 -0400
categories: jekyll update
tag: serverless footprint
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Using a Serverless Model to Reduce Footprint for Your Kubernetes/OpenShift Platform](#using-a-serverless-model-to-reduce-footprint-for-your-kubernetesopenshift-platform)
  - [Background](#background)
  - [Which Resource Needs to be Scaled](#which-resource-needs-to-be-scaled)
    - [Operator Resource](#operator-resource)
    - [Operand Resource](#operand-resource)
  - [How Serverless Can Help](#how-serverless-can-help)
  - [Best Practice For Serverless Model](#best-practice-for-serverless-model)
  - [Example Operator](#example-operator)
  - [Why NOT KEDA?](#why-not-keda)
  - [Conclusion](#conclusion)
  - [Reference](#reference)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Using a Serverless Model to Reduce Footprint for Your Kubernetes/OpenShift Platform

## Background

Kubernetes/OpenShift is becoming the preferred Control Plane for customers to build their platforms and run their workloads. Many Kubernetes/Openshift platforms have a lot of Operators and Operands that consume a lot of resources even when they are idle.

![w](/images/k8s-operator.png)

In this situation, I propose leveraging a Knative Serverless model in a Kubernetes/OpenShift platform. Idle components can be scaled down to 0 replicas, and components that have requests coming in can be scaled to 1 or N based on your scaling policy.

## Which Resource Needs to be Scaled

As the Kubernetes/OpenShift platform is mainly composed of Operators and Operands, we need to check which resource needs to be scaled. Operators, Operands — or both?

### Operator Resource

Can we really scale an Operator Resource? An Operator is a continuous service which watches etcd to see if there are any resource updates required, and then performs the necessary reconciliation logic. We cannot scale the Operator and keep it running, at the same time.

You can also check the resource request for your Operator. The best practice for Operator resource request is that it should be light-weight, as it does not have too much logic and the major logic is reconcile resources. If your Operator is consuming too much resource, then you may want to consider how to reduce resource request for your Operator, and make it as light-weight as possible.

### Operand Resource

Operands are the major resources which are running the workload, and the footprint is mainly contributed by those resources, based on my test with some [IBM Cloud Paks](https://www.ibm.com/cloud/paks%22%20%5Ct%20%22_blank).

There are two types of Operands: stateful and stateless. Stateful components are mainly composed of `StatefulSet` and `Stateless` components are mainly composed of `Deployment` resources.

Knative has some limitations for scaling `Stateful` resource. It assumes that the workloads are stateless; it uses a `Deployment` under the covers, and may remove Pods at random rather than assigning indexes and removing the last index.

For workloads which are amenable to Knative’s workload management, it can simplify one common case for Deployments (12-factor HTTP applications). Not all Deployments are suitable for Knative workload management (as an example, Rook uses Deployments with host constraints to manage OSDs), but StatefulSets almost certainly are not.

So we will only cover `Stateless` resources here.

## How Serverless Can Help

- The idea is scale the operands (Deployment but not StatefulSet) based on workload, like http request etc.
- With scale from N to 1, 1 to 0; 0 to 1, 1 to N, we can have a dynamic platform.

![w](/images/serverless-operator.png)

The major effort for the support is you may want to check how to convert a Kubernetes Deployment and Service into a Knative Service Resource. Check the [Knative Docs Issue](https://github.com/knative/docs/issues/3841) to get some best practice for how to convert a Kubernetes Deployment and Service into a Knative Service. You can get the official document from [here](https://knative.dev/docs/serving/convert-deployment-to-knative-service/).

## Best Practice For Serverless Model

Knative support scaling from 0 to 1 and 1 to N, and this can help you for different scenarios. Scaling to 0 can enable your system to have a very light footprint, but you may want to consider these two best practice points to decide if you want to scale to 0.

- If your Operand is critical and has high requirement for latency, then you can set a minimum replica for your Operands.
- If your Operand is not critical and can tolerate some latency, you can scale the pod to 0.

Check [here](https://knative.dev/docs/serving/autoscaling/kpa-specific/) to see how to customize autoscaler in Knative.

## Example Operator

We have a sample Operator [here](https://github.com/vincent-pli/serverless-operand), which is deploying a Nginx Knative Service, and we can use some HTTP request to scale the Nginx Knative Service.

![w](/images/example-operator.png)

## Why NOT KEDA?

[KEDA](https://keda.sh/) is also a great project which can help to do auto scaling for Kubernetes. With KEDA, we can drive the scaling of any container in Kubernetes, based on the number of events that need to be processed.
KEDA already has some scalers [here](https://github.com/kedacore/keda/tree/main/pkg/scalers). You can select the one that you want. However, the major problem for KEDA is that if you want to scale a resource not supported by KEDA, then you must create a new scaler and build. This is not very convenient for some users, although the current scalers in KEDA can cover most of the cases now.

## Conclusion

If you are using Operator in your Kubernetes/OCP platform with large footprint, please have a try for the above solution by converting your Operand from Deployment and Service to a Knative Service, with this, you will have a dynamic Kubernetes/OCP platform which does not consume much resources when it is idle.

## Reference

- [Guidance for turn a Kubernetes Deployment+Service to Knative Service](https://knative.dev/docs/serving/convert-deployment-to-knative-service/)
- [Turn a Kubernetes deployment into a Knative service](https://www.redhat.com/sysadmin/kubernetes-deployment-knative-service)

Thanks to [Evan Anderson](https://github.com/evankanderson) for the great help in providing some guidance for how to covert Kubernetes Deployment to Knative Service and answering some of my questions in the community.

Thanks to [Vincent Li](https://github.com/vincent-pli/) and [Jin Song Wang](https://github.com/wangjsty) for the evaluation of some popular Serverless Frameworks including Knative, KEDA, Kubeless etc.