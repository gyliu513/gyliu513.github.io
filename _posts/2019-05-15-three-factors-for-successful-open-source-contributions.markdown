---
layout: post
title:  "3 Factors for Successful Open Source Contributions"
date:   2019-05-15 23:17:10 -0400
categories: jekyll update
tag: open source contributions
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [3 Factors for Successful Open Source Contributions](#3-factors-for-successful-open-source-contributions)
  - [My open source credentials and perspective](#my-open-source-credentials-and-perspective)
  - [Evaluating open source projects](#evaluating-open-source-projects)
    - [Ecosystem](#ecosystem)
    - [Open standards and open governance](#open-standards-and-open-governance)
  - [How to work in an open source community](#how-to-work-in-an-open-source-community)
    - [Contributing to open source](#contributing-to-open-source)
    - [Land open source to a product](#land-open-source-to-a-product)
    - [Bring open source to your clients](#bring-open-source-to-your-clients)
  - [Summary](#summary)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 3 Factors for Successful Open Source Contributions

[Open source software is eating the world](https://landscape.cncf.io/images/landscape.png), with numerous projects that cover a breadth of technologies, from IaaS to PaaS to CaaS to Serverless, AI, and more.

With so many projects and so much technology, getting started in open source can be overwhelming. What project should you work on? How do you open source your own code? How do you make your project meaningful for customers? In this blog post, I share the three key aspects that you should pay attention to when contributing to open source.


## My open source credentials and perspective

Since 2012, I have worked in various open source communities and on many different open source projects, including [OpenStack](https://github.com/openstack), [Mesos](https://github.com/apache/mesos), [Kubernetes](https://github.com/kubernetes), [Istio](https://github.com/istio), [Kubernetes Federation V2](https://github.com/kubernetes-sigs/federation-v2), [Knative](https://github.com/knative), [cluster-api](https://github.com/kubernetes-sigs/cluster-api), even becoming a maintainer for some of those projects.

![w](/images/os-journey.png)

The image above shows my journey in open source. It’s important to note that with every open source product that I worked on, IBM now has a product or clients using it. My open source contributions, product integrations, and clients moved me to the position of an open source maintainer.

Along my journey in open source, I have learned a few things along the way that I think will help if you are planning to contribute or already contributing to open source.

## Evaluating open source projects

So, what makes a successful project? Based on my experience, I think we should evaluate if an open source project is successful or not by looking at two factors: the ecosystem that surrounds it and open standards and open governance.

### Ecosystem

We need to evaluate a project’s ecosystem by its users, sponsors and contributors.
This might seem obvious, but a project can’t be considered successful if there are no users using it. Open source thrives on contributors who can offer requirements that improve the project’s quality, so you need enough users who have insight into what would make the project better.

Having project sponsors who can amplify and promote the project in the community attracts more attention, and, thus, more users and contributors. I still remember how excited I was when I read the Istio announcement letter from Google and IBM. I, was working with a client for a traffic management issue with their microservices, and Istio saved the world at that time. With high-profile sponsors who have good reputations in technology and open source-the likes of Red Hat, IBM, Google-a project gives the project more potential to attract more people to join and contribute.

Having a diverse number of active contributors from different companies makes a project better and stronger. The chart below shows the contributors for Kubernetes. Notice there are contributors from almost 100 companies, a really large and diverse community.

![w](/images/k8s-contribution.png)

### Open standards and open governance

Open standards mean standards that are freely available for adoption, implementation, and updates. For cloud native projects, we have standards like the Container Network Interface (CNI), Container Storage Interface (CSI), the Open Container Initiative ([OCI](https://github.com/opencontainers)), and [CloudEvents](https://cloudevents.io/), just to name a few. The standards facilitate network management, storage management, container runtime management, cloud event management and the like. There are other examples as well. For instance, Kubernetes is becoming standard for container orchestration, Istio is becoming the standard for service mesh, and Knative is going to be standardized for serverless.

Open governance ensures that the way that a project is run is done in a truly open, collaborative environment. Open governance is the best way to ensure the long-term success and viability of open source projects.

Open standards and open governance are the key factors to avoid vendor lock-in or, even, project abandonment.

## How to work in an open source community

I think there are three key aspects to pay attention to when working in open source communities. These include contributing to open source, landing open source to product, and bringing open source to our clients, While creating open source projects is fairly easy, it takes understanding these three areas well to truly become an open source leader and expert.

![w](/images/three-factors.png)

Let’s look at these areas more closely.

### Contributing to open source

You don’t have to become a core member, maintainer or committer to make a meaningful impact in an open source community.

In addition to submitting code changes and pull requests, another key part of becoming active in an open source community is to share knowledge or help the project move forward in other ways. In addition to tradition code changes, deletions, and contributions, other ways to contribute to a project include:

- **Evangelize the project:** Write technical blogs or attend meetups or workshop where you share your experience or your knowledge about a particular project
- **Draw attention to issues:** Open GitHub issues when you encounter a problem and drive the discussion around the issue to help improve the project quality.
- **Answer questions:** Reply to the mail list or Slack channel to help others if you have an answer for their questions.
- **Functional or performance testing:** Testing the project finds flaws before they get to other users or clients.

These are just a few small ways you can help the open source community and prove your worth as an expert.

While contributing to open source is good, the goal of any project we’re working on should be to take the technology and use it in real solutions that solve our customers’ problems.

### Land open source to a product

As you’re working with open source projects, you need to account for how you can incorporate or integrate that technology into your product to help clients. We’re doing this now with how we use Kubernetes and Istio in IBM Cloud Private.

In the open source community, there are often many different open source projects that can provide similar functions. How do you choose the right project when there are so many projects? If we go back to 2016, we will see that people are still struggling to investigate how to manage container orchestration, they are trying to evaluate Mesos, Swarm, Kubernetes etc to see which one is the best. I won’t say which one I think is the best, but just to draw attention to the fact that, when faced with trying to choose which project is right for you and your product, you need to talk to clients for their requirements and select the best open source projects to meet those requirements.

As part of analyzing clients’ requirements, it’s important to abstract the general requirement for all of your clients and build an enterprise product that meets those requirements. [IBM Cloud Private](https://www.ibm.com/cloud/private) was born this way. We talked with clients, evaluated Kubernetes, Mesos, and other container orchestration projects, and — based on most of the clients’ requirements — we chose Kubernetes as the foundation for IBM Cloud Private.

### Bring open source to your clients

Use your clients’ requirements as the guiding factor behind what open source projects you invest in. It can be easy to get lost in all the different open source organizations, with their many different project repos. While it can be hard to focus, considering your clients’ requirements can always drive us to find the right direction.

It’s imperative to have trust from your clients when trying to bring open source to a client. Becoming an open source leader or expert and having a mature product based on open source will definitely help clients trust you.

## Summary

Every open source project has its own life cycle — it will either die or mature for production use. Whether a project dies or becomes widely accepted, we always need to innovate with new open source projects to resolve clients’ new requirements. Keep learning to know what your clients want, and keep innovating to help resolve your clients’ requirements.

I hope you’ve found these suggestions helpful as you embark on or continue your own open source journey. Make sure you are a good contributor to open source, use the clients’ requirements to dictate what projects you get involved in, and bring your open source technology to your product and to your clients.