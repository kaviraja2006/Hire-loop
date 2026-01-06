# Authentication APIs (Signup / Login)

This section documents the implementation of secure user authentication APIs using **bcrypt** for password hashing and **JWT (JSON Web Token)** for session management.

## Overview

Authentication is the backbone of modern web applications. This implementation demonstrates production-ready security practices including:

- **Secure password hashing** with bcrypt (10 salt rounds)
- **JWT token generation** with configurable expiration
- **Protected routes** with token validation
- **Comprehensive error handling** for all edge cases

---

## Authentication Flow Diagram

```mermaid
sequenceDiagram
    participant Client
    participant SignupAPI as /api/auth/signup
    participant LoginAPI as /api/auth/login
    participant ProtectedAPI as /api/auth/protected
    participant Database

    Note over Client,Database: Signup Flow
    Client->>SignupAPI: POST {name, email, password}
    SignupAPI->>Database: Check if user exists
    alt User exists
        Database-->>SignupAPI: User found
        SignupAPI-->>Client: 400 - User already exists
    else New user
        SignupAPI->>SignupAPI: Hash password with bcrypt
        SignupAPI->>Database: Create new user
        Database-->>SignupAPI: User created
        SignupAPI-->>Client: 201 - Signup successful
    end

    Note over Client,Database: Login Flow
    Client->>LoginAPI: POST {email, password}
    LoginAPI->>Database: Find user by email
    alt User not found
        Database-->>LoginAPI: No user
        LoginAPI-->>Client: 404 - User not found
    else User found
        Database-->>LoginAPI: User data
        LoginAPI->>LoginAPI: Compare password with bcrypt
        alt Invalid password
            LoginAPI-->>Client: 401 - Invalid credentials
        else Valid password
            LoginAPI->>LoginAPI: Generate JWT token
            LoginAPI-->>Client: 200 - Token returned
        end
    end

    Note over Client,Database: Protected Route Access
    Client->>ProtectedAPI: GET with Authorization header
    alt No token
        ProtectedAPI-->>Client: 401 - Token missing
    else Invalid/Expired token
        ProtectedAPI-->>Client: 403 - Invalid token
    else Valid token
        ProtectedAPI->>ProtectedAPI: Verify JWT
        ProtectedAPI-->>Client: 200 - Protected data
    end
```

---

## API Endpoints

### 1. Signup API

**Endpoint:** `POST /api/auth/signup`

**Purpose:** Register a new user with hashed password

**Request Body:**

```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "securepassword123"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Signup successful",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "CANDIDATE",
    "createdAt": "2026-01-06T08:36:43.000Z"
  }
}
```

**Error Response (400 - User Exists):**

```json
{
  "success": false,
  "message": "User already exists"
}
```

**Implementation Highlights:**

- Password is hashed using `bcrypt.hash(password, 10)` before storage
- User existence check prevents duplicate accounts
- Password field excluded from response for security
- Returns newly created user data (without password)

---

### 2. Login API

**Endpoint:** `POST /api/auth/login`

**Purpose:** Authenticate user and issue JWT token

**Request Body:**

```json
{
  "email": "alice@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsImVtYWlsIjoiYWxpY2VAZXhhbXBsZS5jb20iLCJyb2xlIjoiQ0FORElEQVRFIiwiaWF0IjoxNzA0NTI5MDAwLCJleHAiOjE3MDQ1MzI2MDB9.signature",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "CANDIDATE"
  }
}
```

**Error Responses:**

**404 - User Not Found:**

```json
{
  "success": false,
  "message": "User not found"
}
```

**401 - Invalid Credentials:**

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Implementation Highlights:**

- Uses `bcrypt.compare(password, hashedPassword)` for secure verification
- JWT token includes user id, email, and role
- Token expires after 1 hour (`expiresIn: "1h"`)
- Signed with `JWT_SECRET` environment variable

---

### 3. Protected Route API

**Endpoint:** `GET /api/auth/protected`

**Purpose:** Demonstrate JWT validation for secure endpoints

**Request Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Access granted - Protected data",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "alice@example.com",
    "role": "CANDIDATE"
  }
}
```

**Error Responses:**

**401 - Missing Token:**

```json
{
  "success": false,
  "message": "Token missing"
}
```

**403 - Invalid/Expired Token:**

```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**Implementation Highlights:**

- Extracts Bearer token from Authorization header
- Verifies token signature with `jwt.verify(token, JWT_SECRET)`
- Returns decoded user data if valid
- Automatically rejects expired tokens

---

## Security Implementation Details

### Password Hashing with bcrypt

**Why bcrypt?**

- Designed specifically for password hashing (not general-purpose like SHA-256)
- Includes salt generation automatically
- Computationally expensive (protects against brute-force attacks)
- Adaptive algorithm (can increase cost factor over time)

**Implementation:**

```typescript
// Hashing during signup
const hashedPassword = await bcrypt.hash(password, 10);
// 10 = salt rounds (2^10 = 1,024 iterations)

// Verification during login
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

**Salt Rounds Impact:**

| Salt Rounds | Time to Hash | Security Level                   |
| ----------- | ------------ | -------------------------------- |
| 8           | ~40ms        | Minimum acceptable               |
| 10          | ~65ms        | **Recommended for most apps**    |
| 12          | ~250ms       | High security applications       |
| 14          | ~1000ms      | Maximum security (may impact UX) |

**Our Choice:** 10 salt rounds balances security and performance

---

### JWT Token Structure

**Token Components:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9  ← Header (Base64)
.
eyJpZCI6IjU1MGU4NDAwLWUyOWIiLCJlbWFpbCI6ImFsaWNlQGV4YW1wbGUuY29tIn0  ← Payload (Base64)
.
4n8VxXGVKXz9fI5KZ2X9_signature  ← Signature (HMAC-SHA256)
```

**Decoded Payload:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "alice@example.com",
  "role": "CANDIDATE",
  "iat": 1704529000, // Issued at timestamp
  "exp": 1704532600 // Expiration timestamp (1 hour later)
}
```

**Security Features:**

- **Tamper-proof**: Any modification invalidates the signature
- **Stateless**: No server-side session storage needed
- **Self-contained**: Includes all necessary user information
- **Time-limited**: Automatically expires after configured duration

---

## Token Expiry & Refresh Strategy

### Current Implementation

**Token Lifetime:** 1 hour  
**Refresh Strategy:** Not implemented (manual re-login required)

### Why 1 Hour?

✅ **Security:** Limits exposure window if token is compromised  
✅ **Balance:** Long enough for typical user sessions  
✅ **Simplicity:** No refresh token complexity for this demo

### Production Recommendations

For production applications, consider implementing:

**1. Refresh Tokens**

```typescript
// Long-lived refresh token (7-30 days)
const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, {
  expiresIn: "7d",
});

// Short-lived access token (15-30 minutes)
const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
  expiresIn: "15m",
});
```

**2. Token Rotation**

- Issue new access token before old one expires
- Invalidate old refresh token when used
- Store refresh tokens in database (allow revocation)

**3. Sliding Expiration**

- Extend token lifetime with each request
- Reset countdown on user activity
- Automatically logout after true inactivity

---

## Token Storage: localStorage vs Cookies

### Option 1: localStorage

```javascript
// Store token
localStorage.setItem("authToken", token);

// Send with requests
fetch("/api/protected", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  },
});
```

**Pros:**
✅ Easy to implement  
✅ Works with any API structure  
✅ Explicitly controlled by JavaScript

**Cons:**
❌ Vulnerable to XSS attacks  
❌ Not automatically sent with requests  
❌ No built-in expiration

---

### Option 2: httpOnly Cookies (Recommended for Production)

```typescript
// Server-side: Set token as cookie
response.headers.set(
  "Set-Cookie",
  `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`
);

// Browser automatically sends cookie with requests
```

**Pros:**
✅ **XSS Protection**: JavaScript cannot access httpOnly cookies  
✅ **Automatic**: Browser sends cookie with every request  
✅ **Secure flag**: HTTPS-only transmission  
✅ **SameSite**: CSRF protection

**Cons:**
❌ More complex implementation  
❌ Requires CORS configuration for cross-origin  
❌ Cookie size limits (4KB)

---

### Our Implementation Choice

**Current:** Bearer tokens (for API demonstration and testing)  
**Production Recommendation:** httpOnly cookies with SameSite protection

---

## Testing the Authentication APIs

### Using PowerShell (Windows)

Run the comprehensive test suite:

```powershell
.\scripts\test-auth.ps1
```

### Using Bash (Linux/Mac)

```bash
chmod +x scripts/test-auth.sh
./scripts/test-auth.sh
```

### Manual Testing with curl

**1. Signup:**

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "password": "securepassword123"
  }'
```

**2. Login:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "securepassword123"
  }'
```

**3. Access Protected Route:**

```bash
# Replace <YOUR_TOKEN> with the token from login response
curl -X GET http://localhost:3000/api/auth/protected \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

## Test Scenarios Covered

| #   | Test Case                          | Expected Result            | Status |
| --- | ---------------------------------- | -------------------------- | ------ |
| 1   | Signup with new user               | 201 - User created         | ✅     |
| 2   | Signup with existing email         | 400 - User exists          | ✅     |
| 3   | Login with correct credentials     | 200 - Token returned       | ✅     |
| 4   | Login with wrong password          | 401 - Invalid credentials  | ✅     |
| 5   | Login with non-existent email      | 404 - User not found       | ✅     |
| 6   | Protected route without token      | 401 - Token missing        | ✅     |
| 7   | Protected route with invalid token | 403 - Invalid token        | ✅     |
| 8   | Protected route with valid token   | 200 - Access granted       | ✅     |
| 9   | Password hashed in database        | Never stored as plain text | ✅     |

---

## Database Schema Changes

### Updated User Model

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  password  String   // Hashed password for authentication
  role      Role     @default(CANDIDATE)
  createdAt DateTime @default(now()) @map("created_at")

  // Relations
  postedJobs   Job[]         @relation("PostedJobs")
  applications Application[]

  @@map("users")
}
```

**Key Addition:** `password String` field stores bcrypt hashed passwords

---

## Reusable JWT Utilities

We created a centralized JWT utility module at `lib/jwt.ts`:

### Functions Available

**1. `verifyToken(request: Request): JWTPayload | null`**

- Extracts and verifies JWT from request headers
- Returns decoded payload or null if invalid

**2. `requireAuth(request: Request): NextResponse | JWTPayload`**

- Middleware-like protection for routes
- Returns error response or decoded payload

**3. `generateToken(payload: JWTPayload, expiresIn: string): string`**

- Creates signed JWT with custom expiration
- Default: 1 hour

**Usage Example:**

```typescript
import { requireAuth } from "@/lib/jwt";

export async function GET(req: Request) {
  const auth = requireAuth(req);

  // If auth is NextResponse, it's an error - return it
  if (auth instanceof NextResponse) {
    return auth;
  }

  // Otherwise, it's the decoded payload
  const { id, email, role } = auth;
  // ... proceed with authenticated user data
}
```

---

## Environment Configuration

### Required Environment Variable

Add to your `.env` file:

```bash
# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

> **⚠️ SECURITY WARNING:**
>
> - Use a strong, random secret in production (minimum 32 characters)
> - Never commit the actual secret to version control
> - Rotate secrets periodically (e.g., every 90 days)
> - Use different secrets for development, staging, and production

**Generate a strong secret:**

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# OpenSSL
openssl rand -hex 32
```

---

## Reflection & Design Decisions

### Why This Authentication Approach?

**1. Bcrypt for Password Security**

- Industry standard for password hashing
- Protects against rainbow table attacks
- Future-proof (adjustable cost factor)

**2. JWT for Stateless Authentication**

- Enables horizontal scaling (no server-side sessions)
- Works seamlessly with microservices
- Reduces database load (no session lookups)

**3. Bearer Token Pattern**

- Standard HTTP authentication method
- Compatible with REST APIs
- Easy to test and debug

### Trade-offs Made

| Decision            | Benefit                       | Trade-off                          |
| ------------------- | ----------------------------- | ---------------------------------- |
| 1-hour token expiry | Better security               | More frequent re-logins            |
| No refresh tokens   | Simpler implementation        | Manual re-login required           |
| Bearer tokens       | Easy testing                  | Requires HTTPS in production       |
| 10 salt rounds      | Balanced security/performance | Could be higher for sensitive apps |

### Production Improvements Roadmap

**Phase 1: Essential Security**

- ✅ Implement httpOnly cookies
- ✅ Add HTTPS enforcement
- ✅ Enable rate limiting on auth endpoints

**Phase 2: User Experience**

- ✅ Add refresh token mechanism
- ✅ Implement "Remember Me" functionality
- ✅ Add password reset flow

**Phase 3: Advanced Features**

- ✅ Multi-factor authentication (MFA)
- ✅ OAuth integration (Google, GitHub)
- ✅ Session management dashboard
- ✅ Device tracking and logout

---

## Code Quality & Organization

### Files Created/Modified

**New API Routes:**

- `app/api/auth/signup/route.ts` - User registration
- `app/api/auth/login/route.ts` - User authentication
- `app/api/auth/protected/route.ts` - Protected route example

**Utilities:**

- `lib/jwt.ts` - Reusable JWT functions

**Testing:**

- `scripts/test-auth.ps1` - PowerShell test suite
- `scripts/test-auth.sh` - Bash test suite

**Database:**

- `prisma/schema.prisma` - Added password field to User model

**Configuration:**

- `.env.example` - Added JWT_SECRET template

---

## Learning Outcomes

Through this implementation, we demonstrated:

✅ **Password Security:** Understanding bcrypt hashing, salts, and cost factors  
✅ **Token-Based Auth:** JWT structure, signing, and verification  
✅ **API Design:** RESTful error handling and status codes  
✅ **Security Best Practices:** Never storing plaintext passwords, token expiration  
✅ **Testing Strategy:** Comprehensive test coverage for all scenarios  
✅ **Documentation:** Clear API documentation with examples

---

## Quick Start Guide

**1. Set up environment:**

```bash
# Copy example environment file
cp .env.example .env

# Add JWT secret
echo "JWT_SECRET=$(openssl rand -hex 32)" >> .env
```

**2. Update database schema:**

```bash
npx prisma migrate dev --name add-user-password
```

**3. Start development server:**

```bash
npm run dev
```

**4. Test the APIs:**

```powershell
.\scripts\test-auth.ps1
```

---

## Additional Resources

**Official Documentation:**

- [bcrypt npm package](https://www.npmjs.com/package/bcrypt)
- [jsonwebtoken npm package](https://www.npmjs.com/package/jsonwebtoken)
- [JWT.io - Token Debugger](https://jwt.io/)

**Security Best Practices:**

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

---
