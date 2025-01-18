import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-gray-100">
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <ScrollToTop />
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
