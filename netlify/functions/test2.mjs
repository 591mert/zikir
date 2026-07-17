export default async () => {
  return new Response(JSON.stringify({ ok: true, message: "MJS test çalışıyor!" }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
};
