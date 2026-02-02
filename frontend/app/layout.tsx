import Providers from "@/components/Providers";
import "./globals.css";

export const metadata = { title: "Client Ledger" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
