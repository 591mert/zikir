// ============================================================================
//  🔔 ZİKİR — PUSH BİLDİRİM KURULUM SCRIPTİ
// ----------------------------------------------------------------------------
//  Bu script şunları otomatik yapar:
//    1. VAPID anahtar çiftini üretir
//    2. Public Key'i otomatik olarak src/lib/pushConfig.ts'e yazar
//    3. Private Key'i ekrana yazdırır (bunu Netlify'a gireceksin)
//
//  ÇALIŞTIRMA:
//      node setup-push.js
// ============================================================================

import webpush from "web-push";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("\n🔔 Zikir Push Bildirim Kurulumu başlıyor...\n");
console.log("⏳ VAPID anahtarları üretiliyor...\n");

// 1) Anahtar çiftini üret
const vapidKeys = webpush.generateVAPIDKeys();

console.log("✅ Anahtarlar üretildi!\n");
console.log("==================================================");
console.log("🔒 GİZLİ ANAHTARLAR (BUNLARI KOPYALA):\n");
console.log("Public Key:    ", vapidKeys.publicKey);
console.log("Private Key:   ", vapidKeys.privateKey);
console.log("==================================================\n");

// 2) Public Key'i pushConfig.ts'e otomatik yaz
const configPath = join(__dirname, "src", "lib", "pushConfig.ts");
let content = readFileSync(configPath, "utf8");

// Eski public key satırını yenisiyle değiştir
content = content.replace(
  /export const VAPID_PUBLIC_KEY = "[^"]*";/,
  `export const VAPID_PUBLIC_KEY = "${vapidKeys.publicKey}";`
);

writeFileSync(configPath, content, "utf8");
console.log("✅ Public Key otomatik olarak src/lib/pushConfig.ts dosyasına yazıldı.\n");

// 3) Sonraki adımları yazdır
console.log("==================================================");
console.log("📋 SIRADAKİ ADIMLAR:\n");
console.log("1. Yukarıdaki 3 değeri bir yere NOT ET (Private Key'i kaybetme!):");
console.log("   • Public Key:  (zaten dosyaya yazıldı, tekrar girmene gerek yok)");
console.log("   • Private Key: Netlify ortam değişkenlerine gireceksin");
console.log("   • Subject:     mailto:senin@mail.com\n");
console.log("2. PUSH_KURULUM_REHBERI.md dosyasındaki adımları takip et.");
console.log("3. Kodu GitHub'a yükle, Netlify'a GitHub ile bağlan.\n");
console.log("==================================================\n");
