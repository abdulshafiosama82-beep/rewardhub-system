import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/toaster";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "أرباحي | اكسب النقاط واربح الجوائز",
  description:
    "موقع أرباحي للمطور أسامة الحجر - اكسب النقاط من المهام والمقالات، جرب عجلة الحظ، وادخل السحوبات الشهرية على جوائز حقيقية.",
  generator: "v0.app",
  applicationName: "أرباحي",
  keywords: ["أرباحي", "نقاط", "جوائز", "سحوبات", "عجلة الحظ", "إحالات"],
};

export const viewport: Viewport = {
  themeColor: "#16a085",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} bg-background`}>
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
