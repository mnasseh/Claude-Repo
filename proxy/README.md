# Dr Cal — Proxy Anthropic (Claude)

Petit serveur **sans dépendance** (Node 18+) qui détient ta clé Anthropic
**côté serveur** et relaie les analyses (scan d'assiette / d'étiquette,
évaluation de texte) vers l'API Claude. Ainsi, **la clé n'est jamais dans le
fichier HTML** et ne peut pas être lue par les utilisateurs de l'app.

## 1. Pré-requis
- [Node.js 18 ou plus](https://nodejs.org)
- Une clé API Anthropic : https://console.anthropic.com/settings/keys

## 2. Lancer en local (usage perso)

```bash
cd proxy

# Windows (PowerShell)
$env:ANTHROPIC_API_KEY="sk-ant-xxxxx"
node server.mjs

# macOS / Linux
export ANTHROPIC_API_KEY="sk-ant-xxxxx"
node server.mjs
```

Le proxy écoute sur **http://localhost:8787**.

Test rapide :
```bash
curl http://localhost:8787/health
# → {"ok":true,"model":"claude-haiku-4-5-20251001","keyConfigured":true}
```

## 3. Brancher l'app
Ouvre `plan_nutritionnel_dr_cal_swiss_v8.html`, va dans **Paramètres de
l'application** → champ **Serveur (proxy)** → mets `http://localhost:8787`
→ **Valider / Actualiser**. Si tout est bon : « Serveur OK ✓ ».

> Tant que le proxy tourne, les fonctions IA marchent. Si tu fermes le
> terminal, relance `node server.mjs`.

## 4. Variables d'environnement
| Variable | Rôle | Défaut |
|---|---|---|
| `ANTHROPIC_API_KEY` | Ta clé Anthropic (obligatoire) | — |
| `ANTHROPIC_MODEL` | Modèle Claude utilisé | `claude-haiku-4-5-20251001` |
| `PORT` | Port d'écoute | `8787` |

## 5. Héberger (pour y accéder hors de ta machine)
N'importe quel hébergeur Node fait l'affaire (Render, Railway, Fly.io, un VPS,
ou une fonction serverless). Mets `ANTHROPIC_API_KEY` dans les variables
d'environnement de la plateforme, déploie `server.mjs`, puis renseigne l'URL
publique (https://…) dans les Paramètres de l'app.

> Sécurité : en production, restreins `Access-Control-Allow-Origin` à l'origine
> de ton app au lieu de `*`, et ajoute éventuellement un jeton d'accès.
