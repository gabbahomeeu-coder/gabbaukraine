import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600"],
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "GABBA — Luxury Furniture Ukraine",
  description:
    "Дизайнерські меблі преміум-класу. Колекції Madrid, Luna, Montana, Leora, Moka. Безкоштовна доставка по Україні.",
  keywords: "меблі, дизайнерські меблі, преміум меблі, Gabba, Україна, luxury furniture",
  openGraph: {
    title: "GABBA — Luxury Furniture Ukraine",
    description: "Дизайнерські меблі преміум-класу для вашого дому",
    url: "https://www.gabbaukraine.com",
    siteName: "GABBA",
    locale: "uk_UA",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#201A12",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
