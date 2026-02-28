"use client";

import Image from "next/image";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X, ImagePlus, Plus } from "lucide-react";

const MAX_GALLERY_IMAGES = 5;

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  image: string;
  images: string[];
}

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: ProductFormData | null;
  onSave: (data: ProductFormData) => void;
  isLoading?: boolean;
  categories?: { value: string; label: string }[];
}

export function AddProductModal({
  open,
  onOpenChange,
  editData,
  onSave,
  isLoading,
  categories: customCategories,
}: AddProductModalProps) {
  const categoriesList = customCategories || [];
  const isEdit = !!editData;

  const [form, setForm] = React.useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
    images: [],
  });

  const [errors, setErrors] = React.useState<Partial<Record<string, boolean>>>(
    {},
  );

  React.useEffect(() => {
    if (editData) {
      setForm({ ...editData, images: editData.images ?? [] });
    } else {
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: "",
        images: [],
      });
    }
    setErrors({});
  }, [editData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<string, boolean>> = {};
    if (!form.name.trim()) newErrors.name = true;
    if (!form.price.trim()) newErrors.price = true;
    if (!form.category) newErrors.category = true;
    if (!form.stock.trim()) newErrors.stock = true;
    if (!form.image) newErrors.image = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(form);
    onOpenChange(false);
  };

  const updateField = (field: keyof ProductFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: false }));
  };

  // ── Main image file input ──
  const mainImageRef = React.useRef<HTMLInputElement>(null);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField("image", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // reset so the same file can be re-selected
    e.target.value = "";
  };

  // ── Gallery images file input ──
  const galleryInputRef = React.useRef<HTMLInputElement>(null);

  const handleGalleryImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && form.images.length < MAX_GALLERY_IMAGES) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, reader.result as string],
        }));
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const removeGalleryImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-w-lg max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-lg font-bold text-foreground">
            {isEdit ? "تعديل المنتج" : "إضافة منتج جديد"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground font-medium">
            {isEdit
              ? "عدّل بيانات المنتج ثم احفظ التغييرات"
              : "أدخل بيانات المنتج الجديد لإضافته إلى المتجر"}
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-5">
          {/* اسم المنتج */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">
              اسم المنتج <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="مثال: كريم مرطب طبيعي"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className={`rounded-xl h-11 font-medium ${
                errors.name
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
            />
            {errors.name && (
              <p className="text-xs text-destructive font-medium">
                اسم المنتج مطلوب
              </p>
            )}
          </div>

          {/* وصف المنتج */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">
              وصف المنتج
            </label>
            <textarea
              placeholder="أدخل وصف المنتج..."
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={4}
              className="flex w-full rounded-xl border border-input bg-transparent px-3 py-2.5 text-sm font-medium transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
          </div>

          {/* السعر + الكمية */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">
                السعر (ج.م) <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                className={`rounded-xl h-11 font-medium ${
                  errors.price
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
              />
              {errors.price && (
                <p className="text-xs text-destructive font-medium">
                  السعر مطلوب
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">
                الكمية في المخزون <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                placeholder="0"
                value={form.stock}
                onChange={(e) => updateField("stock", e.target.value)}
                className={`rounded-xl h-11 font-medium ${
                  errors.stock
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
              />
              {errors.stock && (
                <p className="text-xs text-destructive font-medium">
                  الكمية مطلوبة
                </p>
              )}
            </div>
          </div>

          {/* التصنيف */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">
              التصنيف <span className="text-destructive">*</span>
            </label>
            <Select
              value={form.category}
              onValueChange={(v) => updateField("category", v)}
            >
              <SelectTrigger
                className={`rounded-xl h-11 font-bold ${
                  errors.category ? "border-destructive" : ""
                }`}
              >
                <SelectValue placeholder="اختر التصنيف" />
              </SelectTrigger>
              <SelectContent>
                {categoriesList.map((c: { value: string; label: string }) => (
                  <SelectItem
                    key={c.value}
                    value={c.value}
                    className="font-bold"
                  >
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-destructive font-medium">
                التصنيف مطلوب
              </p>
            )}
          </div>

          {/* ═══════════════════════════════════════════════ */}
          {/* الصورة الرئيسية (مطلوبة) */}
          {/* ═══════════════════════════════════════════════ */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">
              الصورة الرئيسية <span className="text-destructive">*</span>
            </label>
            <input
              type="file"
              ref={mainImageRef}
              className="hidden"
              accept="image/*"
              onChange={handleMainImageChange}
            />

            {form.image ? (
              <div
                className="relative aspect-video rounded-2xl overflow-hidden border-2 border-muted bg-muted group cursor-pointer"
                onClick={() => mainImageRef.current?.click()}
              >
                <Image
                  src={form.image}
                  alt="الصورة الرئيسية"
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                    <ImagePlus className="size-6 text-white" />
                  </div>
                  <span className="text-sm font-bold text-white">
                    تغيير الصورة
                  </span>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-3 left-3 size-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateField("image", "");
                  }}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => mainImageRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group ${
                  errors.image
                    ? "border-destructive/50 bg-destructive/5"
                    : "border-muted-foreground/20"
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Upload className="size-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-bold text-foreground">
                      اختر الصورة الرئيسية للمنتج
                    </p>
                    <p className="text-xs text-muted-foreground max-w-[220px] mx-auto">
                      اسحب الصورة هنا أو اضغط للاختيار (PNG, JPG حتى 5 ميغابايت)
                    </p>
                  </div>
                </div>
              </div>
            )}
            {errors.image && (
              <p className="text-xs text-destructive font-medium">
                الصورة الرئيسية مطلوبة
              </p>
            )}
          </div>

          {/* ═══════════════════════════════════════════════ */}
          {/* صور إضافية (اختيارية) */}
          {/* ═══════════════════════════════════════════════ */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-foreground">
                صور إضافية{" "}
                <span className="text-muted-foreground font-medium">
                  (اختياري)
                </span>
              </label>
              <span className="text-xs text-muted-foreground font-medium">
                {form.images.length}/{MAX_GALLERY_IMAGES}
              </span>
            </div>
            <input
              type="file"
              ref={galleryInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleGalleryImageAdd}
            />

            <div className="grid grid-cols-3 gap-3">
              {/* Existing gallery images */}
              {form.images.map((img, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden border bg-muted group"
                >
                  <Image
                    src={img}
                    alt={`صورة ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-1.5 left-1.5 size-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeGalleryImage(index)}
                  >
                    <X className="size-3" />
                  </Button>
                </div>
              ))}

              {/* Add more button */}
              {form.images.length < MAX_GALLERY_IMAGES && (
                <div
                  onClick={() => galleryInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group"
                >
                  <Plus className="size-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors">
                    إضافة صورة
                  </span>
                </div>
              )}
            </div>
          </div>
          {/* Buttons */}
          <DialogFooter className="gap-3 pt-2">
            <Button
              type="submit"
              className="flex-1 rounded-xl font-bold h-11"
              disabled={isLoading}
            >
              {isLoading
                ? "جاري الحفظ..."
                : isEdit
                  ? "حفظ التعديلات"
                  : "حفظ المنتج"}
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-xl font-bold h-11"
                disabled={isLoading}
              >
                إلغاء
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
