"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import type { Locale } from "@/src/data/profile";
import { Brain3DViewer, type BrainRegionId } from "./Brain3DViewer";
import {
  NeuroBrainGuide,
  NeuroGuidedExperience,
  type NeuroAudienceMode,
} from "./NeuroGuidedExperience";
import { NeuroStudyConsole } from "./NeuroStudyConsole";

type TreatmentId =
  | "baseline"
  | "donepezil"
  | "memantine"
  | "lecanemab"
  | "donanemab"
  | "trontinemab"
  | "tau-vaccine";

type RegionId = BrainRegionId;
type DiseaseId = "alzheimer" | "parkinson" | "frontotemporal" | "lewy";
type NetworkId = "default" | "salience" | "executive" | "visual";

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

const diseaseModels: Array<{
  id: DiseaseId;
  name: { fr: string; en: string };
  signature: { fr: string; en: string };
  color: string;
  networkWeights: Record<NetworkId, number>;
}> = [
  {
    id: "alzheimer",
    name: { fr: "Alzheimer", en: "Alzheimer’s" },
    signature: {
      fr: "Mémoire · hippocampe · réseau par défaut",
      en: "Memory · hippocampus · default mode network",
    },
    color: "#55e6d7",
    networkWeights: {
      default: 0.88,
      salience: 0.48,
      executive: 0.56,
      visual: 0.3,
    },
  },
  {
    id: "parkinson",
    name: { fr: "Parkinson", en: "Parkinson’s" },
    signature: {
      fr: "Boucles motrices · ganglions de la base",
      en: "Motor loops · basal ganglia",
    },
    color: "#7aa7ff",
    networkWeights: {
      default: 0.28,
      salience: 0.52,
      executive: 0.64,
      visual: 0.26,
    },
  },
  {
    id: "frontotemporal",
    name: { fr: "Démence frontotemporale", en: "Frontotemporal dementia" },
    signature: {
      fr: "Réseaux frontaux · langage · comportement",
      en: "Frontal networks · language · behaviour",
    },
    color: "#ff8d73",
    networkWeights: {
      default: 0.42,
      salience: 0.8,
      executive: 0.9,
      visual: 0.18,
    },
  },
  {
    id: "lewy",
    name: { fr: "Corps de Lewy", en: "Lewy body disease" },
    signature: {
      fr: "Attention · perception · réseau visuel",
      en: "Attention · perception · visual network",
    },
    color: "#d696ff",
    networkWeights: {
      default: 0.58,
      salience: 0.68,
      executive: 0.55,
      visual: 0.86,
    },
  },
];

const networkModels: Array<{
  id: NetworkId;
  label: { fr: string; en: string };
  function: { fr: string; en: string };
}> = [
  {
    id: "default",
    label: { fr: "Réseau par défaut", en: "Default mode network" },
    function: {
      fr: "Mémoire autobiographique et intégration interne",
      en: "Autobiographical memory and internal integration",
    },
  },
  {
    id: "salience",
    label: { fr: "Réseau de saillance", en: "Salience network" },
    function: {
      fr: "Détection des signaux pertinents et bascule attentionnelle",
      en: "Relevant-signal detection and attentional switching",
    },
  },
  {
    id: "executive",
    label: { fr: "Frontopariétal exécutif", en: "Executive frontoparietal" },
    function: {
      fr: "Planification, contrôle et mémoire de travail",
      en: "Planning, control, and working memory",
    },
  },
  {
    id: "visual",
    label: { fr: "Réseau visuel", en: "Visual network" },
    function: {
      fr: "Traitement visuel et intégration perceptive",
      en: "Visual processing and perceptual integration",
    },
  },
];

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

function calculateMetrics(treatment: Treatment, year: number) {
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
}

function withAlpha(color: string, alpha: number) {
  const rgb = color.match(/\d+(?:\.\d+)?/g);
  if (!rgb || rgb.length < 3) return color;
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

function useCanvasSize(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  draw: (
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => void,
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
  const [treatmentId, setTreatmentId] = useState<TreatmentId>("lecanemab");
  const [selectedRegion, setSelectedRegion] = useState<RegionId>("hippocampus");
  const [activeDiseases, setActiveDiseases] = useState<DiseaseId[]>([
    "alzheimer",
  ]);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkId>("default");
  const [playing, setPlaying] = useState(false);
  const [audienceMode, setAudienceMode] = useState<NeuroAudienceMode>("guided");
  const [exported, setExported] = useState(false);
  const [layers, setLayers] = useState({
    amyloid: true,
    delta: true,
    tau: true,
    network: true,
  });
  const brainCanvasRef = useRef<HTMLCanvasElement>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);
  const networkCanvasRef = useRef<HTMLCanvasElement>(null);

  const treatment =
    treatments.find((item) => item.id === treatmentId) ?? treatments[0];

  const metrics = useMemo(
    () => calculateMetrics(treatment, year),
    [treatment, year],
  );
  const baselineMetrics = useMemo(
    () => calculateMetrics(treatments[0], year),
    [year],
  );
  const deltas = {
    amyloid: baselineMetrics.amyloid - metrics.amyloid,
    cognition: metrics.cognition - baselineMetrics.cognition,
    hippocampus: metrics.hippocampus - baselineMetrics.hippocampus,
    tau: baselineMetrics.tau - metrics.tau,
  };
  const comparisonStrength = clamp(
    (Math.max(0, deltas.amyloid) +
      Math.max(0, deltas.tau) +
      Math.max(0, deltas.cognition) * 1.4) /
      72,
    0,
    1,
  );
  const networkScores = useMemo(
    () =>
      networkModels.map((network) => {
        const diseasePressure =
          activeDiseases.reduce((total, diseaseId) => {
            const disease = diseaseModels.find(
              (candidate) => candidate.id === diseaseId,
            );
            return total + (disease?.networkWeights[network.id] ?? 0);
          }, 0) / Math.max(1, activeDiseases.length);
        const progressionPressure =
          diseasePressure * (year * 4.1 + metrics.tau * 0.19);
        const treatmentSupport = Math.max(0, deltas.cognition) * 0.48;
        return {
          ...network,
          score: clamp(96 - progressionPressure + treatmentSupport, 18, 99),
        };
      }),
    [activeDiseases, deltas.cognition, metrics.tau, year],
  );

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
        Math.min(width / 680, height / 500) * (1 - metrics.atrophy * 0.00125);

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

      const brainGradient = context.createRadialGradient(0, -20, 35, 0, 0, 310);
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
      const scanGradient = context.createLinearGradient(
        0,
        scanY - 18,
        0,
        scanY + 18,
      );
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
      const markerY = padding.top + plotHeight * (1 - metrics.cognition / 100);
      context.fillStyle = accent;
      context.beginPath();
      context.arc(markerX, markerY, 4.5, 0, Math.PI * 2);
      context.fill();
    },
    [metrics.cognition, treatment, year],
  );

  useCanvasSize(
    networkCanvasRef,
    (context, width, height) => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#041016";
      context.fillRect(0, 0, width, height);

      context.strokeStyle = "rgba(87, 226, 213, 0.08)";
      context.lineWidth = 1;
      for (let x = 24; x < width; x += 34) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }
      for (let y = 22; y < height; y += 34) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }

      const nodes: Array<{
        x: number;
        y: number;
        network: NetworkId;
      }> = [
        { x: 0.12, y: 0.32, network: "default" },
        { x: 0.28, y: 0.18, network: "default" },
        { x: 0.48, y: 0.28, network: "default" },
        { x: 0.72, y: 0.2, network: "default" },
        { x: 0.88, y: 0.34, network: "default" },
        { x: 0.22, y: 0.58, network: "salience" },
        { x: 0.46, y: 0.48, network: "salience" },
        { x: 0.74, y: 0.52, network: "salience" },
        { x: 0.14, y: 0.78, network: "executive" },
        { x: 0.38, y: 0.72, network: "executive" },
        { x: 0.64, y: 0.76, network: "executive" },
        { x: 0.87, y: 0.7, network: "executive" },
        { x: 0.35, y: 0.9, network: "visual" },
        { x: 0.58, y: 0.91, network: "visual" },
      ];
      const edges = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [0, 5],
        [1, 6],
        [2, 6],
        [2, 7],
        [4, 7],
        [5, 6],
        [6, 7],
        [5, 8],
        [6, 9],
        [6, 10],
        [7, 11],
        [8, 9],
        [9, 10],
        [10, 11],
        [9, 12],
        [10, 13],
        [12, 13],
        [1, 9],
        [3, 10],
      ];

      for (const [startIndex, endIndex] of edges) {
        const start = nodes[startIndex];
        const end = nodes[endIndex];
        const selected =
          start.network === selectedNetwork || end.network === selectedNetwork;
        context.strokeStyle = selected
          ? "rgba(100, 244, 230, 0.68)"
          : "rgba(107, 174, 185, 0.2)";
        context.lineWidth = selected ? 1.8 : 0.8;
        context.beginPath();
        context.moveTo(start.x * width, start.y * height);
        context.lineTo(end.x * width, end.y * height);
        context.stroke();
      }

      for (const node of nodes) {
        const strongestDisease = activeDiseases
          .map((diseaseId) =>
            diseaseModels.find((disease) => disease.id === diseaseId),
          )
          .filter((disease) => disease !== undefined)
          .sort(
            (a, b) =>
              b.networkWeights[node.network] - a.networkWeights[node.network],
          )[0];
        const selected = node.network === selectedNetwork;
        const x = node.x * width;
        const y = node.y * height;
        const radius = selected ? 6.5 : 4;
        context.fillStyle = strongestDisease?.color ?? "#55e6d7";
        context.shadowColor = context.fillStyle;
        context.shadowBlur = selected ? 18 : 8;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
        context.shadowBlur = 0;
      }
    },
    [
      activeDiseases.join("|"),
      networkScores.map((network) => network.score.toFixed(1)).join("|"),
      selectedNetwork,
    ],
  );

  const copy = {
    fr: {
      kicker: "NeuroLens / laboratoire de recherche 3D",
      back: "Retour aux projets",
      title: "Observer une trajectoire, tester une hypothèse.",
      intro:
        "Une démonstration de produit scientifique qui relie imagerie, biomarqueurs, littérature et scénarios comparatifs dans une seule interface.",
      model: "Modèle éducatif",
      synthetic: "Données synthétiques",
      protocol: "Protocole",
      cohort: "Cohorte",
      cohortValue: "MCI · amyloïde+ · synthétique",
      modality: "Modalités",
      modalityValue: "IRM · TEP amyloïde/tau · connectome",
      quality: "Contrôle qualité",
      qualityValue: "QC PASS · 98,4 %",
      reset: "Réinitialiser",
      export: "Exporter le rapport",
      exported: "Rapport généré",
      year: "Année",
      play: "Lire la progression",
      pause: "Mettre en pause",
      treatment: "Scénario thérapeutique",
      approved: "Approuvé",
      experimental: "Expérimental",
      reference: "Référence",
      brainTitle: "Jumeau cérébral synthétique",
      brainHint: "Glissez pour tourner · molette pour zoomer",
      layers: "Couches 3D",
      network: "Réseau neuronal",
      deltaMap: "Carte delta",
      cognition: "Indice cognitif",
      hippocampus: "Intégrité hippocampique",
      amyloid: "Charge amyloïde",
      tau: "Charge tau",
      syntheticIndex: "indice synthétique",
      trajectory: "Trajectoire cognitive comparée",
      current: "Scénario sélectionné",
      natural: "Référence sans intervention",
      comparisonTitle: "Analyse différentielle",
      comparisonIntro:
        "Écart synthétique entre le scénario actif et la trajectoire de référence au même temps.",
      pathologies: "Comparaison multi-pathologies",
      pathologiesIntro:
        "Superposez plusieurs signatures pour explorer leurs réseaux vulnérables.",
      connectome: "Explorateur du connectome",
      networkScore: "Connectivité synthétique",
      networkHint: "Sélectionnez un réseau pour isoler ses connexions.",
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
      kicker: "NeuroLens / interactive 3D research lab",
      back: "Back to projects",
      title: "Observe a trajectory. Test a hypothesis.",
      intro:
        "A scientific product demonstration connecting imaging, biomarkers, literature, and comparative scenarios in one interface.",
      model: "Educational model",
      synthetic: "Synthetic data",
      protocol: "Protocol",
      cohort: "Cohort",
      cohortValue: "MCI · amyloid+ · synthetic",
      modality: "Modalities",
      modalityValue: "MRI · amyloid/tau PET · connectome",
      quality: "Quality control",
      qualityValue: "QC PASS · 98.4%",
      reset: "Reset",
      export: "Export report",
      exported: "Report generated",
      year: "Year",
      play: "Play progression",
      pause: "Pause progression",
      treatment: "Treatment scenario",
      approved: "Approved",
      experimental: "Experimental",
      reference: "Reference",
      brainTitle: "Synthetic brain twin",
      brainHint: "Drag to rotate · scroll to zoom",
      layers: "3D layers",
      network: "Neural network",
      deltaMap: "Delta map",
      cognition: "Cognitive index",
      hippocampus: "Hippocampal integrity",
      amyloid: "Amyloid load",
      tau: "Tau load",
      syntheticIndex: "synthetic index",
      trajectory: "Compared cognitive trajectory",
      current: "Selected scenario",
      natural: "Reference without intervention",
      comparisonTitle: "Differential analysis",
      comparisonIntro:
        "Synthetic difference between the active scenario and the reference trajectory at the same time point.",
      pathologies: "Multi-pathology comparison",
      pathologiesIntro:
        "Overlay multiple signatures to explore their vulnerable networks.",
      connectome: "Connectome explorer",
      networkScore: "Synthetic connectivity",
      networkHint: "Select a network to isolate its connections.",
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
  const activeDiseaseNames = activeDiseases.map(
    (diseaseId) =>
      diseaseModels.find((disease) => disease.id === diseaseId)?.name[locale] ??
      diseaseId,
  );
  const guidedControlCopy = {
    fr: {
      play: "Lancer la visite guidée",
      pause: "Mettre la visite en pause",
      treatment: "Choisir un scénario à comparer",
    },
    en: {
      play: "Start guided tour",
      pause: "Pause guided tour",
      treatment: "Choose a scenario to compare",
    },
  }[locale];
  const categoryLabel =
    treatment.category === "approved"
      ? copy.approved
      : treatment.category === "experimental"
        ? copy.experimental
        : copy.reference;
  const projectsHref = locale === "fr" ? "/#projets" : "/en#projets";
  const formatDelta = (value: number, inverse = false) => {
    const signedValue = inverse ? -value : value;
    return `${signedValue >= 0 ? "+" : ""}${signedValue.toFixed(1)}`;
  };
  const resetLab = () => {
    setYear(3);
    setTreatmentId("lecanemab");
    setSelectedRegion("hippocampus");
    setActiveDiseases(["alzheimer"]);
    setSelectedNetwork("default");
    setLayers({ amyloid: true, delta: true, network: true, tau: true });
    setPlaying(false);
    setExported(false);
  };
  const toggleDisease = (diseaseId: DiseaseId) => {
    setActiveDiseases((current) => {
      if (current.includes(diseaseId)) {
        return current.length === 1
          ? current
          : current.filter((item) => item !== diseaseId);
      }
      return [...current, diseaseId];
    });
  };
  const exportReport = () => {
    const report = {
      protocol: "NL-AD-042",
      generatedAt: new Date().toISOString(),
      educationalModel: true,
      timepointYears: year,
      scenario: {
        treatment: treatment.name,
        category: treatment.category,
        stage: treatment.stage[locale],
      },
      syntheticMetrics: metrics,
      referenceMetrics: baselineMetrics,
      differential: deltas,
      activePathologies: activeDiseases,
      networkScores: Object.fromEntries(
        networkScores.map((network) => [network.id, network.score]),
      ),
      disclaimer: copy.disclaimer,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `neurolens-NL-AD-042-T${year.toFixed(2)}.json`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    setExported(true);
  };

  return (
    <section
      className={`neuro-lab is-${audienceMode}-mode`}
      aria-labelledby="neuro-lab-title"
    >
      <header className="neuro-lab-header">
        <div>
          <a className="neuro-lab-back" href={projectsHref}>
            <span aria-hidden="true">←</span> {copy.back}
          </a>
          <p className="eyebrow">{copy.kicker}</p>
          <h1 id="neuro-lab-title">{copy.title}</h1>
          <p>{copy.intro}</p>
        </div>
        <div className="neuro-lab-badges" aria-label={copy.model}>
          <span>{copy.model}</span>
          <span>{copy.synthetic}</span>
        </div>
      </header>

      <NeuroGuidedExperience
        locale={locale}
        mode={audienceMode}
        onModeChange={(mode) => {
          setAudienceMode(mode);
          setPlaying(false);
        }}
        year={year}
        playing={playing}
        treatmentName={treatment.name}
        hasTreatment={treatment.id !== "baseline"}
        selectedRegionName={region.label[locale]}
        selectedRegionFunction={region.function[locale]}
        activeDiseaseNames={activeDiseaseNames}
        metrics={metrics}
        baselineMetrics={baselineMetrics}
      />

      <div className="neuro-protocol-bar" aria-label={copy.protocol}>
        <div>
          <span>{copy.protocol}</span>
          <strong>NL-AD-042</strong>
        </div>
        <div>
          <span>{copy.cohort}</span>
          <strong>{copy.cohortValue}</strong>
        </div>
        <div>
          <span>{copy.modality}</span>
          <strong>{copy.modalityValue}</strong>
        </div>
        <div>
          <span>{copy.quality}</span>
          <strong className="is-qc-pass">{copy.qualityValue}</strong>
        </div>
        <div className="neuro-protocol-actions">
          <button type="button" onClick={resetLab}>
            <span aria-hidden="true">↺</span>
            {copy.reset}
          </button>
          <button type="button" onClick={exportReport}>
            <span aria-hidden="true">↓</span>
            {exported ? copy.exported : copy.export}
          </button>
        </div>
      </div>

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
              {playing
                ? audienceMode === "guided"
                  ? guidedControlCopy.pause
                  : copy.pause
                : audienceMode === "guided"
                  ? guidedControlCopy.play
                  : copy.play}
            </button>
          </div>

          <fieldset className="neuro-treatment-list">
            <legend>
              {audienceMode === "guided"
                ? guidedControlCopy.treatment
                : copy.treatment}
            </legend>
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
          <div className="neuro-layer-controls" aria-label={copy.layers}>
            <span>{copy.layers}</span>
            <button
              type="button"
              aria-pressed={layers.network}
              onClick={() =>
                setLayers((current) => ({
                  ...current,
                  network: !current.network,
                }))
              }
            >
              {copy.network}
            </button>
            <button
              type="button"
              aria-pressed={layers.amyloid}
              onClick={() =>
                setLayers((current) => ({
                  ...current,
                  amyloid: !current.amyloid,
                }))
              }
            >
              {copy.amyloid}
            </button>
            <button
              type="button"
              aria-pressed={layers.tau}
              onClick={() =>
                setLayers((current) => ({
                  ...current,
                  tau: !current.tau,
                }))
              }
            >
              {copy.tau}
            </button>
            <button
              type="button"
              aria-pressed={layers.delta}
              onClick={() =>
                setLayers((current) => ({
                  ...current,
                  delta: !current.delta,
                }))
              }
            >
              {copy.deltaMap}
            </button>
          </div>
          <div className="neuro-brain-stage">
            <Brain3DViewer
              metrics={metrics}
              year={year}
              selectedRegion={selectedRegion}
              layers={layers}
              comparisonStrength={comparisonStrength}
              onSelectRegion={setSelectedRegion}
              ariaLabel={`${copy.brainTitle}. ${copy.amyloid}: ${Math.round(metrics.amyloid)}. ${copy.tau}: ${Math.round(metrics.tau)}.`}
            />
            {audienceMode === "guided" ? (
              <NeuroBrainGuide
                locale={locale}
                year={year}
                playing={playing}
                treatmentName={treatment.name}
                hasTreatment={treatment.id !== "baseline"}
              />
            ) : null}
            <div className="neuro-region-dock" aria-label={copy.region}>
              {(Object.keys(regions) as RegionId[]).map((regionId, index) => (
                <button
                  key={regionId}
                  type="button"
                  aria-pressed={selectedRegion === regionId}
                  onClick={() => setSelectedRegion(regionId)}
                >
                  <span>0{index + 1}</span>
                  {regions[regionId].label[locale]}
                </button>
              ))}
            </div>
            <div className="neuro-live-readout" aria-hidden="true">
              <span>LIVE / WEBGL</span>
              <i />
              <span>REALTIME</span>
            </div>
          </div>
          <div className="neuro-legend" aria-hidden="true">
            <span className="legend-amyloid">{copy.amyloid}</span>
            <span className="legend-tau">{copy.tau}</span>
            <span className="legend-region">{copy.region}</span>
            <span className="legend-delta">{copy.deltaMap}</span>
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

      <section
        className="neuro-differential"
        aria-labelledby="neuro-differential-title"
      >
        <div>
          <p className="eyebrow">A/B · ACTIVE VS REFERENCE</p>
          <h3 id="neuro-differential-title">{copy.comparisonTitle}</h3>
          <p>{copy.comparisonIntro}</p>
        </div>
        <div className="neuro-delta-grid">
          <article>
            <span>Δ {copy.cognition}</span>
            <strong>{formatDelta(deltas.cognition)}</strong>
            <small>{treatment.name}</small>
          </article>
          <article>
            <span>Δ {copy.amyloid}</span>
            <strong>{formatDelta(deltas.amyloid, true)}</strong>
            <small>{copy.natural}</small>
          </article>
          <article>
            <span>Δ {copy.tau}</span>
            <strong>{formatDelta(deltas.tau, true)}</strong>
            <small>{copy.natural}</small>
          </article>
          <article>
            <span>Δ {copy.hippocampus}</span>
            <strong>{formatDelta(deltas.hippocampus)}</strong>
            <small>T+{year.toFixed(2)}</small>
          </article>
        </div>
      </section>

      <NeuroStudyConsole
        locale={locale}
        year={year}
        activeTreatmentId={treatmentId}
        treatments={treatments.map((item) => ({
          category: item.category,
          factors: item.factors,
          id: item.id,
          name: item.name,
        }))}
        pathologyCount={activeDiseases.length}
        onTreatmentChange={(id) => setTreatmentId(id as TreatmentId)}
      />

      <section
        className="neuro-network-lab"
        aria-labelledby="neuro-network-title"
      >
        <div className="neuro-network-heading">
          <div>
            <p className="eyebrow">CONNECTOME / MULTI-PATHOLOGY</p>
            <h3 id="neuro-network-title">{copy.connectome}</h3>
          </div>
          <p>{copy.networkHint}</p>
        </div>
        <div className="neuro-network-layout">
          <fieldset className="neuro-disease-selector">
            <legend>{copy.pathologies}</legend>
            <p>{copy.pathologiesIntro}</p>
            {diseaseModels.map((disease) => {
              const active = activeDiseases.includes(disease.id);
              return (
                <button
                  key={disease.id}
                  type="button"
                  data-disease={disease.id}
                  aria-pressed={active}
                  onClick={() => toggleDisease(disease.id)}
                >
                  <i aria-hidden="true" />
                  <span>
                    <strong>{disease.name[locale]}</strong>
                    <small>{disease.signature[locale]}</small>
                  </span>
                </button>
              );
            })}
          </fieldset>

          <div className="neuro-connectome-canvas">
            <div>
              <span>{copy.connectome}</span>
              <strong>
                {activeDiseases.length.toString().padStart(2, "0")} / 04
              </strong>
            </div>
            <canvas
              ref={networkCanvasRef}
              role="img"
              aria-label={`${copy.connectome}. ${activeDiseases
                .map(
                  (id) =>
                    diseaseModels.find((disease) => disease.id === id)?.name[
                      locale
                    ],
                )
                .filter(Boolean)
                .join(", ")}.`}
            />
          </div>

          <div className="neuro-network-scores">
            <span>{copy.networkScore}</span>
            {networkScores.map((network) => (
              <button
                key={network.id}
                type="button"
                aria-pressed={selectedNetwork === network.id}
                onClick={() => setSelectedNetwork(network.id)}
              >
                <span>
                  <strong>{network.label[locale]}</strong>
                  <small>{network.function[locale]}</small>
                </span>
                <output>{Math.round(network.score)}%</output>
                <i aria-hidden="true">
                  <b style={{ width: `${network.score}%` }} />
                </i>
              </button>
            ))}
          </div>
        </div>
      </section>

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
