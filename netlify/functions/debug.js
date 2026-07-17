exports.handler = async () => {
  const all = Object.keys(process.env).filter(k => k.includes("VAPID"));
  return {
    statusCode: 200,
    body: JSON.stringify({
      vapid_vars_found: all,
      vapid_vars_count: all.length,
      public_len: (process.env.VAPID_PUBLIC_KEY || "").length,
      private_len: (process.env.VAPID_PRIVATE_KEY || "").length,
      subject_len: (process.env.VAPID_SUBJECT || "").length,
    }),
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  };
};
