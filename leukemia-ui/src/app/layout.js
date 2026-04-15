import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '../components/Navbar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Leukemia Detection System | AI-Powered Blood Analysis",
  description: "Upload blood images for instant AI-powered leukemia detection. Fast, accurate, medical-grade results.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gradient-to-br from-slate-900 via-black to-slate-900">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
