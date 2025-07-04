---
layout: post
title:  "FastMCP Bearer Token Authentication: A Technical Deep Dive"
date:   2025-07-03 08:17:10 -0400
categories: jekyll update
tag: FastMCP
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [FastMCP Bearer Token Authentication: A Technical Deep Dive](#fastmcp-bearer-token-authentication-a-technical-deep-dive)
  - [Introduction](#introduction)
  - [Background: Why Authentication Matters in MCP](#background-why-authentication-matters-in-mcp)
  - [Technical Architecture](#technical-architecture)
  - [Implementation Tutorial](#implementation-tutorial)
    - [Step 1: Generate RSA Key Pair](#step-1-generate-rsa-key-pair)
    - [Step 2: Server Implementation](#step-2-server-implementation)
    - [Step 3: Client Implementation](#step-3-client-implementation)
  - [Authentication Flow](#authentication-flow)
  - [Transport Modes](#transport-modes)
    - [HTTP Streamable Mode (Primary Example)](#http-streamable-mode-primary-example)
    - [SSE (Server-Sent Events) Mode](#sse-server-sent-events-mode)
  - [JWT Token Structure](#jwt-token-structure)
  - [Security Considerations](#security-considerations)
    - [Key Distribution Strategy](#key-distribution-strategy)
    - [Multi-Client Architecture Best Practices](#multi-client-architecture-best-practices)
      - [1. Centralized Key Distribution](#1-centralized-key-distribution)
      - [2. Client Identification Strategy](#2-client-identification-strategy)
      - [3. Server-Side Client Tracking](#3-server-side-client-tracking)
      - [4. Security Considerations for Multi-Client Setup](#4-security-considerations-for-multi-client-setup)
    - [Best Practices](#best-practices)
  - [Performance Considerations](#performance-considerations)
    - [Token Validation Overhead](#token-validation-overhead)
    - [Transport Mode Selection](#transport-mode-selection)
  - [Advanced Features](#advanced-features)
    - [Custom Scopes](#custom-scopes)
    - [Multiple Audiences](#multiple-audiences)
  - [Conclusion](#conclusion)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# FastMCP Bearer Token Authentication: A Technical Deep Dive

## Introduction

FastMCP (Model Context Protocol) is a powerful framework for building AI agents and tools that can communicate seamlessly with various AI models and services. One of its key features is robust authentication support, particularly through JWT Bearer tokens. In this technical deep dive, we'll explore how to implement secure authentication in FastMCP applications using RSA key pairs and JWT tokens.

## Background: Why Authentication Matters in MCP

The Model Context Protocol (MCP) enables AI agents to access external tools, resources, and data sources. In production environments, these connections must be secure to prevent unauthorized access to sensitive data and tools. FastMCP's authentication system provides:

- **Token-based Security**: JWT tokens with configurable expiration and scopes
- **Asymmetric Encryption**: RSA key pairs for secure token signing and validation
- **Flexible Transport**: Support for both HTTP streamable and SSE (Server-Sent Events) modes
- **Scope-based Access Control**: Fine-grained permissions for different operations

## Technical Architecture

![w](/images/fastmcp-auth/fastmcp-arch.png)

## Implementation Tutorial

### Step 1: Generate RSA Key Pair

The foundation of our authentication system is an RSA key pair. The private key is used for token signing, while the public key validates tokens.

```bash
# Generate private key (2048-bit RSA)
openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048

# Generate public key from private key
openssl rsa -in private.pem -pubout -out public.pem
```

### Step 2: Server Implementation

The FastMCP server uses the `BearerAuthProvider` to validate incoming JWT tokens:

```python
from fastmcp import FastMCP, Context
from fastmcp.server.auth import BearerAuthProvider
from fastmcp.server.dependencies import get_access_token, AccessToken
from fastmcp.server.middleware.logging import LoggingMiddleware
from fastmcp.server.middleware.error_handling import ErrorHandlingMiddleware

# Read public key for token validation
with open("public.pem", "r") as public_key_file:
    public_key_content = public_key_file.read()

# Configure authentication provider
auth = BearerAuthProvider(
    public_key=public_key_content,
    issuer="http://localhost:8000",
    audience="my-mcp-server"
)

# Create FastMCP server with authentication
mcp = FastMCP(name="My MCP Server", auth=auth)
mcp.add_middleware(LoggingMiddleware())
mcp.add_middleware(ErrorHandlingMiddleware(
    include_traceback=True,
    transform_errors=True,
))

@mcp.tool()
def greet(name: str) -> str:
    # Extract user information from validated token
    access_token: AccessToken = get_access_token()
    user_id = access_token.client_id
    return f"Hello, {name}! Your userid is {user_id}."

async def main():
    await mcp.run_http_async(transport="streamable-http", log_level="debug")
```

### Step 3: Client Implementation

The client generates JWT tokens using the private key and includes them in requests:

```python
import asyncio
from fastmcp import Client
from fastmcp.client.transports import StreamableHttpTransport
from fastmcp.server.auth.providers.bearer import RSAKeyPair
from pydantic import SecretStr

# Read key pair
with open("private.pem", "r") as private_key_file:
    private_key_content = private_key_file.read()

with open("public.pem", "r") as public_key_file:
    public_key_content = public_key_file.read()

# Create key pair for token generation
key_pair = RSAKeyPair(
    private_key=SecretStr(private_key_content),
    public_key=public_key_content
)

# Generate JWT token
token = key_pair.create_token(
    subject="user@example.com",
    issuer="http://localhost:8000",
    audience="my-mcp-server",
    scopes=["read", "write"]
)

# Create transport with authentication
transport = StreamableHttpTransport(
    "http://localhost:8000/mcp",
    headers={"Authorization": "Bearer " + token},
)

async def call_tool(name: str):
    async with Client(transport=transport) as client:
        result = await client.call_tool("greet", {"name": name})
        print(f"Result: {result.data}")
```

## Authentication Flow

![w](/images/fastmcp-auth/workflow.png)

## Transport Modes

FastMCP supports two transport modes, each with different characteristics. In this blog post, we are focusing on **HTTP Streamable mode** as our primary example, which provides excellent performance for most use cases.

### HTTP Streamable Mode (Primary Example)

```python
# Server
await mcp.run_http_async(transport="streamable-http")

# Client
transport = StreamableHttpTransport(url, headers=auth_headers)
```

**Advantages:**
- High performance for request-response patterns
- Excellent for API-like interactions
- Lower latency for individual requests
- Better suited for high-frequency tool calls

### SSE (Server-Sent Events) Mode

```python
# Server
await mcp.run_http_async(transport="sse")

# Client
transport = SSETransport(url, headers=auth_headers)
```

**Advantages:**
- Real-time event streaming
- Better for long-lived connections
- Efficient for continuous data updates
- Ideal for monitoring and real-time applications

## JWT Token Structure

The JWT tokens contain essential claims for authentication and authorization:

```json
{
  "sub": "user@example.com",
  "iss": "http://localhost:8000",
  "aud": "my-mcp-server",
  "scope": "read write",
  "exp": 1640998800,
  "iat": 1640995200
}
```

**Claims Explanation:**
- `sub` (Subject): User identifier
- `iss` (Issuer): Token issuer URL
- `aud` (Audience): Intended recipient
- `scope`: Comma-separated list of permissions
- `exp` (Expiration): Token expiration timestamp
- `iat` (Issued At): Token creation timestamp

## Security Considerations

### Key Distribution Strategy

- **Client Side**: Each client needs access to the **private key** for token signing
- **Server Side**: The server only needs the **public key** for token validation
- **Shared Key Model**: Multiple clients can share the same RSA key pair

### Multi-Client Architecture Best Practices

When multiple clients connect to a single MCP server, they can all share the same RSA key pair. Here's the recommended approach:

![w](/images/fastmcp-auth/multi-clients.png)

#### 1. Centralized Key Distribution

```python
# All clients use the same private key for token generation
key_pair = RSAKeyPair(
    private_key=SecretStr(shared_private_key),
    public_key=shared_public_key
)
```

#### 2. Client Identification Strategy

```python
# Each client generates tokens with unique subjects
token_client_a = key_pair.create_token(
    subject="client-a@example.com",  # Unique client identifier
    issuer="http://localhost:8000",
    audience="my-mcp-server",
    scopes=["read", "write"]
)

token_client_b = key_pair.create_token(
    subject="client-b@example.com",  # Different client identifier
    issuer="http://localhost:8000",
    audience="my-mcp-server",
    scopes=["read"]  # Different scopes per client
)
```

#### 3. Server-Side Client Tracking

```python
@mcp.tool()
def greet(name: str) -> str:
    access_token: AccessToken = get_access_token()
    client_id = access_token.client_id  # e.g., "client-a@example.com"
    scopes = access_token.scopes
    
    # Log client activity
    print(f"Tool called by client: {client_id} with scopes: {scopes}")
    
    return f"Hello, {name}! Called by {client_id}"
```

#### 4. Security Considerations for Multi-Client Setup

1. **Unique Client Identifiers**: Use distinct subjects for each client
2. **Scope-Based Access Control**: Different clients can have different permission levels
3. **Audit Logging**: Track which client performed which actions
4. **Key Distribution Security**: Secure distribution of the shared private key
5. **Client Revocation**: Implement mechanisms to revoke specific client access

### Best Practices

1. **Key Security**: Store private keys securely, never in version control
2. **Token Expiration**: Set reasonable expiration times (e.g., 1 hour)
3. **Scope Validation**: Implement scope-based access control
4. **HTTPS**: Use HTTPS in production for secure communication
5. **Key Rotation**: Regularly rotate RSA keys
6. **Audit Logging**: Log authentication attempts and tool access
7. **Client Isolation**: Use unique subjects and scopes for different clients
8. **Key Distribution**: Implement secure key distribution mechanisms


## Performance Considerations

### Token Validation Overhead
- JWT validation is fast with RSA public key verification
- Consider caching validated tokens for short periods
- Use appropriate key sizes (2048-bit RSA recommended)

### Transport Mode Selection
- **HTTP Streamable**: Better for high-frequency requests
- **SSE**: Better for real-time updates and long-lived connections

## Advanced Features

### Custom Scopes
```python
# Server-side scope validation
auth = BearerAuthProvider(
    public_key=public_key_content,
    required_scopes=["admin", "read", "write"]
)

# Client-side scope request
token = key_pair.create_token(
    subject="admin@example.com",
    scopes=["admin", "read", "write"]
)
```

### Multiple Audiences
```python
# Support multiple services
auth = BearerAuthProvider(
    public_key=public_key_content,
    audience=["service-a", "service-b"]
)
```

## Conclusion

FastMCP's Bearer token authentication provides a robust, secure foundation for AI agent communication. By leveraging RSA key pairs and JWT tokens, developers can implement enterprise-grade security while maintaining the flexibility and performance needed for AI applications.

The dual transport support (HTTP streamable and SSE) ensures compatibility with various deployment scenarios, while the comprehensive middleware system provides logging, error handling, and extensibility.

For production deployments, remember to:
- Use HTTPS for all communications
- Implement proper key management and rotation
- Set up monitoring and alerting for authentication failures
- Regularly audit access patterns and token usage

FastMCP's authentication system strikes the right balance between security and usability, making it an excellent choice for building secure AI applications. 

Check out the complete source code and detailed guide [here](https://github.com/gyliu513/langX101/tree/main/fastmcp/auth). Happy hacking!