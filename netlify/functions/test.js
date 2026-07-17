exports.handler = async () => {
  const netlifyVars = Object.keys(process.env).filter(k =>
    k.startsWith("NETLIFY") || k.startsWith("SITE_") || k === "SITE_ID" || k.startsWith("DEPLOY") || k.startsWith("CONTEXT")
  );
  return {
    statusCode: 200,
    body: JSON.stringify({ vars: netlifyVars }),
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  };
};
