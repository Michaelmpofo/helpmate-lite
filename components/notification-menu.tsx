"use client"

import { Bell, Clock, HandHelping } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useHelpRequests } from "@/contexts/help-requests-context"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function NotificationMenu() {
  const { user } = useAuth()
  const { 
    requests, 
    updateRequests, 
    notifications, 
    clearNotification, 
    unreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead 
  } = useHelpRequests()

  const handleAcceptHelp = (requestId: number, helperId: string) => {
    updateRequests(
      requests.map((request) =>
        request.id === requestId
          ? { ...request, helper: helperId, status: "accepted" }
          : request
      )
    )
    clearNotification(requestId)
    toast.success("Help offer accepted!")
  }

  const handleDenyHelp = (requestId: number) => {
    updateRequests(
      requests.map((request) =>
        request.id === requestId
          ? { ...request, helper: null, status: "pending" }
          : request
      )
    )
    clearNotification(requestId)
    toast.info("Help offer declined")
  }

  if (!user) return null

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="z-[100]">
            <p>Notifications</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" className="w-[300px]">
          <DropdownMenuLabel className="font-normal">
            <div className="flex justify-between items-center">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Notifications</p>
                <p className="text-xs leading-none text-muted-foreground">
                  Recent help offers and updates
                </p>
              </div>
              {notifications.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    markAllNotificationsAsRead()
                    toast.success("All notifications marked as read")
                  }}
                >
                  Mark all read
                </Button>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <ScrollArea className="h-[300px]">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No new notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem 
                  key={notification.id} 
                  className={`p-4 cursor-pointer ${notification.read ? 'opacity-60' : ''}`}
                  onClick={() => {
                    if (!notification.read) {
                      markNotificationAsRead(notification.id)
                      toast.success("Notification marked as read")
                    }
                  }}
                >
                  <div className="flex flex-col space-y-1 relative">
                    {!notification.read && (
                      <div className="absolute -left-2 top-1 w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                    <div className="flex items-center gap-2">
                      {notification.type === "help_offer" ? (
                        <HandHelping className="w-4 h-4 text-green-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-orange-500" />
                      )}
                      <p className={`text-sm pl-1 ${
                        notification.type === "deadline_reminder" ? "text-orange-600 dark:text-orange-400" : ""
                      }`}>
                        {notification.message}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 pl-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  )
}
