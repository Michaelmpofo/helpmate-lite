"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { HelpRequest, Notification } from "@/types"
import { toast } from "sonner"

type HelpRequestsContextType = {
  requests: HelpRequest[]
  notifications: Notification[]
  unreadCount: number
  updateRequests: (newRequests: HelpRequest[]) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void
  clearNotification: (requestId: number) => void
  cancelRequest: (requestId: number) => void
  markNotificationAsRead: (notificationId: string) => void
  markAllNotificationsAsRead: () => void
  completeRequest: (requestId: number) => void
  onNotification: (callback: (notification: Notification) => void) => () => void
}

const HelpRequestsContext = createContext<HelpRequestsContextType | undefined>(undefined)

export function HelpRequestsProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<HelpRequest[]>([
    {
      id: 1,
      name: "Help with Grocery Shopping",
      description: "Need assistance picking up groceries from the local supermarket. I have mobility issues and would appreciate help.",
      category: "Errands",
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      userId: "default1",
      userName: "Sarah Johnson",
      email: "example1@email.com",
      phone: "+1234567890",
      whatsapp: "",
      status: "pending",
      helper: null,
      helperName: undefined
    },
    {
      id: 2,
      name: "Math Tutoring Needed",
      description: "Looking for help with calculus homework. Need someone who can explain complex concepts clearly.",
      category: "Tutoring",
      deadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
      userId: "default2",
      userName: "Mike Chen",
      email: "example2@email.com",
      phone: "+1234567891",
      whatsapp: "",
      status: "pending",
      helper: null,
      helperName: undefined
    },
    {
      id: 3,
      name: "Laptop Repair Assistance",
      description: "My laptop is running very slow. Need someone with tech experience to help diagnose and fix the issue.",
      category: "Tech Support",
      deadline: new Date(Date.now() + 72 * 60 * 60 * 1000),
      userId: "default3",
      userName: "Emma Davis",
      email: "example3@email.com",
      phone: "+1234567892",
      whatsapp: "",
      status: "pending",
      helper: null,
      helperName: undefined
    }
  ])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [notificationCallbacks] = useState<Set<(notification: Notification) => void>>(new Set())
  const unreadCount = notifications.filter(n => !n.read).length

  // Check for deadlines every minute
  useEffect(() => {
    const checkDeadlines = () => {
      const now = new Date()
      requests.forEach(request => {
        const timeLeft = request.deadline.getTime() - now.getTime()
        const hoursLeft = timeLeft / (1000 * 60 * 60)
        
        // Add deadline reminder when 2 hours are left
        if (hoursLeft <= 2 && hoursLeft > 0) {
          const existingReminder = notifications.find(
            n => n.requestId === request.id && n.type === "deadline_reminder"
          )
          
          if (!existingReminder) {
            addNotification({
              requestId: request.id,
              helperId: request.userId, // For requests you created
              recipientId: request.userId, // Send reminder to request creator
              type: "deadline_reminder",
              message: `Only ${Math.round(hoursLeft)} hour(s) left for help request: "${request.name}"`
            })
          }
        }
      })
    }

    const interval = setInterval(checkDeadlines, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [requests, notifications])

  const updateRequests = (newRequests: HelpRequest[]) => {
    setRequests(newRequests)
    localStorage.setItem("helpRequests", JSON.stringify(newRequests))
  }

  const onNotification = (callback: (notification: Notification) => void) => {
    notificationCallbacks.add(callback)
    return () => notificationCallbacks.delete(callback)
  }

  const addNotification = (notification: Omit<Notification, "id" | "createdAt" | "read">) => {
    // Only add notifications for help offers, deadline reminders, and new requests
    if (notification.type === "help_offer" || notification.type === "deadline_reminder" || notification.type === "new_request") {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        createdAt: new Date(),
        read: false
      }
      setNotifications(prev => [...prev, newNotification])
      
      // Notify all subscribers
      notificationCallbacks.forEach(callback => callback(newNotification))
    }
  }

  const clearNotification = (requestId: number) => {
    setNotifications(prev => prev.filter(n => n.requestId !== requestId))
  }

  const cancelRequest = (requestId: number) => {
    const request = requests.find(r => r.id === requestId)
    if (!request) return

    // Remove all notifications related to this request
    setNotifications(prev => prev.filter(n => n.requestId !== requestId))
    
    // Remove the request
    updateRequests(requests.filter(r => r.id !== requestId))
    toast.success("Request cancelled successfully")
  }

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
  }

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const completeRequest = (requestId: number) => {
    const request = requests.find(r => r.id === requestId)
    if (!request) return

    // Remove all notifications related to this request
    setNotifications(prev => prev.filter(n => n.requestId !== requestId))
    
    // Remove the request
    updateRequests(requests.filter(r => r.id !== requestId))
    toast.success("Help request completed successfully! Thank you for helping!")
  }

  useEffect(() => {
    const savedRequests = localStorage.getItem("helpRequests")
    if (savedRequests) {
      try {
        const parsed = JSON.parse(savedRequests)
        const validatedRequests = parsed.map((request: any) => ({
          ...request,
          deadline: new Date(request.deadline),
          status: request.status || "pending" as const,
          helper: request.helper || null
        })) as HelpRequest[]
        setRequests(validatedRequests)
      } catch (error) {
        console.error("Error loading requests from localStorage:", error)
      }
    }
  }, [])

  return (
    <HelpRequestsContext.Provider
      value={{
        requests,
        notifications,
        unreadCount,
        updateRequests,
        searchQuery,
        setSearchQuery,
        addNotification,
        clearNotification,
        cancelRequest,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        completeRequest,
        onNotification
      }}
    >
      {children}
    </HelpRequestsContext.Provider>
  )
}

export function useHelpRequests() {
  const context = useContext(HelpRequestsContext)
  if (context === undefined) {
    throw new Error("useHelpRequests must be used within a HelpRequestsProvider")
  }
  return context
}
