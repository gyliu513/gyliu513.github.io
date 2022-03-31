---
layout: post
title:  "GitOps Native: The future of Kubernetes Native"
date:   2022-03-31 15:17:10 -0400
categories: jekyll update
tag: GitOps
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [GitOps Native: The Future of Kubernetes Native](#gitops-native-the-future-of-kubernetes-native)
  - [What is GitOps?](#what-is-gitops)
  - [Why GitOps](#why-gitops)
  - [What you can do with GitOps](#what-you-can-do-with-gitops)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# GitOps Native: The Future of Kubernetes Native

If we go back and take a look at the history of Kubernetes, we can see that Cloud Native is evolving to Kubernetes Native, and Kubernetes is becoming the de facto platform to manage applications running in containers. With that, we have a new challenge now: **how to manage applications running on top of Kubernetes with ease.** If you talk with people in the Kubernetes community, you’ll often hear them discuss how hard it is to get complex and large applications running on Kubernetes, as people may encounter some errors when deploying a complex and large applications, and sometimes it is very difficult to debug such issues and cannot find the root cause of the installation failure with ease.

GitOps is a new approach that allows us to manage applications on top of Kubernetes with ease, and I want to label this tech as GitOps Native. I also think this will be the future of Kubernetes Native, since the final target of end users using Kubernetes is managing applications and GitOps Native can help those end users deploy and manage large and complex applications on Kubernetes in a more simple way.

## What is GitOps?

For GitOps, there are many different tools, like [ArgoCD](https://argoproj.github.io/cd/), [FluxCD](https://fluxcd.io/), [Jenkins X](https://jenkins-x.io/) available, but today I would like to focus on ArgoCD for GitOps, as [OpenShift is using ArgoCD as a de facto platform for GitOps](https://cloud.redhat.com/blog/announcing-openshift-gitops).

As organizations start their journey with hybrid cloud, they face challenges of managing Kubernetes and OpenShift clusters in the public cloud, private cloud, and air-gapped environments. The complexities of delivering applications consistently and predictably on these hybrid cloud environments makes GitOps a perfect choice. GitOps provides a declarative approach to continuous delivery that has proven to be an effective strategy for addressing these challenges in hybrid cloud environments.

GitOps uses a declarative way to implement continuous deployment for cloud native applications. We can use GitOps to create repeatable processes for managing Kubernetes clusters and applications across multiple Kubernetes environments. GitOps handles and automates large, complex deployments at a fast pace.

GitOps principles is about treating Git as the single source of truth and take advantage of established Git workflows to drive cluster operations and application delivery and as a result ensure predictability, security, visibility, and repeatability. It is a set of practices that use Git pull requests to manage infrastructure and application configurations, and the Git repository contains a declarative description of the infrastructure and applications you need in your specified environment and contains an automated process to make your environment match the described state.

GitOps also allows full tracking of change logs via Git audit capabilities and provides a straightforward mechanism to roll back to any desired version across multiple OpenShift and Kubernetes clusters in hybrid cloud environments.

To explain this better, here is a [GitOps workflow from RedHat Openshift](https://cloud.redhat.com/blog/announcing-openshift-gitops) in which the end user only needs to commit YAML templates to Github, and ArgoCD would sync all of the YAML templates to different Kubernetes and OpenShift Clusters to have your application deployed with desired states.

![w](/images/argo-workflow.png)

## Why GitOps

In the Kubernetes world, there are many choices to deploy container applications on Kubernetes, including raw YAML templates, helm charts, operators, and so on.

**Raw YAML Templates:** Ever since Kubernetes was created, this is how you deploy applications. You can create raw YAML templates including deployment, services, and statefulset and then use kubectl apply to install all of the components. Large and complex applications typically include many YAML templates and the components may also have dependencies, which makes it difficult to use raw YAML templates to deploy them.

**Helm Charts:** Helm charts came into this world because people found it difficult to manage numerous raw YAML templates for large and complex applications. With helm charts, you can group all of the deployment, services, and statefulset into a chart and also expose all of the parameters which can be customized by the end user via values.yaml. The end user can also configure different values.yaml based on different cluster requirements. The problem with helm charts is that it does not handle the Day-Two management well for some stateful applications.

**Operators:** Operator was created to resolve the weak points of helm charts for Day-Two management of stateful applications, like upgrade. You can use the Helm, Go, or Ansible operator to better facilitate the management of applications on Kubernetes. In particular, the Go operator, with the “reconcile” method, makes it very convenient for the operator developers to add logic for Day-Two management of the applications.

All of the preceding three methods have another issue for the end users — when an application is updated, it is slightly difficult for cluster admins to track the audit log of the changes made, as cluster admins must go through a long list of log files for different pods, check the logs, then analyze who made those changes, when and why.

But with GitOps, things are simpler: the Cluster Admin or Application Developer can commit all of the configurations and templates for the application that they are going to deploy to Github, and then update the configurations and templates using the commit log. Argo CD will act as the top-level orchestrator for Kubernetes to manage those applications, including both Day-One and Day-Two managements, and you can still use raw YAML templates, helm charts or operators to deploy your application with GitOps. With GitOps, we can have a one-click install experience for any application running on Kubernetes.

![w](/images/argo-every-deploy.png)

## What you can do with GitOps

You can treat GitOps as a bootstrap engine for Kubernetes and leverage GitOps to deploy any kind of application on top of Kubernetes. With this GitOps Native model, the cluster admin only need to have a Kubernetes/OpenShift with GitOps installed, and GitOps will help them to manage everything on Kubernetes/OpenShift.

![w](/images/argo-boot-strap.png)

At IBM, we recently released [using GitOps to deploy IBM Cloud Pak for Watson AIOps 3.3 as a technical preview feature](https://www.ibm.com/docs/en/cloud-paks/cloud-pak-watson-aiops/3.3.0?topic=notes-whats-new#preview). GitOps helped a lot to simplify the installation process for the Cloud Pak. We were able to leverage GitOps to help us deploy the IBM Cloud into Cloud, and on-prem even in the air-gapped cluster. If you’re interested in learning more, see [https://ibm.github.io/cp4waiops-gitops/docs/](https://ibm.github.io/cp4waiops-gitops/docs/). Good luck!

![w](/images/argo-cloud-pak.png)
