import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import type { Metadata } from "next";
import { Inter, Black_Ops_One } from 'next/font/google';
import { Providers } from "./providers";
import { AnalyticsTracker } from "./components/AnalyticsTracker";
import "./globals.css";
import { SITE_CONFIG } from "@/config/site";

// Налаштування шрифтів
const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
})

const blackOpsOne = Black_Ops_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-black-ops',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.siteUrl),
  title: {
    default: "АЕРО ВЕНТ",
    template: "%s | АЕРО ВЕНТ",
  },
  description: "Сайт виробника безпілотних систем та РЕБ.",
  
  robots: {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
  },
},

  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: SITE_CONFIG.siteUrl,
    siteName: "АЕРО ВЕНТ",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={`${inter.variable} ${blackOpsOne.variable} antialiased flex flex-col min-h-screen bg-black text-white`}>
        <Providers>
          <AnalyticsTracker />
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
