"use client";

import Image from "next/image";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImagePlus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface CategoryFormData {
  name: string;
  image: string;
}

interface AddCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CategoryFormData) => void;
  editData?: CategoryFormData | null;
  isLoading?: boolean;
}

export function AddCategoryModal({
  open,
  onOpenChange,
  onSave,
  editData,
  isLoading,
}: AddCategoryModalProps) {
  const [name, setName] = React.useState("");
  const [image, setImage] = React.useState("");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setName(editData?.name ?? "");
      setImage(editData?.image ?? "");
    }
  }, [open, editData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), image });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 rounded-2xl overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b bg-muted/30">
          <DialogTitle className="text-lg font-bold text-foreground">
            {editData ? "تعديل الفئة" : "إضافة فئة جديدة"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Category Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">
              اسم الفئة
            </label>
            <Input
              placeholder="مثال: ساعات، هدايا، إكسسوارات..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl h-11 font-medium"
              autoFocus
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">
              صورة الفئة
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {image ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border bg-muted/20">
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-2 left-2 flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <ImagePlus className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setImage("")}
                    className="p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-video rounded-xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center gap-2 text-muted-foreground bg-muted/10 hover:bg-muted/20 transition-colors"
              >
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <ImagePlus className="size-8" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground">
                    اضغطي لرفع صورة
                  </p>
                  <p className="text-xs font-medium mt-1">
                    PNG, JPG أو WebP (الحد الأقصى 5MB)
                  </p>
                </div>
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={!name.trim() || isLoading}
              className="flex-1 rounded-xl h-11 font-bold"
            >
              {isLoading
                ? "جاري الحفظ..."
                : editData
                  ? "حفظ التعديلات"
                  : "إضافة الفئة"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => onOpenChange(false)}
              className="rounded-xl h-11 font-bold"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
