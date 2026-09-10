import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SENTINEL — Fraud & Scam Pattern Intelligence Engine",
  description: "Advanced multi-input fraud detection, OCR screenshot forensics, deterministic heuristic pattern evaluation, and explainable risk scoring.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-cyber-dark text-slate-100 antialiased min-h-screen selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
