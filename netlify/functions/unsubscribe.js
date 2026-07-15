// ============================================================================
//  /unsubscribe — Telefon hatırlatmaları kapatınca aboneliği siler
// ============================================================================
import { getStore } from "@netlify/blobs";

export default async (req) => {
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
    const endpoint = body.endpoint;
    if (!endpoint) {
      return new Response(JSON.stringify({ error: "endpoint eksik" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }
    const store = getStore("subscriptions");
    await store.delete(endpoint);

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
