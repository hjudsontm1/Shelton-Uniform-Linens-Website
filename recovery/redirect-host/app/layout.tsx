import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shelton Linen & Uniform Services",
  description: "Permanent redirect service for Shelton Linen & Uniform Services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
