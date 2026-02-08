"use client";
import RequireAuth from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import { DollarSign, LogOut, Moon, Sun, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { signOut } from "aws-amplify/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { setTheme, theme } = useTheme();

  return (
    // This wrapper ensures NO dashboard content loads until Auth is confirmed
    <RequireAuth>
      {/* NAVBAR */}
      <div className="min-h-screen bg-muted/40 transition-colors duration-300">
        <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur px-6 py-4 flex justify-between items-center shadow-sm">
          <div
            className="flex items-center gap-2"
            onClick={() => router.push("/dashboard")}
            style={{ cursor: "pointer" }}
          >
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">
              ClientLedger
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard/profile")}
            >
              <User />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                signOut();
                router.push("/");
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>
        {children}
      </div>
    </RequireAuth>
  );
}
