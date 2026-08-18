import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Trivialand",
  description: "Quiz and knowledge platform",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="font-sans antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
