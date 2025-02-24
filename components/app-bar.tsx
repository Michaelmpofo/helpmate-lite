"use client"

import { useState, useEffect } from "react"
import { Bell, Settings, Search, Moon, Sun, HelpCircle, BookOpen, LogOut, Clipboard } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { HelpOfferedDialog } from "./help-offered-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import HowToUseDialog from "./how-to-use-dialog"
import HelpGuideDialog from "./help-guide-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useHelpRequests } from "@/contexts/help-requests-context"
import { motion } from "framer-motion"
import NotificationMenu from "./notification-menu"

export default function AppBar() {
  const [search, setSearch] = useState("")
  const { theme, setTheme } = useTheme()
  const [isHelpOfferedOpen, setIsHelpOfferedOpen] = useState(false)
  const [hasNotification, setHasNotification] = useState(false)
  const [isHowToUseOpen, setIsHowToUseOpen] = useState(false)
  const [isHelpGuideOpen, setIsHelpGuideOpen] = useState(false)
  const { user, logout, login } = useAuth()
  const { requests, setSearchQuery } = useHelpRequests()

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search, setSearchQuery])

  return (
    <TooltipProvider>
      <motion.header 
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="container flex h-14 items-center">
          <motion.div 
            className="mr-4 hidden md:flex"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <motion.span 
                className="hidden text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text sm:inline-block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Community Help Board
              </motion.span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
            </nav>
          </motion.div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <motion.div 
              className="w-full flex-1 md:w-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search help requests..."
                  className="h-9 md:w-[300px] lg:w-[300px] pl-8 pr-4 transition-all duration-300 focus:md:w-[400px] bg-white dark:bg-gray-800"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-9 px-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setIsHelpOfferedOpen(true)}
                  >
                    <div className="relative">
                      <Clipboard className="h-5 w-5" />
                      {hasNotification && (
                        <motion.span
                          className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />
                      )}
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View your help offers</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-9 px-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setIsHelpGuideOpen(true)}
                  >
                    <BookOpen className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Help Guide</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-9 px-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setIsHowToUseOpen(true)}
                  >
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>How to use</p>
                </TooltipContent>
              </Tooltip>

              {user && <NotificationMenu />}
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-9 px-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Settings className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Theme</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>System</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  {user ? (
                    <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => {
                        window.location.href = "/auth"
                      }}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Login / Sign Up</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </div>
        </div>
      </motion.header>
      <HelpOfferedDialog open={isHelpOfferedOpen} onOpenChange={setIsHelpOfferedOpen} />
      <HowToUseDialog open={isHowToUseOpen} onOpenChange={setIsHowToUseOpen} />
      <HelpGuideDialog open={isHelpGuideOpen} onOpenChange={setIsHelpGuideOpen} />
    </TooltipProvider>
  )
}
