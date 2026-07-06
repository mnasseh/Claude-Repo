"""Alpha Mailer — Outbox : envoie les brouillons marques "SEND".

A lancer sur une machine dont le reseau sortant est ouvert (ton ordinateur),
via cron. Principe :

  1. Se connecte a Gmail en IMAP (mot de passe d'application).
  2. Cherche dans les Brouillons ceux dont l'objet commence par le prefixe
     "SEND" (configurable).
  3. Pour chacun : enleve le prefixe, envoie reellement par SMTP (en reutilisant
     les garde-fous de alpha_mailer : liste blanche, plafond/jour, audit), puis
     supprime le brouillon.

Ainsi la routine cloud (ou toi, depuis le telephone) n'a qu'a creer un
brouillon dont l'objet commence par "SEND" — et il part au prochain passage.

Identifiants lus depuis l'environnement ou le .env (voir alpha_mailer.py) :
  ALPHA_MAILER_USER, ALPHA_MAILER_APP_PASSWORD, ALPHA_MAILER_WHITELIST
  ALPHA_MAILER_OUTBOX_PREFIX  (optionnel, defaut "SEND")

Usage :
  python alpha_mailer_outbox.py            # traite les brouillons "SEND"
  python alpha_mailer_outbox.py --dry-run  # liste sans envoyer ni supprimer
"""

import argparse
import email
import email.utils
import imaplib
import ssl
import sys
from email.header import decode_header, make_header
from email.message import EmailMessage

import alpha_mailer as am

IMAP_HOST = "imap.gmail.com"
IMAP_PORT = 993


def _decode(value):
    if not value:
        return ""
    try:
        return str(make_header(decode_header(value)))
    except Exception:
        return value


def _plain_body(msg):
    """Extrait le corps texte brut d'un message email.message.Message."""
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain" and \
                    "attachment" not in str(part.get("Content-Disposition", "")):
                payload = part.get_payload(decode=True)
                if payload is not None:
                    charset = part.get_content_charset() or "utf-8"
                    return payload.decode(charset, errors="replace")
        return ""
    payload = msg.get_payload(decode=True)
    if payload is None:
        return msg.get_payload()
    charset = msg.get_content_charset() or "utf-8"
    return payload.decode(charset, errors="replace")


def find_drafts_folder(imap):
    """Trouve le dossier Brouillons via le flag special-use \\Drafts.

    Fallback sur les noms connus (Gmail EN/FR) si le flag est absent.
    """
    typ, data = imap.list()
    if typ == "OK":
        for raw in data:
            line = raw.decode(errors="replace") if isinstance(raw, bytes) else str(raw)
            if "\\Drafts" in line:
                # Le nom du dossier est entre guillemets en fin de ligne.
                return line.split(' "/" ')[-1].strip().strip('"')
    for name in ('[Gmail]/Drafts', '[Gmail]/Brouillons', 'Drafts', 'Brouillons'):
        typ, _ = imap.select(name, readonly=True)
        if typ == "OK":
            return name
    return None


def process(dry_run=False):
    am.load_dotenv()
    user = am._env("ALPHA_MAILER_USER")
    password = am._env("ALPHA_MAILER_APP_PASSWORD")
    whitelist = am.load_whitelist()
    prefix = (am.os.environ.get("ALPHA_MAILER_OUTBOX_PREFIX") or "SEND").strip()

    ctx = ssl.create_default_context()
    imap = imaplib.IMAP4_SSL(IMAP_HOST, IMAP_PORT, ssl_context=ctx)
    try:
        imap.login(user, password)
    except imaplib.IMAP4.error as exc:
        sys.exit(f"[outbox] Echec de connexion IMAP : {exc}")

    folder = find_drafts_folder(imap)
    if not folder:
        imap.logout()
        sys.exit("[outbox] Dossier Brouillons introuvable.")

    typ, _ = imap.select(f'"{folder}"')
    if typ != "OK":
        imap.logout()
        sys.exit(f"[outbox] Impossible d'ouvrir le dossier {folder}.")

    typ, data = imap.uid("search", None, "HEADER", "Subject", prefix)
    uids = data[0].split() if (typ == "OK" and data and data[0]) else []

    sent = skipped = 0
    for uid in uids:
        typ, msgdata = imap.uid("fetch", uid, "(RFC822)")
        if typ != "OK" or not msgdata or not msgdata[0]:
            continue
        msg = email.message_from_bytes(msgdata[0][1])
        subject = _decode(msg.get("Subject", ""))

        # On ne garde que ceux qui COMMENCENT reellement par le prefixe.
        if not subject.lstrip().upper().startswith(prefix.upper()):
            continue

        clean_subject = subject.lstrip()[len(prefix):].lstrip(" :-—").strip()
        recipients = [a.strip() for a in (msg.get("To") or "").split(",") if a.strip()]
        body = _plain_body(msg)

        if not recipients:
            print(f"[outbox] Ignore (aucun destinataire) : {subject!r}")
            skipped += 1
            continue

        for to in recipients:
            addr = email.utils.parseaddr(to)[1].lower()
            if addr not in whitelist:
                am.audit({"status": "blocked", "reason": "not_whitelisted",
                          "to": addr, "via": "outbox"})
                print(f"[outbox] Hors liste blanche, non envoye : {addr}")
                skipped += 1
                continue
            if am.sends_today() >= am.DAILY_CAP:
                am.audit({"status": "blocked", "reason": "daily_cap", "to": addr,
                          "via": "outbox"})
                print(f"[outbox] Plafond journalier atteint, arret.")
                imap.logout()
                _summary(sent, skipped)
                return

            if dry_run:
                print(f"[outbox] DRY-RUN — enverrait a {addr} : {clean_subject!r}")
                continue

            out = EmailMessage()
            out["From"] = user
            out["To"] = addr
            out["Subject"] = clean_subject
            out.set_content(body)
            try:
                am._smtp_send(out, user, password, ctx)
            except OSError as exc:
                am.audit({"status": "error", "reason": "smtp_unreachable",
                          "to": addr, "via": "outbox", "detail": str(exc)})
                sys.exit("[outbox] SMTP injoignable (reseau bloque ?). "
                         "A lancer sur une machine a reseau ouvert.")
            am.audit({"status": "sent", "to": addr, "subject": clean_subject,
                      "via": "outbox"})
            print(f"[outbox] Envoye a {addr} : {clean_subject!r}")
            sent += 1

        # Brouillon traite : on le supprime (sauf dry-run).
        if not dry_run:
            imap.uid("store", uid, "+FLAGS", "(\\Deleted)")

    if not dry_run:
        imap.expunge()
    imap.logout()
    _summary(sent, skipped)


def _summary(sent, skipped):
    print(f"[outbox] Termine — envoyes: {sent}, ignores: {skipped}, "
          f"total aujourd'hui: {am.sends_today()}/{am.DAILY_CAP}")


def main():
    p = argparse.ArgumentParser(description="Alpha Mailer Outbox — envoie les brouillons 'SEND'")
    p.add_argument("--dry-run", action="store_true",
                   help="Liste ce qui serait envoye sans envoyer ni supprimer")
    args = p.parse_args()
    process(dry_run=args.dry_run)


if __name__ == "__main__":
    main()
