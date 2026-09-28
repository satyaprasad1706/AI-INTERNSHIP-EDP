import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Resume-to-Job Matching Platform | B.Tech Capstone",
  description:
    "Production-quality full-stack AI/NLP-powered recruitment screening platform combining Weeks 1-8.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen antialiased">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 p-6 max-w-7xl w-full mx-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
