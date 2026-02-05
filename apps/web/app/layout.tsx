import type { Metadata } from "next";
import "./globals.css";
import AnimatedBackground from "../components/AnimatedBackground";

export const metadata: Metadata = {
  title: "Alofy",
  description:
    "A Text based AI-Powered RPG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-[--font-mono]">
        <AnimatedBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
