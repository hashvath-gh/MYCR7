import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { PWAInstaller } from "@/components/PWAInstaller";

export const metadata: Metadata = {
  title: {
    default: "Life Manager — Score Your Life Out of 100",
    template: "%s · Life Manager",
  },
  description: "Life Manager is the personal operating system for daily discipline. Track sleep, hydration, fitness, meals, academics, music and journaling as a single 100-point daily score.",
  keywords: ["habit tracker","discipline","productivity","self improvement","sleep tracker","hydration","fitness","journaling"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Life Manager",
  },
  icons: {
    icon: "/icon-512.png",
    apple: "/icon-512.png",
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080c14] text-slate-100 antialiased min-h-screen selection:bg-emerald-500 selection:text-slate-950">
        <PWAInstaller />
        {children}
      </body>
    </html>
  );
}
