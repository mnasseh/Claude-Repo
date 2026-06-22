// Dr Cal — Proxy Anthropic (Claude)
// Petit serveur sans dépendance : il détient la clé Anthropic (côté serveur,
// jamais dans le navigateur) et relaie les demandes d'analyse vers l'API Claude.
//
// Lancement :
//   1) export ANTHROPIC_API_KEY="sk-ant-..."   (ou fichier .env, voir README)
//   2) node server.mjs
//   3) le proxy écoute sur http://localhost:8787
//
// L'app appelle POST /api/analyze avec :
//   { kind: "meal" | "supp", text?: "...", image?: { media_type, data(base64) } }
// et reçoit : { name, cal, prot, carb, fat, explanation }

import http from "node:http";

const PORT = process.env.PORT || 8787;
const API_KEY = process.env.ANTHROPIC_API_KEY || "";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function send(res, status, obj) {
  res.writeHead(status, { "Content-Type": "application/json", ...CORS });
  res.end(JSON.stringify(obj));
}

function systemPrompt(kind) {
  const sujet = kind === "supp"
    ? "Évalue le complément alimentaire / supplément (texte ou étiquette). Estime l'apport par dose."
    : "Évalue le plat (texte ou photo). Estime ses calories et macronutriments.";
  return `Tu es un nutritionniste de précision. ${sujet}
Réponds UNIQUEMENT par un objet JSON strict, sans Markdown ni texte autour, au format exact :
{ "name": "nom en français", "cal": 350, "prot": 25, "carb": 30, "fat": 12, "explanation": "1 à 2 phrases en français sur la pertinence pour le CrossFit et la perte de gras." }`;
}

function extractJson(text) {
  if (!text) throw new Error("Réponse vide du modèle");
  const cleaned = String(text).replace(/```json|```/g, "").trim();
  try { return JSON.parse(cleaned); } catch (_) {
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]);
    throw new Error("JSON non analysable");
  }
}

async function callClaude(payload) {
  const kind = payload.kind === "supp" ? "supp" : "meal";
  const content = [];
  if (payload.image && payload.image.data) {
    content.push({ type: "image", source: { type: "base64", media_type: payload.image.media_type || "image/jpeg", data: payload.image.data } });
  }
  content.push({ type: "text", text: payload.text ? `Évalue : ${payload.text}` : "Évalue ce que montre l'image." });

  const body = {
    model: MODEL,
    max_tokens: 500,
    system: systemPrompt(kind),
    messages: [{ role: "user", content }],
  };

  const r = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!r.ok) {
    let msg = "";
    try { const e = await r.json(); msg = e?.error?.message || JSON.stringify(e); } catch (_) {}
    const err = new Error(msg || `Anthropic HTTP ${r.status}`);
    err.status = r.status;
    throw err;
  }

  const data = await r.json();
  const textBlock = (data.content || []).find((b) => b.type === "text");
  return extractJson(textBlock && textBlock.text);
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") { res.writeHead(204, CORS); res.end(); return; }

  if (req.method === "GET" && req.url === "/health") {
    return send(res, 200, { ok: true, model: MODEL, keyConfigured: !!API_KEY });
  }

  if (req.method === "POST" && req.url === "/api/analyze") {
    if (!API_KEY) return send(res, 500, { error: "ANTHROPIC_API_KEY non configurée côté serveur." });
    let raw = "";
    req.on("data", (c) => { raw += c; if (raw.length > 12 * 1024 * 1024) req.destroy(); });
    req.on("end", async () => {
      let payload;
      try { payload = JSON.parse(raw || "{}"); } catch (_) { return send(res, 400, { error: "Corps JSON invalide." }); }
      try { const result = await callClaude(payload); send(res, 200, result); }
      catch (e) { send(res, e.status || 502, { error: e.message || "Échec de l'appel Anthropic" }); }
    });
    return;
  }

  send(res, 404, { error: "Route inconnue. Utilise POST /api/analyze ou GET /health." });
});

server.listen(PORT, () => {
  console.log(`Dr Cal proxy → http://localhost:${PORT}`);
  console.log(`  modèle: ${MODEL}`);
  console.log(`  clé Anthropic: ${API_KEY ? "OK" : "MANQUANTE (export ANTHROPIC_API_KEY=...)"}`);
});
