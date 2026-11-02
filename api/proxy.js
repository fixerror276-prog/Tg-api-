const fetch = require("node-fetch");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { type, key, query } = req.query;

  if (!type || !key || !query) {
    return res.status(400).json({ error: "type, key, query required" });
  }

  try {
    const upstream = `https://darkx-osint-rv33.vercel.app/?type=${encodeURIComponent(type)}&key=${encodeURIComponent(key)}&query=${encodeURIComponent(query)}`;

    const r = await fetch(upstream, {
      headers: { "Accept": "application/json" }
    });

    const text = await r.text();

    // Agar upstream JSON de raha hai toh JSON, warna raw text bhej do
    try {
      const data = JSON.parse(text);
      return res.status(r.status).json(data);
    } catch {
      return res.status(r.status).send(text);
    }
  } catch (err) {
    return res.status(500).json({ error: "upstream failed", detail: err.message });
  }
};
