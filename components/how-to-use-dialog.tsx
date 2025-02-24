import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

type HowToUseDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function HowToUseDialog({ open, onOpenChange }: HowToUseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>How to Use Community Help Board</DialogTitle>
        </DialogHeader>
        <ScrollArea className="relative h-[calc(80vh-8rem)] pr-6">
          <div className="space-y-4 pr-4">
            <div>
              <h3 className="font-semibold mb-2">1. Getting Started</h3>
              <p className="text-sm text-muted-foreground">
                Sign up or log in to access all features. You'll need to provide your contact information (email, phone, and WhatsApp) during registration.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">2. Requesting Help</h3>
              <p className="text-sm text-muted-foreground">
                Click the "New Request" button to create a help request. Provide a clear title, description, and deadline for your request.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">3. Offering Help</h3>
              <p className="text-sm text-muted-foreground">
                Browse through requests and click "Offer Help" on any request you'd like to help with. You'll see the requester's contact information to coordinate.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">4. Managing Your Offers</h3>
              <p className="text-sm text-muted-foreground">
                View your offered help by clicking the clipboard icon. You can cancel your offer if needed.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">5. Contact & Communication</h3>
              <p className="text-sm text-muted-foreground">
                Once you offer help, you'll have access to the requester's contact information (email, phone, and WhatsApp) to coordinate directly.
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
