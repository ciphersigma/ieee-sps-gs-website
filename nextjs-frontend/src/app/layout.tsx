import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IEEE SPS Gujarat Chapter",
  description: "Signal Processing Society Gujarat Chapter - Advancing signal processing research, education, and innovation in Gujarat",
  keywords: "IEEE, SPS, Signal Processing, Gujarat, Research, Education, Innovation",
  authors: [{ name: "IEEE SPS Gujarat Chapter" }],
  openGraph: {
    title: "IEEE SPS Gujarat Chapter",
    description: "Signal Processing Society Gujarat Chapter",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}