# Alpha Mailer

Pipeline d'envoi autonome via SMTP Gmail, validé le 2026-07-01
(mail « ✅ Test Alpha Mailer — envoi autonome »).

Garde-fous : liste blanche de destinataires · plafond de 30 envois/jour ·
journal d'audit append-only. **Aucun secret n'est stocké dans le code** : les
identifiants sont lus depuis l'environnement.

## Variables d'environnement

| Variable | Rôle |
|----------|------|
| `ALPHA_MAILER_USER` | Adresse Gmail émettrice (`m.nasseh@grpalpha.com`) |
| `ALPHA_MAILER_APP_PASSWORD` | **Mot de passe d'application** Gmail (16 caractères, généré le 2026-07-01). Secret. |
| `ALPHA_MAILER_WHITELIST` | Destinataires autorisés, séparés par des virgules |

## Utilisation locale (depuis ton ordi)

```bash
export ALPHA_MAILER_USER="m.nasseh@grpalpha.com"
export ALPHA_MAILER_APP_PASSWORD="xxxx xxxx xxxx xxxx"
export ALPHA_MAILER_WHITELIST="m.nasseh@grpalpha.com"

python alpha_mailer.py --check       # vérifie la config, n'envoie rien
python alpha_mailer.py --selftest    # rejoue le mail de vérification
python alpha_mailer.py --to m.nasseh@grpalpha.com --subject "Sujet" --body "Corps"
```

Le secret peut être fourni de **deux façons** (les deux sont sûres : jamais dans
le chat, jamais commitées). Les variables d'environnement ont priorité sur le
fichier `.env`.

### Méthode 1 — Secrets de l'environnement (recommandée, durable)

Persiste entre les sessions, chiffré au repos.

1. Réglages de l'environnement cloud : **Settings → Environment → Variables
   d'environnement / Secrets** (doc :
   https://code.claude.com/docs/en/claude-code-on-the-web).
2. Ajoute les trois variables ci-dessus ; marque `ALPHA_MAILER_APP_PASSWORD`
   comme **secret**.
3. Relance une session.

### Méthode 2 — Fichier `.env` (rapide, local)

Crée un fichier `.env` à la racine du repo (il est **git-ignoré**, jamais
commité). `alpha_mailer.py` le charge automatiquement au démarrage.

```
ALPHA_MAILER_USER=m.nasseh@grpalpha.com
ALPHA_MAILER_APP_PASSWORD=xxxx xxxx xxxx xxxx
ALPHA_MAILER_WHITELIST=m.nasseh@grpalpha.com
```

> Note : dans un environnement cloud éphémère, un `.env` créé pendant une
> session ne survit pas à la reconstruction du conteneur — pour du durable,
> utilise la Méthode 1.

### Vérifier puis tester

```bash
python alpha_mailer.py --check      # les 3 lignes doivent afficher OK
python alpha_mailer.py --selftest   # envoie réellement le mail de vérification
```

## ⚠️ Limite : envoi SMTP impossible depuis un environnement cloud

Le SMTP (ports 465 / 587) est **bloqué** dans l'environnement cloud Claude Code
on the web : la sortie réseau ne passe que par un proxy HTTPS. `alpha_mailer.py`
détecte ce cas et affiche un message clair plutôt qu'une stacktrace.

Conséquence : l'**envoi réel** ne fonctionne que là où le réseau sortant est
ouvert — c'est-à-dire **ta propre machine** (là où le test du 2026-07-01 a
réussi). Depuis le cloud, on peut préparer un **brouillon** via le connecteur
Gmail (HTTPS), mais pas envoyer par SMTP.

Pour un envoi 100 % autonome, planifie le script **sur ton ordinateur** (cron
ci-dessous) : il tourne chez toi, où le réseau le permet.

## Outbox : envoyer les brouillons marqués « SEND » (depuis ton ordi)

`alpha_mailer_outbox.py` transforme un **brouillon** en **email envoyé**. Il
tourne sur ta machine (réseau ouvert), scanne les Brouillons Gmail, prend ceux
dont l'objet commence par **`SEND`**, les envoie par SMTP (mêmes garde-fous :
liste blanche, plafond 30/j, audit), retire le préfixe, puis supprime le
brouillon.

Intérêt : la **routine cloud** (ou toi, **depuis le téléphone**) n'a qu'à créer
un brouillon dont l'objet commence par `SEND` → il part au prochain passage du
cron, sans dépendre du connecteur Gmail (qui ne sait pas envoyer).

```bash
python alpha_mailer_outbox.py --dry-run   # liste ce qui partirait, sans rien envoyer
python alpha_mailer_outbox.py             # envoie + nettoie les brouillons "SEND"
```

Planifier toutes les 10 min (crontab -e) :
```
*/10 * * * * cd /chemin/vers/Claude-Repo && /usr/bin/python3 alpha_mailer_outbox.py >> alpha_mailer_cron.log 2>&1
```

Prérequis : le `.env` (ou les variables d'env) avec `ALPHA_MAILER_USER`,
`ALPHA_MAILER_APP_PASSWORD`, `ALPHA_MAILER_WHITELIST`. Le mot de passe
d'application donne accès **IMAP + SMTP** (lecture des brouillons + envoi).

### Brancher la routine « Alerte emails importants (FR) »
Dans l'éditeur de la routine, à l'étape qui crée le brouillon récap, rends-la
**obligatoire** et préfixe l'objet par `SEND ` :

> Crée un brouillon Gmail via `create_draft`, adressé à
> `m.nasseh@grpalpha.com`, dont l'objet commence par **`SEND `** (ex.
> `SEND 🔔 Alerte mails — JJ/MM HH:MM | N importants`), avec le même contenu que
> la page Notion.

L'Outbox sur ton ordi enverra ensuite ce brouillon automatiquement.

## Envoi programmé (cron)

Génère la ligne crontab prête à coller (envoi quotidien du self-test à 8h00
comme sonde de santé) :

```bash
python alpha_mailer.py --cron-line
crontab -e   # colle la ligne affichée
```

> Rotation : si le mot de passe d'application est régénéré côté Google, mets
> simplement à jour `ALPHA_MAILER_APP_PASSWORD` (secret d'environnement ou
> `.env`). Rien à changer dans le code.
