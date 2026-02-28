"use client";

import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NextImage from "next/image";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Camera, Loader2, Settings, User, Phone, Check } from "lucide-react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const user = useQuery(api.users.currentUser);
  const updateUser = useMutation(api.users.updateUser);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const deleteUser = useMutation(api.users.deleteUser);
  const { signOut } = useAuthActions();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 2 ميجابايت");
      return;
    }

    // Create preview URL
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPendingImage(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let imageId = undefined;

      // If there's a pending image, upload it first
      if (pendingImage) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": pendingImage.type },
          body: pendingImage,
        });

        if (!result.ok) throw new Error("Upload failed");
        const { storageId } = await result.json();
        imageId = storageId;
      }

      await updateUser({
        name,
        phone,
        ...(imageId && { image: imageId }),
      });

      toast.success("تم حفظ التعديلات بنجاح");
      setPendingImage(null);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء حفظ التعديلات");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteUser();
      await signOut();
      toast.success("تم حذف الحساب بنجاح");
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء حذف الحساب");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-w-[400px] p-0 overflow-hidden bg-white rounded-[24px] sm:rounded-[32px] gap-0 rtl"
          dir="rtl"
        >
          <DialogHeader className="p-5 border-b bg-muted/5">
            <DialogTitle className="text-xl font-black flex items-center gap-3">
              <Settings className="w-6 h-6 text-primary" />
              إعدادات الحساب
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="p-6 space-y-6">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-muted/30 transition-all group-hover:border-primary">
                  {previewUrl || user?.image ? (
                    <NextImage
                      src={previewUrl || user!.image!}
                      alt={user?.name || "User"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <NextImage
                      src="/default.jpg"
                      alt="Default User"
                      fill
                      className="object-cover opacity-60"
                    />
                  )}
                  {isSaving && pendingImage && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isSaving}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center border-2 border-white shadow-lg active:scale-95 transition-all"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                اضغط على الأيقونة لتغيير الصورة الشخصية
              </p>
            </div>

            <div className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-bold mr-1">
                  الاسم بالكامل
                </Label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="أدخل اسمك"
                    className="pr-10 h-12 rounded-xl border-muted-foreground/20 focus-visible:ring-primary/20"
                    required
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-bold mr-1">
                  رقم الهاتف
                </Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01xxxxxxxxx"
                    className="pr-10 h-12 rounded-xl border-muted-foreground/20 focus-visible:ring-primary/20"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <Button
                type="submit"
                disabled={isSaving || isDeleting}
                className="w-full h-12 rounded-xl font-medium text-base bg-primary hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Check className="w-5 h-5" />
                )}
                {isSaving ? "جاري الحفظ..." : "حفظ التعديلات"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                disabled={isSaving || isDeleting}
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full h-12 rounded-xl font-medium text-sm border hover:border-destructive/50 text-red-500 hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                حذف الحساب نهائياً
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="rounded-[24px] gap-6 rtl" dir="rtl">
          <AlertDialogHeader className="text-right">
            <AlertDialogTitle className="text-xl font-bold">
              هل أنت متأكد من حذف الحساب؟
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع بياناتك وقائمة
              المفضلة الخاصة بك بشكل نهائي من خوادمنا.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-3 sm:gap-3">
            <AlertDialogCancel className="mt-0 rounded-xl hover:bg-muted/75 h-11 px-6">
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 rounded-xl h-11 px-6"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
              ) : null}
              نعم، احذف الحساب
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
