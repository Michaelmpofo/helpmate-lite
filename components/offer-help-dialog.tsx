import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { HelpRequest } from "@/types"

type OfferHelpDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  request: HelpRequest | null
  isLoading: boolean
}

export default function OfferHelpDialog({ open, onOpenChange, onConfirm, request, isLoading }: OfferHelpDialogProps) {
  if (!request) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Confirm Offer to Help</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{request.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground dark:text-gray-400">{request.description}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Contact Information:</h4>
            <div className="space-y-2 text-sm">
              <p className="flex items-center">
                <span className="w-20 font-medium">Email:</span>
                <span className="text-muted-foreground dark:text-gray-400">{request.email}</span>
              </p>
              <p className="flex items-center">
                <span className="w-20 font-medium">Phone:</span>
                <span className="text-muted-foreground dark:text-gray-400">{request.phone}</span>
              </p>
              {request.whatsapp && (
                <p className="flex items-center">
                  <span className="w-20 font-medium">WhatsApp:</span>
                  <span className="text-muted-foreground dark:text-gray-400">{request.whatsapp}</span>
                </p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
