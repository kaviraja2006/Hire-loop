# Job Portal Web Application – Rendering Strategies (Next.js 15)

This project demonstrates **Static (SSG)**, **Dynamic (SSR)**, and **Hybrid (ISR)** rendering in the new **Next.js App Router**.

---

## 🚀 Pages Overview

| Page | Rendering Type | Config | Description |
|------|----------------|--------|--------------|
| `/about` | Static (SSG) | `export const revalidate = false` | Generated at build time for static content |
| `/dashboard` | Dynamic (SSR) | `export const dynamic = 'force-dynamic'` | Always re-renders with new server data |
| `/jobs` | Hybrid (ISR) | `export const revalidate = 60` | Cached and regenerated every 60 seconds |

---

## 🧠 Why These Choices

- **About Page (SSG):** Content rarely changes → best for performance.
- **Dashboard (SSR):** Needs live data (user count, time) → must re-render on every request.
- **Jobs Page (ISR):** Jobs change periodically → balance between speed & freshness.

---

## ⚡ Performance Benefits

- SSG → Fastest load time (cached HTML)
- SSR → Always up-to-date, but higher cost
- ISR → Cached pages automatically refresh, scalable for large apps

---

## 🧩 Reflection

If the app had **10× more users**, using SSR for everything would be slow and costly.  
A balanced approach:
- Use **SSG** for static pages
- Use **ISR** for semi-dynamic data
- Use **SSR** only where real-time accuracy is essential

---

## 🧪 Verification

You can open **Network tab** in DevTools:
- `/about` → loads from cache
- `/dashboard` → fetches fresh data every time
- `/jobs` → same data until 60 sec passes, then regenerates

---

## 📦 Deployment

Deployed on [Vercel](https://vercel.com) for real-world caching and ISR testing.

