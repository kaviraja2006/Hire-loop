import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Sidebar from "./Sidebar";

/**
 * LayoutWrapper Component
 * 
 * Provides a consistent layout structure with Header and Sidebar.
 * Conditionally renders Sidebar based on the current route.
 */
export default function LayoutWrapper({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    // Routes where we might not want the sidebar (e.g., login, home if we want full width)
    // For this assignment, we'll keep it simple but typically public pages might exclude sidebar.
    // Let's exclude sidebar on auth pages for a cleaner look
    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/sign-in");
    const isHomePage = pathname === "/";

    const showSidebar = !isAuthPage && !isHomePage;

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex flex-1">
                {showSidebar && <Sidebar />}
                <main className="flex-1 bg-white p-6 dark:bg-gray-950 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
