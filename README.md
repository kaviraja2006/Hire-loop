# Hire-Loop  
### A Next.js Job Posting Platform

Hire-Loop is a job posting and talent discovery platform built with **Next.js App Router**.  
This project demonstrates **modern rendering strategies** and **production-ready environment & secrets management practices** used in real-world applications.

---

## Tech Stack

- Next.js (App Router)
- TypeScript
- Clerk Authentication
- PostgreSQL (Neon)
- Tailwind CSS

---

# Concept-1: Advanced Data Fetching & Rendering Strategies

This application demonstrates **three different rendering strategies** supported by the Next.js App Router:

- Static Site Generation (SSG)
- Server-Side Rendering (SSR)
- Incremental Static Regeneration (ISR)

Each page uses the strategy that best fits its **data freshness** and **performance requirements**.

---

## Rendering Modes Used

| Page | Route | Rendering Strategy | Configuration | Reason |
|----|----|----|----|----|
| About | `/about` | Static (SSG) | `revalidate = false` | Marketing content that rarely changes |
| Dashboard | `/dashboard` | Dynamic (SSR) | `dynamic = 'force-dynamic'` | User-specific, real-time data |
| Home | `/` | Hybrid (ISR) | `revalidate = 60` | Job listings update periodically |

---

## Static Rendering (SSG)

- Pages are generated **at build time**
- Served as **pre-rendered HTML**
- Fastest performance and lowest server cost

**Used for:**  
Marketing pages, informational content, and static sections.

---

## Dynamic Rendering (SSR)

- Pages are rendered **on every request**
- Always returns **fresh, user-specific data**
- Higher server cost but required for real-time views

**Used for:**  
User dashboards and authenticated pages.

---

## Hybrid Rendering (ISR)

- Pages are statically generated
- Automatically regenerated after a fixed interval
- Balances performance and freshness

**Used for:**  
Job listings and homepage feeds.

---

## Performance Impact Summary

- **SSG:** ~50ms load time (pre-rendered)
- **SSR:** ~200–300ms (server computation per request)
- **ISR:** ~50ms cached + background regeneration

---

## Scalability Reflection (Concept-1)

If traffic increased **10×**:

- Static pages would remain unchanged
- Dashboard would stay SSR but use caching layers (Redis, DB optimization)
- ISR revalidation interval would be tuned based on job posting frequency

---

# Concept-2: Environment-Aware Builds & Secrets Management

This project follows **production-safe configuration practices** by separating code from configuration and managing secrets securely.

---

## Current Environment Setup

For local development, the project uses:


This file contains all required environment variables such as:

- Clerk authentication keys
- Database connection string
- API endpoints

---

## Important Notes

- `.env.local` is **never committed to GitHub**
- Secrets are injected at **build or runtime**
- Sensitive variables are kept **server-only** unless explicitly marked `NEXT_PUBLIC_`

---

## Git Safety

```gitignore
.env*
!.env.example
