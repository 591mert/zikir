import { asmaNames } from "@/data/asma";
import { BackHeader, Card } from "@/components/ui";

export default function Asma({ onBack }: { onBack: () => void }) {
  return (
    <div className="animate-fade space-y-5">
      <BackHeader title="Esmâül Hüsnâ" subtitle="Allah'ın 99 güzel ismi" onBack={onBack} />

      <Card className="bg-gradient-to-br from-nuur-700 to-nuur-900 p-5 text-white ring-0">
        <p className="text-xl font-bold">✨ Allah'ın en güzel isimleri</p>
        <p className="mt-1 text-base text-white/80">
          "En güzel isimler Allah'ındır. O halde O'na o güzel isimlerle dua edin." (A'râf, 180)
        </p>
        <p className="mt-3 rounded-2xl bg-white/10 p-3 text-base">
          Peygamberimiz (s.a.s.) şöyle buyurmuştur: "Allah'ın 99 ismi vardır. Bunları sayan
          (ezberleyip anlamını uygulayan) cennete girer."
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {asmaNames.map((n) => (
          <Card key={n.no} className="p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-nuur-50 text-sm font-black text-nuur-700">
                {n.no}
              </span>
              <div className="min-w-0">
                <p className="text-2xl font-extrabold text-nuur-900">{n.tr}</p>
              </div>
              <span dir="rtl" className="ml-auto font-arabic text-3xl text-nuur-800">
                {n.arabic}
              </span>
            </div>
            <p className="mt-2 text-lg leading-snug text-nuur-600">{n.meaning}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
