import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Huntme | AI-Powered OSINT Intelligence Platform",
  description: "Enterprise-grade OSINT platform for phone telemetry, vehicle registration lookups, and AI-powered investigation timelines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
