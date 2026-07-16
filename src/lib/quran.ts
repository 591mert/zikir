export interface AyahFull {
  number: number; // global ayah number
  numberInSurah: number;
  arabic: string;
  turkish: string;
  audio: string; // mp3 URL
}

export interface SurahFull {
  id: number;
  name: string;
  arabicName: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: AyahFull[];
}

interface ApiAyah {
  number: number;
  numberInSurah: number;
  text: string;
  audio?: string;
}

// Sûrenin Arapça (Osmanlı) metnini, Türkçe (Diyanet) mealini ve
// ses (Mişerî Âlafâsî) dosyalarını tek istekte getirir.
export async function fetchSurah(num: number): Promise<SurahFull> {
  const url = `https://api.alquran.cloud/v1/surah/${num}/editions/quran-uthmani,tr.diyanet,ar.alafasy`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Sûre alınamadı.");
  const json = await res.json();
  const editions = json.data as { ayahs: ApiAyah[]; number: number; name: string; englishName: string; englishNameTranslation: string; revelationType: string; numberOfAyahs: number }[];

  const arabic = editions[0].ayahs;
  const turkish = editions[1].ayahs;
  const audio = editions[2].ayahs;

  const ayahs: AyahFull[] = arabic.map((a, i) => ({
    number: a.number,
    numberInSurah: a.numberInSurah,
    arabic: a.text,
    turkish: turkish[i]?.text ?? "",
    audio: audio[i]?.audio ?? "",
  }));

  return {
    id: editions[0].number,
    name: editions[0].englishName,
    arabicName: editions[0].name,
    revelationType: editions[0].revelationType,
    numberOfAyahs: editions[0].numberOfAyahs,
    ayahs,
  };
}

// "2:255" gibi bir referans için tek âyetin ses URL'sini getirir (dualar için).
export const audioCache = new Map<string, string>();
export async function fetchAyahAudio(ref: string): Promise<string | null> {
  if (audioCache.has(ref)) return audioCache.get(ref)!;
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/ayah/${ref}/ar.alafasy`);
    if (!res.ok) return null;
    const json = await res.json();
    const audio = json?.data?.audio ?? null;
    if (audio) audioCache.set(ref, audio);
    return audio;
  } catch {
    return null;
  }
}

// Uygulama açılırken/component mount'ta ses URL'lerini önceden getirir.
// Böylece kullanıcı butona tıkladığında beklemeye gerek kalmaz (Android gesture sorununu çözer).
export function preFetchAyahAudio(refs: string[]): void {
  for (const ref of refs) {
    if (!audioCache.has(ref)) {
      fetchAyahAudio(ref).catch(() => {});
    }
  }
}
