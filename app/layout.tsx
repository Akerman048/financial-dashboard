import type { Metadata } from "next";
import { Geist, Geist_Mono, Saira } from "next/font/google";
import "./globals.css";

import AuthInitializer from "@/components/auth/AuthInitializer";
import DesktopSidebar from "@/components/layout/DesktopSidebar";
import MobileSidebar from "@/components/layout/MobileSidebar";
import MobileMenuButton from "@/components/layout/MobileMenuButton";
import ModalOverlay from "@/components/layout/ModalOverlay";
import { LoginCard } from "@/components/auth/LoginCard";
import ThemeProvider from "@/components/layout/ThemeProvider";
import FinanceInitializer from "@/components/auth/FinanceInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-saira",
});

export const metadata: Metadata = {
  title: "Financial dashboard",
  description: "Manage your finances",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} ${saira.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider>
          <div className="min-h-screen p-3 lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
            <DesktopSidebar />

            <main className="min-w-0 rounded-2xl border border-white/10 bg-surface/70 p-3 lg:h-[calc(100vh-1.5rem)] lg:overflow-hidden">
              <div className="mb-4 lg:hidden">
                <MobileMenuButton />
              </div>
              <AuthInitializer />
              <FinanceInitializer />
              {children}
            </main>
          </div>

          <MobileSidebar />

          <ModalOverlay>
            <LoginCard />
          </ModalOverlay>
        </ThemeProvider>
      </body>
    </html>
  );
}
