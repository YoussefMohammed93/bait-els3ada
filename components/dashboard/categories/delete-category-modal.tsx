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

interface DeleteCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryName: string;
  onConfirm: () => void;
}

export function DeleteCategoryModal({
  open,
  onOpenChange,
  categoryName,
  onConfirm,
}: DeleteCategoryModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm p-0 gap-0 rounded-2xl overflow-hidden">
        <AlertDialogHeader className="p-6 pb-4 border-b bg-muted/30">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <AlertDialogTitle className="text-lg font-bold text-foreground">
                حذف الفئة
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs font-medium text-muted-foreground mt-0.5">
                لا يمكن التراجع عن هذا الإجراء
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="p-6 space-y-5">
          <p className="text-sm text-muted-foreground font-medium">
            هل أنتِ متأكدة من حذف فئة{" "}
            <span className="font-bold text-foreground">{categoryName}</span>؟
            سيتم حذف هذه الفئة نهائياً.
          </p>

          <AlertDialogFooter className="flex gap-3 sm:gap-3">
            <AlertDialogAction
              onClick={onConfirm}
              className="flex-1 rounded-xl h-10 font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              نعم
            </AlertDialogAction>
            <AlertDialogCancel className="flex-1 rounded-xl h-10 font-bold mt-0">
              إلغاء
            </AlertDialogCancel>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
