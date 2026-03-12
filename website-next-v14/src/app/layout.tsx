import { NextTamaguiProvider } from "./NextTamaguiProvider";
import { Nav } from "@/components/nav";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "TamaKit — UI components for Tamagui",
  description:
    "Beautifully crafted, cross-platform UI components for React Native and Web, built on Tamagui.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning
      >
        <NextTamaguiProvider>
          <Nav />
          {children}
        </NextTamaguiProvider>
      </body>
    </html>
  );
}
