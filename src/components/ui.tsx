import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import type { Page } from "@/lib/nav";

export function Card({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className={cn(
        "w-full rounded-3xl bg-white text-left shadow-sm ring-1 ring-black/5",
        onClick &&
          "transition active:scale-[0.98] hover:shadow-md hover:ring-nuur-200 cursor-pointer",
        className
      )}
    >
      {children}
    </Comp>
  );
}

// Arapça metin bloğu (sağdan sola)
export function ArabicText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      dir="rtl"
      lang="ar"
      className={cn("font-arabic text-3xl leading-loose text-nuur-900", className)}
    >
      {children}
    </p>
  );
}

// Alt sayfa başlığı + geri butonu
export function BackHeader({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
}) {
  return (
    <div className="flex items-center gap-3 pb-5 pt-1">
      <button
        onClick={onBack}
        aria-label="Geri"
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-nuur-800 shadow-sm ring-1 ring-black/5 transition active:scale-95"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-extrabold text-nuur-900">{title}</h1>
        {subtitle && <p className="truncate text-base text-nuur-600">{subtitle}</p>}
      </div>
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 px-1 text-lg font-bold uppercase tracking-wide text-nuur-500">
      {children}
    </h2>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-nuur-600">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-nuur-200 border-t-nuur-600" />
      {label && <p className="text-lg font-semibold">{label}</p>}
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-3xl bg-red-50 p-6 text-center ring-1 ring-red-200">
      <p className="text-5xl">📡</p>
      <p className="mt-3 text-xl font-bold text-red-700">Bağlantı hatası</p>
      <p className="mt-1 text-lg text-red-600">{message}</p>
    </div>
  );
}

export function Pill({
  children,
  tone = "nuur",
}: {
  children: ReactNode;
  tone?: "nuur" | "gold" | "red";
}) {
  const tones = {
    nuur: "bg-nuur-100 text-nuur-800",
    gold: "bg-gold-300/40 text-gold-600",
    red: "bg-red-100 text-red-700",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-sm font-bold", tones[tone])}>
      {children}
    </span>
  );
}

// Bir özelliğe gitmek için büyük dokunmatik buton
export function PrimaryButton({
  children,
  onClick,
  tone = "nuur",
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: "nuur" | "gold";
  className?: string;
}) {
  const tones = {
    nuur: "bg-nuur-700 text-white shadow-lg shadow-nuur-700/20",
    gold: "bg-gold-500 text-nuur-900 shadow-lg shadow-gold-500/30",
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-5 text-xl font-extrabold transition active:scale-[0.98]",
        tones[tone],
        className
      )}
    >
      {children}
    </button>
  );
}

export function pageName(p: Page): string {
  return {
    home: "Ana Sayfa",
    prayer: "Namaz Vakitleri",
    guide: "Namaz Rehberi",
    qibla: "Kıble Pusulası",
    tasbih: "Tesbihat",
    quran: "Kur'an-ı Kerim",
    asma: "Esmâül Hüsnâ",
    duas: "Günlük Dualar",
    wisdom: "Günün Âyeti",
  }[p];
}
