import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyCoach — Reality-First AI Study Assistant",
  description: "A structured, technical AI study companion for students. No fluff, just results.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen flex flex-col bg-brand-bg text-brand-black">{children}</body>
    </html>
  );
}
