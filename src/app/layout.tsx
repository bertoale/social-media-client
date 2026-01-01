import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blog App",
  description: "A modern blog application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
