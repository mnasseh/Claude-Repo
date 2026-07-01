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

## Envoyer aussi depuis les sessions cloud (Claude Code on the web)

Pour que l'envoi fonctionne aussi depuis l'environnement cloud, le secret doit
être ajouté **une seule fois** dans la configuration de l'environnement — jamais
collé dans le chat.

1. Ouvre les réglages de l'environnement cloud : **Settings → Environment →
   Variables d'environnement / Secrets** (voir la doc :
   https://code.claude.com/docs/en/claude-code-on-the-web).
2. Ajoute les trois variables ci-dessus. Marque `ALPHA_MAILER_APP_PASSWORD`
   comme **secret** (masqué, chiffré au repos).
3. Relance une session, puis vérifie sans rien envoyer :
   ```bash
   python alpha_mailer.py --check
   ```
   Quand les trois lignes affichent `OK`, l'envoi autonome est disponible ici
   aussi :
   ```bash
   python alpha_mailer.py --selftest
   ```

> Rotation : si le mot de passe d'application est régénéré côté Google, il
> suffit de mettre à jour `ALPHA_MAILER_APP_PASSWORD` dans les secrets de
> l'environnement. Rien à changer dans le code.
