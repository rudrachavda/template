import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";

const inter = localFont({
  src: "../public/fonts/Inter/InterVariable.ttf",
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Template",
  description: "Full-stack sidebar UI template.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} no-scrollbar bg-[#fefefe] font-sans antialiased dark:bg-[#121212]`}>
        <ThemeProvider enableSystem={true} attribute="class" storageKey="theme" defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
