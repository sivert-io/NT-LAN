import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

const inter = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "N T L A N",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="text-white bg-[#1A171F]">
      <head>
        <link rel="icon" href="NT.svg" />
      </head>
      <body className={`py-12 2xl:py-0 ${inter.className}`}>{children}</body>
    </html>
  );
}
