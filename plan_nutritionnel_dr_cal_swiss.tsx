import React, { useState, useMemo, useEffect } from 'react';

/* =============================================================================
   DR CAL — Plan Nutritionnel
   Redesign « Swiss / International Typographic Style »
   - Grille 12 colonnes, filets hairline, zéro ombre
   - Palette restreinte : papier / noir / un accent rouge + un gris
   - Chiffres tabulaires comme éléments graphiques, labels capitales lettrées
   La logique (états, appels Gemini, calculs) est conservée à l'identique.
   ============================================================================= */

// Configuration de l'API Gemini (La clé est injectée automatiquement par l'environnement d'exécution)
const apiKey = "";

// Palette Swiss
const INK = "#0A0A0A";       // noir
const PAPER = "#F4F3EE";     // papier
const ACCENT = "#E63329";    // rouge suisse (Protéines / clé)
const GRAPHITE = "#8C8B83";  // gris (Lipides)
const RULE = "#0A0A0A";      // filets

// Fonction utilitaire de pause pour le backoff exponentiel
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Appel API pour l'analyse d'image (Scanner d'assiette par photo)
async function analyzeImageWithGemini(base64Image, mimeType) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const systemPrompt = `Tu es un nutritionniste de précision.
Analyse l'image du plat fournie. Estime ses calories et ses macronutriments (Protéines, Glucides, Lipides en grammes).
Renvoie obligatoirement un objet JSON strict sans aucun formatage Markdown ni texte autour.
Le format attendu est exactement :
{
  "name": "Nom du plat identifié en français",
  "cal": 350,
  "prot": 25,
  "carb": 30,
  "fat": 12,
  "explanation": "Brève explication de 2 phrases maximum en français sur la qualité nutritionnelle de ce plat par rapport à la perte de ventre et au CrossFit."
}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          { text: systemPrompt },
          { inlineData: { mimeType, data: base64Image } }
        ]
      }
    ],
    generationConfig: { responseMimeType: "application/json" }
  };

  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textResponse) return JSON.parse(textResponse);
      throw new Error("Réponse vide de l'API");
    } catch (error) {
      attempts++;
      if (attempts >= maxAttempts) throw error;
      await delay(Math.pow(2, attempts - 1) * 1000);
    }
  }
}

// Appel API pour l'estimation textuelle rapide (Bouton "+")
async function analyzeTextMealWithGemini(descriptionText) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const systemPrompt = `Tu es un expert nutritionniste. Évalue la description textuelle du plat consommé.
Estime les calories (cal), protéines (prot) en g, glucides (carb) en g, et lipides (fat) en g de manière réaliste et précise.
Renvoie obligatoirement un objet JSON strict en français.
Le format attendu est :
{
  "name": "Nom du plat en français",
  "cal": 280,
  "prot": 22,
  "carb": 15,
  "fat": 8,
  "explanation": "Analyse rapide d'une phrase sur la pertinence pour le CrossFit intense et la perte de gras abdominal."
}`;

  const payload = {
    contents: [{ parts: [{ text: `Analyse ce repas : ${descriptionText}` }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: { responseMimeType: "application/json" }
  };

  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textResponse) return JSON.parse(textResponse);
      throw new Error("Aucune réponse");
    } catch (error) {
      attempts++;
      if (attempts >= maxAttempts) throw error;
      await delay(Math.pow(2, attempts - 1) * 1000);
    }
  }
}

/* --- Icônes : trait fin et net, cohérent avec la rigueur Swiss --- */
const UploadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);
const CheckIcon = ({ checked }) => (
  <span aria-hidden style={{ borderColor: INK, background: checked ? INK : "transparent" }} className="w-4 h-4 border flex items-center justify-center flex-shrink-0">
    {checked && (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={PAPER} strokeWidth="3" strokeLinecap="square"><path d="M20 6 9 17l-5-5"/></svg>
    )}
  </span>
);
const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);

/* --- Sous-composants de mise en page Swiss --- */

// En-tête de section numéroté (01 — TITRE)
const SectionHead = ({ index, title, note }) => (
  <div className="flex items-baseline justify-between border-b border-black pb-1.5 mb-4">
    <div className="flex items-baseline gap-3">
      <span className="text-[11px] font-bold tabular-nums tracking-tight" style={{ color: ACCENT }}>{index}</span>
      <h2 className="text-[12px] font-bold uppercase tracking-[0.18em]">{title}</h2>
    </div>
    {note && <span className="text-[10px] uppercase tracking-[0.15em] text-neutral-500">{note}</span>}
  </div>
);

// Chip de choix rectangulaire (sélectionné = plein noir)
const Chip = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] border transition-colors"
    style={active
      ? { background: INK, color: PAPER, borderColor: INK }
      : { background: "transparent", color: INK, borderColor: "#C9C8C0" }}
  >
    {children}
  </button>
);

// Pastille carrée + heure (langage Swiss : carré plein, chiffres tabulaires)
const TimeTag = ({ time, color }) => (
  <div className="flex items-center gap-2">
    <span className="w-2.5 h-2.5 inline-block" style={{ background: color }} />
    <span className="text-[11px] font-bold tabular-nums tracking-tight">{time}</span>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('plan'); // 'plan' | 'courses'

  const [breakfastCarb, setBreakfastCarb] = useState('aucun');
  const [lunchProtein, setLunchProtein] = useState('aucun');
  const [snackChoice, setSnackChoice] = useState('aucun');
  const [dinnerProtein, setDinnerProtein] = useState('aucun');
  const [dinnerCarb, setDinnerCarb] = useState('aucun');

  const [waterCount, setWaterCount] = useState(0);
  const [supplements, setSupplements] = useState({ vitB: false, bcaa: false });

  const [scannedMeals, setScannedMeals] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState(null);
  const [scanPreview, setScanPreview] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customDescription, setCustomDescription] = useState('');
  const [isCalculatingCustom, setIsCalculatingCustom] = useState(false);

  // Police Inter (substitut Helvetica) — chiffres tabulaires activés en CSS
  useEffect(() => {
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const foodDatabase = {
    oeufs: { name: "2 Œufs entiers", cal: 140, prot: 13, carb: 1, fat: 10 },
    avoine: { name: "Flocons d'avoine (50g sec)", cal: 180, prot: 6, carb: 30, fat: 3 },
    pain_seigle: { name: "Pain de seigle complet (1 tranche)", cal: 110, prot: 3, carb: 22, fat: 1 },
    cafe: { name: "Café noir sans sucre", cal: 0, prot: 0, carb: 0, fat: 0 },
    yaourt: { name: "1 Yaourt nature (ou Skyr)", cal: 60, prot: 5, carb: 6, fat: 1 },
    bcaa: { name: "BCAA 8:1:1 BiotechUSA (1 dose)", cal: 30, prot: 7, carb: 0, fat: 0 },
    legumes_dej: { name: "Assiette de légumes variés + 1 c.à.c d'huile d'olive", cal: 80, prot: 3, carb: 10, fat: 5 },
    poulet: { name: "Blanc de poulet grillé (140g cuit)", cal: 200, prot: 31, carb: 0, fat: 3 },
    poisson_blanc: { name: "Filet de cabillaud / colin (150g)", cal: 120, prot: 26, carb: 0, fat: 1 },
    pomme_amandes: { name: "1 Pomme moyenne + 12 amandes (15g)", cal: 150, prot: 4, carb: 20, fat: 8 },
    banane: { name: "1 Petite banane", cal: 90, prot: 1, carb: 22, fat: 0 },
    boeuf_5: { name: "Bœuf haché 5% MG (140g)", cal: 190, prot: 29, carb: 0, fat: 7 },
    saumon: { name: "Pavé de saumon au four (130g)", cal: 240, prot: 26, carb: 0, fat: 15 },
    pommes_de_terre: { name: "Pommes de terre vapeur (130g)", cal: 110, prot: 2, carb: 24, fat: 0 },
    quinoa_boulgour: { name: "Mélange Quinoa & Boulgour (50g sec / Image U)", cal: 173, prot: 6.5, carb: 30.5, fat: 1.7 },
    lentilles: { name: "Lentilles Vertes (50g sec / Image U)", cal: 163, prot: 12.5, carb: 22.5, fat: 0.9 }
  };

  const targets = { cal: 1350, prot: 120, carb: 110, fat: 40 };

  const calculatedNutrition = useMemo(() => {
    const activeFoods = [];

    if (breakfastCarb !== 'aucun') {
      activeFoods.push(foodDatabase.oeufs);
      activeFoods.push(foodDatabase.cafe);
      if (breakfastCarb === 'avoine') activeFoods.push(foodDatabase.avoine);
      if (breakfastCarb === 'pain_seigle') activeFoods.push(foodDatabase.pain_seigle);
    }
    if (supplements.bcaa) activeFoods.push(foodDatabase.bcaa);
    if (lunchProtein !== 'aucun') {
      activeFoods.push(foodDatabase.yaourt);
      activeFoods.push(foodDatabase.legumes_dej);
      if (lunchProtein === 'poulet') activeFoods.push(foodDatabase.poulet);
      if (lunchProtein === 'poisson_blanc') activeFoods.push(foodDatabase.poisson_blanc);
    }
    if (snackChoice !== 'aucun') {
      if (snackChoice === 'pomme_amandes') activeFoods.push(foodDatabase.pomme_amandes);
      if (snackChoice === 'banane') activeFoods.push(foodDatabase.banane);
    }
    if (dinnerProtein !== 'aucun' || dinnerCarb !== 'aucun') {
      if (dinnerProtein === 'boeuf_5') activeFoods.push(foodDatabase.boeuf_5);
      if (dinnerProtein === 'saumon') activeFoods.push(foodDatabase.saumon);
      if (dinnerCarb === 'quinoa_boulgour') activeFoods.push(foodDatabase.quinoa_boulgour);
      if (dinnerCarb === 'lentilles') activeFoods.push(foodDatabase.lentilles);
      if (dinnerCarb === 'pommes_de_terre') activeFoods.push(foodDatabase.pommes_de_terre);
    }

    let currentCal = 0, currentProt = 0, currentCarb = 0, currentFat = 0;
    activeFoods.forEach(f => { currentCal += f.cal; currentProt += f.prot; currentCarb += f.carb; currentFat += f.fat; });
    scannedMeals.forEach(m => { currentCal += m.cal; currentProt += m.prot; currentCarb += m.carb; currentFat += m.fat; });

    return {
      calLeft: Math.max(targets.cal - currentCal, 0),
      protLeft: Math.max(targets.prot - currentProt, 0),
      carbLeft: Math.max(targets.carb - currentCarb, 0),
      fatLeft: Math.max(targets.fat - currentFat, 0),
      pct: Math.min(Math.round((currentCal / targets.cal) * 100), 100),
      totals: { cal: currentCal, prot: currentProt, carb: currentCarb, fat: currentFat }
    };
  }, [breakfastCarb, lunchProtein, snackChoice, dinnerProtein, dinnerCarb, scannedMeals, supplements]);

  // Données pour la barre stacked des macros (remplace le donut)
  const macroChartData = useMemo(() => {
    const { prot, carb, fat } = calculatedNutrition.totals;
    const totalGrams = prot + carb + fat;
    if (totalGrams === 0) return { totalGrams: 0, slices: [] };
    const slices = [
      { name: 'Protéines', short: 'PROT', value: prot, color: ACCENT, percent: (prot / totalGrams) * 100 },
      { name: 'Glucides', short: 'GLUC', value: carb, color: INK, percent: (carb / totalGrams) * 100 },
      { name: 'Lipides', short: 'LIP', value: fat, color: GRAPHITE, percent: (fat / totalGrams) * 100 }
    ];
    return { totalGrams, slices };
  }, [calculatedNutrition]);

  const handleAddCustomMeal = async (e) => {
    e.preventDefault();
    if (!customDescription.trim()) return;
    setIsCalculatingCustom(true);
    setScanError(null);
    try {
      const data = await analyzeTextMealWithGemini(customDescription);
      setScannedMeals(prev => [...prev, {
        id: Date.now(),
        name: data.name || "Repas ajouté",
        cal: Number(data.cal) || 250,
        prot: Number(data.prot) || 15,
        carb: Number(data.carb) || 20,
        fat: Number(data.fat) || 5,
        explanation: data.explanation || "Calculé d'après ta description.",
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      }]);
      setCustomDescription('');
      setIsAddModalOpen(false);
    } catch (err) {
      console.error(err);
      setScanError("Désolé, l'IA n'a pas pu évaluer ce texte. Réessaie avec des portions plus explicites.");
    } finally {
      setIsCalculatingCustom(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScanError(null);
    setIsScanning(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result.split(',')[1];
      setScanPreview(reader.result);
      try {
        const analyzedMeal = await analyzeImageWithGemini(base64Data, file.type);
        setScannedMeals(prev => [...prev, {
          id: Date.now(),
          name: analyzedMeal.name || "Plat Scanné",
          cal: Number(analyzedMeal.cal) || 300,
          prot: Number(analyzedMeal.prot) || 20,
          carb: Number(analyzedMeal.carb) || 30,
          fat: Number(analyzedMeal.fat) || 10,
          explanation: analyzedMeal.explanation || "Analysé à partir de l'image.",
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsScanning(false);
        setScanPreview(null);
      } catch (err) {
        console.error(err);
        setScanError("Échec de la numérisation. Assure-toi que la clé API est active.");
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeScannedMeal = (id) => setScannedMeals(prev => prev.filter(m => m.id !== id));

  const breakfastKcal = breakfastCarb === 'aucun' ? 0 : 140 + (breakfastCarb === 'avoine' ? 180 : 110);
  const lunchKcal = lunchProtein === 'aucun' ? 0 : 80 + 60 + (lunchProtein === 'poulet' ? 200 : 120);
  const snackKcal = snackChoice === 'aucun' ? 0 : (snackChoice === 'pomme_amandes' ? 150 : 90);
  const dinnerKcal =
    (dinnerProtein === 'boeuf_5' ? 190 : dinnerProtein === 'saumon' ? 240 : 0) +
    (dinnerCarb === 'quinoa_boulgour' ? 173 : dinnerCarb === 'lentilles' ? 163 : dinnerCarb === 'pommes_de_terre' ? 110 : 0);

  return (
    <div
      className="min-h-screen antialiased"
      style={{ background: PAPER, color: INK, fontFamily: "'Inter', Helvetica, Arial, sans-serif", fontFeatureSettings: "'tnum' 1, 'ss01' 1" }}
    >
      <style>{`
        .tabular-nums { font-variant-numeric: tabular-nums; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px);} to { opacity:1; transform:none; } }
        .animate-fade-in { animation: fadeIn .25s ease-out; }
        .grid-rule { background-image: linear-gradient(${RULE} 1px, transparent 1px); }
      `}</style>

      {/* ===================== EN-TÊTE ===================== */}
      <header className="max-w-md mx-auto px-6 pt-7">
        <div className="flex items-end justify-between border-b-2 border-black pb-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 text-[13px] font-black tracking-[-0.04em]" style={{ background: INK, color: PAPER }}>
                DR CAL
              </span>
              <span className="w-2.5 h-2.5 inline-block" style={{ background: ACCENT }} />
            </div>
            <h1 className="mt-2 text-[11px] font-bold uppercase tracking-[0.22em]">Projet Santé — CrossFit / Sèche</h1>
          </div>
          <span className="text-[10px] tabular-nums uppercase tracking-[0.12em] text-neutral-500">No. 01</span>
        </div>

        {/* Navigation : onglets soulignés (pas de pilules) */}
        <nav className="flex gap-7 mt-3">
          {[['plan', "Aujourd'hui"], ['courses', 'Courses']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="relative pb-2 text-[12px] font-bold uppercase tracking-[0.14em] transition-colors"
              style={{ color: activeTab === key ? INK : "#A3A299" }}
            >
              {label}
              {activeTab === key && <span className="absolute left-0 -bottom-[1px] w-full h-[2px]" style={{ background: ACCENT }} />}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-md mx-auto px-6 pt-8 pb-32">

        {activeTab === 'plan' ? (
          <>
            {/* ===================== 00 — BILAN DU JOUR ===================== */}
            <section className="mb-12">
              {/* Chiffre héros : calories restantes */}
              <div className="border-y-2 border-black py-5">
                <div className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-7">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Calories restantes</span>
                    <div className="flex items-start gap-1.5 mt-1">
                      <span className="text-[64px] leading-[0.82] font-black tabular-nums tracking-[-0.04em]">
                        {calculatedNutrition.calLeft}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider mt-1.5 text-neutral-500">kcal</span>
                    </div>
                    <span className="text-[11px] tabular-nums text-neutral-500 mt-1 block">
                      Cible {targets.cal} · Consommé {calculatedNutrition.totals.cal}
                    </span>
                  </div>
                  <div className="col-span-5 text-right">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 block">Apport</span>
                    <span className="text-[40px] leading-none font-black tabular-nums tracking-[-0.03em]" style={{ color: ACCENT }}>
                      {calculatedNutrition.pct}<span className="text-[18px] align-top">%</span>
                    </span>
                  </div>
                </div>

                {/* Barre de progression calorique : règle pleine largeur */}
                <div className="mt-4 h-1.5 w-full" style={{ background: "#DAD8CF" }}>
                  <div className="h-full" style={{ width: `${calculatedNutrition.pct}%`, background: INK }} />
                </div>
              </div>

              {/* Répartition des macros : barre stacked + grille de valeurs */}
              <div className="mt-6">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Répartition macros</span>
                  <span className="text-[11px] tabular-nums font-bold">{macroChartData.totalGrams.toFixed(0)} g</span>
                </div>

                <div className="h-6 w-full flex border border-black overflow-hidden">
                  {macroChartData.totalGrams === 0 ? (
                    <div className="w-full flex items-center justify-center text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                      Aucun apport
                    </div>
                  ) : (
                    macroChartData.slices.map((s, i) => s.percent > 0 && (
                      <div key={i} style={{ width: `${s.percent}%`, background: s.color }} title={`${s.name} ${s.value}g`} />
                    ))
                  )}
                </div>

                {/* Légende / valeurs en grille 3 colonnes */}
                <div className="grid grid-cols-3 mt-3 border-t border-black">
                  {[
                    { lbl: 'Protéines', val: calculatedNutrition.totals.prot, left: calculatedNutrition.protLeft, c: ACCENT },
                    { lbl: 'Glucides', val: calculatedNutrition.totals.carb, left: calculatedNutrition.carbLeft, c: INK },
                    { lbl: 'Lipides', val: calculatedNutrition.totals.fat, left: calculatedNutrition.fatLeft, c: GRAPHITE }
                  ].map((m, i) => (
                    <div key={i} className={`py-2.5 ${i < 2 ? 'border-r border-black' : ''} px-0.5`}>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 inline-block" style={{ background: m.c }} />
                        <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-neutral-500">{m.lbl}</span>
                      </div>
                      <div className="mt-1 text-[20px] font-black tabular-nums tracking-[-0.03em] leading-none">
                        {Number(m.val).toFixed(0)}<span className="text-[10px] font-bold align-top ml-0.5">g</span>
                      </div>
                      <span className="text-[9px] tabular-nums text-neutral-400 uppercase tracking-wider">reste {Number(m.left).toFixed(0)}g</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ===================== 01 — SAISIE ===================== */}
            <section className="mb-12">
              <SectionHead index="01" title="Saisie rapide" note="IA Gemini" />
              <div className="grid grid-cols-12 gap-0 border border-black">
                <label className="col-span-8 cursor-pointer flex items-center gap-3 p-4 border-r border-black hover:bg-black/[0.03] transition-colors">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isScanning} />
                  <span className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ background: INK, color: PAPER }}>
                    <UploadIcon />
                  </span>
                  <span className="text-left">
                    <span className="block text-[12px] font-bold uppercase tracking-[0.08em]">Scanner l'assiette</span>
                    <span className="block text-[10px] text-neutral-500 uppercase tracking-wider">Photo → macros</span>
                  </span>
                </label>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="col-span-4 flex flex-col items-center justify-center gap-1 p-4 transition-colors hover:opacity-90"
                  style={{ background: ACCENT, color: PAPER }}
                >
                  <PlusIcon />
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em]">Texte</span>
                </button>
              </div>

              {isScanning && (
                <div className="mt-3 border border-black px-4 py-3 flex items-center gap-3">
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em]">Analyse Gemini en cours…</span>
                </div>
              )}
              {scanError && (
                <div className="mt-3 border-2 px-4 py-3 text-[11px] font-semibold" style={{ borderColor: ACCENT, color: ACCENT }}>
                  {scanError}
                </div>
              )}
            </section>

            {/* ===================== 02 — PLANNING DES REPAS ===================== */}
            <section className="mb-12">
              <SectionHead index="02" title="Planning des repas" note="4 services" />

              <div className="border-t border-black">
                {/* PETIT-DÉJEUNER */}
                <div className="py-5 border-b border-black">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center justify-between mb-2">
                        <TimeTag time="07:30" color={ACCENT} />
                        <span className="text-[9px] uppercase tracking-[0.18em] text-neutral-500 font-bold">Pré-WOD</span>
                      </div>
                      <h3 className="text-[15px] font-bold tracking-tight">
                        {breakfastCarb === 'aucun' ? 'Aucun aliment sélectionné' : '2 Œufs entiers · Café noir'}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Chip active={breakfastCarb === 'aucun'} onClick={() => setBreakfastCarb('aucun')}>Aucun</Chip>
                        <Chip active={breakfastCarb === 'avoine'} onClick={() => setBreakfastCarb('avoine')}>Avoine 50g · 180</Chip>
                        <Chip active={breakfastCarb === 'pain_seigle'} onClick={() => setBreakfastCarb('pain_seigle')}>Seigle 1 tr. · 110</Chip>
                      </div>
                    </div>
                    <div className="text-right w-16 flex-shrink-0">
                      <span className="text-[22px] font-black tabular-nums tracking-[-0.03em]">{~~breakfastKcal}</span>
                      <span className="block text-[9px] uppercase tracking-[0.1em] text-neutral-500">kcal</span>
                    </div>
                  </div>
                </div>

                {/* DÉJEUNER */}
                <div className="py-5 border-b border-black">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center justify-between mb-2">
                        <TimeTag time="12:30" color={INK} />
                        <span className="text-[9px] uppercase tracking-[0.18em] text-neutral-500 font-bold">Satiété</span>
                      </div>
                      <h3 className="text-[15px] font-bold tracking-tight">
                        {lunchProtein === 'aucun' ? 'Aucun aliment sélectionné' : 'Légumes · Yaourt · Protéine'}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Chip active={lunchProtein === 'aucun'} onClick={() => setLunchProtein('aucun')}>Aucun</Chip>
                        <Chip active={lunchProtein === 'poulet'} onClick={() => setLunchProtein('poulet')}>Poulet 140g · 200</Chip>
                        <Chip active={lunchProtein === 'poisson_blanc'} onClick={() => setLunchProtein('poisson_blanc')}>Colin/Cabillaud · 120</Chip>
                      </div>
                    </div>
                    <div className="text-right w-16 flex-shrink-0">
                      <span className="text-[22px] font-black tabular-nums tracking-[-0.03em]">{~~lunchKcal}</span>
                      <span className="block text-[9px] uppercase tracking-[0.1em] text-neutral-500">kcal</span>
                    </div>
                  </div>
                </div>

                {/* GOÛTER */}
                <div className="py-5 border-b border-black">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center justify-between mb-2">
                        <TimeTag time="16:30" color={GRAPHITE} />
                        <span className="text-[9px] uppercase tracking-[0.18em] text-neutral-500 font-bold">Coupe-faim</span>
                      </div>
                      <h3 className="text-[15px] font-bold tracking-tight">
                        {snackChoice === 'aucun' ? 'Aucun aliment sélectionné' : 'Zéro biscuit'}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Chip active={snackChoice === 'aucun'} onClick={() => setSnackChoice('aucun')}>Aucun</Chip>
                        <Chip active={snackChoice === 'pomme_amandes'} onClick={() => setSnackChoice('pomme_amandes')}>Pomme + Amandes · 150</Chip>
                        <Chip active={snackChoice === 'banane'} onClick={() => setSnackChoice('banane')}>Banane · 90</Chip>
                      </div>
                    </div>
                    <div className="text-right w-16 flex-shrink-0">
                      <span className="text-[22px] font-black tabular-nums tracking-[-0.03em]">{snackKcal}</span>
                      <span className="block text-[9px] uppercase tracking-[0.1em] text-neutral-500">kcal</span>
                    </div>
                  </div>
                </div>

                {/* DÎNER */}
                <div className="py-5 border-b border-black">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center justify-between mb-2">
                        <TimeTag time="19:30" color={ACCENT} />
                        <span className="text-[9px] uppercase tracking-[0.18em] text-neutral-500 font-bold">Récupération</span>
                      </div>

                      <div className="mt-1">
                        <span className="text-[9px] uppercase font-bold tracking-[0.14em] text-neutral-500 block mb-1.5">Protéine</span>
                        <div className="flex flex-wrap gap-2">
                          <Chip active={dinnerProtein === 'boeuf_5'} onClick={() => setDinnerProtein(p => p === 'boeuf_5' ? 'aucun' : 'boeuf_5')}>Bœuf 5% 140g · 190</Chip>
                          <Chip active={dinnerProtein === 'saumon'} onClick={() => setDinnerProtein(p => p === 'saumon' ? 'aucun' : 'saumon')}>Saumon 130g · 240</Chip>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[9px] uppercase font-bold tracking-[0.14em] text-neutral-500">Glucide</span>
                          <span className="text-[8px] uppercase font-bold tracking-[0.1em] px-1.5 py-0.5" style={{ background: INK, color: PAPER }}>Produits U</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Chip active={dinnerCarb === 'aucun'} onClick={() => setDinnerCarb('aucun')}>Aucun</Chip>
                          <Chip active={dinnerCarb === 'quinoa_boulgour'} onClick={() => setDinnerCarb('quinoa_boulgour')}>Quinoa/Boulgour · 173</Chip>
                          <Chip active={dinnerCarb === 'lentilles'} onClick={() => setDinnerCarb('lentilles')}>Lentilles · 163</Chip>
                          <Chip active={dinnerCarb === 'pommes_de_terre'} onClick={() => setDinnerCarb('pommes_de_terre')}>Pdt vapeur · 110</Chip>
                        </div>
                      </div>
                    </div>
                    <div className="text-right w-16 flex-shrink-0">
                      <span className="text-[22px] font-black tabular-nums tracking-[-0.03em]">{~~dinnerKcal}</span>
                      <span className="block text-[9px] uppercase tracking-[0.1em] text-neutral-500">kcal</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Plats ajoutés / scannés */}
              {scannedMeals.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center gap-2 border-b border-black pb-1.5 mb-4">
                    <span className="w-2.5 h-2.5 inline-block" style={{ background: ACCENT }} />
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.18em]">Plats enregistrés</h3>
                  </div>
                  {scannedMeals.map(meal => (
                    <div key={meal.id} className="py-4 border-b border-black animate-fade-in">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-bold tabular-nums">{meal.time}</span>
                            <span className="text-[9px] uppercase tracking-[0.16em] font-bold" style={{ color: ACCENT }}>Ajouté</span>
                          </div>
                          <h4 className="text-[15px] font-bold tracking-tight">{meal.name}</h4>
                          <p className="text-[11px] text-neutral-500 mt-1 leading-snug">{meal.explanation}</p>
                          <div className="flex gap-4 mt-2 text-[10px] font-bold uppercase tracking-wider tabular-nums">
                            <span style={{ color: ACCENT }}>P {meal.prot}g</span>
                            <span>G {meal.carb}g</span>
                            <span className="text-neutral-500">L {meal.fat}g</span>
                          </div>
                        </div>
                        <div className="text-right w-16 flex-shrink-0 flex flex-col items-end justify-between self-stretch">
                          <div>
                            <span className="text-[22px] font-black tabular-nums tracking-[-0.03em]">{meal.cal}</span>
                            <span className="block text-[9px] uppercase tracking-[0.1em] text-neutral-500">kcal</span>
                          </div>
                          <button onClick={() => removeScannedMeal(meal.id)} className="mt-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider hover:opacity-60" title="Supprimer">
                            <TrashIcon /> Suppr
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ===================== 03 — HYDRATATION & SUPPLÉMENTS ===================== */}
            <section className="mb-4">
              <SectionHead index="03" title="Hydratation · Suppléments" />
              <div className="grid grid-cols-2 border border-black">
                {/* Hydratation */}
                <div className="p-4 border-r border-black flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em]">Hydratation</span>
                    <p className="text-[10px] text-neutral-500 mt-1 leading-snug">Objectif 2,5 L. Viande + CrossFit sollicitent les reins.</p>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[28px] font-black tabular-nums tracking-[-0.03em]">{(waterCount * 0.25).toFixed(2)}</span>
                      <span className="text-[10px] font-bold uppercase">L</span>
                    </div>
                    <div className="flex gap-0 mt-2 border border-black w-max">
                      <button onClick={() => setWaterCount(w => Math.max(0, w - 1))} className="w-8 h-8 font-bold text-sm border-r border-black hover:bg-black hover:text-[#F4F3EE] transition-colors">–</button>
                      <button onClick={() => setWaterCount(w => w + 1)} className="w-8 h-8 font-bold text-sm hover:bg-black hover:text-[#F4F3EE] transition-colors">+</button>
                    </div>
                  </div>
                </div>
                {/* Suppléments */}
                <div className="p-4 flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em]">Suppléments</span>
                  <div className="space-y-2.5 mt-3">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" className="hidden" checked={supplements.vitB} onChange={() => setSupplements(p => ({ ...p, vitB: !p.vitB }))} />
                      <CheckIcon checked={supplements.vitB} />
                      <span className="text-[11px] font-semibold uppercase tracking-wider">Vitamines B · matin</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" className="hidden" checked={supplements.bcaa} onChange={() => setSupplements(p => ({ ...p, bcaa: !p.bcaa }))} />
                      <CheckIcon checked={supplements.bcaa} />
                      <span className="text-[11px] font-semibold uppercase tracking-wider">BCAA 8:1:1 · intra-WOD</span>
                    </label>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* ===================== COURSES ===================== */
          <section>
            <SectionHead index="04" title="Liste de sèche" note="1 mois" />
            <p className="text-[12px] text-neutral-600 leading-relaxed mb-6">
              Rayons calibrés pour séances intenses de CrossFit et perte de gras abdominal rapide.
            </p>

            <div className="border-t border-black">
              {/* Boucherie */}
              <div className="py-5 border-b border-black grid grid-cols-12 gap-3">
                <div className="col-span-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: ACCENT }}>Boucherie</span>
                  <span className="block text-[9px] uppercase tracking-wider text-neutral-400 mt-0.5">Protéines</span>
                </div>
                <ul className="col-span-9 space-y-1.5 text-[12px]">
                  <li className="flex justify-between"><span>Œufs frais de qualité</span></li>
                  <li className="flex justify-between"><span>Bœuf haché <b>5% MG uniquement</b></span></li>
                  <li className="flex justify-between"><span>Blancs de poulet / dinde (140g/part)</span></li>
                  <li className="flex justify-between"><span>Poisson blanc · pavés de saumon</span></li>
                </ul>
              </div>

              {/* Épicerie U */}
              <div className="py-5 border-b border-black grid grid-cols-12 gap-3">
                <div className="col-span-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em]">Épicerie U</span>
                  <span className="block text-[9px] uppercase tracking-wider text-neutral-400 mt-0.5">Glucides</span>
                </div>
                <ul className="col-span-9 space-y-1.5 text-[12px]">
                  <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 inline-block" style={{ background: ACCENT }} /><b>Quinoa & Boulgour (Marque U)</b></li>
                  <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 inline-block" style={{ background: ACCENT }} /><b>Lentilles Vertes (Marque U)</b></li>
                  <li>Flocons d'avoine nature</li>
                  <li>Amandes entières naturelles (sans sel)</li>
                </ul>
              </div>

              {/* Fruits & Légumes */}
              <div className="py-5 border-b border-black grid grid-cols-12 gap-3">
                <div className="col-span-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">Primeur</span>
                  <span className="block text-[9px] uppercase tracking-wider text-neutral-400 mt-0.5">Fibres</span>
                </div>
                <ul className="col-span-9 space-y-1.5 text-[12px]">
                  <li>Brocolis, haricots verts, courgettes à foison</li>
                  <li>Pommes et bananes (énergie rapide)</li>
                </ul>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ===================== MODAL AJOUT TEXTE ===================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in" style={{ background: "rgba(10,10,10,0.55)" }}>
          <div className="w-full max-w-sm border-2 border-black" style={{ background: PAPER }}>
            <div className="flex items-center justify-between px-5 py-3 border-b-2 border-black">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.16em]">Ajout par l'IA</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[11px] font-bold uppercase tracking-wider hover:opacity-60">Fermer ✕</button>
            </div>
            <form onSubmit={handleAddCustomMeal} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500 mb-2">Qu'as-tu mangé ?</label>
                <textarea
                  className="w-full bg-transparent border border-black p-3 text-[13px] focus:outline-none min-h-[90px]"
                  style={{ caretColor: ACCENT }}
                  placeholder="Ex : 120g de filet de dinde grillée, 100g de patate douce, brocolis."
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  disabled={isCalculatingCustom}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isCalculatingCustom}
                className="w-full py-3 text-[11px] font-bold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors"
                style={{ background: INK, color: PAPER }}
              >
                {isCalculatingCustom ? (
                  <><span className="w-4 h-4 border-2 border-[#F4F3EE] border-t-transparent rounded-full animate-spin" /> Calcul…</>
                ) : (
                  <>Estimer & Enregistrer →</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===================== BARRE D'ÉTAT FIXE (NOIR) ===================== */}
      <footer className="fixed bottom-0 left-0 right-0 z-40" style={{ background: INK, color: PAPER }}>
        <div className="max-w-md mx-auto px-6 py-3 flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase font-bold tracking-[0.2em]" style={{ color: "#9A9990" }}>Total consommé</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[22px] font-black tabular-nums tracking-[-0.03em]">{calculatedNutrition.totals.cal}</span>
              <span className="text-[10px] font-bold uppercase">kcal</span>
            </div>
          </div>
          <div className="flex gap-4 text-[11px] font-bold uppercase tracking-wider tabular-nums">
            <span><span style={{ color: ACCENT }}>P</span> {calculatedNutrition.totals.prot.toFixed(0)}</span>
            <span>G {calculatedNutrition.totals.carb.toFixed(0)}</span>
            <span style={{ color: "#9A9990" }}>L {calculatedNutrition.totals.fat.toFixed(0)}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
