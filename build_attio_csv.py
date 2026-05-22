import csv

SRC = "/root/.claude/uploads/487c1e19-47b7-41d7-9a99-ff4bca1eb537/a9182e4a-contacts05222026.csv"
OUT = "/home/user/Claude-Repo/attio_import.csv"

OUT_COLS = [
    "First name", "Last name", "Full name", "Job title",
    "Company", "Company website", "Email", "Email deliverability",
    "Company industry", "Company size", "Location", "LinkedIn URL",
]

rows = []
seen = set()
with open(SRC, newline="", encoding="utf-8") as f:
    for r in csv.DictReader(f):
        key = (r.get("linkedinUrl") or "").strip().lower()
        if key and key in seen:
            continue
        if key:
            seen.add(key)
        first = (r.get("firstName") or "").strip()
        last = (r.get("lastName") or "").strip()
        full = " ".join(p for p in (first, last) if p)
        industry = (r.get("companyIndustry") or "").strip() or (r.get("industry") or "").strip()
        location = (r.get("location") or "").strip() or (r.get("companyLocation") or "").strip()
        rows.append({
            "First name": first,
            "Last name": last,
            "Full name": full,
            "Job title": (r.get("jobTitle") or "").strip(),
            "Company": (r.get("companyName") or "").strip(),
            "Company website": (r.get("companyWebsite") or "").strip(),
            "Email": (r.get("email") or "").strip(),
            "Email deliverability": (r.get("emailDeliverability") or "").strip(),
            "Company industry": industry,
            "Company size": (r.get("companySize") or "").strip(),
            "Location": location,
            "LinkedIn URL": (r.get("linkedinUrl") or "").strip(),
        })

with open(OUT, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=OUT_COLS)
    w.writeheader()
    w.writerows(rows)

n = len(rows)
def filled(col):
    return sum(1 for x in rows if x[col])

print(f"Contacts ecrits        : {n}")
print(f"Avec email             : {filled('Email')}  ({filled('Email')*100//n}%)")
deliv = sum(1 for x in rows if x["Email deliverability"].lower() == "deliverable")
print(f"  dont 'deliverable'   : {deliv}")
print(f"Avec entreprise        : {filled('Company')}  ({filled('Company')*100//n}%)")
print(f"Avec site entreprise   : {filled('Company website')}")
print(f"Avec titre             : {filled('Job title')}")
print(f"Avec secteur           : {filled('Company industry')}")
print(f"Avec taille entreprise : {filled('Company size')}")
print(f"Avec localisation      : {filled('Location')}")
