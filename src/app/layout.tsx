import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./header";
import Footer from "./footer";
import AppProvider from "./provider";
import ChatSocketProvider from "./chatroom/components/ChatSocketProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trip Planner",
  description: "여행을 쉽게 계획하세요",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {

  
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 flex flex-col min-h-screen`}
      >
          <AppProvider>
            <ChatSocketProvider>
              <Header />
                {children}
              <Footer />
            </ChatSocketProvider>
          </AppProvider>
      </body>
    </html>
  );
}
