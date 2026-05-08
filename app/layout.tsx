import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Instant API � Generate Mock API Endpoints in Seconds",
  description: "Type a prompt, get a live JSON API endpoint instantly. No backend setup required.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full" >
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
