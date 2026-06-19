import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LabVerse — Interactive Science Experiments for Classes 9–12",
  description:
    "A teaching aid for teachers and a visual playground for students. Perform CBSE/NCERT science experiments interactively — add reagents, observe reactions, identify unknowns. Chemistry, Physics, Biology, Maths for Classes 9, 10, 11, 12.",
  keywords: [
    "CBSE",
    "NCERT",
    "Science Experiments",
    "Chemistry Lab",
    "Hinsberg Test",
    "Carbylamine Test",
    "Tollens Test",
    "Class 12 Chemistry",
    "Interactive Lab",
    "Teaching Aid",
  ],
  authors: [{ name: "LabVerse" }],
  openGraph: {
    title: "LabVerse — Interactive Science Experiments",
    description:
      "Practise CBSE/NCERT science experiments like a real lab. For teachers & students of Classes 9–12.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LabVerse — Interactive Science Experiments",
    description: "Practise CBSE/NCERT science experiments like a real lab. For teachers & students of Classes 9–12.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
