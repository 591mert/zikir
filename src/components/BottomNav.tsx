import { cn } from "@/utils/cn";
import type { Page } from "@/lib/nav";

const ITEMS: { id: Page; label: string; icon: string }[] = [
  { id: "home", label: "Ana Sayfa", icon: "🏠" },
  { id: "prayer", label: "Namaz", icon: "🕌" },
  { id: "qibla", label: "Kıble", icon: "🧭" },
  { id: "tasbih", label: "Tesbih", icon: "📿" },
  { id: "duas", label: "Dualar", icon: "🤲" },
];

export default function BottomNav({
  page,
  setPage,
}: {
  page: Page;
  setPage: (p: Page) => void;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-nuur-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-stretch justify-between px-1 pb-[env(safe-area-inset-bottom)]">
        {ITEMS.map((it) => {
          const active = page === it.id;
          return (
            <button
              key={it.id}
              onClick={() => setPage(it.id)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 transition",
                active ? "text-nuur-800" : "text-nuur-400"
              )}
            >
              <span
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-2xl text-2xl transition",
                  active ? "scale-110 bg-nuur-100" : "scale-100"
                )}
              >
                {it.icon}
              </span>
              <span className="text-xs font-bold">{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
