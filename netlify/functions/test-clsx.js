import clsx from "clsx";

export default async () => {
  return new Response(JSON.stringify({ ok: true, result: clsx("a", "b") }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
};
