"""Alpha Mailer — pipeline d'envoi autonome via SMTP Gmail.

Reconstitution du workflow validé le 2026-07-01 (mail « Test Alpha Mailer —
envoi autonome »). L'authentification utilise un mot de passe d'application
Gmail (compte protege par la validation en deux etapes).

Garde-fous (identiques au test valide) :
  - Liste blanche de destinataires
  - Plafond de 30 envois / jour
  - Journal d'audit de chaque envoi (append-only)

Aucun secret n'est ecrit dans le code : les identifiants sont lus depuis
l'environnement.

  export ALPHA_MAILER_USER="m.nasseh@grpalpha.com"
  export ALPHA_MAILER_APP_PASSWORD="xxxx xxxx xxxx xxxx"   # mot de passe d'appli
  export ALPHA_MAILER_WHITELIST="m.nasseh@grpalpha.com,contact@grpalpha.com"

Usage :
  python alpha_mailer.py --to m.nasseh@grpalpha.com \
      --subject "Sujet" --body "Corps du message"

  # Rejoue le mail de verification du workflow :
  python alpha_mailer.py --selftest
"""

import argparse
import json
import os
import smtplib
import ssl
import sys
from datetime import datetime, timezone
from email.message import EmailMessage
from email.utils import parseaddr

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 465  # SSL

DAILY_CAP = 30
AUDIT_LOG = os.path.join(os.path.dirname(os.path.abspath(__file__)), "alpha_mailer_audit.log")


def _env(name, required=True):
    val = (os.environ.get(name) or "").strip()
    if required and not val:
        sys.exit(f"[alpha-mailer] Variable d'environnement manquante : {name}")
    return val


def check_config():
    """Preflight : verifie la config sans jamais afficher le secret."""
    required = ["ALPHA_MAILER_USER", "ALPHA_MAILER_APP_PASSWORD", "ALPHA_MAILER_WHITELIST"]
    missing = [k for k in required if not (os.environ.get(k) or "").strip()]
    print("[alpha-mailer] Preflight de configuration :")
    for k in required:
        present = bool((os.environ.get(k) or "").strip())
        # On confirme seulement la PRESENCE, jamais la valeur du secret.
        print(f"  - {k:<28} {'OK' if present else 'MANQUANT'}")
    if missing:
        print(f"\n[alpha-mailer] Config incomplete : {', '.join(missing)}")
        print("Ajoute ces variables dans les secrets de l'environnement (voir ALPHA_MAILER.md).")
        return False
    print(f"\n[alpha-mailer] Config complete. Envois aujourd'hui : {sends_today()}/{DAILY_CAP}")
    print("Pret a envoyer : python alpha_mailer.py --selftest")
    return True


def load_whitelist():
    raw = _env("ALPHA_MAILER_WHITELIST")
    wl = {a.strip().lower() for a in raw.split(",") if a.strip()}
    if not wl:
        sys.exit("[alpha-mailer] Liste blanche vide : aucun destinataire autorise.")
    return wl


def sends_today():
    """Compte les envois reussis journalises pour la date du jour (UTC)."""
    if not os.path.exists(AUDIT_LOG):
        return 0
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    n = 0
    with open(AUDIT_LOG, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                rec = json.loads(line)
            except json.JSONDecodeError:
                continue
            if rec.get("status") == "sent" and str(rec.get("ts", "")).startswith(today):
                n += 1
    return n


def audit(record):
    record = {"ts": datetime.now(timezone.utc).isoformat(), **record}
    with open(AUDIT_LOG, "a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")


def send(to, subject, body, dry_run=False):
    user = _env("ALPHA_MAILER_USER")
    whitelist = load_whitelist()

    recipient = parseaddr(to)[1].lower()
    if not recipient:
        sys.exit(f"[alpha-mailer] Destinataire invalide : {to!r}")

    # Garde-fou 1 : liste blanche
    if recipient not in whitelist:
        audit({"status": "blocked", "reason": "not_whitelisted", "to": recipient})
        sys.exit(f"[alpha-mailer] Destinataire hors liste blanche, envoi refuse : {recipient}")

    # Garde-fou 2 : plafond journalier
    used = sends_today()
    if used >= DAILY_CAP:
        audit({"status": "blocked", "reason": "daily_cap", "to": recipient, "used": used})
        sys.exit(f"[alpha-mailer] Plafond journalier atteint ({used}/{DAILY_CAP}), envoi refuse.")

    msg = EmailMessage()
    msg["From"] = user
    msg["To"] = recipient
    msg["Subject"] = subject
    msg.set_content(body)

    if dry_run:
        audit({"status": "dry_run", "to": recipient, "subject": subject})
        print(f"[alpha-mailer] DRY-RUN — aurait envoye a {recipient} ({used + 1}/{DAILY_CAP})")
        return

    password = _env("ALPHA_MAILER_APP_PASSWORD")
    ctx = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=ctx) as smtp:
        smtp.login(user, password)
        smtp.send_message(msg)

    audit({"status": "sent", "to": recipient, "subject": subject})
    print(f"[alpha-mailer] Envoye a {recipient} ({used + 1}/{DAILY_CAP} aujourd'hui)")


SELFTEST_SUBJECT = "✅ Test Alpha Mailer — envoi autonome"
SELFTEST_BODY = (
    "Bonjour,\n\n"
    "Si tu lis cet email, c'est que le pipeline d'envoi autonome fonctionne :\n"
    "Claude a envoye ce message directement via SMTP Gmail, sans clic manuel.\n\n"
    "Garde-fous actifs :\n"
    "- Liste blanche de destinataires\n"
    "- Plafond de 30 envois/jour\n"
    "- Journal d'audit de chaque envoi\n\n"
    "Prochaine etape : l'envoi programme (cron).\n\n"
    "— Alpha Mailer"
)


def main():
    p = argparse.ArgumentParser(description="Alpha Mailer — envoi autonome via SMTP Gmail")
    p.add_argument("--to", help="Destinataire (doit figurer dans la liste blanche)")
    p.add_argument("--subject", help="Sujet du message")
    p.add_argument("--body", help="Corps du message (texte brut)")
    p.add_argument("--selftest", action="store_true",
                   help="Rejoue le mail de verification vers ALPHA_MAILER_USER")
    p.add_argument("--check", action="store_true",
                   help="Verifie la config (secrets presents) sans rien envoyer")
    p.add_argument("--dry-run", action="store_true",
                   help="Applique les garde-fous sans se connecter au SMTP")
    args = p.parse_args()

    if args.check:
        sys.exit(0 if check_config() else 1)

    if args.selftest:
        to = args.to or _env("ALPHA_MAILER_USER")
        send(to, SELFTEST_SUBJECT, SELFTEST_BODY, dry_run=args.dry_run)
        return

    if not (args.to and args.subject and args.body is not None):
        p.error("--to, --subject et --body sont requis (ou utilisez --selftest)")

    send(args.to, args.subject, args.body, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
