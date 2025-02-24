"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingCart, Book, Wrench, HeartHandshake, Keyboard } from "lucide-react"

export default function HelpGuideDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text">
            Help Guide
          </DialogTitle>
          <DialogDescription>
            Learn how to use the Community Help Board effectively
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="relative h-[calc(80vh-8rem)]">
          <div className="space-y-6 pr-6">
            <section>
              <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
              <p className="text-muted-foreground mb-4">
                Welcome to the Community Help Board! This platform connects people who need help with those who can offer it.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Categories</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-pink-500" />
                  <span>Errands - Help with shopping, deliveries, and other tasks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Book className="w-5 h-5 text-blue-500" />
                  <span>Tutoring - Academic help and knowledge sharing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-green-500" />
                  <span>Repairs - Help with fixing things</span>
                </div>
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-purple-500" />
                  <span>Tech Support - Help with computers and technology</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Keyboard Shortcuts</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-gray-500" />
                  <span><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl/⌘ + N</kbd> Create new request</span>
                </div>
                <div className="flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-gray-500" />
                  <span><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl/⌘ + F</kbd> Focus search</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Creating a Request</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Click the "New Request" button or use <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl/⌘ + N</kbd></li>
                <li>Fill in the request details including category and deadline</li>
                <li>Add your contact information for helpers to reach you</li>
                <li>Submit the request and wait for offers</li>
              </ol>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Offering Help</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Browse through requests or use search to find relevant ones</li>
                <li>Click "Offer Help" on a request you'd like to help with</li>
                <li>The requester will be notified and can accept your offer</li>
                <li>Once accepted, you can chat with the requester</li>
              </ol>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Tips</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Keep an eye on the notification bell for updates</li>
                <li>Use the search bar to find specific types of requests</li>
                <li>Check the time remaining on requests before offering help</li>
                <li>Be responsive in chat once connected</li>
              </ul>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
