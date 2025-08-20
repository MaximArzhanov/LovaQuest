import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import { PartnerProvider } from "@/context/PartnerContext";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LoveQuest - Планирование свиданий",
  description:
    "Приложение для планирования романтических свиданий и получения призов",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <LanguageProvider>
          <AuthProvider>
            <PartnerProvider>
              <AppProvider>{children}</AppProvider>
            </PartnerProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

