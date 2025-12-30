# API Testing Script

This script contains curl commands to test all API endpoints.

## Prerequisites

Make sure the development server is running:

```bash
npm run dev
```

Server should be available at: http://localhost:3000

## Test Sequence

### 1. Users API

#### Create a Candidate User

```powershell
curl -X POST http://localhost:3000/api/users `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"john.candidate@example.com\",\"name\":\"John Candidate\",\"role\":\"CANDIDATE\"}'
```

#### Create a Recruiter User

```powershell
curl -X POST http://localhost:3000/api/users `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"jane.recruiter@example.com\",\"name\":\"Jane Recruiter\",\"role\":\"RECRUITER\"}'
```

#### Get All Users

```powershell
curl http://localhost:3000/api/users
```

#### Get All Users (with pagination)

```powershell
curl "http://localhost:3000/api/users?page=1&limit=5"
```

#### Filter Users by Role

```powershell
curl "http://localhost:3000/api/users?role=RECRUITER"
```

#### Get Specific User (replace {userId} with actual ID from create response)

```powershell
curl http://localhost:3000/api/users/{userId}
```

#### Update User (replace {userId} with actual ID)

```powershell
curl -X PUT http://localhost:3000/api/users/{userId} `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"John Updated Candidate\"}'
```

#### Delete User (replace {userId} with actual ID)

```powershell
curl -X DELETE http://localhost:3000/api/users/{userId}
```

---

### 2. Jobs API

#### Create a Job Posting (replace {recruiterId} with actual recruiter ID)

```powershell
curl -X POST http://localhost:3000/api/jobs `
  -H "Content-Type: application/json" `
  -d '{\"title\":\"Senior Software Engineer\",\"company\":\"Tech Corp\",\"location\":\"San Francisco, CA\",\"jobType\":\"FULL_TIME\",\"experienceLevel\":\"SENIOR\",\"salary\":\"$120,000 - $180,000\",\"description\":\"We are looking for an experienced software engineer to join our team. You will work on cutting-edge technologies and solve complex problems.\",\"applicationUrl\":\"https://techcorp.com/apply\",\"recruiterId\":\"{recruiterId}\"}'
```

#### Create Another Job

```powershell
curl -X POST http://localhost:3000/api/jobs `
  -H "Content-Type: application/json" `
  -d '{\"title\":\"Junior Developer\",\"company\":\"Startup Inc\",\"location\":\"Remote\",\"jobType\":\"CONTRACT\",\"experienceLevel\":\"ENTRY_LEVEL\",\"salary\":\"$60,000 - $80,000\",\"description\":\"Great opportunity for recent graduates. Learn from experienced developers and grow your skills.\",\"recruiterId\":\"{recruiterId}\"}'
```

#### Get All Jobs

```powershell
curl http://localhost:3000/api/jobs
```

#### Get Jobs (with pagination)

```powershell
curl "http://localhost:3000/api/jobs?page=1&limit=10"
```

#### Filter by Job Type

```powershell
curl "http://localhost:3000/api/jobs?jobType=FULL_TIME"
```

#### Filter by Experience Level

```powershell
curl "http://localhost:3000/api/jobs?experienceLevel=SENIOR"
```

#### Filter by Recruiter

```powershell
curl "http://localhost:3000/api/jobs?recruiterId={recruiterId}"
```

#### Get Specific Job (replace {jobId} with actual ID)

```powershell
curl http://localhost:3000/api/jobs/{jobId}
```

#### Update Job (replace {jobId} with actual ID)

```powershell
curl -X PUT http://localhost:3000/api/jobs/{jobId} `
  -H "Content-Type: application/json" `
  -d '{\"salary\":\"$130,000 - $200,000\"}'
```

#### Delete Job (replace {jobId} with actual ID)

```powershell
curl -X DELETE http://localhost:3000/api/jobs/{jobId}
```

---

### 3. Applications API

#### Create an Application (replace {jobId} and {candidateId})

```powershell
curl -X POST http://localhost:3000/api/applications `
  -H "Content-Type: application/json" `
  -d '{\"jobId\":\"{jobId}\",\"candidateId\":\"{candidateId}\"}'
```

#### Get All Applications

```powershell
curl http://localhost:3000/api/applications
```

#### Get Applications (with pagination)

```powershell
curl "http://localhost:3000/api/applications?page=1&limit=10"
```

#### Filter by Status

```powershell
curl "http://localhost:3000/api/applications?status=PENDING"
```

#### Filter by Job

```powershell
curl "http://localhost:3000/api/applications?jobId={jobId}"
```

#### Filter by Candidate

```powershell
curl "http://localhost:3000/api/applications?candidateId={candidateId}"
```

#### Get Specific Application (replace {applicationId} with actual ID)

```powershell
curl http://localhost:3000/api/applications/{applicationId}
```

#### Update Application Status (replace {applicationId} with actual ID)

```powershell
curl -X PATCH http://localhost:3000/api/applications/{applicationId} `
  -H "Content-Type: application/json" `
  -d '{\"status\":\"REVIEWED\"}'
```

#### Delete Application (replace {applicationId} with actual ID)

```powershell
curl -X DELETE http://localhost:3000/api/applications/{applicationId}
```

---

## Error Testing

### Test Invalid Email (should return 400)

```powershell
curl -X POST http://localhost:3000/api/users `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"invalid-email\",\"name\":\"Test User\"}'
```

### Test Non-Existent User (should return 404)

```powershell
curl http://localhost:3000/api/users/00000000-0000-0000-0000-000000000000
```

### Test Duplicate Application (should return 409)

First create an application, then try to create the same one again with same jobId and candidateId.

### Test Missing Required Fields (should return 400)

```powershell
curl -X POST http://localhost:3000/api/jobs `
  -H "Content-Type: application/json" `
  -d '{\"title\":\"Test Job\"}'
```

---

## Testing Tips

1. **Save IDs**: After creating users, jobs, or applications, save the returned IDs to use in subsequent requests.
2. **Test in Order**: Create users first, then jobs (need recruiter ID), then applications (need job and candidate IDs).
3. **Use Prisma Studio**: Run `npx prisma studio` to visually verify data in the database.
4. **Check Responses**: Verify that each response has the correct structure and status code.
5. **Test Pagination**: Try different page and limit values, including edge cases (page=0, limit=1000).

---

## Expected Response Format

All successful responses follow this structure:

**Single Resource (201 Created or 200 OK):**

```json
{
  "id": "uuid",
  "field1": "value1",
  ...
}
```

**List with Pagination (200 OK):**

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

**Error Response (4xx or 5xx):**

```json
{
  "error": "Error message",
  "details": [...] // Optional, for validation errors
}
```

**Delete Success (200 OK):**

```json
{
  "message": "Resource deleted successfully"
}
```
