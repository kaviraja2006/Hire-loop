"use client";

import { Button } from "@/components/ui/button";
// import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"; // Disabled - using manual JWT auth
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavbarActions() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="flex items-center gap-3">
      {mounted && (
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      )}

      <div className="flex items-center gap-2">
        {/* Manual JWT Authentication - Sign in button for demonstration */}
        <Button asChild variant={"ghost"} size="sm">
          <Link href={"/sign-in"}>Sign In</Link>
        </Button>

        {/* 
          Note: For full authentication UI with login/logout state:
          1. Store JWT token in localStorage/cookies after login
          2. Create a custom auth context/hook to check token state
          3. Show user menu based on token presence
          
          For now, this is a simple sign-in button for testing the auth APIs
        */}
      </div>
    </div>
  );
}
