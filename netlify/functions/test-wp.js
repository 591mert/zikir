import webpush from "web-push";

export default async () => {
  return new Response(JSON.stringify({ ok: true, version: "web-push" }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
};
