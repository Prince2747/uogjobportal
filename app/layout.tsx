import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UoG Job Portal",
  description: "University of Gondar Job Portal",
  icons: {
    icon: [
      {
        url: "/logo.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
    shortcut: ["/logo.ico"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
