import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const lexend = Lexend({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio Optimizer",
  description: "yessir",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={lexend.className}>
        <div className="fixed top-0 left-0 -z-10 h-full w-full gradient-bg">
          <div className="gradient-blob"></div>
        </div>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
