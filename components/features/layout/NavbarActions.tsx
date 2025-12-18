"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
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
        <SignedOut>
          <Button asChild variant={"ghost"} size="sm">
            <Link href={"/sign-in"}>Sign In</Link>
          </Button>
        </SignedOut>

        <SignedIn>
          <Button asChild variant={"outline"} size={"sm"}>
            <Link href={"/dashboard"}>Dashboard</Link>
          </Button>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}
