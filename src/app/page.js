import LandingClient from "./LandingClient";

export const metadata = {
  title: "ApexLoan — Next-Gen Enterprise Loan Management",
  description: "Experience the next-generation enterprise loan management platform. ApexLoan offers real-time analytics, instant amortization simulations, and secure credit risk evaluations.",
  keywords: "loan management, enterprise lending, loan software, amortization simulator, credit risk, finance",
  openGraph: {
    title: "ApexLoan — Next-Gen Enterprise Loan Management",
    description: "Empower your financial institution with our cutting-edge loan platform.",
    url: "https://apexloan.example.com",
    siteName: "ApexLoan",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ApexLoan — Next-Gen Enterprise Loan Management",
    description: "Empower your financial institution with our cutting-edge loan platform.",
  },
};

export default function Page() {
  return <LandingClient />;
}
