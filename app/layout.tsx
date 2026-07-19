import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Riuh Merekah Dashboard",
  description: "Digital wedding invitation SaaS dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
