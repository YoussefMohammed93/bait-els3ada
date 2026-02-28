import Link from "next/link";

import { ChevronRight, ShieldCheck } from "lucide-react";

import SiteHeader from "@/components/landing/landing-header";
import SiteFooter from "@/components/landing/landing-footer";

export default function PrivacyPage() {
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
            <span className="text-foreground font-medium">سياسة الخصوصية</span>
          </nav>

          <div className="bg-card border rounded-2xl p-6 sm:p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-primary/10 rounded-xl">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  سياسة الخصوصية
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  آخر تحديث: {new Date().toLocaleDateString("ar-EG")}
                </p>
              </div>
            </div>

            <div className="prose prose-slate max-w-none dark:prose-invert space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 border-r-4 border-primary pr-4">
                  1. مقدمة
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  مرحباً بكم في &quot;بيت السعادة&quot;. نحن نحترم خصوصيتكم
                  ونلتزم بحماية بياناتكم الشخصية. توضح سياسة الخصوصية هذه كيفية
                  جمع واستخدام وتأمين معلوماتكم عند استخدام موقعنا.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 border-r-4 border-primary pr-4">
                  2. المعلومات التي نجمعها
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  عند استخدام ميزات تسجيل الدخول عبر Google أو Facebook، نقوم
                  بالوصول إلى المعلومات الأساسية التي تسمحون بها، مثل:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mr-4">
                  <li>الاسم الكامل</li>
                  <li>عنوان البريد الإلكتروني</li>
                  <li>الصورة الشخصية (اختياري)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 border-r-4 border-primary pr-4">
                  3. كيف نستخدم معلوماتكم
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  نستخدم هذه المعلومات فقط من أجل:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mr-4 mt-4">
                  <li>إنشاء وإدارة حسابكم الشخصي في المتجر.</li>
                  <li>تسهيل عملية الشراء وتتبع الطلبات.</li>
                  <li>التواصل معكم بشأن طلباتكم أو تحديثات الخدمة.</li>
                  <li>تحسين تجربة التسوق الخاصة بكم.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 border-r-4 border-primary pr-4">
                  4. حماية البيانات
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  نحن نطبق إجراءات أمنية تقنية وتنظيمية مناسبة لحماية بياناتكم
                  من الوصول غير المصرح به أو الإفصاح أو التغيير أو التدمير. يتم
                  تخزين جميع البيانات بشكل آمن عبر خدمات Convex المشفرة.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 border-r-4 border-primary pr-4">
                  5. حقوقكم
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  لكم الحق في الوصول إلى بياناتكم الشخصية أو تصحيحها أو طلب
                  حذفها في أي وقت عبر إعدادات الحساب أو بالتواصل معنا مباشرة.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 border-r-4 border-primary pr-4">
                  6. التواصل معنا
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  إذا كان لديكم أي استفسارات حول سياسة الخصوصية، يرجى التواصل
                  معنا عبر الواتساب أو الفيسبوك الموضحين في أسفل الصفحة.
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
