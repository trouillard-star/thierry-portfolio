"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/src/data/profile";

type Factors = {
  amyloid: number;
  tau: number;
  cognition: number;
  atrophy: number;
  symptomLift: number;
};

export type StudyTreatmentOption = {
  id: string;
  name: string;
  category: "reference" | "approved" | "experimental";
  factors: Factors;
};

type EndpointId = "cognition" | "amyloid" | "connectivity";
type StageId = "mci" | "mild" | "moderate";

type Props = {
  locale: Locale;
  year: number;
  activeTreatmentId: string;
  treatments: StudyTreatmentOption[];
  pathologyCount: number;
  onTreatmentChange: (id: string) => void;
};

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

export function NeuroStudyConsole({
  locale,
  year,
  activeTreatmentId,
  treatments,
  pathologyCount,
  onTreatmentChange,
}: Props) {
  const [sampleSize, setSampleSize] = useState(180);
  const [meanAge, setMeanAge] = useState(72);
  const [apoeRate, setApoeRate] = useState(46);
  const [stage, setStage] = useState<StageId>("mci");
  const [endpoint, setEndpoint] = useState<EndpointId>("cognition");
  const [comparatorId, setComparatorId] = useState("baseline");
  const [analysisRevision, setAnalysisRevision] = useState(1);
  const [running, setRunning] = useState(false);

  const activeTreatment =
    treatments.find((treatment) => treatment.id === activeTreatmentId) ??
    treatments[0];
  const resolvedComparatorId =
    comparatorId === activeTreatmentId
      ? activeTreatmentId === "baseline"
        ? "lecanemab"
        : "baseline"
      : comparatorId;
  const comparator =
    treatments.find((treatment) => treatment.id === resolvedComparatorId) ??
    treatments[0];

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      setAnalysisRevision((current) => current + 1);
      setRunning(false);
    }, 720);
    return () => window.clearTimeout(timer);
  }, [running]);

  const analysis = useMemo(() => {
    const stageMultiplier = { mci: 0.82, mild: 1, moderate: 0.92 }[stage];
    const ageAdjustment = 1 + Math.max(0, meanAge - 68) * 0.006;
    const genotypeAdjustment = 1 + (apoeRate - 35) * 0.003;
    const active = activeTreatment.factors;
    const control = comparator.factors;
    const endpointEffect = {
      cognition:
        (control.cognition - active.cognition) * year * 7.2 +
        (active.symptomLift - control.symptomLift) *
          Math.exp(-Math.max(0, year - 1) / 4),
      amyloid: (control.amyloid - active.amyloid) * year * 6.2,
      connectivity:
        ((control.cognition - active.cognition) * 5.4 +
          (control.tau - active.tau) * 2.8) *
        year,
    }[endpoint];
    const effect =
      endpointEffect * stageMultiplier * ageAdjustment * genotypeAdjustment;
    const standardDeviation = {
      cognition: 11.8,
      amyloid: 15.4,
      connectivity: 9.6,
    }[endpoint];
    const standardError =
      standardDeviation * Math.sqrt(2 / Math.max(24, sampleSize / 2));
    const zScore = Math.abs(effect) / Math.max(0.1, standardError);
    const pValue = clamp(
      Math.exp(-0.717 * zScore - 0.416 * zScore * zScore),
      0.0001,
      0.999,
    );
    const effectSize = effect / standardDeviation;
    const power = clamp(
      48 +
        Math.abs(effectSize) * Math.sqrt(sampleSize) * 5.1 -
        pathologyCount * 1.8,
      12,
      99,
    );
    const retention = clamp(
      96 - year * 1.15 - (stage === "moderate" ? 4.5 : 0),
      71,
      98,
    );
    return {
      ciHigh: effect + standardError * 1.96,
      ciLow: effect - standardError * 1.96,
      effect,
      effectSize,
      pValue,
      power,
      retention,
      standardError,
    };
  }, [
    activeTreatment,
    apoeRate,
    comparator,
    endpoint,
    meanAge,
    pathologyCount,
    sampleSize,
    stage,
    year,
  ]);

  const roiRows = useMemo(() => {
    const rows = [
      { id: "HPC", name: { fr: "Hippocampe", en: "Hippocampus" }, weight: 1 },
      {
        id: "TMP",
        name: { fr: "Cortex temporal", en: "Temporal cortex" },
        weight: 0.88,
      },
      {
        id: "PAR",
        name: { fr: "Cortex pariétal", en: "Parietal cortex" },
        weight: 0.69,
      },
      {
        id: "PFC",
        name: { fr: "Cortex préfrontal", en: "Prefrontal cortex" },
        weight: 0.57,
      },
      {
        id: "PCC",
        name: { fr: "Cingulaire postérieur", en: "Posterior cingulate" },
        weight: 0.81,
      },
    ];
    return rows.map((row, index) => {
      const active = activeTreatment.factors;
      const treatmentBenefit =
        (1 - active.atrophy) * 4.2 + (1 - active.cognition) * 2.4;
      const volume = -(year * 0.72 * row.weight * active.atrophy);
      const amyloid = 1.08 + year * 0.038 * row.weight * active.amyloid;
      const tau = 1.03 + year * 0.032 * row.weight * active.tau;
      const connectivity = clamp(
        96 -
          year * 4.4 * row.weight * active.cognition +
          treatmentBenefit -
          pathologyCount * 1.2,
        22,
        99,
      );
      const response = clamp(
        38 + treatmentBenefit * 6.2 + (sampleSize / 500) * 8 - index * 2.4,
        8,
        94,
      );
      return { ...row, amyloid, connectivity, response, tau, volume };
    });
  }, [activeTreatment, pathologyCount, sampleSize, year]);

  const copy = {
    fr: {
      eyebrow: "STUDY DESIGNER / SYNTHETIC TRIAL",
      title: "Console d’étude longitudinale",
      intro:
        "Configurez une cohorte, choisissez le comparateur et exécutez une analyse reproductible.",
      design: "Plan expérimental",
      active: "Intervention",
      comparator: "Comparateur",
      endpoint: "Critère principal",
      stage: "Stade initial",
      sample: "Participants",
      age: "Âge moyen",
      apoe: "Porteurs APOE ε4",
      run: "Exécuter l’analyse",
      running: "Calcul en cours…",
      export: "Exporter les ROI",
      cognition: "Variation cognitive",
      amyloid: "Charge amyloïde",
      connectivity: "Connectivité réseau",
      mci: "Trouble cognitif léger",
      mild: "Démence légère",
      moderate: "Démence modérée",
      results: "Résultats statistiques",
      effect: "Effet estimé",
      ci: "IC 95 %",
      pValue: "Valeur p",
      power: "Puissance",
      retention: "Rétention",
      qc: "Qualité imagerie",
      roi: "Analyse régionale ROI",
      region: "Région",
      volume: "Δ volume",
      suvrAmyloid: "SUVR amyloïde",
      suvrTau: "SUVR tau",
      network: "Connectivité",
      response: "Réponse",
      disclaimer:
        "Calculs entièrement synthétiques destinés à démontrer une interface de recherche; aucune valeur clinique.",
      revision: "Analyse",
    },
    en: {
      eyebrow: "STUDY DESIGNER / SYNTHETIC TRIAL",
      title: "Longitudinal study console",
      intro:
        "Configure a cohort, choose a comparator, and run a reproducible analysis.",
      design: "Experimental design",
      active: "Intervention",
      comparator: "Comparator",
      endpoint: "Primary endpoint",
      stage: "Baseline stage",
      sample: "Participants",
      age: "Mean age",
      apoe: "APOE ε4 carriers",
      run: "Run analysis",
      running: "Computing…",
      export: "Export ROI data",
      cognition: "Cognitive change",
      amyloid: "Amyloid load",
      connectivity: "Network connectivity",
      mci: "Mild cognitive impairment",
      mild: "Mild dementia",
      moderate: "Moderate dementia",
      results: "Statistical results",
      effect: "Estimated effect",
      ci: "95% CI",
      pValue: "p-value",
      power: "Power",
      retention: "Retention",
      qc: "Imaging quality",
      roi: "Regional ROI analysis",
      region: "Region",
      volume: "Δ volume",
      suvrAmyloid: "Amyloid SUVR",
      suvrTau: "Tau SUVR",
      network: "Connectivity",
      response: "Response",
      disclaimer:
        "Fully synthetic calculations for research-interface demonstration; no clinical value.",
      revision: "Analysis",
    },
  }[locale];

  const endpointLabels: Record<EndpointId, string> = {
    cognition: copy.cognition,
    amyloid: copy.amyloid,
    connectivity: copy.connectivity,
  };
  const stageLabels: Record<StageId, string> = {
    mci: copy.mci,
    mild: copy.mild,
    moderate: copy.moderate,
  };

  const exportRoi = () => {
    const header = [
      "roi",
      "region",
      "volume_change_pct",
      "amyloid_suvr",
      "tau_suvr",
      "connectivity_pct",
      "response_pct",
    ];
    const rows = roiRows.map((row) => [
      row.id,
      row.name[locale],
      row.volume.toFixed(2),
      row.amyloid.toFixed(3),
      row.tau.toFixed(3),
      row.connectivity.toFixed(1),
      row.response.toFixed(1),
    ]);
    const csv = [header, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `neurolens-roi-analysis-${analysisRevision}.csv`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return (
    <section
      className="neuro-study-console"
      aria-labelledby="neuro-study-console-title"
    >
      <div className="neuro-study-heading">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h3 id="neuro-study-console-title">{copy.title}</h3>
        </div>
        <p>{copy.intro}</p>
        <span>
          {copy.revision} #{analysisRevision.toString().padStart(3, "0")}
        </span>
      </div>

      <div className="neuro-study-grid">
        <form
          className="neuro-study-design"
          onSubmit={(event) => event.preventDefault()}
        >
          <span>{copy.design}</span>
          <label>
            {copy.active}
            <select
              value={activeTreatmentId}
              onChange={(event) => onTreatmentChange(event.target.value)}
            >
              {treatments.map((treatment) => (
                <option key={treatment.id} value={treatment.id}>
                  {treatment.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            {copy.comparator}
            <select
              value={resolvedComparatorId}
              onChange={(event) => setComparatorId(event.target.value)}
            >
              {treatments
                .filter((treatment) => treatment.id !== activeTreatmentId)
                .map((treatment) => (
                  <option key={treatment.id} value={treatment.id}>
                    {treatment.name}
                  </option>
                ))}
            </select>
          </label>
          <label>
            {copy.endpoint}
            <select
              value={endpoint}
              onChange={(event) =>
                setEndpoint(event.target.value as EndpointId)
              }
            >
              {Object.entries(endpointLabels).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            {copy.stage}
            <select
              value={stage}
              onChange={(event) => setStage(event.target.value as StageId)}
            >
              {Object.entries(stageLabels).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="neuro-study-range">
            <span>
              {copy.sample} <output>{sampleSize}</output>
            </span>
            <input
              type="range"
              min="40"
              max="500"
              step="20"
              value={sampleSize}
              onChange={(event) => setSampleSize(Number(event.target.value))}
            />
          </label>
          <label className="neuro-study-range">
            <span>
              {copy.age} <output>{meanAge}</output>
            </span>
            <input
              type="range"
              min="55"
              max="85"
              step="1"
              value={meanAge}
              onChange={(event) => setMeanAge(Number(event.target.value))}
            />
          </label>
          <label className="neuro-study-range">
            <span>
              {copy.apoe} <output>{apoeRate}%</output>
            </span>
            <input
              type="range"
              min="0"
              max="100"
              step="2"
              value={apoeRate}
              onChange={(event) => setApoeRate(Number(event.target.value))}
            />
          </label>
          <button
            className="neuro-run-analysis"
            type="button"
            disabled={running}
            onClick={() => setRunning(true)}
          >
            <i aria-hidden="true" />
            {running ? copy.running : copy.run}
          </button>
        </form>

        <div className="neuro-statistics" aria-live="polite">
          <span>{copy.results}</span>
          <div>
            <article>
              <small>{copy.effect}</small>
              <strong>
                {analysis.effect >= 0 ? "+" : ""}
                {analysis.effect.toFixed(2)}
              </strong>
              <em>d = {analysis.effectSize.toFixed(2)}</em>
            </article>
            <article>
              <small>{copy.ci}</small>
              <strong>
                {analysis.ciLow.toFixed(2)} · {analysis.ciHigh.toFixed(2)}
              </strong>
              <em>SE {analysis.standardError.toFixed(2)}</em>
            </article>
            <article>
              <small>{copy.pValue}</small>
              <strong>
                {analysis.pValue < 0.001
                  ? "< 0.001"
                  : analysis.pValue.toFixed(3)}
              </strong>
              <em>two-sided</em>
            </article>
            <article>
              <small>{copy.power}</small>
              <strong>{analysis.power.toFixed(0)}%</strong>
              <i>
                <b style={{ width: `${analysis.power}%` }} />
              </i>
            </article>
            <article>
              <small>{copy.retention}</small>
              <strong>{analysis.retention.toFixed(1)}%</strong>
              <em>at T+{year.toFixed(2)}</em>
            </article>
            <article>
              <small>{copy.qc}</small>
              <strong>98.4%</strong>
              <em>QC PASS</em>
            </article>
          </div>
          <p>{copy.disclaimer}</p>
        </div>
      </div>

      <div className="neuro-roi-panel">
        <div>
          <span>{copy.roi}</span>
          <button type="button" onClick={exportRoi}>
            ↓ {copy.export}
          </button>
        </div>
        <div className="neuro-roi-table-wrap">
          <table>
            <thead>
              <tr>
                <th>ROI</th>
                <th>{copy.region}</th>
                <th>{copy.volume}</th>
                <th>{copy.suvrAmyloid}</th>
                <th>{copy.suvrTau}</th>
                <th>{copy.network}</th>
                <th>{copy.response}</th>
              </tr>
            </thead>
            <tbody>
              {roiRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <th scope="row">{row.name[locale]}</th>
                  <td>{row.volume.toFixed(2)}%</td>
                  <td>{row.amyloid.toFixed(3)}</td>
                  <td>{row.tau.toFixed(3)}</td>
                  <td>{row.connectivity.toFixed(1)}%</td>
                  <td>
                    <span>
                      <i style={{ width: `${row.response}%` }} />
                    </span>
                    {row.response.toFixed(0)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
