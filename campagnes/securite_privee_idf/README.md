# Campagne test — Sécurité privée Île-de-France

Première campagne du partenaire francilien : sécurité privée seule, **600 €/mois**,
Paris + petite couronne. Les autres métiers (propreté, peinture & plâtrerie) seront
ajoutés selon les résultats.

Source des mots-clés : étude « La demande client en Île-de-France sur Google »
(Groupe Alpha Holding, 24/09/2026, Keyword Planner, 12 mois glissants).

## Fichiers

- `build_editor_csv.py` : génère le fichier d'import et vérifie la longueur des textes
  (titres ≤ 30, descriptions ≤ 90, chemins ≤ 15 caractères).
- `google_ads_editor_import.csv` : fichier à importer dans Google Ads Editor.

Pour régénérer après modification : `python3 build_editor_csv.py`

## Contenu de la campagne

| Groupe d'annonces | CPC max | Mots-clés |
|---|---|---|
| Société de sécurité | 2,50 € | société / entreprise / agence de sécurité (privée), sécurité privée |
| Gardiennage et surveillance | 2,00 € | société de gardiennage, gardiennage de site / chantier, surveillance de site / locaux |
| Agents de sécurité | 2,00 € | location / tarif / devis agent de sécurité, agent de sécurité magasin |
| Sécurité événementielle | 2,00 € | sécurité événementielle, sécurité soirée / mariage / événement |

- Correspondance exacte + expression uniquement (pas de requête large).
- « agent de sécurité privée » et « agent de prévention et de sécurité » en exact seulement :
  ces requêtes viennent surtout de personnes qui cherchent un emploi.
- 78 mots-clés négatifs au niveau campagne : emploi / formation, autres types de sécurité
  (sociale, informatique, incendie, vidéosurveillance…), grands concurrents, autres villes.
- 1 annonce responsive par groupe (15 titres, 4 descriptions).
- Budget : 19,74 €/jour, soit environ 600 €/mois (Google plafonne le mois à 30,4 × budget jour).
- Enchères : CPC manuel au départ, puis « Maximiser les conversions » après ~30 conversions.
- La campagne est importée **en pause**.

## Avant l'import

1. Remplacer `DOMAINE` dans `build_editor_csv.py` par le vrai domaine, puis régénérer.
2. Vérifier avec le partenaire :
   - son **numéro d'autorisation CNAPS** (les titres « Entreprise Autorisée CNAPS » n'ont pas le droit de tourner sans) ;
   - qu'il est capable de répondre aux devis sous 48 h (promesse faite dans les annonces) ;
   - s'il fait aussi du SSIAP (sécurité incendie) ou de la cynophilie (maître-chien) : si oui,
     retirer « ssiap » des négatifs et ajouter un groupe d'annonces dédié.

## Réglages à faire à la main dans Google Ads Editor après import

- **Zones** : Paris (75), Hauts-de-Seine (92), Seine-Saint-Denis (93), Val-de-Marne (94).
- **Option de zone** : « Présence : personnes se trouvant dans vos zones ciblées »
  (pas « Présence ou intérêt »).
- **Réseaux** : décocher les partenaires du Réseau de Recherche et le Réseau Display.
- **Accroches** (≤ 25 car.) : `Devis gratuit sous 48 h`, `Agents carte pro CNAPS`,
  `Paris et petite couronne`, `Interlocuteur dédié`, `Contrat sur mesure`.
- **Extraits de site structurés**, en-tête « Services » : Gardiennage, Surveillance de site,
  Sécurité événementielle, Agents de magasin, Rondes de surveillance.
- **Extension d'appel** : numéro du partenaire, avec suivi des appels activé.
- **Liens annexes** : à ajouter quand les pages du site existent.

## La page d'atterrissage (`/securite-privee`)

- Obligation légale (art. L612-14 du Code de la sécurité intérieure) : afficher le **numéro
  d'autorisation CNAPS** et la mention « L'autorisation d'exercice délivrée par le CNAPS ne
  confère aucune prérogative de puissance publique à l'entreprise ou aux personnes qui en bénéficient. »
- Bouton d'appel, formulaire de devis relié au CRM, zone couverte, types de missions.

## Suivi des conversions (avant de lancer)

- Envoi du formulaire de devis (conversion principale).
- Appels depuis les annonces de plus de 60 secondes, et clics sur le numéro du site.
- Consent Mode v2 + bandeau cookies conforme CNIL.
- Import des devis signés depuis le CRM (conversions hors ligne).

## Ordre de grandeur attendu (hypothèses de l'étude, pas des mesures)

600 € ÷ 1,61 € de CPC ≈ 370 clics/mois → 5 % de conversion ≈ 18 demandes de devis
→ 57 % de transformation (chiffre B2B Alpha) ≈ 10 contrats signés.

Il y a un risque que la campagne ne dépense pas tout son budget : le marché sécurité est
petit (13 120 recherches/mois sur toute l'Île-de-France) et on le cible de façon stricte.
Si moins de ~70 % du budget est dépensé après 2 semaines, ajouter la grande couronne
(77, 78, 91, 95), à condition que le partenaire puisse intervenir dans ces départements.
