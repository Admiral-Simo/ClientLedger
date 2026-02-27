"use client";

import RequireAuth from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  LogOut,
  Moon,
  Sun,
  User,
  Settings,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { signOut } from "aws-amplify/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { setTheme, theme } = useTheme();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Logout successfully."); // Professional German for your B2 goals
      router.push("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#020617] transition-colors duration-500">
        {/* --- MODERN GLASS NAVBAR --- */}
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/30">
          <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
            {/* BRANDING */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => router.push("/dashboard")}
            >
              <div className="bg-primary shadow-lg shadow-primary/20 text-primary-foreground p-1.5 rounded-xl transition-transform group-hover:scale-110 active:scale-95">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="font-black text-xl tracking-tighter text-foreground">
                ClientLedger
              </span>
            </motion.div>

            {/* ACTIONS */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle - Minimalist style */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-muted"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              <div className="h-6 w-px bg-border/60 mx-1" />

              {/* ACCOUNT DROPDOWN - This is the "Greater" way */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 flex items-center gap-2 px-2 rounded-xl hover:bg-muted/50 transition-all"
                  >
                    <Avatar className="h-8 w-8 rounded-lg border shadow-sm">
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-black">
                        SK
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-56 mt-2 rounded-2xl p-2 shadow-2xl border-border/40 bg-background/95 backdrop-blur-lg"
                  align="end"
                >
                  <DropdownMenuLabel className="px-3 py-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-black leading-none tracking-tight">
                        Simo Khalis
                      </p>
                      <p className="text-[10px] leading-none text-muted-foreground uppercase font-bold tracking-widest mt-1">
                        Free Tier
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/40" />

                  <DropdownMenuItem
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors font-semibold text-xs"
                    onClick={() => router.push("/dashboard/profile")}
                  >
                    <User className="w-4 h-4" /> Account Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors font-semibold text-xs"
                    onClick={() => router.push("/pricing")}
                  >
                    <CreditCard className="w-4 h-4" /> Subscription
                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors font-semibold text-xs">
                    <Settings className="w-4 h-4" /> Settings
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-border/40" />

                  <DropdownMenuItem
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-rose-500 focus:bg-rose-500/10 focus:text-rose-600 transition-colors font-bold text-xs"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4" /> Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="relative">{children}</main>
      </div>
    </RequireAuth>
  );
}
