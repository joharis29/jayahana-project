import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sistem Keuangan & Operasional - PT. Jayahana Manaura Mekanika Selaras",
  description: "Platform Manajemen Anggaran, Pengadaan, Billing Starlite FTTH, dan Laporan Keuangan Terpadu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 antialiased text-slate-900">
        {children}
      </body>
    </html>
  );
}
