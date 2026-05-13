import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Meeting-to-Action Converter",
  description: "Turn any meeting transcript into assigned, tracked action items in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.className} min-h-screen bg-background antialiased`}>
          {children}
          <Toaster theme="dark" position="bottom-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
