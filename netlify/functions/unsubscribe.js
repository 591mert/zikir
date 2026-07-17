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
    const endpoint = body.endpoint;
    if (!endpoint) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Endpoint gerekli" }),
        headers: { "Content-Type": "application/json", ...cors },
      };
    }

    const store = getStore("subscriptions");
    await store.delete(endpoint);

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
