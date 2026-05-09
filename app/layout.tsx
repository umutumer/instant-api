import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Instant API — Generate Mock API Endpoints in Seconds",
  description: "Type a prompt, get a live JSON API endpoint instantly. No backend setup required.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${inter.variable} ${mono.variable} min-h-full flex flex-col antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
