import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Hire Loop",
  description: "Sign in to access your Hire Loop dashboard",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
