---
layout: post
title:  "Code is Cheap, Show Me the Markdown"
date:   2025-11-09 08:17:10 -0400
categories: jekyll update
tag: [SpecKit]
---

> "Talk is cheap, show me the code." — Linus Torvalds  
>
> In the AI era, that quote deserves an update: **Code is cheap, show me the markdown.**

Writing code has never been easier. Between GitHub Copilot, Claude, and Spec Kit's `/implement`, code is increasingly the *by-product* of a well-defined intent, not the main artifact.  
Lines of code can be generated in seconds. A maintainable **Markdown spec**, however, encodes intent, constraints, trade‑offs, and success criteria. It is the part that actually compounds.

**Spec-Driven Development (SDD)** inverts the traditional power structure: specifications don't serve code—code serves specifications. The Product Requirements Document (PRD) isn't a guide for implementation; it's the source that generates implementation. Technical plans aren't documents that inform coding; they're precise definitions that produce code. This isn't an incremental improvement—it's a fundamental rethinking of what drives development.

---

## Markdown as the Single Source of Truth

With **Spec‑Driven Development (SDD)** and especially with GitHub's Spec Kit, the Markdown spec becomes the foundation:

```
/constitution → /specify → /plan → /tasks → /implement
```

Every downstream asset reads and refines the upstream Markdown. The quality of your **markdown** determines the quality of your **code**.

In this new world, maintaining software means evolving specifications. The intent of the development team is expressed in natural language ("**intent-driven development**"), design assets, core principles and other guidelines. The **lingua franca** of development moves to a higher level, and code is the last-mile approach.

Debugging means fixing specifications and their implementation plans that generate incorrect code. Refactoring means restructuring specifications for clarity. The entire development workflow reorganizes around specifications as the central source of truth, with implementation plans and code as the continuously regenerated output.

---

## Mermaid: Workflow (Spec → Plan → Tasks → Code)

```mermaid
flowchart LR
    subgraph Governance["/constitution (principles, quality gates)"]
    end

    Intent["/specify • Intent & Requirements (Markdown)"]
    Plan["/plan • Architecture & Design (Markdown)"]
    Tasks["/tasks • Decomposed Work (Markdown)"]
    Code["/implement • Generated Code"]
    Validate["Tests • Lint • CI • Observability"]
    Learn["Feedback & Telemetry"]

    Governance -.guides.-> Intent
    Intent --> Plan --> Tasks --> Code --> Validate --> Learn --> Intent

    click Intent "https://github.com/github/spec-kit/blob/main/spec-driven.md" _blank
```

**How to read this:** the spec in Markdown is the living center; code is a derivative. Telemetry and review feed back into the spec, not only into the codebase.

The workflow begins with an idea—often vague and incomplete. Through iterative dialogue with AI, this idea becomes a comprehensive PRD. The AI asks clarifying questions, identifies edge cases, and helps define precise acceptance criteria. Throughout this specification process, research agents gather critical context—library compatibility, performance benchmarks, security implications, and organizational constraints.

From the PRD, AI generates implementation plans that map requirements to technical decisions. Every technology choice has documented rationale. Every architectural decision traces back to specific requirements. Consistency validation continuously improves quality—AI analyzes specifications for ambiguity, contradictions, and gaps as an ongoing refinement process, not a one-time gate.

---

## Mermaid: Architecture (Markdown-First AI Development)

```mermaid
graph TD
    A["Markdown Specs (spec.md, plan.md, tasks.md)"] --> B["AI Orchestrator (Spec Kit + LLMs)"]
    B --> C["Generators (scaffolders, impl scripts)"]
    C --> D["Code Artifacts (services, APIs, infra)"]
    D --> E["Validation (unit/e2e tests, policies)"]
    E --> F["Runtime & Observability (metrics, logs, traces)"]
    F --> G["Feedback Loop"]
    G --> A

    subgraph Tooling
      B
      C
    end

    subgraph Repo
      A
      D
      E
    end
```

**Key idea:** Markdown is the API between humans and AI. We refine the Markdown; tools read it to generate and evolve the system. Observability data flows back to evolve the Markdown.

The feedback loop extends beyond initial development. Production metrics and incidents don't just trigger hotfixes—they update specifications for the next regeneration. Performance bottlenecks become new non-functional requirements. Security vulnerabilities become constraints that affect all future generations. This iterative dance between specification, implementation, and operational reality is where true understanding emerges.

---

## Why Markdown Wins

1. **Maintainable**: text, diff‑able, reviewable; intent and design are versioned.  
2. **Portable**: tool/LLM‑agnostic; Copilot, Claude, Gemini can all consume it.  
3. **Extensible**: embed diagrams, prompts, schemas; compose across teams.  
4. **The Real Human↔AI Contract**: humans write *why/what*; AI executes *how*.
5. **Executable Specifications**: precise, complete, and unambiguous enough to generate working systems, eliminating the gap between intent and implementation.
6. **Continuous Refinement**: consistency validation happens continuously, not as a one-time gate. AI analyzes specifications for ambiguity, contradictions, and gaps as an ongoing process.

---


## The Constitutional Foundation

At the heart of SDD lies a constitution—a set of immutable principles that govern how specifications become code. The constitution (`memory/constitution.md`) acts as the architectural DNA of the system, ensuring that every generated implementation maintains consistency, simplicity, and quality.

The constitution defines core principles like:
- **Library-First Principle**: Every feature must begin as a standalone library
- **CLI Interface Mandate**: All functionality exposed through command-line interfaces
- **Test-First Imperative**: No code before tests—strict Test-Driven Development
- **Simplicity and Anti-Abstraction**: Combat over-engineering through explicit gates
- **Integration-First Testing**: Prioritize real-world testing over isolated unit tests

These principles are enforced through implementation plan templates that act as "phase gates"—the AI cannot proceed without either passing the gates or documenting justified exceptions. This ensures generated code isn't just functional—it's maintainable, testable, and architecturally sound.

## Example: From Markdown to Code

The SDD workflow is streamlined through powerful slash commands that automate the specification → planning → tasking workflow:

### `/speckit.specify` Command

Transforms a simple feature description into a complete, structured specification:
- Automatic feature numbering (scans existing specs for next number)
- Semantic branch creation from your description
- Template-based generation with proper directory structure

### `/speckit.plan` Command

Creates a comprehensive implementation plan from the specification:
- Maps requirements to technical decisions
- Documents rationale for every technology choice
- Enforces constitutional gates (simplicity, anti-abstraction, integration-first)
- Creates proper information hierarchy

### `/speckit.tasks` Command

Generates actionable, decomposed work items:
- Breaks implementation plan into reviewable tasks
- Maintains traceability to requirements
- Supports team collaboration and review

### `/speckit.implement` Command

Executes the implementation following the plan:
- Generates code that makes tests pass
- Maintains consistency with specifications
- Supports regeneration when specs change

Change `spec.md` → regenerate plan/tasks/impl. The spec *drives* the system. When requirements change, you update the specification and regenerate—pivots become systematic regenerations rather than manual rewrites.

---

## Core Principles of SDD

**Specifications as the Lingua Franca**: The specification becomes the primary artifact. Code becomes its expression in a particular language and framework. Maintaining software means evolving specifications.

**Executable Specifications**: Specifications must be precise, complete, and unambiguous enough to generate working systems. This eliminates the gap between intent and implementation.

**Continuous Refinement**: Consistency validation happens continuously, not as a one-time gate. AI analyzes specifications for ambiguity, contradictions, and gaps as an ongoing process.

**Research-Driven Context**: Research agents gather critical context throughout the specification process, investigating technical options, performance implications, and organizational constraints.

**Bidirectional Feedback**: Production reality informs specification evolution. Metrics, incidents, and operational learnings become inputs for specification refinement.

**Branching for Exploration**: Generate multiple implementation approaches from the same specification to explore different optimization targets—performance, maintainability, user experience, cost.

## TL;DR

> **Code is cheap. Markdown is meaning.**  
> Start from `spec.md`, not `main.go`. Treat your spec as living architecture and let tools generate the code, but never delegate your *intent*.

This isn't about replacing developers or automating creativity. It's about amplifying human capability by automating mechanical translation. It's about creating a tight feedback loop where specifications, research, and code evolve together, each iteration bringing deeper understanding and better alignment between intent and implementation.

*Inspired by [GitHub Spec Kit](https://github.com/github/spec-kit/blob/main/spec-driven.md) and the rise of Spec‑Driven Development.*