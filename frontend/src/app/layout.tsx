import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";
import QueryProvider from "@/components/QueryProvider";

export const metadata: Metadata = {
  title: "TaskEarn Pro - Earn Money by Completing Daily Tasks",
  description: "Complete daily tasks and earn real money. Join TaskEarn Pro today and start earning ₦500 daily.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              {children}
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
