import { getStore } from "@netlify/blobs";

export default async () => {
  const store = getStore("subscriptions");
  const list = await store.list();
  return new Response(JSON.stringify({ ok: true, count: list.blobs.length }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
};
