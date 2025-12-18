import Container from "@/components/ui/Container";
import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <Container className="px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="mb-3 text-lg font-semibold">FindTalent</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Connecting talented professionals with innovative companies. Find
              your next career opportunity or discover exceptional talent.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href={"/"}
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href={"/"}
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href={"/"}
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href={"/"}
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href={"/"}
                >
                  Terms of Service
                </Link>
              </li>

              <li>
                <Link
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href={"/"}
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-8">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FindTalent. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href={"/"}
              target="_blank"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Linkedin className="h-5 w-5" />
            </Link>

            <Link
              href={"/"}
              target="_blank"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Twitter className="h-5 w-5" />
            </Link>

            <Link
              href={"/"}
              target="_blank"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
