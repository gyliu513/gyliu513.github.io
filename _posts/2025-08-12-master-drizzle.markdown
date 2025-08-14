---
layout: post
title:  "Mastering Drizzle ORM: A TypeScript-First Database Toolkit"
date:   2025-08-12 08:17:10 -0400
categories: jekyll update
tag: [Drizzle, DB]
---

In today's fast-paced development environment, working with databases efficiently is crucial. Whether you're building traditional web applications or AI-powered agents that need persistent memory, a reliable database layer is essential. Enter Drizzle ORM, a lightweight, type-safe, and developer-friendly ORM for TypeScript that's gaining popularity for its simplicity and performance. If you want your AI agents to have memory across sessions or maintain state, you'll need a database solution like Drizzle to store and retrieve that information efficiently. This blog post will explore what Drizzle is, how to use it, and demonstrate a complete end-to-end example.

## What is Drizzle?

Drizzle ORM is a TypeScript-first ORM (Object-Relational Mapping) library designed to provide a type-safe interface for interacting with relational databases. Unlike traditional ORMs that often rely on decorators, classes, or runtime magic, Drizzle focuses on:

1. **Type Safety**: Leveraging TypeScript's type system to catch errors at compile time
2. **Performance**: Minimal runtime overhead compared to other ORMs
3. **Developer Experience**: Intuitive API that feels natural to TypeScript developers
4. **SQL-like Syntax**: Query builder that closely resembles SQL, making it easier to understand

Drizzle supports multiple database engines including PostgreSQL, MySQL, SQLite, and more. It's particularly well-suited for projects where type safety and performance are priorities.

### Drizzle Architecture

```mermaid
flowchart TD
    A[TypeScript Application] --> B[Drizzle ORM]
    B --> C[Database Driver]
    C --> D[(Database)]
    
    subgraph "Drizzle Components"
        E[Schema Definition] --> B
        F[Query Builder] --> B
        G[Migration Tools] --> B
    end
```

## How to Use Drizzle

Let's walk through the basic steps of using Drizzle ORM in a TypeScript project.

### 1. Installation

First, you'll need to install Drizzle ORM and the appropriate database driver. For PostgreSQL:

```bash
npm install drizzle-orm pg
npm install -D drizzle-kit @types/pg
```

### 2. Define Your Schema

One of Drizzle's strengths is its declarative schema definition. Here's how you define a simple users table:

```typescript
// src/db/schema.ts
import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  age: integer("age").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

This code defines a PostgreSQL table named "users" with id, name, age, and createdAt columns. The schema is type-safe, meaning TypeScript will catch any type errors when you interact with this table.

### Schema to Database Flow

```mermaid
flowchart LR
    A[Schema Definition] -->|drizzle-kit generate| B[SQL Migration Files]
    B -->|drizzle-kit push/migrate| C[(Database)]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px
```

### 3. Set Up Database Connection

Next, create a database client:

```typescript
// src/db/client.ts
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

export const db = drizzle(pool, { schema });
```

This code creates a PostgreSQL connection pool and initializes Drizzle with our schema.

### 4. Basic CRUD Operations

Now you can perform database operations with full type safety:

```typescript
// src/index.ts
import { db } from "./db/client";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

async function main() {
  // Insert a new user
  await db.insert(users).values({ name: "Charlie", age: 28 });

  // Select all users
  const result = await db.select().from(users);
  console.log("Users:", result);

  // Update a user
  await db.update(users).set({ age: 29 }).where(eq(users.name, "Charlie"));

  // Delete a user
  await db.delete(users).where(eq(users.name, "Charlie"));
}

main().then(() => process.exit(0));
```

### CRUD Operations Flow

```mermaid
sequenceDiagram
    participant App as Application
    participant Drizzle as Drizzle ORM
    participant DB as Database
    
    App->>Drizzle: db.insert(users).values({...})
    Drizzle->>DB: INSERT INTO users (name, age) VALUES (...)
    DB-->>Drizzle: Result
    Drizzle-->>App: Return result
    
    App->>Drizzle: db.select().from(users)
    Drizzle->>DB: SELECT * FROM users
    DB-->>Drizzle: Result rows
    Drizzle-->>App: Return typed results
    
    App->>Drizzle: db.update(users).set({...}).where(...)
    Drizzle->>DB: UPDATE users SET age = 29 WHERE name = 'Charlie'
    DB-->>Drizzle: Result
    Drizzle-->>App: Return result
    
    App->>Drizzle: db.delete(users).where(...)
    Drizzle->>DB: DELETE FROM users WHERE name = 'Charlie'
    DB-->>Drizzle: Result
    Drizzle-->>App: Return result
```

## Wrapping Drizzle: Creating Convenient CLI Commands

One of the advantages of Drizzle is its excellent CLI tool, drizzle-kit. Let's see how to set up common database tasks as npm scripts.

In your `package.json`, add these scripts:

```json
"scripts": {
  "db:generate": "drizzle-kit generate --config=drizzle.config.ts",
  "db:migrate": "drizzle-kit migrate --config=drizzle.config.ts",
  "db:push": "drizzle-kit push --config=drizzle.config.ts",
  "db:studio": "drizzle-kit studio --config=drizzle.config.ts",
  "db:seed": "ts-node src/db/seed.ts",
  "dev": "ts-node src/index.ts"
}
```

These scripts provide convenient shortcuts for common database operations:

- **db:generate**: Generates SQL migration files based on schema changes
- **db:migrate**: Applies migrations to your database
- **db:push**: Pushes schema changes directly to the database (useful during development)
- **db:studio**: Launches Drizzle Studio, a web UI for managing your database
- **db:seed**: Runs a custom script to seed your database with initial data
- **dev**: Runs your application

### Drizzle CLI Workflow

```mermaid
flowchart TD
    A[Schema Changes] --> B[npm run db:generate]
    B --> C[Migration Files]
    C --> D{Development or Production?}
    D -->|Development| E[npm run db:push]
    D -->|Production| F[npm run db:migrate]
    E --> G[(Database Updated)]
    F --> G
    G --> H[npm run db:seed]
    H --> I[Database with Data]
    I --> J[npm run dev]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style G fill:#bfb,stroke:#333,stroke-width:2px
    style I fill:#bfb,stroke:#333,stroke-width:2px
```

You'll also need a configuration file for drizzle-kit:

```typescript
// drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.PGHOST ?? "localhost",
    port: Number(process.env.PGPORT ?? 5432),
    user: process.env.PGUSER ?? "postgres",
    password: process.env.PGPASSWORD ?? "postgres",
    database: process.env.PGDATABASE ?? "demo",
  },
} satisfies Config;
```

## End-to-End Example

Let's put everything together with a complete example of setting up and using Drizzle ORM with PostgreSQL.

### Step 1: Project Setup

First, set up your project structure:

```
drizzle-demo/
├── docker-compose.yml
├── drizzle.config.ts
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    └── db/
        ├── client.ts
        ├── schema.ts
        └── seed.ts
```

### Project Structure and Data Flow

```mermaid
flowchart TD
    A[schema.ts] --> B[client.ts]
    B --> C[seed.ts]
    B --> D[index.ts]
    E[drizzle.config.ts] --> F[drizzle-kit]
    F --> G[(Database)]
    C --> G
    D --> G
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style E fill:#bbf,stroke:#333,stroke-width:2px
    style G fill:#bfb,stroke:#333,stroke-width:2px
```

### Step 2: Database Setup with Docker

Use Docker Compose to set up PostgreSQL:

```yaml
# docker-compose.yml
version: "3.9"

services:
  db:
    image: postgres:16
    container_name: drizzle_demo_pg
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: demo
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d demo"]
      interval: 5s
      timeout: 3s
      retries: 10

  adminer:
    image: adminer:4
    container_name: drizzle_demo_adminer
    restart: unless-stopped
    ports:
      - "8080:8080"
    depends_on:
      db:
        condition: service_healthy

volumes:
  pgdata:
```

Start the database:

```bash
docker-compose up -d
```

### Step 3: Create a Seed Script

To populate your database with initial data:

```typescript
// src/db/seed.ts
import { db } from "./client";
import { users } from "./schema";

async function seed() {
  await db.insert(users).values([
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 },
  ]);
  console.log("✅ Seed data inserted");
}

seed().then(() => process.exit(0));
```

### Step 4: Run Your Application

Now you can run your application:

1. Start the database: `docker-compose up -d`
2. Generate migrations: `npm run db:generate`
3. Apply migrations: `npm run db:push`
4. Seed the database: `npm run db:seed`
5. Run the application: `npm run dev`

### Complete Application Workflow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Docker as Docker
    participant Drizzle as Drizzle Tools
    participant App as Application
    participant DB as Database
    
    Dev->>Docker: docker-compose up -d
    Docker->>DB: Start PostgreSQL
    Dev->>Drizzle: npm run db:generate
    Drizzle->>Drizzle: Create migration files
    Dev->>Drizzle: npm run db:push
    Drizzle->>DB: Apply schema changes
    Dev->>App: npm run db:seed
    App->>DB: Insert initial data
    Dev->>App: npm run dev
    App->>DB: Perform CRUD operations
    DB-->>App: Return results
    App-->>Dev: Display output
```

## Conclusion

Drizzle ORM offers a refreshing approach to database access in TypeScript applications. Its focus on type safety, performance, and developer experience makes it an excellent choice for modern applications.

Key benefits include:

- **Type Safety**: Catch errors at compile time rather than runtime
- **Performance**: Minimal overhead compared to traditional ORMs
- **Developer Experience**: Intuitive API that feels natural to TypeScript developers
- **Flexibility**: Works with multiple database engines
- **Tooling**: Excellent CLI tools for migrations and database management

Whether you're building a small project or a large application, Drizzle ORM provides a solid foundation for your database access layer. Give it a try and experience the benefits of a TypeScript-first ORM!

### Sample Code Repository

For a complete working example of the code discussed in this blog post, check out the reference implementation at [my github](https://github.com/gyliu513/langX101/tree/main/drizzle-demo).

This repository contains all the files and configurations needed to get started with Drizzle ORM and PostgreSQL.

### Drizzle vs Traditional ORMs

When comparing Drizzle to traditional ORMs, several key differences become apparent in their approach to database interaction:

```mermaid
graph LR
    subgraph "Traditional ORM"
        A1[Class-based Models] --> B1[Runtime Type Checking]
        B1 --> C1[Heavy Abstractions]
        C1 --> D1[SQL Generation]
        D1 --> E1[(Database)]
    end
    
    subgraph "Drizzle ORM"
        A2[Schema Definitions] --> B2[Compile-time Type Checking]
        B2 --> C2[Lightweight Abstractions]
        C2 --> D2[SQL Generation]
        D2 --> E2[(Database)]
    end
    
    style A2 fill:#bfb,stroke:#333,stroke-width:2px
    style B2 fill:#bfb,stroke:#333,stroke-width:2px
    style C2 fill:#bfb,stroke:#333,stroke-width:2px
```

Traditional ORMs typically use class-based models with decorators and rely on runtime type checking, which can lead to errors being discovered only during execution. They often introduce heavy abstractions that hide SQL details, which can make debugging and performance optimization challenging.

In contrast, Drizzle takes a more lightweight approach:

1. **Schema Definitions vs Class Models**: Drizzle uses plain object definitions for schemas rather than classes with decorators, resulting in cleaner, more maintainable code.

2. **Compile-time vs Runtime Type Checking**: By leveraging TypeScript's type system, Drizzle catches type errors during development rather than at runtime, improving reliability.

3. **Lightweight vs Heavy Abstractions**: Drizzle provides a thinner layer over SQL, giving developers more control and visibility into the generated queries while still offering type safety.

4. **SQL-like Syntax**: Drizzle's query builder closely resembles SQL, making it more intuitive for developers familiar with SQL and easier to predict what SQL will be generated.

5. **Performance**: With fewer abstractions and runtime overhead, Drizzle typically offers better performance compared to heavier ORMs.

This approach makes Drizzle particularly well-suited for TypeScript projects where type safety, performance, and developer experience are priorities. It strikes a balance between the raw power of SQL and the convenience of an ORM, without sacrificing the benefits of either.
