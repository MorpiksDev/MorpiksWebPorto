import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://morpiks.com"),
  title: "Morpiks Solutions | Evolve Beyond Limits",
  description:
    "Morpiks is a multi-solution company in Bogor, Indonesia. Web apps, rapid prototyping, WMS/IMS/ERP, IoT, automation, industrial equipment, furniture, and procurement, tailored to your business.",
  keywords: [
    "Morpiks",
    "WebApp development",
    "Rapid prototyping",
    "ERP",
    "WMS",
    "IoT",
    "Automation",
    "Industrial equipment design",
    "Furniture fabrication",
    "Procurement",
    "Bogor",
    "Indonesia",
  ],
  openGraph: {
    title: "Morpiks Solutions | Evolve Beyond Limits",
    description:
      "Multi-solution company helping businesses adapt, evolve, and grow. Book a free consultation.",
    url: "https://morpiks.com",
    siteName: "Morpiks Solutions",
    images: [{ url: "/images/services-hero-overview.jpg", width: 1376, height: 768 }],
    locale: "en_US",
    alternateLocale: ["id_ID"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAFAFA",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body>
        {/* Without JS the intro can never finish, so hide it. */}
        <noscript>
          <style>{`#intro-overlay{display:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
