"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingCart, Book, Wrench, HeartHandshake, Plus, Clock, Search, MessageCircle, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import NewRequestDialog from "./new-request-dialog"
import OfferHelpDialog from "./offer-help-dialog"
import { HelpOfferedDialog } from "./help-offered-dialog"
import { toast } from "sonner"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useHelpRequests } from "@/contexts/help-requests-context"
import { useAuth } from "@/contexts/auth-context"
import { HelpRequest, NewRequestInput } from "@/types"
import ChatDialog from "./chat-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface Notification {
  requestId: number;
  recipientId: string;
  helperId: string;
  type: string;
  message: string;
}

const categoryIcons = {
  Errands: ShoppingCart,
  Tutoring: Book,
  Repairs: Wrench,
  "Tech Support": HeartHandshake,
}

const categoryColors = {
  Errands: "bg-pink-500 dark:bg-pink-700",
  Tutoring: "bg-blue-500 dark:bg-blue-700",
  Repairs: "bg-green-500 dark:bg-green-700",
  "Tech Support": "bg-purple-500 dark:bg-purple-700",
}

export default function HelpBoard() {
  const { user } = useAuth()
  const {
    requests: serverRequests,
    searchQuery,
    setSearchQuery,
    updateRequests,
    addNotification,
    cancelRequest,
    onNotification,
  } = useHelpRequests()
  const [filter, setFilter] = useState("All")
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false)
  const [isOfferHelpOpen, setIsOfferHelpOpen] = useState(false)
  const [isHelpOfferedOpen, setIsHelpOfferedOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasNotification, setHasNotification] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [requestToCancel, setRequestToCancel] = useState<number | null>(null)
  const [showDescription, setShowDescription] = useState(false)

  useEffect(() => {
    // Initialize with default cards if no server requests
    if (serverRequests.length === 0) {
      const defaultRequests: HelpRequest[] = [
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
      ]
      updateRequests(defaultRequests)
    }
  }, [serverRequests, updateRequests])

  const handleNewRequest = async (requestInput: NewRequestInput) => {
    if (!user) {
      toast.error("Please login to create a request")
      return
    }

    try {
      // Create the full request object
      const newRequest: HelpRequest = {
        id: serverRequests.length + 1,
        name: requestInput.name,
        description: requestInput.description,
        category: requestInput.category,
        deadline: new Date(Date.now() + requestInput.duration * 60 * 60 * 1000), // Convert hours to milliseconds
        userId: user.id,
        userName: user.name,
        email: requestInput.email,
        phone: requestInput.phone,
        whatsapp: requestInput.whatsapp,
        status: "pending",
        helper: null,
        helperName: undefined
      }
      
      updateRequests([...serverRequests, newRequest])
      setIsNewRequestOpen(false)
      toast.success("Help request created successfully")
    } catch (error) {
      toast.error("Failed to create request. Please try again.")
      console.error(error)
    }
  }

  const handleOfferHelp = async (request: HelpRequest) => {
    if (!user) {
      toast.error("Please login to offer help")
      return
    }

    setSelectedRequest(request)
    setIsLoading(true)
    
    try {
      // Update the request
      const updatedRequests = serverRequests.map((r) =>
        r.id === request.id ? { ...r, helper: user.id, helperName: user.name } : r
      )
      updateRequests(updatedRequests)
      
      // Show success notification to the helper (me)
      toast.success(`You have offered to help ${request.userName || 'Anonymous'} with "${request.name}"`)
      
      // Add notification for the requester (the other person)
      if (request.userId !== user.id) {
        // Only notify the requester, not yourself
        addNotification({
          requestId: request.id,
          recipientId: request.userId,
          helperId: user.id,
          type: "help_offer",
          message: `${user.name} has offered to help with your request "${request.name}"`
        })
      }
    } catch (error) {
      toast.error("Failed to offer help. Please try again.")
      console.error(error)
    } finally {
      setIsLoading(false)
      setIsOfferHelpOpen(false)
    }
  }

  const cancelHelp = () => {
    setSelectedRequest(null)
    setIsOfferHelpOpen(false)
  }

  const handleCancelRequest = (requestId: number) => {
    if (!user) {
      toast.error("Please login to cancel requests")
      return
    }
    setRequestToCancel(requestId)
    setShowCancelConfirm(true)
  }

  const confirmCancel = () => {
    if (!requestToCancel) return

    try {
      cancelRequest(requestToCancel)
    } catch (error) {
      toast.error("Failed to cancel request. Please try again.")
      console.error(error)
    } finally {
      setShowCancelConfirm(false)
      setRequestToCancel(null)
    }
  }

  const filteredRequests = useMemo(() => 
    serverRequests.filter(request => {
      // Apply category filter
      if (filter !== "All" && request.category !== filter) {
        return false
      }
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          request.name.toLowerCase().includes(query) ||
          request.description.toLowerCase().includes(query) ||
          request.category.toLowerCase().includes(query)
        )
      }
      
      return true
    }).sort((a, b) => b.deadline.getTime() - a.deadline.getTime()), [serverRequests, filter, searchQuery])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N for new request
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        if (user) setIsNewRequestOpen(true)
        else toast.error("Please login to create a request")
      }
      // Ctrl/Cmd + F to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
        searchInput?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [user])

  useEffect(() => {
    if (!user) return

    // Subscribe to notifications
    const unsubscribe = onNotification((notification: Notification) => {
      if (notification.recipientId === user.id) {
        switch (notification.type) {
          case "help_offer":
            toast.info(notification.message)
            break
          case "help_request_cancelled":
            toast.error(notification.message)
            break
          case "help_accepted":
            toast.success(notification.message)
            break
          case "help_denied":
            toast.error(notification.message)
            break
          case "deadline_reminder":
            toast.warning(notification.message)
            break
          case "new_request":
            toast.info(notification.message)
            break
          default:
            console.error(`Unknown notification type: ${notification.type}`)
        }
        setHasNotification(true)
      }
    })

    return () => unsubscribe()
  }, [user, onNotification])

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg"
        >
          <div className="w-full md:w-auto">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-[180px] bg-white dark:bg-gray-800 shadow-sm dark:border-gray-600 dark:hover:border-gray-500 dark:focus:border-purple-500 dark:shadow-[0_0_15px_rgba(168,85,247,0.15)] dark:hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] transition-all duration-300">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="All" className="dark:focus:bg-purple-500/20">All categories</SelectItem>
                {Object.keys(categoryIcons).map((category) => (
                  <SelectItem key={category} value={category} className="dark:focus:bg-purple-500/20">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text">
              Connect with neighbours
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              who need assistance
            </p>
          </motion.div>

          <div className="w-full md:w-auto">
            <Button
              onClick={() => setIsNewRequestOpen(true)}
              className="w-full md:w-auto bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </div>
        </motion.div>

        <AnimatePresence>
          {filteredRequests.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <div className="rounded-full bg-gray-100 dark:bg-gray-700 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-gray-200">No Requests Found</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                {searchQuery 
                  ? "No help requests match your search criteria. Try adjusting your search terms."
                  : "No help requests in this category. Be the first to create one!"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredRequests.map((request, index) => {
                const Icon = categoryIcons[request.category as keyof typeof categoryIcons] || HeartHandshake
                const colorClass = categoryColors[request.category as keyof typeof categoryColors] || "bg-gray-500 dark:bg-gray-700"
                const timeLeft = request.deadline.getTime() - Date.now()
                const hoursLeft = Math.floor(timeLeft / 3600000)
                const minutesLeft = Math.floor((timeLeft % 3600000) / 60000)
                const canChat = user && (request.helper === user.id || request.userId === user.id)

                return (
                  <motion.div
                    key={request.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="col-span-1"
                  >
                    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                      <div className={`h-2 ${colorClass}`} />
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{request.name}</h3>
                            {request.userId === user?.id && request.status !== "cancelled" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCancelRequest(request.id)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                              <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            </div>
                            <span className="font-semibold text-lg dark:text-gray-100">{request.category}</span>
                            <span className="text-sm text-muted-foreground">· {request.userName || "Anonymous"}</span>
                          </div>
                          <div className="text-sm mb-4 dark:text-gray-300">
                            <p className="line-clamp-2 inline">{request.description}</p>
                            {request.description.length > 100 && (
                              <button
                                onClick={() => {
                                  setSelectedRequest(request)
                                  setShowDescription(true)
                                }}
                                className="inline-flex text-blue-500 hover:text-blue-600 hover:underline ml-1 font-medium"
                              >
                                ...read more
                              </button>
                            )}
                          </div>
                          <motion.div 
                            className="flex items-center text-sm text-muted-foreground dark:text-gray-400"
                            initial={{ opacity: 0.8 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                          >
                            <Clock className="w-4 h-4 mr-1" />
                            {timeLeft > 0 ? (
                              <span>
                                {hoursLeft}h {minutesLeft}m left
                              </span>
                            ) : (
                              <span className="text-red-500 dark:text-red-400">Expired</span>
                            )}
                          </motion.div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 bg-gray-50 dark:bg-gray-800/80 flex flex-col gap-2">
                        <div className="flex gap-2 w-full">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex-1">
                                <Button
                                  onClick={() => {
                                    setSelectedRequest(request)
                                    setIsOfferHelpOpen(true)
                                  }}
                                  className={`w-full transition-all duration-300 ${
                                    timeLeft <= 0 || !!request.helper || request.userId === user?.id
                                      ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                                      : "bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 transform hover:-translate-y-1 hover:shadow-lg"
                                  } text-white`}
                                  disabled={timeLeft <= 0 || !!request.helper || request.userId === user?.id}
                                >
                                  <AnimatePresence mode="wait">
                                    <motion.span
                                      key={request.helper ? "offered" : "offer"}
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -20 }}
                                      className="flex items-center justify-center"
                                    >
                                      {request.helper ? "Help Offered" : "Offer Help"}
                                    </motion.span>
                                  </AnimatePresence>
                                </Button>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              {timeLeft <= 0 ? (
                                <p>This request has expired</p>
                              ) : request.helper ? (
                                <p>Someone has already offered to help</p>
                              ) : request.userId === user?.id ? (
                                <p>This is your own request</p>
                              ) : (
                                <p>Click to offer help</p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                          {canChat && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={() => {
                                    setSelectedRequest(request)
                                    setIsChatOpen(true)
                                  }}
                                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                                >
                                  <MessageCircle className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Chat with {request.userId === user?.id ? 'helper' : 'requester'}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {isNewRequestOpen && (
          <NewRequestDialog
            open={isNewRequestOpen}
            onOpenChange={setIsNewRequestOpen}
            onSubmit={handleNewRequest}
          />
        )}
        {isOfferHelpOpen && (
          <OfferHelpDialog
            open={isOfferHelpOpen}
            onOpenChange={setIsOfferHelpOpen}
            onConfirm={() => handleOfferHelp(selectedRequest!)}
            request={selectedRequest}
            isLoading={isLoading}
          />
        )}
        {isHelpOfferedOpen && (
          <HelpOfferedDialog 
            open={isHelpOfferedOpen}
            onOpenChange={setIsHelpOfferedOpen}
          />
        )}
        {selectedRequest && (
          <ChatDialog
            open={isChatOpen}
            onOpenChange={setIsChatOpen}
            requestId={selectedRequest.id}
            recipientId={selectedRequest.userId === user?.id ? selectedRequest.helper! : selectedRequest.userId}
            recipientName={selectedRequest.name}
          />
        )}
        <Dialog open={showDescription} onOpenChange={setShowDescription}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{selectedRequest?.name}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className={`p-2 rounded-lg ${selectedRequest ? categoryColors[selectedRequest.category as keyof typeof categoryColors] : ''}`}>
                  {selectedRequest && (
                    <div className="w-5 h-5 text-white">
                      {(() => {
                        const IconComponent = categoryIcons[selectedRequest.category as keyof typeof categoryIcons] || HeartHandshake;
                        return <IconComponent />;
                      })()}
                    </div>
                  )}
                </div>
                <span className="font-semibold text-lg">{selectedRequest?.category}</span>
                <span className="text-sm text-muted-foreground">· {selectedRequest?.userName || "Anonymous"}</span>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedRequest?.description}</p>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowDescription(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Help Request</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this help request? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Request</AlertDialogCancel>
              <AlertDialogAction onClick={confirmCancel} className="bg-red-500 hover:bg-red-600">
                Yes, Cancel Request
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  )
}
