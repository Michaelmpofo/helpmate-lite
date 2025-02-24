import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { HelpRequestsProvider } from "@/contexts/help-requests-context"
import { AuthProvider } from "@/contexts/auth-context"
import AppBar from "@/components/app-bar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "HelpMate",
  description: "A platform for helping others",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-white dark:bg-gray-900`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <HelpRequestsProvider>
              <div className="min-h-screen flex flex-col">
                <AppBar />
                <main className="flex-1 container mx-auto px-4 py-6">
                  {children}
                </main>
              </div>
              <Toaster />
            </HelpRequestsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}