"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "destructive" | "success"
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "destructive"
}: ConfirmDialogProps) {
  const isCancel = confirmText.toLowerCase().includes("cancel")
  const isNegative = cancelText.toLowerCase().includes("not") || cancelText.toLowerCase().includes("cancel")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground">{description}</p>
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className={isNegative ? "text-red-500 hover:text-red-600 hover:bg-red-50" : variant === "success" ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white" : undefined}
          >
            {cancelText}
          </Button>
          <Button
            variant={isCancel ? "destructive" : "outline"}
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
            className={!isCancel && variant === "success" ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white" : undefined}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
