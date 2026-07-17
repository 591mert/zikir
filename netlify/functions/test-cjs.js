exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, message: "CJS test çalışıyor!" }),
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  };
};
