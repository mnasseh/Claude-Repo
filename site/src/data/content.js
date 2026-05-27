// All content extracted verbatim from alpha-clean.fr — no lorem ipsum.

export const company = {
  name: 'Alpha Clean',
  tagline: "L'assurance d'un double contrôle : IA & HUMAIN.",
  mission:
    "Services de nettoyage spécialisés pour les campings, le milieu médical (laboratoires, cliniques), et le secteur des loisirs.",
  zone: 'Nouvelle-Aquitaine / Bordeaux',
  phone: '+33 05 47 74 09 24',
  email: 'contact.clean@grpalpha.com',
  address: '39 rue Robert Caumont, 33000 Bordeaux',
  social: {
    instagram: 'https://www.instagram.com/',
    linkedin: 'https://www.linkedin.com/',
  },
};

export const stats = [
  { value: 24, suffix: 'h', label: 'Réponse garantie sous 24h' },
  { value: 80, suffix: '%', label: 'Gain de temps machine en cryogénie' },
  { value: 100, suffix: '%', label: 'Traçabilité GPS + photos' },
  { value: 4, suffix: 'h', label: 'Réponse expertise sous 4h ouvrées' },
];

export const sectors = [
  {
    key: 'medical',
    title: 'Milieu Médical',
    desc: "Désinfection certifiée et traçabilité des interventions pour cliniques et laboratoires.",
    tone: 'cyan',
  },
  {
    key: 'camping',
    title: 'Campings & HPA',
    desc: "Nettoyage des mobil-homes, sanitaires et parties communes pour garantir un cadre propre et accueillant à vos vacanciers.",
    tone: 'cream',
  },
  {
    key: 'loisirs',
    title: 'Loisirs & événements',
    desc: 'Gestion du nettoyage pour les grands flux dans les bars et boîtes de nuit.',
    tone: 'cyan',
  },
  {
    key: 'tertiaire',
    title: 'Tertiaire',
    desc: "Bureaux, parties communes, vitres, moquettes — l'excellence opérationnelle quotidienne.",
    tone: 'cream',
  },
];

export const services = [
  { title: "Nettoyage d'événements", icon: 'CalendarCheck' },
  { title: 'Nettoyage après Travaux', icon: 'Hammer' },
  { title: 'Nettoyage de Vitres', icon: 'PanelTop' },
  { title: 'Entretien des Parties Communes', icon: 'Building2' },
  { title: 'Nettoyage de Moquettes et Tapisseries', icon: 'Rug' },
  { title: 'Nettoyage Commercial et Industriel', icon: 'Factory' },
];

export const packs = [
  {
    name: 'Pack Duo',
    composition: 'Sécurité + Nettoyage',
    accent: 'cyan',
    bullet: ['Coordination unique', 'Reporting consolidé', 'Tarif négocié'],
  },
  {
    name: 'Pack Duo Événementiel',
    composition: 'Nettoyage + Événementiel',
    accent: 'cream',
    bullet: ['Montage / démontage', 'Équipes briefées', 'Réactivité 24/7'],
    featured: true,
  },
  {
    name: 'Pack Trio',
    composition: 'Sécurité + Nettoyage + Événementiel',
    accent: 'cyan',
    bullet: ['Couverture totale', 'Un seul interlocuteur', 'SLA premium'],
  },
];

export const techFeatures = [
  {
    title: 'Planification intelligente',
    desc: 'Les missions sont attribuées par algorithme selon les compétences, la zone et les SLA contractuels.',
    icon: 'Workflow',
  },
  {
    title: 'Traçabilité temps réel',
    desc: 'Géofencing GPS et photos horodatées — chaque passage est certifié, chaque preuve est disponible.',
    icon: 'MapPin',
  },
  {
    title: 'Contrôle qualité IA',
    desc: "Validation automatique des standards à partir des photos d'intervention. Les écarts remontent immédiatement.",
    icon: 'Sparkles',
  },
  {
    title: 'SOS & dashboard centralisé',
    desc: 'Signalement en un clic, tableau de bord centralisé, KPIs par site et par équipe.',
    icon: 'Gauge',
  },
];

export const process = [
  {
    n: '01',
    title: 'Audit gratuit sur site',
    desc: "Un expert vient cartographier vos surfaces, vos points critiques et vos contraintes horaires. Devis flash en 24h sur simple photo.",
  },
  {
    n: '02',
    title: 'Plan de prestation digital',
    desc: 'Cahier des charges, fréquences, équipes nommées et standards de propreté validés conjointement dans Alpha Clean Control.',
  },
  {
    n: '03',
    title: 'Intervention tracée',
    desc: "Techniciens certifiés, preuves de passage par géofencing, photos avant/après centralisées en temps réel.",
  },
  {
    n: '04',
    title: 'Validation IA + humaine',
    desc: "L'IA contrôle les standards à partir des photos. Un responsable humain valide les écarts. Vous voyez tout, en direct.",
  },
];

export const cryoBenefits = [
  {
    title: 'Zéro Humidité',
    desc: "Idéal pour l'agroalimentaire, l'électrique et les armoires de commande. Pas de risque de court-circuit.",
  },
  {
    title: 'Zéro Résidu',
    desc: 'La glace carbonique se sublime instantanément. Il ne reste que la pollution détachée du support.',
  },
  {
    title: 'Zéro Démontage',
    desc: 'Nettoyage directement sur la ligne de production. Gain de temps machine estimé à 80%.',
  },
];

export const cryoSectors = [
  {
    title: 'Industrie & Agroalimentaire',
    desc: "Élimination radicale des graisses, colles et résidus de production sur vos machines. Procédé sec, sans chimie, sans démontage.",
  },
  {
    title: 'Aéronautique',
    desc: "Nettoyage de haute précision pour les moteurs, trains d'atterrissage et composants délicats. Solution non-abrasive.",
  },
  {
    title: 'Patrimoine & Rénovation',
    desc: "Restauration délicate des monuments, façades et boiseries. Retire la pollution sans altérer le support d'origine.",
  },
];

export const videos = [
  { id: 'IGGWbcEiXts', title: 'Décapage cryogénique — démonstration industrielle' },
  { id: 'MJWjR3GHSMA', title: 'Cryogénie sur ligne de production' },
  { id: 'zA2OYILlHcQ', title: 'Restauration patrimoine — pierre de Bordeaux' },
];

export const testimonials = [
  {
    quote: "Service irréprochable, l'appli change tout.",
    author: 'Sarah M.',
    role: 'Cliente professionnelle',
  },
  {
    quote: 'Traçabilité parfaite, sérénité totale.',
    author: 'Armand LEGUET',
    role: 'Responsable de site',
  },
  {
    quote: 'Réactivité et professionnalisme.',
    author: 'Antoine B.',
    role: 'Direction des opérations',
  },
];

export const clientLogos = Array.from({ length: 11 }, (_, i) => `/logos/logo${i + 1}.png`);

export const navItems = [
  { label: 'Secteurs', href: '#sectors' },
  { label: 'Technologie', href: '#tech' },
  { label: 'Cryogénie', href: '#cryo' },
  { label: 'Équipe', href: '#team' },
  { label: 'Contact', href: '#contact' },
];
