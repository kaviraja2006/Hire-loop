"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button"; // Using existing button for styling consistency
import { cn } from "@/lib/utils";

export default function Header() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Home" },
        { href: "/dashboard", label: "Dashboard" },
        { href: "/jobs", label: "Jobs" },
    ];

    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-6 py-3 dark:bg-gray-950 dark:border-gray-800">
            <div className="flex items-center gap-6">
                <Link href="/" className="text-xl font-bold text-blue-600">
                    HireLoop
                </Link>
                <nav className="flex gap-4">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-blue-600",
                                pathname === link.href ? "text-blue-600" : "text-gray-600 dark:text-gray-400"
                            )}
                        >
                            {link.label}
                        </Link>
                    )}
                </nav>
            </div>

            <div className="flex items-center gap-4">
                {/* Placeholder for future auth buttons or theme toggle */}
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                    <Link href="/sign-in">Sign Up</Link>
                </Button>
            </div>
        </header>
    );
}
