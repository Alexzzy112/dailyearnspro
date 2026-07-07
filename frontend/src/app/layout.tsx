import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";
import QueryProvider from "@/components/QueryProvider";
import InactivityWrapper from "@/components/InactivityWrapper";

export const metadata: Metadata = {
  title: "TaskEarn Pro - Earn Money by Completing Daily Tasks",
  description: "Complete daily tasks and earn real money. Join TaskEarn Pro today and start earning ₦10,000 daily.",
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="url(%23g)"/><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="%233B82F6"/><stop offset="1" stop-color="%238B5CF6"/></linearGradient></defs><text x="50" y="68" font-family="Arial" font-size="50" font-weight="bold" fill="white" text-anchor="middle">T</text></svg>',
    apple: '/icons/icon-192.svg',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'TaskEarn Pro',
    statusBarStyle: 'default',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <script dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js').catch(()=>{})})}`
          }} />
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <InactivityWrapper>
                {children}
              </InactivityWrapper>
              <Toaster position="top-right" toastOptions={{
                duration: 4000,
                style: { borderRadius: '10px', background: '#333', color: '#fff' },
              }} />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
