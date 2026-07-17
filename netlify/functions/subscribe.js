const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors };
  }
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Sadece POST" }),
      headers: { "Content-Type": "application/json", ...cors },
    };
  }

  try {
    const body = JSON.parse(event.body);
    const subscription = body.subscription;
    if (!subscription || !subscription.endpoint) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Abonelik eksik" }),
        headers: { "Content-Type": "application/json", ...cors },
      };
    }

    const store = getStore("subscriptions");
    const record = {
      subscription,
      city: body.city || "Bilinmiyor",
      lat: body.lat,
      lng: body.lng,
      offsetMinutes: body.offsetMinutes ?? 10,
      createdAt: Date.now(),
      sent: {},
    };
    await store.set(subscription.endpoint, JSON.stringify(record));

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
      headers: { "Content-Type": "application/json", ...cors },
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(e) }),
      headers: { "Content-Type": "application/json", ...cors },
    };
  }
};
