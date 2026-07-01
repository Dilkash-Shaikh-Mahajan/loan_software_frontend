import { Geist, Geist_Mono } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ApexLoan — Enterprise Loan Management Platform",
  description: "ApexLoan empowers financial institutions with interactive amortization simulators, real-time analytics dashboards, and secure credit risk evaluations.",
};

import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ReactQueryProvider>
          <AppProvider>
            {children}
            <Toaster position="bottom-right" />
          </AppProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
