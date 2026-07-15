# 🔔 Kapalıyken Çalışan Namaz Bildirimleri — Kurulum Rehberi

Bu rehber, **Zikir** uygulamasının telefon kapalıyken bile namaz vakti bildirimi göndermesi için gereken ücretsiz kurulumu anlatır. Mağazaya (Play/App Store) yükleme YOK.

---

## 📋 Genel Bakış: 3 Parça

```
1. TELEFON (uygulama)   → abone olur, ilini söyler
2. NETLIFY (sunucu)     → aboneleri saklar, her dakika kontrol eder
3. APPLE/GOOGLE         → bildirimi telefona ulaştırır (uygulama kapalı olsa bile)
```

---

## Adım 1 — VAPID Anahtarları Üret

Bilgisayarda terminal (komut satırı) aç ve şunu çalıştır:

```
npx web-push generate-vapid-keys
```

Sana iki değer verecek:
- ✅ **Public Key** (herkese açık)
- 🔒 **Private Key** (GİZLİ — asla kimseyle paylaşma, GitHub'a koyma)

---

## Adım 2 — Public Key'i Uygulamaya Koy

`src/lib/pushConfig.ts` dosyasını aç. İki satırı doldur:

```ts
// Public Key'i tırnak içinde yapıştır:
export const VAPID_PUBLIC_KEY = "BURAYA_PUBLIC_KEY";

// Sunucu adresini yaz (Adım 4'te öğreneceksin):
export const PUSH_BACKEND_URL = "https://SENIN-SITEN.netlify.app/.netlify/functions";
```

> Önce VAPID_PUBLIC_KEY'i şimdi koy. PUSH_BACKEND_URL'i Adım 4'ten sonra dolduracaksın.

---

## Adım 3 — Kodu GitHub'a Yükle (ÖNEMLİ!)

⚠️ **Sürükle-bırak yöntemi ÇALIŞMAZ!** Çünkü push için sunucu fonksiyonları (functions) gerekir ve sürükle-bırak sadece statik site yükler.

1. GitHub'da yeni bir depo (repository) aç.
2. Tüm proje dosyalarını oraya yükle (GitHub Desktop veya `git push` ile).

---

## Adım 4 — Netlify'a GitHub ile Bağlan

1. [app.netlify.com](https://app.netlify.com) → **"Add new site" → "Import an existing project"**
2. GitHub'ı seç → deponu seç.
3. Ayarlar:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** Netlify `netlify.toml`'den otomatik alır (`netlify/functions`)
4. **Deploy** de. Site adresin: `https://bir-isim.netlify.app`
   - Bu adresi Adım 2'deki `PUSH_BACKEND_URL`'ye yaz ve yeniden deploy et.

---

## Adım 5 — Gizli Anahtarları Netlify'a Ekle

Site → **Site configuration → Environment variables**:

| Değişken adı | Değer |
|--------------|-------|
| `VAPID_PUBLIC_KEY` | (Adım 1'deki Public Key) |
| `VAPID_PRIVATE_KEY` | (Adım 1'deki Private Key) |
| `VAPID_SUBJECT` | `mailto:senin@mail.com` |

Kaydettikten sonra **tekrar deploy** et (Deploy → Trigger deploy).

---

## Adım 6 — Zamanlayıcıyı (Cron) Aç

Bildirimleri gönderen `send-push` fonksiyonunun her dakika çalışması gerek.

- **Kolay yol:** [cron-job.org](https://cron-job.org) (ücretsiz) adresinden hesap aç.
  - URL: `https://SENIN-SITEN.netlify.app/.netlify/functions/send-push`
  - Her 1 dakikada bir çalışacak şekilde ayarla.
- **Alternatif:** Netlify panelinde **Scheduled Functions** özelliğini aç (kodda `schedule: "* * * * *"` hazır).

---

## Adım 7 — Test Et

1. `npm run build` → Adım 4'teki siteye push (GitHub'a commit).
2. Telefonda siteyi aç → **Namaz Vakitleri → 🔔 Hatırlatmaları Aç**.
3. Kartta **"✅ Kapalıyken de çalışır"** yazmalı.
4. "Test bildirimi gönder" de → bildirim gelmeli.
5. Uygulamayı tamamen kapat. Namaz vakti gelince bildirim gelecek. 🎉

---

## 📱 Önemli Notlar

- **Android (Chrome):** Tam destek, sorunsuz çalışır.
- **iPhone (iOS 16.4+):** Uygulama **"Ana Ekrana Eklenmiş"** olmalı. Safari sekmesinde çalışmaz.
- **Ücretsiz limit:** Netlify ücretsiz planda ayda 125.000 fonksiyon çağrısı verir. Dakikada 1 çağrı = ayda ~44.000 → ücretsiz limitin çok altında. ✅
- **Veri gizliliği:** Abonelikler sadece bildirim göndermek için saklanır, başkalarıyla paylaşılmaz.

---

Sorun olursa her adımda yardım isteyebilirsin.
