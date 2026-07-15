export interface TurkishCity {
  name: string;
  region: string;
  lat: number;
  lng: number;
}

// Türkiye'nin 81 ilinin tamamı (il merkezleri, doğru koordinatlar)
export const turkishCities: TurkishCity[] = [
  // Marmara Bölgesi
  { name: "Balıkesir", region: "Marmara", lat: 39.6484, lng: 27.8826 },
  { name: "Bilecik", region: "Marmara", lat: 40.1426, lng: 29.9793 },
  { name: "Bursa", region: "Marmara", lat: 40.1885, lng: 29.061 },
  { name: "Çanakkale", region: "Marmara", lat: 40.1553, lng: 26.4142 },
  { name: "Edirne", region: "Marmara", lat: 41.6764, lng: 26.5559 },
  { name: "İstanbul", region: "Marmara", lat: 41.0082, lng: 28.9784 },
  { name: "Kırklareli", region: "Marmara", lat: 41.7333, lng: 27.2167 },
  { name: "Kocaeli", region: "Marmara", lat: 40.8533, lng: 29.8815 },
  { name: "Sakarya", region: "Marmara", lat: 40.7569, lng: 30.3781 },
  { name: "Tekirdağ", region: "Marmara", lat: 40.9833, lng: 27.5167 },
  { name: "Yalova", region: "Marmara", lat: 40.65, lng: 29.2667 },

  // Ege Bölgesi
  { name: "Afyonkarahisar", region: "Ege", lat: 38.7507, lng: 30.5566 },
  { name: "Aydın", region: "Ege", lat: 37.8394, lng: 27.8456 },
  { name: "Denizli", region: "Ege", lat: 37.7765, lng: 29.0864 },
  { name: "İzmir", region: "Ege", lat: 38.4237, lng: 27.1428 },
  { name: "Kütahya", region: "Ege", lat: 39.4242, lng: 29.9833 },
  { name: "Manisa", region: "Ege", lat: 38.6191, lng: 27.4289 },
  { name: "Muğla", region: "Ege", lat: 37.2154, lng: 28.3636 },
  { name: "Uşak", region: "Ege", lat: 38.6823, lng: 29.4082 },

  // Akdeniz Bölgesi
  { name: "Adana", region: "Akdeniz", lat: 37.0, lng: 35.3213 },
  { name: "Antalya", region: "Akdeniz", lat: 36.8969, lng: 30.7133 },
  { name: "Burdur", region: "Akdeniz", lat: 37.7203, lng: 30.2908 },
  { name: "Hatay", region: "Akdeniz", lat: 36.2066, lng: 36.1572 },
  { name: "Isparta", region: "Akdeniz", lat: 37.7648, lng: 30.5566 },
  { name: "Mersin", region: "Akdeniz", lat: 36.8121, lng: 34.6415 },
  { name: "Kahramanmaraş", region: "Akdeniz", lat: 37.5858, lng: 36.6373 },
  { name: "Osmaniye", region: "Akdeniz", lat: 37.0742, lng: 36.2478 },

  // İç Anadolu Bölgesi
  { name: "Aksaray", region: "İç Anadolu", lat: 38.3687, lng: 34.037 },
  { name: "Ankara", region: "İç Anadolu", lat: 39.9334, lng: 32.8597 },
  { name: "Çankırı", region: "İç Anadolu", lat: 40.6013, lng: 33.6134 },
  { name: "Eskişehir", region: "İç Anadolu", lat: 39.7767, lng: 30.5206 },
  { name: "Karaman", region: "İç Anadolu", lat: 37.1759, lng: 33.2287 },
  { name: "Kayseri", region: "İç Anadolu", lat: 38.7312, lng: 35.4787 },
  { name: "Kırıkkale", region: "İç Anadolu", lat: 39.8468, lng: 33.5153 },
  { name: "Kırşehir", region: "İç Anadolu", lat: 39.1425, lng: 34.1709 },
  { name: "Konya", region: "İç Anadolu", lat: 37.8714, lng: 32.4847 },
  { name: "Nevşehir", region: "İç Anadolu", lat: 38.6939, lng: 34.6857 },
  { name: "Niğde", region: "İç Anadolu", lat: 37.9667, lng: 34.6833 },
  { name: "Sivas", region: "İç Anadolu", lat: 40.1866, lng: 37.3343 },
  { name: "Yozgat", region: "İç Anadolu", lat: 39.8181, lng: 34.8147 },

  // Karadeniz Bölgesi
  { name: "Amasya", region: "Karadeniz", lat: 40.6499, lng: 35.8353 },
  { name: "Artvin", region: "Karadeniz", lat: 41.1828, lng: 41.8183 },
  { name: "Bartın", region: "Karadeniz", lat: 41.6358, lng: 32.3375 },
  { name: "Bayburt", region: "Karadeniz", lat: 40.2552, lng: 40.2249 },
  { name: "Bolu", region: "Karadeniz", lat: 40.7392, lng: 31.6094 },
  { name: "Çorum", region: "Karadeniz", lat: 40.5499, lng: 34.9533 },
  { name: "Düzce", region: "Karadeniz", lat: 40.8438, lng: 31.1565 },
  { name: "Giresun", region: "Karadeniz", lat: 40.9128, lng: 38.3895 },
  { name: "Gümüşhane", region: "Karadeniz", lat: 40.4386, lng: 39.5086 },
  { name: "Karabük", region: "Karadeniz", lat: 41.2061, lng: 32.6204 },
  { name: "Kastamonu", region: "Karadeniz", lat: 41.3887, lng: 33.7867 },
  { name: "Ordu", region: "Karadeniz", lat: 40.9839, lng: 37.8797 },
  { name: "Rize", region: "Karadeniz", lat: 41.0201, lng: 40.5234 },
  { name: "Samsun", region: "Karadeniz", lat: 41.2867, lng: 36.33 },
  { name: "Sinop", region: "Karadeniz", lat: 42.0231, lng: 35.1531 },
  { name: "Tokat", region: "Karadeniz", lat: 40.3167, lng: 36.55 },
  { name: "Trabzon", region: "Karadeniz", lat: 41.0027, lng: 39.7168 },
  { name: "Zonguldak", region: "Karadeniz", lat: 41.4564, lng: 31.7987 },

  // Doğu Anadolu Bölgesi
  { name: "Ağrı", region: "Doğu Anadolu", lat: 39.7191, lng: 43.0503 },
  { name: "Ardahan", region: "Doğu Anadolu", lat: 41.1105, lng: 42.7022 },
  { name: "Bingöl", region: "Doğu Anadolu", lat: 38.8847, lng: 40.4986 },
  { name: "Bitlis", region: "Doğu Anadolu", lat: 38.4011, lng: 42.108 },
  { name: "Elazığ", region: "Doğu Anadolu", lat: 38.681, lng: 39.2264 },
  { name: "Erzincan", region: "Doğu Anadolu", lat: 39.7464, lng: 39.4914 },
  { name: "Erzurum", region: "Doğu Anadolu", lat: 39.9043, lng: 41.2679 },
  { name: "Hakkari", region: "Doğu Anadolu", lat: 37.5744, lng: 43.7408 },
  { name: "Iğdır", region: "Doğu Anadolu", lat: 39.9237, lng: 44.045 },
  { name: "Kars", region: "Doğu Anadolu", lat: 40.6013, lng: 43.0975 },
  { name: "Malatya", region: "Doğu Anadolu", lat: 38.3552, lng: 38.3095 },
  { name: "Muş", region: "Doğu Anadolu", lat: 38.7432, lng: 41.5065 },
  { name: "Tunceli", region: "Doğu Anadolu", lat: 39.1079, lng: 39.5401 },
  { name: "Van", region: "Doğu Anadolu", lat: 38.4942, lng: 43.38 },

  // Güneydoğu Anadolu Bölgesi
  { name: "Adıyaman", region: "Güneydoğu Anadolu", lat: 37.7644, lng: 38.2763 },
  { name: "Batman", region: "Güneydoğu Anadolu", lat: 37.8812, lng: 41.1351 },
  { name: "Diyarbakır", region: "Güneydoğu Anadolu", lat: 37.9144, lng: 40.2306 },
  { name: "Gaziantep", region: "Güneydoğu Anadolu", lat: 37.0662, lng: 37.3833 },
  { name: "Kilis", region: "Güneydoğu Anadolu", lat: 36.7184, lng: 37.1212 },
  { name: "Mardin", region: "Güneydoğu Anadolu", lat: 37.3122, lng: 40.734 },
  { name: "Siirt", region: "Güneydoğu Anadolu", lat: 37.9333, lng: 41.95 },
  { name: "Şanlıurfa", region: "Güneydoğu Anadolu", lat: 37.1674, lng: 38.7955 },
  { name: "Şırnak", region: "Güneydoğu Anadolu", lat: 37.5188, lng: 42.4537 },
];

// Bölge sırası (görüntüleme için)
export const REGION_ORDER: string[] = [
  "Marmara",
  "Ege",
  "Akdeniz",
  "İç Anadolu",
  "Karadeniz",
  "Doğu Anadolu",
  "Güneydoğu Anadolu",
];

// Türkçe karakterleri dikkate alarak il adına göre sıralama
export function sortCitiesTurkish(a: TurkishCity, b: TurkishCity): number {
  return a.name.localeCompare(b.name, "tr");
}

export interface PrayerTime {
  key: string;
  name: string;
  time: string; // "HH:MM"
}

export interface PrayerData {
  city: string;
  hijri: string;
  gregorianReadable: string;
  weekday: string;
  times: PrayerTime[];
}

const HIJRI_MONTHS_TR = [
  "Muharrem", "Safer", "Rebiülevvel", "Rebiülahir",
  "Cemaziyelevvel", "Cemaziyelahir", "Receb", "Şaban",
  "Ramazan", "Şevval", "Zilkade", "Zilhicce",
];

const WEEKDAYS_TR: Record<string, string> = {
  Sunday: "Pazar", Monday: "Pazartesi", Tuesday: "Salı",
  Wednesday: "Çarşamba", Thursday: "Perşembe", Friday: "Cuma",
  Saturday: "Cumartesi",
};

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function dateParam(d: Date): string {
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
}

// Aladhan API'sinden namaz vakitlerini çeker (method=13 Diyanet)
export async function fetchPrayerTimes(lat: number, lng: number, label: string): Promise<PrayerData> {
  const url = `https://api.aladhan.com/v1/timings/${dateParam(new Date())}?latitude=${lat}&longitude=${lng}&method=13&school=0`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Namaz vakitleri alınamadı.");
  const json = await res.json();
  const t = json.data.timings;

  const times: PrayerTime[] = [
    { key: "imsak", name: "İmsak", time: t.Imsak },
    { key: "gunes", name: "Güneş", time: t.Sunrise },
    { key: "ogle", name: "Öğle", time: t.Dhuhr },
    { key: "ikindi", name: "İkindi", time: t.Asr },
    { key: "aksam", name: "Akşam", time: t.Maghrib },
    { key: "yatsi", name: "Yatsı", time: t.Isha },
  ].map((p) => ({ ...p, time: (p.time as string).slice(0, 5) }));

  const hijri = json.data.date.hijri;
  const monthName = HIJRI_MONTHS_TR[(hijri.month.number - 1) % 12] || hijri.month.en;
  const hijriStr = `${hijri.day} ${monthName} ${hijri.year} Hicrî`;

  return {
    city: label,
    hijri: hijriStr,
    gregorianReadable: json.data.date.gregorian.date,
    weekday: WEEKDAYS_TR[json.data.date.gregorian.weekday.en] || "",
    times,
  };
}

// Bugünün vakitlerinden bir sonraki vakti ve kalan süreyi bulur
export function getNextPrayer(times: PrayerTime[]): { prayer: PrayerTime; remainingMs: number } | null {
  const now = new Date();
  for (const p of times) {
    if (p.key === "gunes") continue; // Güneş vakit olarak sayılmaz
    const [h, m] = p.time.split(":").map(Number);
    const target = new Date();
    target.setHours(h, m, 0, 0);
    const diff = target.getTime() - now.getTime();
    if (diff > 0) {
      return { prayer: p, remainingMs: diff };
    }
  }
  // Bugün bittiyse yarının ilk vakti (İmsak)
  const imsak = times.find((p) => p.key === "imsak");
  if (!imsak) return null;
  const [h, m] = imsak.time.split(":").map(Number);
  const target = new Date();
  target.setDate(target.getDate() + 1);
  target.setHours(h, m, 0, 0);
  return { prayer: imsak, remainingMs: target.getTime() - now.getTime() };
}

export function formatCountdown(ms: number): string {
  if (ms < 0) ms = 0;
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

// Hangi vakitte olduğumuzu bulur (vurgulamak için)
export function getCurrentPrayer(times: PrayerTime[]): PrayerTime | null {
  const now = new Date();
  let current: PrayerTime | null = null;
  for (const p of times) {
    if (p.key === "gunes") continue;
    const [h, m] = p.time.split(":").map(Number);
    const target = new Date();
    target.setHours(h, m, 0, 0);
    if (target.getTime() <= now.getTime()) current = p;
  }
  return current;
}
