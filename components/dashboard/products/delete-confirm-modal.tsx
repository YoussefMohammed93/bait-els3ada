"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  open,
  onOpenChange,
  productName,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl max-w-md">
        <AlertDialogHeader>
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-2">
            <AlertTriangle className="size-8 text-destructive" />
          </div>
          <AlertDialogTitle className="text-lg font-bold text-foreground">
            هل أنت متأكد من حذف هذا المنتج؟
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground font-medium">
            سيتم حذف المنتج &quot;{productName}&quot; نهائياً ولا يمكن استرجاعه.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 mt-2">
          <AlertDialogAction
            onClick={onConfirm}
            className="flex-1 rounded-xl font-bold h-11 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            حذف المنتج
          </AlertDialogAction>
          <AlertDialogCancel className="flex-1 rounded-xl font-bold h-11 mt-0">
            إلغاء
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
