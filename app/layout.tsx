import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lexisg-frontend-intern-test",
  description: "Created with yash savani",
  generator: "yash",
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
