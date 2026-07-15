export type Page =
  | "home"
  | "prayer"
  | "guide"
  | "qibla"
  | "tasbih"
  | "quran"
  | "asma"
  | "duas"
  | "wisdom";

export interface PageMeta {
  id: Page;
  title: string;
  subtitle: string;
  icon: string;
}

// Tüm özellikler (Ana sayfada kart olarak gösterilir)
export const allPages: PageMeta[] = [
  { id: "prayer", title: "Namaz Vakitleri", subtitle: "Bugünün vakitleri", icon: "🕌" },
  { id: "guide", title: "Namaz Rehberi", subtitle: "Abdest & kılınış", icon: "📐" },
  { id: "qibla", title: "Kıble Pusulası", subtitle: "Yönü bulun", icon: "🧭" },
  { id: "tasbih", title: "Tesbihat", subtitle: "Zikir sayacı", icon: "📿" },
  { id: "quran", title: "Kur'an-ı Kerim", subtitle: "114 sûre · dinle", icon: "📖" },
  { id: "asma", title: "Esmâül Hüsnâ", subtitle: "99 güzel isim", icon: "✨" },
  { id: "duas", title: "Günlük Dualar", subtitle: "Hayatın her ânı", icon: "🤲" },
  { id: "wisdom", title: "Günün Âyeti & Hadisi", subtitle: "Günlük ilham", icon: "🌙" },
];
