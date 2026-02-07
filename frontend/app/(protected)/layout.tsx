import RequireAuth from "@/components/RequireAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // This wrapper ensures NO dashboard content loads until Auth is confirmed
    <RequireAuth>{children}</RequireAuth>
  );
}
