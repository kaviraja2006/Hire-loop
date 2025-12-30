# API Route Structure and Naming

This section documents the RESTful API implementation following Next.js App Router conventions and best practices for file-based routing.

---

## Overview

We've implemented a comprehensive REST API under `/api/` with three main resource endpoints:

- **Users** - User management (candidates and recruiters)
- **Jobs** - Job postings management
- **Applications** - Job application tracking

All endpoints follow REST naming conventions, use proper HTTP methods, implement pagination, and provide consistent error handling.

---

## API Route Hierarchy

### File Structure

```
app/api/
├── users/
│   ├── route.ts          # GET /api/users | POST /api/users
│   └── [id]/
│       └── route.ts      # GET/PUT/DELETE /api/users/:id
├── jobs/
│   ├── route.ts          # GET /api/jobs | POST /api/jobs
│   └── [id]/
│       └── route.ts      # GET/PUT/DELETE /api/jobs/:id
└── applications/
    ├── route.ts          # GET /api/applications | POST /api/applications
    └── [id]/
        └── route.ts      # GET/PATCH/DELETE /api/applications/:id
```

---

## Available Endpoints

### Users API

| Method   | Endpoint         | Description                   | Auth Required |
| -------- | ---------------- | ----------------------------- | ------------- |
| `GET`    | `/api/users`     | Get all users with pagination | No            |
| `POST`   | `/api/users`     | Create a new user             | No            |
| `GET`    | `/api/users/:id` | Get a specific user by ID     | No            |
| `PUT`    | `/api/users/:id` | Update a user                 | No            |
| `DELETE` | `/api/users/:id` | Delete a user (cascades)      | No            |

**Query Parameters (GET /api/users):**

- `page` (number, default: 1) - Page number
- `limit` (number, default: 10, max: 100) - Items per page
- `role` (string) - Filter by role: `CANDIDATE` or `RECRUITER`

---

### Jobs API

| Method   | Endpoint        | Description                                | Auth Required |
| -------- | --------------- | ------------------------------------------ | ------------- |
| `GET`    | `/api/jobs`     | Get all jobs with pagination and filtering | No            |
| `POST`   | `/api/jobs`     | Create a new job posting                   | No            |
| `GET`    | `/api/jobs/:id` | Get a specific job with applications       | No            |
| `PUT`    | `/api/jobs/:id` | Update a job posting                       | No            |
| `DELETE` | `/api/jobs/:id` | Delete a job (cascades to applications)    | No            |

**Query Parameters (GET /api/jobs):**

- `page` (number, default: 1) - Page number
- `limit` (number, default: 10, max: 100) - Items per page
- `jobType` (enum) - Filter by type: `FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`
- `experienceLevel` (enum) - Filter by level: `ENTRY_LEVEL`, `MID_LEVEL`, `SENIOR`, `MANAGER`
- `recruiterId` (uuid) - Filter by recruiter ID

---

### Applications API

| Method   | Endpoint                | Description                          | Auth Required |
| -------- | ----------------------- | ------------------------------------ | ------------- |
| `GET`    | `/api/applications`     | Get all applications with pagination | No            |
| `POST`   | `/api/applications`     | Create a new job application         | No            |
| `GET`    | `/api/applications/:id` | Get a specific application           | No            |
| `PATCH`  | `/api/applications/:id` | Update application status            | No            |
| `DELETE` | `/api/applications/:id` | Delete an application                | No            |

**Query Parameters (GET /api/applications):**

- `page` (number, default: 1) - Page number
- `limit` (number, default: 10, max: 100) - Items per page
- `status` (enum) - Filter by status: `PENDING`, `REVIEWED`, `INTERVIEWING`, `REJECTED`, `OFFERED`
- `jobId` (uuid) - Filter by job ID
- `candidateId` (uuid) - Filter by candidate ID

---

## Sample Requests & Responses

### Create a User

**Request:**

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method Post `
  -Body (@{
    email = "john.doe@example.com"
    name = "John Doe"
    role = "CANDIDATE"
  } | ConvertTo-Json) `
  -ContentType "application/json"
```

**Response (201 Created):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john.doe@example.com",
  "name": "John Doe",
  "role": "CANDIDATE",
  "createdAt": "2025-12-30T08:00:00.000Z"
}
```

---

### Get All Jobs with Filtering

**Request:**

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/jobs?jobType=FULL_TIME&page=1&limit=5"
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Senior Software Engineer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "jobType": "FULL_TIME",
      "experienceLevel": "SENIOR",
      "salary": "$120,000 - $180,000",
      "description": "We are looking for an experienced software engineer...",
      "applicationUrl": "https://techcorp.com/apply",
      "postedAt": "2025-12-30T08:00:00.000Z",
      "recruiter": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Jane Recruiter",
        "email": "jane@example.com"
      },
      "_count": {
        "applications": 12
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 25,
    "totalPages": 5
  }
}
```

---

### Create an Application

**Request:**

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/applications" -Method Post `
  -Body (@{
    jobId = "123e4567-e89b-12d3-a456-426614174000"
    candidateId = "550e8400-e29b-41d4-a716-446655440000"
  } | ConvertTo-Json) `
  -ContentType "application/json"
```

**Response (201 Created):**

```json
{
  "id": "789e4567-e89b-12d3-a456-426614174000",
  "status": "PENDING",
  "appliedAt": "2025-12-30T08:00:00.000Z",
  "job": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Senior Software Engineer",
    "company": "Tech Corp",
    "location": "San Francisco, CA"
  },
  "candidate": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### Update Application Status

**Request:**

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/applications/789e4567-e89b-12d3-a456-426614174000" `
  -Method Patch `
  -Body (@{ status = "REVIEWED" } | ConvertTo-Json) `
  -ContentType "application/json"
```

**Response (200 OK):**

```json
{
  "id": "789e4567-e89b-12d3-a456-426614174000",
  "status": "REVIEWED",
  "appliedAt": "2025-12-30T08:00:00.000Z",
  "job": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Senior Software Engineer",
    "company": "Tech Corp"
  },
  "candidate": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

## Error Handling

### HTTP Status Codes

| Code  | Meaning               | Usage                                            |
| ----- | --------------------- | ------------------------------------------------ |
| `200` | OK                    | Successful GET, PUT, PATCH, or DELETE            |
| `201` | Created               | Successful POST                                  |
| `400` | Bad Request           | Invalid input data or validation errors          |
| `404` | Not Found             | Resource doesn't exist                           |
| `409` | Conflict              | Duplicate resource (e.g., duplicate application) |
| `500` | Internal Server Error | Unexpected server error                          |

### Error Response Format

**Validation Error (400):**

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "jobType",
      "message": "Invalid enum value"
    }
  ]
}
```

**Not Found Error (404):**

```json
{
  "error": "User not found"
}
```

**Duplicate Error (409):**

```json
{
  "error": "A record with this jobId, candidateId already exists"
}
```

---

## Pagination & Filtering

All list endpoints (`GET /api/users`, `/api/jobs`, `/api/applications`) support pagination:

**Default Pagination:**

- `page`: 1
- `limit`: 10
- `max limit`: 100

**Example with Multiple Filters:**

```
GET /api/jobs?jobType=FULL_TIME&experienceLevel=SENIOR&page=2&limit=20
```

**Response includes pagination metadata:**

```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

## Input Validation

All endpoints use **Zod** schemas for validation:

### User Creation Validation

```typescript
{
  email: string (valid email format),
  name?: string (optional),
  role?: "CANDIDATE" | "RECRUITER" (default: "CANDIDATE")
}
```

### Job Creation Validation

```typescript
{
  title: string (required),
  company: string (required),
  location: string (required),
  jobType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP",
  experienceLevel: "ENTRY_LEVEL" | "MID_LEVEL" | "SENIOR" | "MANAGER",
  salary?: string (optional),
  description: string (min 10 characters),
  applicationUrl?: string (valid URL format, optional),
  recruiterId: string (valid UUID)
}
```

### Application Creation Validation

```typescript
{
  jobId: string (valid UUID),
  candidateId: string (valid UUID)
}
```

---

## Testing the API

### Option 1: PowerShell Testing Script

Run the automated test script:

```powershell
cd c:\Users\kaviraja\Desktop\Hire-loop
.\scripts\test-api.ps1
```

This script will:
✅ Create sample users (candidates and recruiters)  
✅ Create job postings  
✅ Create applications  
✅ Test pagination and filtering  
✅ Test error handling (invalid inputs, duplicates, 404s)  
✅ Update records  
✅ Delete records

### Option 2: Manual Testing via curl

See [docs/API_TESTING.md](file:///c:/Users/kaviraja/Desktop/Hire-loop/docs/API_TESTING.md) for comprehensive curl command examples.

### Option 3: Prisma Studio Verification

After creating data via the API, verify it persisted correctly:

```bash
 npx prisma studio
```

Opens at `http://localhost:5555` with a visual database browser.

---

## Consistency & Naming Conventions

### Why Consistent Naming Matters

✅ **Predictability**: Developers can guess endpoint patterns without documentation  
✅ **Maintainability**: Adding new resources follows the same structure  
✅ **Integration**: Frontend teams can build API clients with confidence  
✅ **Debugging**: Errors are easier to trace when patterns are consistent

### RESTful Principles Applied

1. **Resource-based URLs**: Use nouns (`/users`, `/jobs`), not verbs (`/getUsers`, `/createJob`)
2. **Plural names**: Always use plural for consistency (`/users` not `/user`)
3. **HTTP methods convey actions**:
   - `GET` = Read
   - `POST` = Create
   - `PUT/PATCH` = Update
   - `DELETE` = Delete
4. **Nested resources**: Keep URLs flat when possible, avoid deep nesting
5. **Status codes communicate outcomes**: Use standard HTTP codes, not custom error numbers

### Naming Consistency Examples

**✅ Good:**

```
GET    /api/users
POST   /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

**❌ Bad:**

```
GET    /api/getUsers
POST   /api/create_user
GET    /api/user/:id
POST   /api/updateUser/:id
POST   /api/deleteUser/:id
```

---

## Production Considerations

### Authentication (Currently Disabled for Testing)

The API routes are currently public for testing purposes. In production:

1. **Enable Clerk Middleware Protection**: Update `middleware.ts` to protect API routes
2. **Add Role-Based Authorization**: Ensure recruiters can only modify their own jobs
3. **Rate Limiting**: Implement rate limits to prevent abuse
4. **API Keys**: Consider API keys for programmatic access

### Database Connection Pooling

Prisma handles connection pooling automatically, but in production:

- Monitor connection counts
- Adjust pool size if needed (`DATABASE_CONNECTION_LIMIT`)
- Use connection retries for resilience

### Logging & Monitoring

In production, add:

```typescript
// Log all API requests
export async function middleware(request: Request) {
  console.log(`${request.method} ${request.url}`);
  const start = Date.now();
  const response = await next();
  console.log(`Response time: ${Date.now() - start}ms`);
  return response;
}
```

---

## Troubleshooting

### "Publishable key not valid" Error

If you see a Clerk authentication error when accessing the API:

**Quick Fix:** See [docs/CLERK_FIX.md](file:///c:/Users/kaviraja/Desktop/Hire-loop/docs/CLERK_FIX.md) for solutions.

**Summary:**

1. Add valid Clerk keys to `.env`
2. OR temporarily disable Clerk in `app/layout.tsx`
3. OR use curl/Postman instead of browser

### API Not Responding

1. **Check dev server is running:**

   ```bash
   npm run dev
   ```

2. **Verify database is accessible:**

   ```bash
   npx prisma studio
   ```

3. **Check for TypeScript errors:**
   ```bash
   npm run build
   ```

---

## Reflection: Design Impact

### How Consistency Reduces Integration Errors

1. **Pattern Recognition**: Once a developer learns `/api/users`, they immediately understand `/api/jobs` and `/api/applications`
2. **Automatic Client Generation**: Tools like OpenAPI/Swagger can auto-generate clients because patterns are predictable
3. **Testing Efficiency**: Test suites can be templated since all resources follow the same structure
4. **Onboarding Speed**: New team members can contribute to any endpoint without domain-specific knowledge

### Scalability Benefits

1. **Easy to Add Resources**: Adding `/api/interviews` or `/api/companies` takes minutes, not hours
2. **Caching Strategies**: Consistent patterns allow for blanket caching rules
3. **Microservice Migration**: If we split into microservices later, each service can maintain the same API contract
4. **Documentation**: Auto-generated docs stay accurate because structure is enforced

### Error Design Impact

By using standard HTTP codes and consistent error formats:

- Frontend can show meaningful error messages
- Debugging is faster (400 = client error, 500 = server error)
- Logging and monitoring tools work out-of-the-box
- API consumers understand errors without reading docs

---

## Built With

- **Next.js 15** - App Router with API routes
- **Prisma** - Type-safe database ORM
- **Zod** - Runtime validation
- **TypeScript** - Type safety
- **PostgreSQL** - Relational database

---

## Summary Checklist

✅ **Organized API routes** under `app/api/` following Next.js conventions  
✅ **Working CRUD endpoints** for all resources (Users, Jobs, Applications)  
✅ **Pagination support** on all list endpoints (configurable page/limit)  
✅ **Filtering capabilities** (role, jobType, experienceLevel, status, etc.)  
✅ **Proper HTTP methods** (GET, POST, PUT, PATCH, DELETE)  
✅ **Consistent error handling** with meaningful status codes  
✅ **Input validation** using Zod schemas  
✅ **Comprehensive documentation** with examples  
✅ **Testing scripts** for automated verification  
✅ **Production considerations** documented

---

See [API_TESTING.md](file:///c:/Users/kaviraja/Desktop/Hire-loop/docs/API_TESTING.md) for manual testing commands.
