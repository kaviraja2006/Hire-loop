"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Sidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/dashboard", label: "Overview", icon: "📊" },
        { href: "/users", label: "Users", icon: "👥" },
        { href: "/jobs", label: "Jobs", icon: "💼" },
        { href: "/settings", label: "Settings", icon: "⚙️" },
    ];

    return (
        <aside className="w-64 border-r bg-gray-50/50 p-4 dark:bg-gray-900/50 hidden md:block">
            <h2 className="mb-4 px-2 text-lg font-bold tracking-tight">Navigation</h2>
            <ul className="space-y-1">
                {links.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                pathname === link.href
                                    ? "bg-blue-100 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100"
                                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                            )}
                        >
                            <span>{link.icon}</span>
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
