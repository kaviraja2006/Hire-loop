# Error Handling Middleware

Centralized error handling system for consistent, secure, and observable error management across the entire Next.js application.

---

## Why Centralized Error Handling?

Modern web applications can fail in countless ways — API timeouts, database issues, validation failures, authentication problems. Without a centralized strategy:

- ❌ Error responses become inconsistent
- ❌ Stack traces leak to production users
- ❌ Debugging becomes difficult
- ❌ Security vulnerabilities emerge

A centralized error handler ensures:

- ✅ **Consistency**: Every error follows a uniform response format
- ✅ **Security**: Sensitive stack traces hidden in production
- ✅ **Observability**: Structured logs make debugging easier
- ✅ **Maintainability**: Single source of truth for error handling

---

## Architecture

```
lib/
├── logger.ts           # Structured logging utility
├── errorHandler.ts     # Centralized error handler
app/api/
├── [route]/
│   └── route.ts       # Uses handleError() for all errors
```

---

## Environment Behavior

| Environment     | Error Messages          | Stack Trace | Logging                   |
| --------------- | ----------------------- | ----------- | ------------------------- |
| **Development** | Detailed error messages | ✅ Included | Full details to console   |
| **Production**  | Generic, safe messages  | ❌ Redacted | Full details to logs only |

---

## Implementation

### 1. Structured Logger (`lib/logger.ts`)

The logger provides consistent, JSON-formatted log output for better parsing and monitoring.

```typescript
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(
      JSON.stringify({
        level: "info",
        message,
        meta,
        timestamp: new Date().toISOString(),
      })
    );
  },

  error: (message: string, meta?: any) => {
    console.error(
      JSON.stringify({
        level: "error",
        message,
        meta,
        timestamp: new Date().toISOString(),
      })
    );
  },
};
```

**Features:**

- JSON-structured output for log aggregation tools
- ISO timestamp for precise error tracking
- Metadata support for contextual information
- Multiple log levels: `info`, `warn`, `error`, `debug`

---

### 2. Custom Error Types (`lib/errorHandler.ts`)

Custom error classes enable specific status codes and messages:

```typescript
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}
```

**Error Type Mapping:**

| Error Type            | HTTP Status | Production Message        |
| --------------------- | ----------- | ------------------------- |
| `ValidationError`     | 400         | "Invalid request data"    |
| `AuthenticationError` | 401         | "Authentication required" |
| `AuthorizationError`  | 403         | "Access denied"           |
| `DatabaseError`       | 500         | "Database error occurred" |
| `Generic Error`       | 500         | "Something went wrong"    |

---

### 3. Central Error Handler

```typescript
export function handleError(error: any, context: string): NextResponse {
  const isProd = process.env.NODE_ENV === "production";

  // Determine status code based on error type
  let statusCode = 500;
  let userMessage = "Something went wrong. Please try again later.";

  if (error instanceof ValidationError) {
    statusCode = 400;
    userMessage = isProd ? "Invalid request data" : error.message;
  } else if (error instanceof AuthenticationError) {
    statusCode = 401;
    userMessage = isProd ? "Authentication required" : error.message;
  }
  // ... other error types

  const errorResponse = {
    success: false,
    message: isProd ? userMessage : error.message,
    errorType: error.name,
    ...(isProd ? {} : { stack: error.stack }),
  };

  logger.error(`Error in ${context}`, {
    errorType: error.name,
    message: error.message,
    stack: isProd ? "REDACTED" : error.stack,
    statusCode,
  });

  return NextResponse.json(errorResponse, { status: statusCode });
}
```

**Key Features:**

- Environment-aware responses
- Automatic status code mapping
- Stack trace redaction in production
- Structured error logging
- Contextual error tracking

---

## Usage in API Routes

### Basic Usage

```typescript
import { handleError, ValidationError } from "@/lib/errorHandler";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.email) {
      throw new ValidationError("Email is required");
    }

    // ... route logic

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return handleError(error, "POST /api/users");
  }
}
```

### With Wrapper Function

```typescript
import { withErrorHandler } from "@/lib/errorHandler";

async function getUsersHandler(req: Request) {
  // No try-catch needed - wrapper handles it
  const users = await prisma.user.findMany();
  return NextResponse.json({ success: true, users });
}

export const GET = withErrorHandler(getUsersHandler, "GET /api/users");
```

---

## Testing

### Test Endpoint

We've created a test endpoint to demonstrate error handling:

```bash
# Test validation error
curl http://localhost:3000/api/test/error?type=validation

# Test database error
curl http://localhost:3000/api/test/error?type=database

# Test generic error
curl http://localhost:3000/api/test/error?type=generic
```

### Automated Test Script

Run the PowerShell test script:

```powershell
.\scripts\test-errors.ps1
```

---

## Response Examples

### Development Mode (Detailed)

**Request:**

```bash
GET /api/test/error?type=validation
```

**Response:**

```json
{
  "success": false,
  "message": "Invalid input: email format is incorrect",
  "errorType": "ValidationError",
  "stack": "ValidationError: Invalid input: email format is incorrect\n    at GET (/app/api/test/error/route.ts:18:15)\n    ..."
}
```

**Console Log:**

```json
{
  "level": "error",
  "message": "Error in GET /api/test/error",
  "meta": {
    "errorType": "ValidationError",
    "message": "Invalid input: email format is incorrect",
    "stack": "ValidationError: Invalid input: email format is incorrect\n    at ...",
    "statusCode": 400
  },
  "timestamp": "2026-01-06T10:15:30.123Z"
}
```

---

### Production Mode (Secure)

**Request:**

```bash
GET /api/test/error?type=validation
```

**Response (User sees this):**

```json
{
  "success": false,
  "message": "Invalid request data",
  "errorType": "ValidationError"
}
```

**Server Log (Internal only):**

```json
{
  "level": "error",
  "message": "Error in GET /api/test/error",
  "meta": {
    "errorType": "ValidationError",
    "message": "Invalid input: email format is incorrect",
    "stack": "REDACTED",
    "statusCode": 400
  },
  "timestamp": "2026-01-06T10:15:30.123Z"
}
```

---

## Comparison Table

| Aspect            | Development               | Production                                  |
| ----------------- | ------------------------- | ------------------------------------------- |
| **Error Message** | Actual error message      | Generic, safe message                       |
| **Stack Trace**   | ✅ Full stack in response | ❌ Redacted                                 |
| **Error Type**    | ✅ Included               | ✅ Included                                 |
| **Logging**       | Full details to console   | Full details to logs (REDACTED in response) |
| **Security**      | Detailed for debugging    | Secure, no sensitive data leaked            |

---

## Benefits

### 1. Debugging Efficiency

**Structured JSON logs** make it easy to:

- Parse logs with tools like `jq`, CloudWatch, or Datadog
- Filter by error type, timestamp, or context
- Track errors across distributed systems

**Example: Finding all validation errors:**

```bash
# In development logs
cat logs/app.log | jq 'select(.meta.errorType == "ValidationError")'
```

### 2. User Trust & Security

Production users see:

- ✅ Clean, professional error messages
- ✅ No technical jargon or stack traces
- ✅ Consistent response format

This builds trust by:

- Not exposing internal implementation details
- Preventing information leakage for attackers
- Maintaining professional appearance

### 3. Maintainability

**Single source of truth** for error handling:

- All routes use the same error format
- Easy to update error messages globally
- Consistent logging across the entire app

---

## Extending the Error Handler

### Adding Custom Error Types

1. **Define new error class:**

```typescript
export class PaymentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaymentError";
  }
}
```

2. **Add mapping in handler:**

```typescript
else if (error instanceof PaymentError) {
  statusCode = 402;
  userMessage = isProd ? "Payment processing failed" : error.message;
}
```

3. **Use in routes:**

```typescript
if (!paymentSucceeded) {
  throw new PaymentError("Credit card declined");
}
```

### Adding Error Metadata

```typescript
export class ValidationError extends Error {
  public field?: string;

  constructor(message: string, field?: string) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

// Usage
throw new ValidationError("Invalid email format", "email");
```

---

## Future Enhancements

### 1. Error Monitoring Integration

```typescript
import * as Sentry from "@sentry/nextjs";

export function handleError(error: any, context: string) {
  // Send to monitoring service
  Sentry.captureException(error, {
    tags: { context },
    level: "error",
  });

  // ... existing error handling
}
```

### 2. Rate Limiting on Errors

Track repeated errors from same user to prevent abuse:

```typescript
const errorCounts = new Map<string, number>();

export function handleError(error: any, context: string, userId?: string) {
  if (userId) {
    const count = errorCounts.get(userId) || 0;
    if (count > 100) {
      return NextResponse.json(
        { message: "Too many errors. Please contact support." },
        { status: 429 }
      );
    }
    errorCounts.set(userId, count + 1);
  }
  // ... existing handling
}
```

### 3. Alert System

```typescript
export function handleError(error: any, context: string) {
  // Alert on critical errors
  if (error instanceof DatabaseError) {
    sendSlackAlert(`Critical DB error in ${context}: ${error.message}`);
  }
  // ... existing handling
}
```

---

## Reflection

### Why Structured Logs Aid Debugging

Traditional console logs:

```
Error: Database connection failed
    at someFunction...
```

Structured logs:

```json
{
  "level": "error",
  "message": "Error in POST /api/users",
  "meta": {
    "errorType": "DatabaseError",
    "statusCode": 500,
    "userId": "abc123",
    "timestamp": "2026-01-06T10:15:30Z"
  }
}
```

**Advantages:**

- Parseable by log aggregation tools
- Searchable and filterable
- Includes contextual metadata
- Can be sent to monitoring services
- Enables dashboards and alerts

### Building User Trust Through Security

**Information leakage risks:**

- Stack traces reveal file paths and code structure
- Error messages expose database schema
- Debug info helps attackers find vulnerabilities

**Our approach:**

- Production errors show minimal, safe messages
- Full details logged internally for debugging
- Consistent, professional error responses
- No exposure of system internals

This balance enables:

- Developers can still debug effectively
- Users see polished, helpful messages
- Attackers get no useful information

### Scalability

The error handler is designed to scale:

**Easily add 10+ custom error types:**

- Just extend Error class
- Add case in handler
- Start using immediately

**Integrate with enterprise tools:**

- Sentry, DataDog, CloudWatch
- Slack/PagerDuty alerts
- Custom analytics

**Maintain consistency:**

- All errors flow through one function
- Update once, affects entire app
- No scattered try-catch blocks

---

## Best Practices

✅ **Always use `handleError()` in all API routes**
✅ **Throw custom error types instead of generic Error**
✅ **Include meaningful context strings**
✅ **Never log sensitive data (passwords, tokens)**
✅ **Test error scenarios in development**
✅ **Monitor error rates in production**

❌ **Don't return raw error objects**
❌ **Don't expose stack traces in production**
❌ **Don't use generic error messages everywhere**
❌ **Don't forget to log errors**

---

## Summary

This centralized error handling system provides:

- **Consistency**: Uniform error format across all routes
- **Security**: No sensitive data leaked to users
- **Observability**: Structured logs for easy debugging
- **Maintainability**: Single source of truth
- **Scalability**: Easy to extend with new error types

By implementing this system, we've transformed error handling from scattered try-catch blocks into a professional, secure, and maintainable solution that serves both developers and users effectively.
