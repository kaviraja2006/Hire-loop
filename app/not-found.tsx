import Link from "next/link";
import Container from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container>
      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center text-center">
        <div className="space-y-6">
          <div className="text-9xl font-bold text-gray-300">404</div>
          <h1 className="text-4xl font-bold text-gray-900">Page Not Found</h1>
          <p className="text-lg text-gray-600">
            Oops! The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <p className="text-gray-500">It might have been moved or deleted.</p>
          <div className="flex gap-4 justify-center mt-8">
            <Link
              href="/"
              className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/jobs"
              className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
