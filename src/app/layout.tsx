import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { AppInitializer, Notification, SessionProvider } from "./layout.imports";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/(controllers)/auth/[...nextauth]/route"; // Removed this import

// Configure fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Next App",
  description: "A Next.js app with Google authentication",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch session server-side
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <StoreProvider>
            <AppInitializer />
            <Notification />
            {children}
          </StoreProvider>
        </SessionProvider>
      </body>
    </html>
  );
}