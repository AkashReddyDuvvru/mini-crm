import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { MessageSquare, LayoutDashboard, Users, Megaphone } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI-Native Mini CRM",
  description: "AI CRM for consumer brands",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                Mini CRM
              </span>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <LayoutDashboard size={20} className="text-gray-500" />
                <span className="font-medium text-gray-700">Dashboard</span>
              </Link>
              <Link href="/segments" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Users size={20} className="text-gray-500" />
                <span className="font-medium text-gray-700">Segments</span>
              </Link>
              <Link href="/campaigns" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Megaphone size={20} className="text-gray-500" />
                <span className="font-medium text-gray-700">Campaigns</span>
              </Link>
              <Link href="/chat" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">
                <MessageSquare size={20} className="text-purple-600" />
                <span className="font-medium">AI Agent</span>
              </Link>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto bg-gray-50">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
