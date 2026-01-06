# 🚀 Next.js App Router Implementation

This document outlines the implementation of public, protected, and dynamic routing in the Hire-Loop application using Next.js 13+ App Router.

## 🗺️ Route Structure

| Route | Type | Description |
|-------|------|-------------|
| `/` | Public | Home page |
| `/login` | Public | User login page |
| `/jobs` | Public | Job listings |
| `/dashboard` | Protected 🔒 | User dashboard (requires auth) |
| `/users` | Protected 🔒 | List of all users |
| `/users/[id]` | Protected 🔒 | Dynamic user profile |

## 🛡️ Authentication & Protection

### Middleware (`middleware.ts`)
We use Next.js Middleware to intercept requests and enforce security:
- **Public Routes:** Accessible by everyone.
- **Protected Routes:** Check for `auth-token` cookie.
- **Redirect:** Unauthenticated users trying to access protected routes are redirected to `/login`.

```typescript
// middleware.ts snippet
export function middleware(req: NextRequest) {
  const protectedRoutes = ["/dashboard", "/users"];
  // ... check token and redirect if needed ...
}
```

### Authorization Flow
1. **Login:** User credentials sent to `/api/auth/login`.
2. **Token:** On success, a JWT token is stored in an `httpOnly` like cookie (`auth-token`).
3. **Dashboard:** Client-side check reads the cookie to display user info (in a real app, this would be validated server-side or via an API call).

## 🔀 Dynamic Routing

### User Profile (`app/users/[id]/page.tsx`)
- Uses `useParams()` to get the user ID from URL.
- Fetches unique data for that specific ID.
- Displays **Breadcrumbs** for better navigation (`Home / Users / [Name]`).
- Handles **404 Errors** if user is not found.

```typescript
// app/users/[id]/page.tsx
export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id;
  // ... fetch user data ...
}
```

## 🔍 SEO & UX

- **Metadata:** Each page (login, etc.) exports `metadata` for SEO.
- **Breadcrumbs:** Improves site structure understanding for bots and users.
- **Custom 404:** A user-friendly `not-found.tsx` helps recover from broken links.

## 🧪 How to Test

1. **Visit Home:** Go to `http://localhost:3000/` (Public)
2. **Try Dashboard:** Go to `http://localhost:3000/dashboard` -> **Redirects to Login**
3. **Login:** Enter any email/password (or valid demo ones).
4. **Access Dashboard:** Now you can see the dashboard.
5. **View User:** Go to `http://localhost:3000/users/1` (Dynamic Route).
6. **404:** Go to `http://localhost:3000/random-page` (Custom Error Page).

---

## 📸 Screenshots & Demo

(Add your screenshots here for the assignment submission)
