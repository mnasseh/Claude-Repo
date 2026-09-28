import csv
import os

# A remplir avant import (le site du partenaire n'existe pas encore)
DOMAINE = "VOTRE-DOMAINE.fr"
LANDING = f"https://{DOMAINE}/securite-privee"

CAMPAGNE = "IDF - Securite privee - Search"
BUDGET_MENSUEL = 600
BUDGET_JOUR = round(BUDGET_MENSUEL / 30.4, 2)  # Google plafonne le mois a 30,4 x budget jour

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "google_ads_editor_import.csv")

AD_GROUPS = {
    "Societe de securite": {
        "cpc": 2.50,
        "exact_phrase": [
            "société de sécurité", "société de sécurité privée",
            "entreprise de sécurité", "entreprise de sécurité privée",
            "agence de sécurité", "agence de sécurité privée",
            "sécurité privée",
        ],
        "exact": [],
        "path": ("securite", "paris"),
        "headlines": [
            "Société de Sécurité Paris", "Agence de Sécurité Privée",
            "Sécurité Privée Île-de-France", "Devis Gratuit Sous 48 h",
            "Agents Qualifiés Carte Pro", "Paris et Petite Couronne",
            "Entreprise Autorisée CNAPS", "Gardiennage et Surveillance",
            "Entreprises, Commerces, Sites", "Demandez Votre Devis",
            "Un Interlocuteur Dédié", "Sécurité de Vos Locaux",
            "Contrat Adapté à Vos Besoins", "Étude de Vos Besoins Offerte",
            "Agents de Sécurité Formés",
        ],
    },
    "Gardiennage et surveillance": {
        "cpc": 2.00,
        "exact_phrase": [
            "société de gardiennage", "entreprise de gardiennage",
            "gardiennage de site", "gardiennage chantier",
            "surveillance de chantier", "surveillance de site",
            "surveillance de locaux", "rondes de surveillance",
        ],
        "exact": ["gardiennage", "agent de surveillance"],
        "path": ("gardiennage", "paris"),
        "headlines": [
            "Société de Gardiennage Paris", "Gardiennage Site et Chantier",
            "Surveillance de Vos Locaux", "Rondes de Surveillance",
            "Devis Gratuit Sous 48 h", "Agents Qualifiés Carte Pro",
            "Paris et Petite Couronne", "Entreprise Autorisée CNAPS",
            "Protégez Votre Chantier", "Demandez Votre Devis",
            "Un Interlocuteur Dédié", "Contrat Adapté à Vos Besoins",
            "Sécurité Privée Île-de-France", "Étude de Vos Besoins Offerte",
            "Surveillance Jour et Nuit",
        ],
    },
    "Agents de securite": {
        "cpc": 2.00,
        "exact_phrase": [
            "location agent de sécurité", "agent de sécurité pour entreprise",
            "agent de sécurité magasin", "prix agent de sécurité",
            "tarif agent de sécurité", "devis agent de sécurité",
        ],
        # Requetes a forte composante "emploi" : exact uniquement
        "exact": ["agent de sécurité privée", "agent de prévention et de sécurité"],
        "path": ("agents", "securite"),
        "headlines": [
            "Agents de Sécurité à Paris", "Location d'Agent de Sécurité",
            "Agents Qualifiés Carte Pro", "Devis Gratuit Sous 48 h",
            "Agents Pour Magasins, Bureaux", "Paris et Petite Couronne",
            "Entreprise Autorisée CNAPS", "Demandez Votre Devis",
            "Tarif Adapté à Votre Besoin", "Un Interlocuteur Dédié",
            "Sécurité Privée Île-de-France", "Agents de Sécurité Formés",
            "Contrat Adapté à Vos Besoins", "Étude de Vos Besoins Offerte",
            "Sécurité de Vos Locaux",
        ],
    },
    "Securite evenementielle": {
        "cpc": 2.00,
        "exact_phrase": [
            "sécurité événementielle", "société de sécurité événementielle",
            "agent de sécurité événementiel", "sécurité événement",
            "sécurité soirée", "sécurité mariage",
        ],
        "exact": [],
        "path": ("evenementiel", "paris"),
        "headlines": [
            "Sécurité Événementielle Paris", "Agents Pour Vos Événements",
            "Soirées, Salons, Mariages", "Devis Gratuit Sous 48 h",
            "Agents Qualifiés Carte Pro", "Entreprise Autorisée CNAPS",
            "Paris et Petite Couronne", "Contrôle d'Accès et Filtrage",
            "Demandez Votre Devis", "Un Interlocuteur Dédié",
            "Sécurité Privée Île-de-France", "Dispositif Sur Mesure",
            "Étude de Vos Besoins Offerte", "Agents de Sécurité Formés",
            "Événements Pros et Privés",
        ],
    },
}

DESCRIPTIONS = [
    "Société de sécurité privée en Île-de-France. Agents qualifiés, devis gratuit sous 48 h.",
    "Gardiennage, surveillance de sites, sécurité événementielle : une solution sur mesure.",
    "Paris, Hauts-de-Seine, Seine-Saint-Denis, Val-de-Marne. Contactez-nous dès aujourd'hui.",
    "Entreprise autorisée par le CNAPS. Agents titulaires de la carte professionnelle.",
]

NEGATIFS = [
    # Emploi / formation
    "emploi", "emplois", "recrutement", "recrute", "offre d'emploi", "job", "jobs",
    "salaire", "salaires", "formation", "formations", "cqp", "carte pro",
    "carte professionnelle", "cnaps", "devenir", "fiche métier", "stage", "alternance",
    "apprentissage", "cv", "lettre de motivation", "indeed", "france travail",
    "pôle emploi", "intérim", "interim", "convention collective", "grille salariale",
    "examen", "diplôme", "concours", "bts", "cours", "pdf", "définition", "wikipedia",
    # Produits / autres securites
    "uniforme", "tenue", "chaussures", "gilet", "caméra", "alarme", "vidéosurveillance",
    "télésurveillance", "domotique", "serrurier", "sécurité sociale", "sécurité routière",
    "sécurité informatique", "cybersécurité", "sécurité au travail", "sécurité incendie",
    "ssiap", "numéro de sécurité", "code de sécurité", "ameli",
    "police", "gendarmerie", "armée", "militaire", "pompier",
    # Concurrents majeurs
    "securitas", "samsic", "onet", "atalian", "seris", "fiducial", "g4s", "mondial protection",
    # Autres villes
    "lyon", "marseille", "lille", "bordeaux", "toulouse", "nice", "nantes", "strasbourg",
]

COLS = (
    ["Campaign", "Campaign Type", "Networks", "Budget", "Budget type",
     "Bid Strategy Type", "Languages", "Campaign Status",
     "Ad Group", "Max CPC", "Ad Group Status",
     "Keyword", "Criterion Type", "Ad type"]
    + [f"Headline {i}" for i in range(1, 16)]
    + [f"Description {i}" for i in range(1, 5)]
    + ["Path 1", "Path 2", "Final URL", "Status"]
)

errors = []
def check(text, limit, where):
    if len(text) > limit:
        errors.append(f"{where}: '{text}' = {len(text)} car. (max {limit})")

rows = [{
    "Campaign": CAMPAGNE, "Campaign Type": "Search", "Networks": "Google search",
    "Budget": f"{BUDGET_JOUR:.2f}", "Budget type": "Daily",
    "Bid Strategy Type": "Manual CPC", "Languages": "fr", "Campaign Status": "Paused",
}]

for kw in NEGATIFS:
    rows.append({"Campaign": CAMPAGNE, "Keyword": kw, "Criterion Type": "Negative Phrase"})

n_kw = 0
for name, ag in AD_GROUPS.items():
    rows.append({"Campaign": CAMPAGNE, "Ad Group": name,
                 "Max CPC": f"{ag['cpc']:.2f}", "Ad Group Status": "Enabled"})
    for kw in ag["exact_phrase"]:
        for mt in ("Exact", "Phrase"):
            rows.append({"Campaign": CAMPAGNE, "Ad Group": name, "Keyword": kw, "Criterion Type": mt})
            n_kw += 1
    for kw in ag["exact"]:
        rows.append({"Campaign": CAMPAGNE, "Ad Group": name, "Keyword": kw, "Criterion Type": "Exact"})
        n_kw += 1

    heads = ag["headlines"]
    assert len(heads) == len(set(heads)) == 15, name
    ad = {"Campaign": CAMPAGNE, "Ad Group": name, "Ad type": "Responsive search ad",
          "Path 1": ag["path"][0], "Path 2": ag["path"][1],
          "Final URL": LANDING, "Status": "Enabled"}
    for i, h in enumerate(heads, 1):
        check(h, 30, f"{name} titre {i}")
        ad[f"Headline {i}"] = h
    for i, d in enumerate(DESCRIPTIONS, 1):
        check(d, 90, f"description {i}")
        ad[f"Description {i}"] = d
    for p in ag["path"]:
        check(p, 15, f"{name} chemin")
    rows.append(ad)

if errors:
    raise SystemExit("Textes trop longs :\n" + "\n".join(errors))

with open(OUT, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=COLS)
    w.writeheader()
    w.writerows(rows)

print(f"Campagne        : {CAMPAGNE} (en pause)")
print(f"Budget          : {BUDGET_JOUR:.2f} EUR/jour (~{BUDGET_MENSUEL} EUR/mois)")
print(f"Groupes         : {len(AD_GROUPS)}")
print(f"Mots-cles       : {n_kw}")
print(f"Negatifs        : {len(NEGATIFS)}")
print(f"Annonces RSA    : {len(AD_GROUPS)} (15 titres, 4 descriptions chacune)")
if "VOTRE-DOMAINE" in DOMAINE:
    print("ATTENTION : renseigner DOMAINE avant import (URL finale factice).")
