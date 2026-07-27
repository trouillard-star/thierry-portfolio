import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const slugs = [
  "neuro-lens",
  "operations-crm",
  "report-automation",
  "secure-client-portal",
  "mario-ai",
  "remote-assist",
  "boreal",
  "pipe360-profiler",
];

const routes = [
  "/",
  "/en",
  "/cv",
  "/en/resume",
  "/preuves-competences",
  "/en/evidence",
  ...slugs.flatMap((slug) => [`/projets/${slug}`, `/en/projects/${slug}`]),
];

async function getWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

async function render(worker, path) {
  const response = await worker.fetch(
    new Request(`https://portfolio.test${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location");
    assert.ok(location, `${path} redirect should include a location`);
    const redirectUrl = new URL(location, "https://portfolio.test");
    return render(worker, `${redirectUrl.pathname}${redirectUrl.search}`);
  }

  return response;
}

test("server-renders every portfolio route", async () => {
  const worker = await getWorker();

  for (const route of routes) {
    const response = await render(worker, route);
    assert.equal(response.status, 200, `${route} should return 200`);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
    const html = await response.text();
    assert.match(
      html,
      /Thierry Rouillard/i,
      `${route} should identify the owner`,
    );
    assert.doesNotMatch(
      html,
      /codex-preview|loading skeleton|Starter Project/i,
    );
    assert.match(
      html,
      /href=["']#contenu["']/,
      `${route} should include a skip link`,
    );
  }
});

test("French and English content are both available", async () => {
  const worker = await getWorker();
  const [frResponse, enResponse] = await Promise.all([
    render(worker, "/"),
    render(worker, "/en"),
  ]);
  const [fr, en] = await Promise.all([frResponse.text(), enResponse.text()]);

  assert.match(fr, /Développeur logiciel/);
  assert.match(fr, /preuves de compétences/i);
  assert.match(en, /Software developer/);
  assert.match(en, /competency evidence/i);
  assert.match(fr, /href=["']\/en/);
  assert.match(en, /href=["']\//);
});

test("project maturity and confidentiality boundaries are explicit", async () => {
  const worker = await getWorker();
  const response = await render(worker, "/projets/boreal");
  const html = await response.text();

  assert.match(html, /Concept (?:planifié|d’architecture)/);
  assert.match(html, /Aucun (?:produit commercial|code de production)/);
  assert.doesNotMatch(
    html,
    /AKIA[0-9A-Z]{16}|aws_account_id|password\s*[:=]|api[_-]?key\s*[:=]/i,
  );
});

test("the contact interface does not transmit or store data", async () => {
  const worker = await getWorker();
  const response = await render(worker, "/");
  const html = await response.text();

  assert.match(html, /github\.com\/trouillard-star/i);
  assert.doesNotMatch(html, /<form/i);
  assert.doesNotMatch(html, /https?:\/\/(?:formspree|netlify|web3forms)/i);
});

test("every project exposes a streamlined, functional case study", async () => {
  const worker = await getWorker();

  for (const slug of slugs) {
    const response = await render(worker, `/projets/${slug}`);
    const html = await response.text();

    assert.match(html, /Étude de cas/i);
    assert.match(html, /Résumé exécutif/i);
    assert.match(html, /Architecture de la solution/i);
    assert.match(html, /Détails de réalisation/i);
    assert.match(html, /Projet suivant/i);
    assert.match(html, /Mini-application interactive/i);
    assert.match(html, /Données anonymisées/i);
    assert.match(html, /aria-pressed=/i);
    assert.match(html, /Réinitialiser/i);
    assert.match(html, new RegExp(`href=["']/diagrams/${slug}\\.mmd["']`));
    assert.match(html, /<details>/i);
  }
});

test("French and English case studies expose equivalent navigation", async () => {
  const worker = await getWorker();
  const [frResponse, enResponse] = await Promise.all([
    render(worker, "/projets/neuro-lens"),
    render(worker, "/en/projects/neuro-lens"),
  ]);
  const [fr, en] = await Promise.all([frResponse.text(), enResponse.text()]);

  assert.match(fr, /Vue d’ensemble/i);
  assert.match(fr, /Résultats et apprentissages/i);
  assert.match(fr, /Voir la stratégie de validation/i);
  assert.match(en, /Executive summary/i);
  assert.match(en, /Outcomes and learnings/i);
  assert.match(en, /View validation strategy/i);
  assert.match(fr, /href=["']\/en\/projects\/neuro-lens["']/);
  assert.match(en, /href=["']\/projets\/neuro-lens["']/);
});

test("NeuroLens renders the interactive anatomical brain without development controls", async () => {
  const worker = await getWorker();
  const [frResponse, enResponse] = await Promise.all([
    render(worker, "/projets/neuro-lens"),
    render(worker, "/en/projects/neuro-lens"),
  ]);
  const [fr, en] = await Promise.all([frResponse.text(), enResponse.text()]);

  assert.match(fr, /<canvas[^>]+role=["']img["'][^>]+Cerveau 3D NeuroLens/i);
  assert.match(en, /<canvas[^>]+role=["']img["'][^>]+NeuroLens 3D brain/i);
  assert.match(fr, />Biomarqueurs</i);
  assert.match(fr, />Réseaux</i);
  assert.match(fr, />Étude</i);
  assert.doesNotMatch(fr, /3D DEBUG/i);
  assert.doesNotMatch(en, /3D DEBUG/i);
});

test("every product demo exposes a project-specific animated visual", async () => {
  const worker = await getWorker();
  const motionVisuals = {
    "operations-crm": "crm",
    "report-automation": "report",
    "secure-client-portal": "portal",
    "mario-ai": "mario",
    "remote-assist": "assist",
    "pipe360-profiler": "pipe",
    boreal: "boreal",
  };

  for (const [slug, variant] of Object.entries(motionVisuals)) {
    const response = await render(worker, `/projets/${slug}`);
    const html = await response.text();

    assert.match(
      html,
      new RegExp(`project-motion project-motion-${variant}`),
      `${slug} should render its animated product visual`,
    );
    assert.match(html, /data-motion-tab=["']0["']/);
  }
});

test("the public worker rejects every mutating request", async () => {
  const worker = await getWorker();
  const response = await worker.fetch(
    new Request("https://portfolio.test/", { method: "POST" }),
    {},
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "GET, HEAD");
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("the public worker applies the production security baseline", async () => {
  const worker = await getWorker();
  const response = await render(worker, "/");

  for (const header of [
    "content-security-policy",
    "permissions-policy",
    "referrer-policy",
    "strict-transport-security",
    "x-content-type-options",
    "x-frame-options",
  ]) {
    assert.ok(response.headers.has(header), `${header} should be present`);
  }
});

test("live verification covers every declared project", async () => {
  const projectSource = await readFile(
    new URL("../src/data/projects.ts", import.meta.url),
    "utf8",
  );
  const liveCheck = await readFile(
    new URL("../scripts/check-live.mjs", import.meta.url),
    "utf8",
  );
  const declaredSlugs = [...projectSource.matchAll(/\bslug:\s*"([^"]+)"/g)].map(
    (match) => match[1],
  );

  assert.deepEqual(new Set(declaredSlugs), new Set(slugs));
  for (const slug of declaredSlugs) {
    assert.match(liveCheck, new RegExp(`"${slug}"`));
  }

  const staticRuntimeStrip = await readFile(
    new URL("../scripts/strip-static-runtime.mjs", import.meta.url),
    "utf8",
  );
  for (const slug of declaredSlugs) {
    assert.match(staticRuntimeStrip, new RegExp(`"${slug}"`));
  }
});

test("Sites metadata is optional for public-source builds", async () => {
  const { loadHostingConfig } = await import(
    new URL("../build/hosting-config.mjs", import.meta.url)
  );
  const missingConfig = join(
    process.cwd(),
    `.missing-hosting-${process.pid}-${Date.now()}.json`,
  );

  assert.deepEqual(await loadHostingConfig(missingConfig), {
    d1: null,
    r2: null,
  });
});
