"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import type { Locale } from "@/src/data/profile";

type TreatmentId =
  | "baseline"
  | "donepezil"
  | "memantine"
  | "lecanemab"
  | "donanemab"
  | "trontinemab"
  | "tau-vaccine";

type RegionId = "hippocampus" | "temporal" | "parietal" | "frontal";

type Treatment = {
  id: TreatmentId;
  name: string;
  category: "reference" | "approved" | "experimental";
  stage: { fr: string; en: string };
  mechanism: { fr: string; en: string };
  caution: { fr: string; en: string };
  factors: {
    amyloid: number;
    tau: number;
    cognition: number;
    atrophy: number;
    symptomLift: number;
  };
};

const treatments: Treatment[] = [
  {
    id: "baseline",
    name: "Sans intervention",
    category: "reference",
    stage: { fr: "Trajectoire de référence", en: "Reference trajectory" },
    mechanism: {
      fr: "Progression synthétique utilisée uniquement comme point de comparaison.",
      en: "Synthetic progression used only as a comparison baseline.",
    },
    caution: {
      fr: "Ce scénario ne représente pas l'évolution d'une personne réelle.",
      en: "This scenario does not represent any real person's progression.",
    },
    factors: {
      amyloid: 1,
      tau: 1,
      cognition: 1,
      atrophy: 1,
      symptomLift: 0,
    },
  },
  {
    id: "donepezil",
    name: "Donépézil",
    category: "approved",
    stage: { fr: "Approuvé · symptômes", en: "Approved · symptoms" },
    mechanism: {
      fr: "Inhibiteur de la cholinestérase visant certains symptômes cognitifs.",
      en: "Cholinesterase inhibitor targeting some cognitive symptoms.",
    },
    caution: {
      fr: "Ne retire pas l'amyloïde et ne guérit pas la maladie.",
      en: "Does not remove amyloid or cure the disease.",
    },
    factors: {
      amyloid: 1,
      tau: 1,
      cognition: 0.91,
      atrophy: 0.98,
      symptomLift: 6,
    },
  },
  {
    id: "memantine",
    name: "Mémantine",
    category: "approved",
    stage: { fr: "Approuvé · symptômes", en: "Approved · symptoms" },
    mechanism: {
      fr: "Antagoniste NMDA utilisé aux stades modéré à sévère pour certains symptômes.",
      en: "NMDA antagonist used in moderate to severe stages for some symptoms.",
    },
    caution: {
      fr: "Effet symptomatique; la trajectoire biologique demeure illustrative.",
      en: "Symptomatic effect; the biological trajectory remains illustrative.",
    },
    factors: {
      amyloid: 1,
      tau: 0.98,
      cognition: 0.89,
      atrophy: 0.97,
      symptomLift: 4,
    },
  },
  {
    id: "lecanemab",
    name: "Lécanémab",
    category: "approved",
    stage: { fr: "Approuvé · stade précoce", en: "Approved · early stage" },
    mechanism: {
      fr: "Immunothérapie anti-amyloïde pour certaines personnes au stade précoce.",
      en: "Anti-amyloid immunotherapy for some people at an early stage.",
    },
    caution: {
      fr: "Surveillance IRM requise; risque d'ARIA et bénéfice clinique modeste.",
      en: "MRI monitoring required; ARIA risk and modest clinical benefit.",
    },
    factors: {
      amyloid: 0.38,
      tau: 0.92,
      cognition: 0.79,
      atrophy: 0.84,
      symptomLift: 0,
    },
  },
  {
    id: "donanemab",
    name: "Donanémab",
    category: "approved",
    stage: { fr: "Approuvé · stade précoce", en: "Approved · early stage" },
    mechanism: {
      fr: "Anticorps ciblant l'amyloïde chez certaines personnes au stade précoce.",
      en: "Antibody targeting amyloid in some people at an early stage.",
    },
    caution: {
      fr: "Risque d'ARIA, réactions à la perfusion et sélection clinique stricte.",
      en: "ARIA risk, infusion reactions, and strict clinical selection.",
    },
    factors: {
      amyloid: 0.29,
      tau: 0.91,
      cognition: 0.77,
      atrophy: 0.82,
      symptomLift: 0,
    },
  },
  {
    id: "trontinemab",
    name: "Trontinémab",
    category: "experimental",
    stage: { fr: "Phase III · expérimental", en: "Phase III · experimental" },
    mechanism: {
      fr: "Anticorps anti-amyloïde « BrainShuttle » étudié dans la maladie précoce.",
      en: "BrainShuttle anti-amyloid antibody under study in early disease.",
    },
    caution: {
      fr: "Aucun bénéfice clinique établi; paramètres de simulation hypothétiques.",
      en: "No established clinical benefit; simulation parameters are hypothetical.",
    },
    factors: {
      amyloid: 0.22,
      tau: 0.9,
      cognition: 0.69,
      atrophy: 0.76,
      symptomLift: 0,
    },
  },
  {
    id: "tau-vaccine",
    name: "AV-1980R",
    category: "experimental",
    stage: { fr: "Phase I · vaccin tau", en: "Phase I · tau vaccine" },
    mechanism: {
      fr: "Vaccin expérimental visant une réponse immunitaire contre la protéine tau.",
      en: "Experimental vaccine designed to elicit an immune response against tau.",
    },
    caution: {
      fr: "Étude de sécurité initiale; aucune efficacité clinique démontrée.",
      en: "Early safety study; no demonstrated clinical efficacy.",
    },
    factors: {
      amyloid: 0.86,
      tau: 0.54,
      cognition: 0.73,
      atrophy: 0.78,
      symptomLift: 0,
    },
  },
];

const regions: Record<
  RegionId,
  {
    label: { fr: string; en: string };
    function: { fr: string; en: string };
    signal: { fr: string; en: string };
  }
> = {
  hippocampus: {
    label: { fr: "Hippocampe", en: "Hippocampus" },
    function: {
      fr: "Formation et consolidation de nouveaux souvenirs.",
      en: "Formation and consolidation of new memories.",
    },
    signal: {
      fr: "Région souvent touchée tôt par l'atrophie.",
      en: "A region often affected early by atrophy.",
    },
  },
  temporal: {
    label: { fr: "Lobe temporal", en: "Temporal lobe" },
    function: {
      fr: "Mémoire, langage et reconnaissance.",
      en: "Memory, language, and recognition.",
    },
    signal: {
      fr: "La propagation tau y est un marqueur important.",
      en: "Tau propagation is an important marker in this region.",
    },
  },
  parietal: {
    label: { fr: "Lobe pariétal", en: "Parietal lobe" },
    function: {
      fr: "Orientation spatiale et intégration sensorielle.",
      en: "Spatial orientation and sensory integration.",
    },
    signal: {
      fr: "La connectivité fonctionnelle peut diminuer avec la progression.",
      en: "Functional connectivity can decline with progression.",
    },
  },
  frontal: {
    label: { fr: "Lobe frontal", en: "Frontal lobe" },
    function: {
      fr: "Planification, jugement et contrôle exécutif.",
      en: "Planning, judgment, and executive control.",
    },
    signal: {
      fr: "Les fonctions exécutives sont souvent atteintes plus tard.",
      en: "Executive functions are often affected later.",
    },
  },
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function withAlpha(color: string, alpha: number) {
  const rgb = color.match(/\d+(?:\.\d+)?/g);
  if (!rgb || rgb.length < 3) return color;
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

function useCanvasSize(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  draw: (context: CanvasRenderingContext2D, width: number, height: number) => void,
  dependencies: unknown[],
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const render = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(bounds.width));
      const height = Math.max(1, Math.round(bounds.height));
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      const context = canvas.getContext("2d");
      if (!context) return;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(context, width, height);
    };

    render();
    const observer = new ResizeObserver(render);
    observer.observe(canvas);
    return () => observer.disconnect();
    // The caller deliberately supplies the values that affect its drawing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}

export function AlzheimerResearchLab({ locale }: { locale: Locale }) {
  const [year, setYear] = useState(3);
  const [treatmentId, setTreatmentId] =
    useState<TreatmentId>("lecanemab");
  const [selectedRegion, setSelectedRegion] =
    useState<RegionId>("hippocampus");
  const [playing, setPlaying] = useState(false);
  const brainCanvasRef = useRef<HTMLCanvasElement>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);

  const treatment =
    treatments.find((item) => item.id === treatmentId) ?? treatments[0];

  const metrics = useMemo(() => {
    const { factors } = treatment;
    const amyloid = clamp(30 + year * 6.2 * factors.amyloid, 0, 100);
    const tau = clamp(15 + year * 6.6 * factors.tau, 0, 100);
    const atrophy = clamp(5 + year * 5.8 * factors.atrophy, 0, 100);
    const symptomSupport =
      factors.symptomLift * Math.exp(-Math.max(0, year - 1) / 4);
    const cognition = clamp(
      100 - year * 7.2 * factors.cognition + symptomSupport,
      12,
      100,
    );
    const hippocampus = clamp(100 - atrophy * 0.72, 18, 100);
    return { amyloid, tau, atrophy, cognition, hippocampus };
  }, [treatment, year]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setYear((current) => {
        const next = Math.round((current + 0.25) * 4) / 4;
        if (next >= 10) {
          setPlaying(false);
          return 10;
        }
        return next;
      });
    }, 360);
    return () => window.clearInterval(timer);
  }, [playing]);

  useCanvasSize(
    brainCanvasRef,
    (context, width, height) => {
      const rootStyle = getComputedStyle(document.documentElement);
      const accent = rootStyle.getPropertyValue("--accent").trim();
      const amber = rootStyle.getPropertyValue("--amber").trim();
      const danger = rootStyle.getPropertyValue("--danger").trim();
      const ink = rootStyle.getPropertyValue("--ink").trim();
      const line = rootStyle.getPropertyValue("--line-strong").trim();
      const surface = rootStyle.getPropertyValue("--surface").trim();

      context.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height * 0.49;
      const scale =
        Math.min(width / 680, height / 500) *
        (1 - metrics.atrophy * 0.00125);

      context.save();
      context.translate(cx, cy);
      context.scale(scale, scale);

      const left = new Path2D();
      left.moveTo(-8, -208);
      left.bezierCurveTo(-95, -236, -220, -196, -258, -118);
      left.bezierCurveTo(-312, -66, -306, 32, -258, 76);
      left.bezierCurveTo(-265, 151, -191, 214, -108, 205);
      left.bezierCurveTo(-62, 228, -21, 184, -10, 132);
      left.bezierCurveTo(-34, 79, -20, 28, -8, 0);
      left.closePath();

      const right = new Path2D();
      right.moveTo(8, -208);
      right.bezierCurveTo(95, -236, 220, -196, 258, -118);
      right.bezierCurveTo(312, -66, 306, 32, 258, 76);
      right.bezierCurveTo(265, 151, 191, 214, 108, 205);
      right.bezierCurveTo(62, 228, 21, 184, 10, 132);
      right.bezierCurveTo(34, 79, 20, 28, 8, 0);
      right.closePath();

      const brainGradient = context.createRadialGradient(
        0,
        -20,
        35,
        0,
        0,
        310,
      );
      brainGradient.addColorStop(
        0,
        withAlpha(accent, 0.34 - metrics.atrophy * 0.0018),
      );
      brainGradient.addColorStop(0.62, withAlpha(accent, 0.14));
      brainGradient.addColorStop(1, withAlpha(surface, 0.94));

      context.fillStyle = brainGradient;
      context.strokeStyle = withAlpha(line, 0.95);
      context.lineWidth = 2;
      context.fill(left);
      context.fill(right);
      context.stroke(left);
      context.stroke(right);

      const folds = [
        [-208, -118, -128, -168, -54, -112],
        [-242, -38, -142, -82, -52, -32],
        [-222, 48, -144, 8, -52, 52],
        [-181, 132, -119, 82, -44, 123],
        [208, -118, 128, -168, 54, -112],
        [242, -38, 142, -82, 52, -32],
        [222, 48, 144, 8, 52, 52],
        [181, 132, 119, 82, 44, 123],
      ];
      context.strokeStyle = withAlpha(ink, 0.24);
      context.lineWidth = 1.35;
      for (const [x1, y1, c1, c2, x2, y2] of folds) {
        context.beginPath();
        context.moveTo(x1, y1);
        context.bezierCurveTo(c1, y1 - 22, c2, y2 + 22, x2, y2);
        context.stroke();
      }

      context.strokeStyle = withAlpha(amber, 0.6);
      context.lineWidth = 1.5;
      context.beginPath();
      context.ellipse(-52, 80, 54, 22, -0.32, 0, Math.PI * 2);
      context.ellipse(52, 80, 54, 22, 0.32, 0, Math.PI * 2);
      context.stroke();

      const plaqueCount = Math.round(7 + metrics.amyloid * 0.22);
      context.fillStyle = withAlpha(amber, 0.64);
      for (let index = 0; index < plaqueCount; index += 1) {
        const angle = index * 2.399;
        const radius = 58 + ((index * 37) % 150);
        const x = Math.cos(angle) * radius * 1.34;
        const y = Math.sin(angle) * radius * 0.84 - 4;
        const size = 1.6 + ((index * 11) % 5) * 0.34;
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2);
        context.fill();
      }

      const tauCount = Math.round(3 + metrics.tau * 0.1);
      context.strokeStyle = withAlpha(danger, 0.62);
      context.lineWidth = 2;
      for (let index = 0; index < tauCount; index += 1) {
        const side = index % 2 === 0 ? -1 : 1;
        const y = 92 - index * 18;
        context.beginPath();
        context.moveTo(side * 45, y);
        context.quadraticCurveTo(side * 105, y - 28, side * 152, y - 8);
        context.stroke();
      }

      context.restore();

      const scanY = (year / 10) * height;
      const scanGradient = context.createLinearGradient(0, scanY - 18, 0, scanY + 18);
      scanGradient.addColorStop(0, withAlpha(accent, 0));
      scanGradient.addColorStop(0.5, withAlpha(accent, 0.46));
      scanGradient.addColorStop(1, withAlpha(accent, 0));
      context.fillStyle = scanGradient;
      context.fillRect(width * 0.08, scanY - 18, width * 0.84, 36);
    },
    [metrics, year],
  );

  useCanvasSize(
    chartCanvasRef,
    (context, width, height) => {
      const rootStyle = getComputedStyle(document.documentElement);
      const accent = rootStyle.getPropertyValue("--accent").trim();
      const amber = rootStyle.getPropertyValue("--amber").trim();
      const line = rootStyle.getPropertyValue("--line").trim();
      const muted = rootStyle.getPropertyValue("--muted").trim();
      const background = rootStyle.getPropertyValue("--surface").trim();
      const padding = { left: 38, right: 18, top: 18, bottom: 30 };
      const plotWidth = width - padding.left - padding.right;
      const plotHeight = height - padding.top - padding.bottom;

      context.clearRect(0, 0, width, height);
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);
      context.font = "11px Cascadia Code, monospace";
      context.textAlign = "right";
      context.textBaseline = "middle";
      context.strokeStyle = withAlpha(line, 0.78);
      context.fillStyle = muted;
      context.lineWidth = 1;

      for (const tick of [25, 50, 75, 100]) {
        const y = padding.top + plotHeight * (1 - tick / 100);
        context.beginPath();
        context.moveTo(padding.left, y);
        context.lineTo(width - padding.right, y);
        context.stroke();
        context.fillText(String(tick), padding.left - 8, y);
      }

      context.textAlign = "center";
      context.textBaseline = "top";
      for (const tick of [0, 2, 4, 6, 8, 10]) {
        const x = padding.left + (tick / 10) * plotWidth;
        context.fillText(String(tick), x, height - padding.bottom + 8);
      }

      const drawLine = (
        color: string,
        cognitionFactor: number,
        symptomLift: number,
        widthValue: number,
      ) => {
        context.strokeStyle = color;
        context.lineWidth = widthValue;
        context.beginPath();
        for (let step = 0; step <= 40; step += 1) {
          const currentYear = step / 4;
          const lift =
            symptomLift * Math.exp(-Math.max(0, currentYear - 1) / 4);
          const value = clamp(
            100 - currentYear * 7.2 * cognitionFactor + lift,
            12,
            100,
          );
          const x = padding.left + (currentYear / 10) * plotWidth;
          const y = padding.top + plotHeight * (1 - value / 100);
          if (step === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.stroke();
      };

      drawLine(withAlpha(amber, 0.6), 1, 0, 1.5);
      drawLine(
        accent,
        treatment.factors.cognition,
        treatment.factors.symptomLift,
        2.5,
      );

      const markerX = padding.left + (year / 10) * plotWidth;
      const markerY =
        padding.top + plotHeight * (1 - metrics.cognition / 100);
      context.fillStyle = accent;
      context.beginPath();
      context.arc(markerX, markerY, 4.5, 0, Math.PI * 2);
      context.fill();
    },
    [metrics.cognition, treatment, year],
  );

  const copy = {
    fr: {
      kicker: "Laboratoire de recherche interactif",
      title: "Observer une trajectoire, tester une hypothèse.",
      intro:
        "Une démonstration de produit scientifique qui relie imagerie, biomarqueurs, littérature et scénarios comparatifs dans une seule interface.",
      model: "Modèle éducatif",
      synthetic: "Données synthétiques",
      year: "Année",
      play: "Lire la progression",
      pause: "Mettre en pause",
      treatment: "Scénario thérapeutique",
      approved: "Approuvé",
      experimental: "Expérimental",
      reference: "Référence",
      brainTitle: "Jumeau cérébral synthétique",
      brainHint: "Sélectionnez une région pour l'inspecter.",
      cognition: "Indice cognitif",
      hippocampus: "Intégrité hippocampique",
      amyloid: "Charge amyloïde",
      tau: "Charge tau",
      syntheticIndex: "indice synthétique",
      trajectory: "Trajectoire cognitive comparée",
      current: "Scénario sélectionné",
      natural: "Référence sans intervention",
      years: "années",
      region: "Région active",
      signal: "Signal observé",
      documentation: "Dossier de recherche",
      documentationIntro:
        "Chaque élément est relié à une source, une date et un niveau de preuve.",
      pipeline: [
        "Sources vérifiées",
        "Extraction structurée",
        "Scénarios versionnés",
        "Révision scientifique",
      ],
      sources: "Sources principales · consultées en juillet 2026",
      disclaimer:
        "Démonstration éducative seulement. Les courbes et indices sont synthétiques, ne prédisent aucun résultat individuel et ne doivent jamais guider un diagnostic ou un traitement.",
    },
    en: {
      kicker: "Interactive research laboratory",
      title: "Observe a trajectory. Test a hypothesis.",
      intro:
        "A scientific product demonstration connecting imaging, biomarkers, literature, and comparative scenarios in one interface.",
      model: "Educational model",
      synthetic: "Synthetic data",
      year: "Year",
      play: "Play progression",
      pause: "Pause progression",
      treatment: "Treatment scenario",
      approved: "Approved",
      experimental: "Experimental",
      reference: "Reference",
      brainTitle: "Synthetic brain twin",
      brainHint: "Select a region to inspect it.",
      cognition: "Cognitive index",
      hippocampus: "Hippocampal integrity",
      amyloid: "Amyloid load",
      tau: "Tau load",
      syntheticIndex: "synthetic index",
      trajectory: "Compared cognitive trajectory",
      current: "Selected scenario",
      natural: "Reference without intervention",
      years: "years",
      region: "Active region",
      signal: "Observed signal",
      documentation: "Research record",
      documentationIntro:
        "Every item is tied to a source, date, and evidence level.",
      pipeline: [
        "Verified sources",
        "Structured extraction",
        "Versioned scenarios",
        "Scientific review",
      ],
      sources: "Primary sources · reviewed July 2026",
      disclaimer:
        "Educational demonstration only. Curves and indices are synthetic, predict no individual outcome, and must never guide diagnosis or treatment.",
    },
  }[locale];

  const region = regions[selectedRegion];
  const categoryLabel =
    treatment.category === "approved"
      ? copy.approved
      : treatment.category === "experimental"
        ? copy.experimental
        : copy.reference;

  return (
    <section className="neuro-lab" aria-labelledby="neuro-lab-title">
      <header className="neuro-lab-header">
        <div>
          <p className="eyebrow">{copy.kicker}</p>
          <h2 id="neuro-lab-title">{copy.title}</h2>
          <p>{copy.intro}</p>
        </div>
        <div className="neuro-lab-badges" aria-label={copy.model}>
          <span>{copy.model}</span>
          <span>{copy.synthetic}</span>
        </div>
      </header>

      <div className="neuro-metrics" aria-label={copy.syntheticIndex}>
        <article>
          <span>{copy.cognition}</span>
          <strong>{Math.round(metrics.cognition)}</strong>
          <small>/ 100</small>
        </article>
        <article>
          <span>{copy.hippocampus}</span>
          <strong>{Math.round(metrics.hippocampus)}</strong>
          <small>/ 100</small>
        </article>
        <article>
          <span>{copy.amyloid}</span>
          <strong>{Math.round(metrics.amyloid)}</strong>
          <small>/ 100</small>
        </article>
        <article>
          <span>{copy.tau}</span>
          <strong>{Math.round(metrics.tau)}</strong>
          <small>/ 100</small>
        </article>
      </div>

      <div className="neuro-workbench">
        <div className="neuro-controls">
          <div className="neuro-time-control">
            <div>
              <label htmlFor="neuro-year">{copy.year}</label>
              <output htmlFor="neuro-year">{year.toFixed(2)}</output>
            </div>
            <input
              id="neuro-year"
              type="range"
              min="0"
              max="10"
              step="0.25"
              value={year}
              onChange={(event) => {
                setYear(Number(event.target.value));
                setPlaying(false);
              }}
            />
            <button
              className="neuro-play-button"
              type="button"
              onClick={() => {
                if (year >= 10) setYear(0);
                setPlaying((current) => !current);
              }}
              aria-pressed={playing}
            >
              <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span>
              {playing ? copy.pause : copy.play}
            </button>
          </div>

          <fieldset className="neuro-treatment-list">
            <legend>{copy.treatment}</legend>
            {treatments.map((item) => {
              const selected = item.id === treatmentId;
              const itemCategory =
                item.category === "approved"
                  ? copy.approved
                  : item.category === "experimental"
                    ? copy.experimental
                    : copy.reference;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={selected ? "is-selected" : undefined}
                  onClick={() => setTreatmentId(item.id)}
                  aria-pressed={selected}
                >
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.stage[locale]}</small>
                  </span>
                  <em data-category={item.category}>{itemCategory}</em>
                </button>
              );
            })}
          </fieldset>
        </div>

        <div className="neuro-brain-panel">
          <div className="neuro-panel-heading">
            <div>
              <span>{copy.brainTitle}</span>
              <small>{copy.brainHint}</small>
            </div>
            <output>
              T+{year.toFixed(2)} {copy.years}
            </output>
          </div>
          <div className="neuro-brain-stage">
            <canvas
              ref={brainCanvasRef}
              role="img"
              aria-label={`${copy.brainTitle}. ${copy.amyloid}: ${Math.round(metrics.amyloid)}. ${copy.tau}: ${Math.round(metrics.tau)}.`}
            />
            <button
              className="neuro-hotspot hotspot-frontal"
              type="button"
              aria-pressed={selectedRegion === "frontal"}
              onClick={() => setSelectedRegion("frontal")}
            >
              <span>{regions.frontal.label[locale]}</span>
            </button>
            <button
              className="neuro-hotspot hotspot-parietal"
              type="button"
              aria-pressed={selectedRegion === "parietal"}
              onClick={() => setSelectedRegion("parietal")}
            >
              <span>{regions.parietal.label[locale]}</span>
            </button>
            <button
              className="neuro-hotspot hotspot-temporal"
              type="button"
              aria-pressed={selectedRegion === "temporal"}
              onClick={() => setSelectedRegion("temporal")}
            >
              <span>{regions.temporal.label[locale]}</span>
            </button>
            <button
              className="neuro-hotspot hotspot-hippocampus"
              type="button"
              aria-pressed={selectedRegion === "hippocampus"}
              onClick={() => setSelectedRegion("hippocampus")}
            >
              <span>{regions.hippocampus.label[locale]}</span>
            </button>
          </div>
          <div className="neuro-legend" aria-hidden="true">
            <span className="legend-amyloid">{copy.amyloid}</span>
            <span className="legend-tau">{copy.tau}</span>
            <span className="legend-region">{copy.region}</span>
          </div>
        </div>

        <aside className="neuro-inspector" aria-live="polite">
          <div className="neuro-inspector-index">
            <span>{copy.region}</span>
            <strong>0{Object.keys(regions).indexOf(selectedRegion) + 1}</strong>
          </div>
          <h3>{region.label[locale]}</h3>
          <p>{region.function[locale]}</p>
          <dl>
            <div>
              <dt>{copy.signal}</dt>
              <dd>{region.signal[locale]}</dd>
            </div>
            <div>
              <dt>{copy.treatment}</dt>
              <dd>
                {treatment.name} · {categoryLabel}
              </dd>
            </div>
          </dl>
          <div className="neuro-treatment-note">
            <span>{treatment.stage[locale]}</span>
            <p>{treatment.mechanism[locale]}</p>
            <small>{treatment.caution[locale]}</small>
          </div>
        </aside>
      </div>

      <div className="neuro-trajectory">
        <div className="neuro-trajectory-heading">
          <div>
            <span>{copy.trajectory}</span>
            <small>
              {copy.syntheticIndex} · 0–10 {copy.years}
            </small>
          </div>
          <div className="trajectory-key">
            <span className="key-current">{copy.current}</span>
            <span className="key-reference">{copy.natural}</span>
          </div>
        </div>
        <canvas
          ref={chartCanvasRef}
          role="img"
          aria-label={`${copy.trajectory}: ${treatment.name}, ${Math.round(metrics.cognition)} sur 100 à l'année ${year.toFixed(2)}.`}
        />
      </div>

      <section className="neuro-research-record">
        <div className="neuro-record-heading">
          <div>
            <p className="eyebrow">EVIDENCE / 2026.07</p>
            <h3>{copy.documentation}</h3>
          </div>
          <p>{copy.documentationIntro}</p>
        </div>
        <ol className="neuro-pipeline">
          {copy.pipeline.map((item, index) => (
            <li key={item}>
              <span>0{index + 1}</span>
              <strong>{item}</strong>
            </li>
          ))}
        </ol>
        <div className="neuro-sources">
          <span>{copy.sources}</span>
          <a
            href="https://www.nia.nih.gov/health/alzheimers-treatment/how-alzheimers-disease-treated"
            target="_blank"
            rel="noreferrer"
          >
            {locale === "fr"
              ? "NIA · traitements et mécanismes ↗"
              : "NIA · treatments and mechanisms ↗"}
          </a>
          <a
            href="https://www.fda.gov/drugs/news-events-human-drugs/fda-approves-treatment-adults-alzheimers-disease"
            target="_blank"
            rel="noreferrer"
          >
            {locale === "fr"
              ? "FDA · donanémab et sécurité ↗"
              : "FDA · donanemab and safety ↗"}
          </a>
          <a
            href="https://clinicaltrials.gov/study/NCT07169578"
            target="_blank"
            rel="noreferrer"
          >
            {locale === "fr"
              ? "NCT07169578 · trontinémab phase III ↗"
              : "NCT07169578 · trontinemab phase III ↗"}
          </a>
          <a
            href="https://clinicaltrials.gov/study/NCT07158905"
            target="_blank"
            rel="noreferrer"
          >
            {locale === "fr"
              ? "NCT07158905 · vaccin tau phase I ↗"
              : "NCT07158905 · tau vaccine phase I ↗"}
          </a>
        </div>
      </section>

      <p className="neuro-disclaimer">
        <strong>{copy.synthetic}.</strong> {copy.disclaimer}
      </p>
    </section>
  );
}
