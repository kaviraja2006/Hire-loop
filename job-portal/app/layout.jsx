
import Link from "next/link";


export const metadata = {
  title: "Job Portal",
  description: "A demo job portal showcasing rendering strategies in Next.js 15",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <nav className="flex gap-6 p-4 bg-white shadow">
          <Link href="/" className="font-semibold">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/jobs">Jobs</Link>
          <Link href="/dashboard">Dashboard</Link>
        </nav>
        <main className="max-w-3xl mx-auto mt-6">{children}</main>
      </body>
    </html>
  );
}
