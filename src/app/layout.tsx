import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Toaster } from "sonner";
import AuthProvider from "@/services/auth-provider";
import { CartProvider } from "@/context/CartContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AgriSmart - AI-Powered Farming Assistant",
  description: "Make data-driven farming decisions with AI-powered insights",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              <Navbar />
              {children}
              <Toaster />
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
