"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/auth-context"
import { Send, Image, Smile, Paperclip } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Message = {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: number
  avatar?: string
}

type ChatDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  requestId: number
  recipientId: string
  recipientName: string
  recipientAvatar?: string
}

export default function ChatDialog({ 
  open, 
  onOpenChange, 
  requestId, 
  recipientId, 
  recipientName,
  recipientAvatar 
}: ChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const { user } = useAuth()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  
  const userIds = [user?.id || "", recipientId].sort()
  const chatKey = `chat_${requestId}_${userIds[0]}_${userIds[1]}`

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem(chatKey)
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
  }, [chatKey])

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(chatKey, JSON.stringify(messages))
    }
  }, [messages, chatKey])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return

    const message: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: user.id,
      senderName: user.name || "User",
      content: newMessage.trim(),
      timestamp: Date.now(),
      avatar: user.avatar || undefined
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const handleTyping = () => {
    setIsTyping(true)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, 1000)
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 gap-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <DialogHeader className="px-4 py-3 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {recipientAvatar ? (
                <AvatarImage src={recipientAvatar} alt={recipientName} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white">
                  {getInitials(recipientName)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <DialogTitle className="text-lg font-semibold">{recipientName}</DialogTitle>
              {isTyping && (
                <motion.p 
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  typing...
                </motion.p>
              )}
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 h-[400px] pr-4" ref={scrollRef}>
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => {
                const isUser = message.senderId === user?.id
                const showAvatar = index === 0 || messages[index - 1]?.senderId !== message.senderId

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && showAvatar && (
                      <Avatar className="h-8 w-8">
                        {recipientAvatar ? (
                          <AvatarImage src={recipientAvatar} alt={recipientName} />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white text-xs">
                            {getInitials(recipientName)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    )}
                    <div
                      className={`group relative max-w-[80%] rounded-2xl px-4 py-2 ${
                        isUser
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white ml-auto rounded-br-none'
                          : 'bg-gray-100 dark:bg-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <span className="absolute bottom-0 text-[10px] opacity-0 group-hover:opacity-70 transition-opacity duration-200 whitespace-nowrap ${
                        isUser ? 'right-2' : 'left-2'
                      }">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    {isUser && showAvatar && (
                      <Avatar className="h-8 w-8">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt="You" />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                            {getInitials(user.name || "You")}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-white dark:bg-gray-900">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value)
                  handleTyping()
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="pr-24 min-h-[44px] dark:bg-gray-800"
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Attach file</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Image className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Send image</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Smile className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add emoji</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 h-[44px] px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
