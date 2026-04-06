import type { Metadata } from "next";
import ScrollbarProvider from "@/components/ScrollbarProvider";
import LenisProvider from "@/components/LenisProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Navtej Singh",
  description: "Navtej Singh — Software Architect & Pre-Med",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative min-h-screen w-screen overflow-x-hidden bg-black" data-overlayscrollbars-initialize="">
        <ScrollbarProvider>
          <LenisProvider>{children}</LenisProvider>
        </ScrollbarProvider>
      </body>
    </html>
  );
}
