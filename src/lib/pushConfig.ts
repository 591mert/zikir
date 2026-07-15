// ============================================================================
//  PUSH BİLDİRİM AYARLARI
// ----------------------------------------------------------------------------
//  Bu uygulama kapalıyken bile bildirim gönderebilmek için "Web Push"
//  tekniğini kullanır. Bunun için bir VAPID ANAHTAR ÇİFTİ gerekir.
//
//  🔑 ANAHTAR NASIL ÜRETİLİR?
//  Terminalinizde şunu çalıştırın (Node.js kurulu olmalı):
//
//      npx web-push generate-vapid-keys
//
//  Bu size iki değer verir:
//    - Public Key  (herkese açık) → aşağıya PUBLIC kısmına yapıştırın
//    - Private Key (gizli)        → ASLA buraya koymayın! Sunucuya koyun.
//
//  Public Key'i aşağıdaki VAPID_PUBLIC_KEY değişkenine yapıştırın.
//  Private Key'i sunucu koduna (push gönderen) koyacaksınız.
// ============================================================================

// ⬇️ KENDİ PUBLIC KEY'İNİZİ buraya yapıştırın (tırnak içinde):
export const VAPID_PUBLIC_KEY = "BJ1AY9adlj1GXshhRUKNayiu_3efECYf3oNKkISviNVrTRjuBSLhGq7bf1Wf5YEPH408B01Nn-4eG265Fh8peho";

// ⬇️ Bildirim gönderen sunucunuzun adresi (Netlify'a yükleyince öğrenilir).
// Örnek: "https://zikir-uygulama.netlify.app/.netlify/functions"
export const PUSH_BACKEND_URL = "https://resilient-sprite-71081d.netlify.app/.netlify/functions";

// Uygulama gerçekten push'a hazır mı? (anahtar girilmiş mi)
export function pushConfigured(): boolean {
  return VAPID_PUBLIC_KEY.length > 0 && PUSH_BACKEND_URL.length > 0;
}
