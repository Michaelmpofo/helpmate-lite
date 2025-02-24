"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useHelpRequests } from "@/contexts/help-requests-context"
import { useAuth } from "@/contexts/auth-context"
import { HelpRequest } from "@/types"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

type HelpOfferedDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HelpOfferedDialog({ open, onOpenChange }: HelpOfferedDialogProps) {
  const { requests, updateRequests, completeRequest } = useHelpRequests()
  const { user } = useAuth()
  const [offeredHelp, setOfferedHelp] = useState<HelpRequest[]>([])
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [confirmComplete, setConfirmComplete] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null)

  useEffect(() => {
    if (user && requests) {
      setOfferedHelp(requests.filter((r) => r.helper === user.id))
    }
  }, [requests, user])

  const cancelHelp = (id: number) => {
    updateRequests(requests.map((r) => (r.id === id ? { ...r, helper: null, helperName: undefined } : r)))
    toast.success("Help offer cancelled successfully")
    if (offeredHelp.length === 1) {
      onOpenChange(false)
    }
  }

  const handleCancelClick = (id: number) => {
    setSelectedRequestId(id)
    setConfirmCancel(true)
  }

  const handleCompleteClick = (id: number) => {
    setSelectedRequestId(id)
    setConfirmComplete(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Your Offered Help</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {!user ? (
              <p>Please log in to view your offered help.</p>
            ) : offeredHelp.length === 0 ? (
              <p>You haven't offered any help yet.</p>
            ) : (
              offeredHelp.map((help) => (
                <div key={help.id} className="mb-4 p-4 border rounded-lg">
                  <h3 className="font-semibold">{help.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{help.description}</p>
                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold text-sm">Contact Information:</h4>
                    <p className="text-sm">Email: {help.email}</p>
                    <p className="text-sm">Phone: {help.phone}</p>
                    {help.whatsapp && (
                      <p className="text-sm">WhatsApp: {help.whatsapp}</p>
                    )}
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                      onClick={() => handleCompleteClick(help.id)}
                    >
                      Mark as Complete
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelClick(help.id)}
                    >
                      Cancel Help
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          <DialogFooter className="flex justify-end">
            <Button 
              onClick={() => {
                onOpenChange(false)
                toast.success("Great! You can view your offered help anytime from the menu.")
              }}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
            >
              Okay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmCancel}
        onOpenChange={setConfirmCancel}
        title="Cancel Help Offer"
        description="Are you sure you want to cancel your offer to help? This action cannot be undone."
        confirmText="Cancel Help"
        cancelText="Keep Helping"
        variant="success"
        onConfirm={() => {
          if (selectedRequestId) {
            cancelHelp(selectedRequestId)
            setConfirmCancel(false)
            setSelectedRequestId(null)
          }
        }}
      />

      <ConfirmDialog
        open={confirmComplete}
        onOpenChange={setConfirmComplete}
        title="Complete Help Request"
        description="Are you sure you want to mark this help request as complete? This will remove the request card and notify the requester. This action cannot be undone."
        confirmText="It's Complete"
        cancelText="Not Complete"
        variant="success"
        onConfirm={() => {
          if (selectedRequestId) {
            completeRequest(selectedRequestId)
            setConfirmComplete(false)
            setSelectedRequestId(null)
            if (offeredHelp.length === 1) {
              onOpenChange(false)
            }
          }
        }}
      />
    </>
  )
}
