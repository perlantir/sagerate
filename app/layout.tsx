import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://proloanmatch.com"),
  title: {
    default: "ProLoanMatch | Professional Mortgage Loan Marketplace",
    template: "%s | ProLoanMatch",
  },
  description:
    "Compare specialized mortgage programs for physicians, dentists, attorneys, CPAs, veterinarians, and other professionals.",
  openGraph: {
    title: "ProLoanMatch",
    description:
      "Professional mortgage loan comparisons with no-PMI, low-down-payment, and student debt-friendly programs.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
