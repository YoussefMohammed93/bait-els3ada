import Link from "next/link";

import { ChevronRight, FileText } from "lucide-react";

import SiteHeader from "@/components/landing/landing-header";
import SiteFooter from "@/components/landing/landing-footer";

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              الرئيسية
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">شروط الخدمة</span>
          </nav>

          <div className="bg-card border rounded-2xl p-6 sm:p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-primary/10 rounded-xl">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  شروط الخدمة
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  آخر تحديث: {new Date().toLocaleDateString("ar-EG")}
                </p>
              </div>
            </div>

            <div className="prose prose-slate max-w-none dark:prose-invert space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 border-r-4 border-primary pr-4">
                  1. قبول الشروط
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  باستخدامك لموقع &quot;بيت السعادة&quot;، فإنك توافق على
                  الالتزام بشروط الخدمة هذه. إذا كنت لا توافق على أي جزء من هذه
                  الشروط، يرجى عدم استخدام الموقع.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 border-r-4 border-primary pr-4">
                  2. استخدام الموقع
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  يتحمل المستخدم مسؤولية الحفاظ على سرية معلومات حسابه وكلمة
                  المرور. كما يتعهد باستخدام الموقع لأغراض قانونية فقط وعدم
                  محاولة الإضرار بالموقع أو مستخدميه.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 border-r-4 border-primary pr-4">
                  3. الطلبات والأسعار
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  نحن نسعى جاهدين لضمان دقة الأسعار وتوافر المنتجات. ومع ذلك،
                  نحتفظ بالحق في إلغاء أو رفض أي طلب في حالة وجود خطأ في السعر
                  أو توافر المنتج أو أي شك في وجود احتيال.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 border-r-4 border-primary pr-4">
                  4. الملكية الفكرية
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  جميع المحتويات الموجودة على الموقع، بما في ذلك التصاميم
                  والشعارات والنصوص والصور، هي ملك لـ &quot;بيت السعادة&quot;
                  ومحمية بموجب قوانين الملكية الفكرية.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 border-r-4 border-primary pr-4">
                  5. حدود المسؤولية
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  &quot;بيت السعادة&quot; غير مسؤول عن أي أضرار مباشرة أو غير
                  مباشرة تنشأ عن استخدام أو عدم القدرة على استخدام الموقع أو
                  المنتجات المشتراة من خلاله.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 border-r-4 border-primary pr-4">
                  6. التعديلات
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم نشر أي تغييرات
                  على هذه الصفحة، ويعتبر استمرارك في استخدام الموقع بمثابة قبول
                  للشروط المحدثة.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
