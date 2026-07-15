// Kâbe (Mescid-i Haram) koordinatları
export const KAABA = { lat: 21.4225, lng: 39.8262 };

const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

// Verilen konumdan Kâbe'ye olan kıble açısını (kuzeyden saat yönünde, derece) hesaplar.
export function qiblaBearing(lat: number, lng: number): number {
  const φ1 = toRad(lat);
  const φ2 = toRad(KAABA.lat);
  const Δλ = toRad(KAABA.lng - lng);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  return (toDeg(θ) + 360) % 360;
}

// İki konum arası mesafe (km) — sadece bilgi amaçlı
export function distanceKm(lat: number, lng: number): number {
  const R = 6371;
  const dLat = toRad(KAABA.lat - lat);
  const dLng = toRad(KAABA.lng - lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat)) *
      Math.cos(toRad(KAABA.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}
