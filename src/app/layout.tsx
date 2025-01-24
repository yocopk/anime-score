import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { currentUser } from "@clerk/nextjs/server";
import { actionSyncUser } from "@/actions/sync-user";

export const metadata: Metadata = {
  title: "AnimeHunt",
  description: "",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (user) {
    try {
      await actionSyncUser(user.emailAddresses[0].emailAddress);
    } catch (error) {
      console.error("Error syncing user:", error);
    }
  }

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
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
