import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Head from "next/head";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <Head>
        <title>AnimeHunt</title>
        <meta
          name="description"
          content="AnimeHunt is a website for searching and rating anime"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <html lang="en">
        <body className="bg-gray-100 min-h-screen">
          <Navbar />
          {children}
          <ScrollToTop />
        </body>
        <Footer />
      </html>
    </ClerkProvider>
  );
}
