const base = process.argv[2]?.replace(/\/$/, "");

if (!base || !base.startsWith("https://")) {
  throw new Error(
    "Usage: node scripts/check-live.mjs https://production-origin",
  );
}

const slugs = [
  "operations-crm",
  "secure-client-portal",
  "mario-ai",
  "remote-assist",
  "boreal",
  "pipe360-profiler",
];

const informationalRoutes = [
  "/",
  "/en/",
  "/cv/",
  "/en/resume/",
  "/preuves-competences/",
  "/en/evidence/",
  ...slugs.flatMap((slug) => [`/projets/${slug}/`, `/en/projects/${slug}/`]),
];
const interactiveRoutes = ["/projets/neuro-lens/", "/en/projects/neuro-lens/"];
const routes = [...informationalRoutes, ...interactiveRoutes];

const pages = await Promise.all(
  routes.map(async (route) => {
    const response = await fetch(`${base}${route}`);
    return {
      route,
      status: response.status,
      text: await response.text(),
    };
  }),
);

const combined = pages.map(({ text }) => text).join("\n");
const failedRoutes = pages
  .filter(({ status }) => status !== 200)
  .map(({ route, status }) => `${route}:${status}`);
const findings = {
  localPath: /C:\\Users|ThierryRouillard\\OneDrive|localhost:/i.test(combined),
  awsKey: /AKIA[0-9A-Z]{16}/.test(combined),
  githubToken: /gh[opsu]_[A-Za-z0-9_]{20,}/.test(combined),
  privateIp: /\b(?:10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)/.test(combined),
  budgetEmail: /trouillard@hotmail\.com/i.test(combined),
  provisionalCopy:
    /Coordonnée professionnelle à confirmer|Professional contact detail to be confirmed|PDF à venir|PDF coming soon|Interface préparée|Interface prepared|Envoi bientôt disponible|Sending available soon|Certifications actuelles|Current certifications/i.test(
      combined,
    ),
  nextRuntimeOnInformationalPage: pages
    .filter(({ route }) => informationalRoutes.includes(route))
    .some(({ text }) =>
      /self\.__next_f|\/_next\/static\/chunks\/[^"']+\.js/.test(text),
    ),
  missingInteractiveRuntime: pages
    .filter(({ route }) => interactiveRoutes.includes(route))
    .some(
      ({ text }) =>
        !/self\.__next_f|\/_next\/static\/chunks\/[^"']+\.js/.test(text),
    ),
};

const frenchHome = pages.find(({ route }) => route === "/")?.text ?? "";
const englishHome = pages.find(({ route }) => route === "/en/")?.text ?? "";
const notFound = await fetch(`${base}/route-inexistante-test/`, {
  redirect: "manual",
});
const notFoundTarget = notFound.headers.get("location");
const notFoundTargetResponse = notFoundTarget
  ? await fetch(new URL(notFoundTarget, base))
  : notFound;
const notFoundText = await notFoundTargetResponse.text();
const validNotFound =
  (notFound.status === 404 && notFoundText.includes("Signal introuvable")) ||
  (notFound.status === 302 &&
    notFoundTarget === "/404.html" &&
    notFoundTargetResponse.status === 200 &&
    notFoundText.includes("Signal introuvable"));
const result = {
  origin: base,
  pagesChecked: pages.length,
  failedRoutes,
  findings,
  languageContent: {
    french: frenchHome.includes("Développeur logiciel"),
    english: englishHome.includes("Software developer"),
  },
  notFound: {
    status: notFound.status,
    target: notFoundTarget,
    targetStatus: notFoundTargetResponse.status,
    customPage: notFoundText.includes("Signal introuvable"),
  },
};

console.log(JSON.stringify(result, null, 2));

if (
  failedRoutes.length ||
  Object.values(findings).some(Boolean) ||
  !result.languageContent.french ||
  !result.languageContent.english ||
  !validNotFound
) {
  process.exitCode = 1;
}
