import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import type { Metadata } from "next";
import { Inter, Black_Ops_One } from 'next/font/google';
import { Providers } from "./providers";
import { AnalyticsTracker } from "./components/AnalyticsTracker";
import { SimplePasswordGate } from "./components/SimplePasswordGate";
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
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: "АЕРО ВЕНТ — виробник безпілотних систем та РЕБ. AeroVent, aerovent, aero vent, аеровент.",
  keywords: [
    "купити FPV",
    "АЕРО ВЕНТ",
    "AeroVent",
    "aerovent",
    "aero vent",
    "аеровент",
    "безпілотні системи",
    "купити дрон",
    "купити РЕБ",
    "FPV",
    "БПЛА",
    "дрони",
    "РЕБ"
  ],

   robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  // robots: {
  //   index: true,
  //   follow: true,
  //   googleBot: {
  //     index: true,
  //     follow: true,
  //   },
  // },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: SITE_CONFIG.siteUrl,
    siteName: SITE_CONFIG.name,
    title: "АЕРО ВЕНТ",
    description: "Виробник безпілотних систем та РЕБ. AeroVent, aerovent, aero vent, аеровент.",
    images: [
      {
        url: "/images/brand_icon.png",
        width: 512,
        height: 512,
        alt: "АЕРО ВЕНТ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "АЕРО ВЕНТ",
    description: "Виробник безпілотних систем та РЕБ. AeroVent, aerovent, aero vent, аеровент.",
    images: ["/images/brand_icon.png"],
  },
  icons: {
    icon: "/images/brand_icon.png",
    shortcut: "/images/brand_icon.png",
    apple: "/images/brand_icon.png",
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
          <SimplePasswordGate>
            <main className="flex-grow">{children}</main>
          </SimplePasswordGate>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
