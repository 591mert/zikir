// ============================================================================
//  /subscribe — Telefon bu cihazı push bildirimlerine abone yapar
//  Telefon, ilini ve hatırlatma süresini buraya gönderir; biz saklarız.
// ============================================================================
import { getStore } from "@netlify/blobs";

export default async (req) => {
  // CORS başlıkları (telefonun başka adresten istek atabilmesi için)
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response("", { status: 204, headers: cors });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Sadece POST" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...cors },
    });
  }

  try {
    const body = await req.json();
    const subscription = body.subscription;
    if (!subscription || !subscription.endpoint) {
      return new Response(JSON.stringify({ error: "Abonelik eksik" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    // Aboneliği sakla (anahtar = cihazın endpoint adresi)
    const store = getStore("subscriptions");
    const record = {
      subscription,
      city: body.city || "Bilinmiyor",
      lat: body.lat,
      lng: body.lng,
      offsetMinutes: body.offsetMinutes ?? 10,
      createdAt: Date.now(),
      // Bugün hangi vakitler için bildirim gönderildi (tekrar göndermeme)
      sent: {},
    };
    await store.set(subscription.endpoint, JSON.stringify(record));

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...cors },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...cors },
    });
  }
};
