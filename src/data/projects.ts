import type { Locale, LocalizedText } from "./profile";

export type ProjectStatus = "applied" | "prototype" | "research" | "concept";

export type Project = {
  slug: string;
  index: string;
  title: LocalizedText;
  status: ProjectStatus;
  statusLabel: LocalizedText;
  tagline: LocalizedText;
  summary: LocalizedText;
  context: LocalizedText;
  problem: LocalizedText;
  role: LocalizedText;
  approach: LocalizedText;
  architecture: {
    fr: string[];
    en: string[];
  };
  technologies: string[];
  security: LocalizedText[];
  testing: LocalizedText[];
  results: LocalizedText[];
  lessons: LocalizedText[];
  currentStatus: LocalizedText;
};

export const projects: Project[] = [
  {
    slug: "neuro-lens",
    index: "LAB-01",
    title: { fr: "NeuroLens", en: "NeuroLens" },
    status: "research",
    statusLabel: {
      fr: "Démonstrateur recherche",
      en: "Research demonstrator",
    },
    tagline: {
      fr: "Comparer les trajectoires neurodégénératives, les réseaux cérébraux et les hypothèses thérapeutiques dans un jumeau 3D interactif.",
      en: "Compare neurodegenerative trajectories, brain networks, and treatment hypotheses in an interactive 3D twin.",
    },
    summary: {
      fr: "Un laboratoire bilingue multi-pathologies qui transforme la littérature scientifique en scénarios explorables : cerveau anatomique en temps réel, connectome, concepteur d’étude, statistiques, analyses ROI et traitements approuvés ou expérimentaux.",
      en: "A bilingual multi-pathology research lab that turns scientific literature into explorable scenarios: a real-time anatomical brain, connectome, study designer, statistics, ROI analyses, and approved or experimental treatments.",
    },
    context: {
      fr: "La recherche sur Alzheimer évolue rapidement et combine imagerie, biomarqueurs, scores cognitifs, essais cliniques et niveaux de preuve difficiles à relier pour un lecteur non spécialiste.",
      en: "Alzheimer's research evolves quickly and combines imaging, biomarkers, cognitive scores, clinical trials, and evidence levels that are difficult for non-specialists to connect.",
    },
    problem: {
      fr: "Les sources sont dispersées et une courbe isolée peut facilement être confondue avec une prédiction clinique. Il faut permettre l'exploration sans masquer l'incertitude ni inventer une précision médicale.",
      en: "Sources are scattered, and an isolated chart can easily be mistaken for a clinical prediction. Exploration must remain possible without hiding uncertainty or inventing medical precision.",
    },
    role: {
      fr: "Conception produit, modélisation de données, expérience interactive, visualisation en temps réel, architecture documentaire, accessibilité et garde-fous médicaux.",
      en: "Product design, data modelling, interactive experience, real-time visualization, documentation architecture, accessibility, and medical safeguards.",
    },
    approach: {
      fr: "Séparer strictement les faits sourcés des paramètres synthétiques. Chaque traitement indique son statut, son mécanisme, ses limites et sa source. Le cerveau, les trajectoires et les réseaux réagissent en temps réel, tout en restant explicitement des scénarios éducatifs.",
      en: "Strictly separate sourced facts from synthetic parameters. Every treatment exposes its status, mechanism, limitations, and source. The brain, trajectories, and networks respond in real time while remaining explicitly educational scenarios.",
    },
    architecture: {
      fr: [
        "Sources scientifiques",
        "Base de connaissances",
        "Moteur de scénarios",
        "Jumeau cérébral + connectome",
      ],
      en: [
        "Scientific sources",
        "Knowledge base",
        "Scenario engine",
        "Brain twin + connectome",
      ],
    },
    technologies: [
      "React",
      "TypeScript",
      "Three.js / WebGL",
      "Connectome modelling",
      "Statistical modelling",
      "Data visualization",
      "Scientific UX",
      "Accessibility",
    ],
    security: [
      {
        fr: "Aucune donnée de patient : tous les profils, indices et trajectoires sont synthétiques.",
        en: "No patient data: all profiles, indices, and trajectories are synthetic.",
      },
      {
        fr: "Séparation visible entre traitements approuvés, essais expérimentaux et trajectoire de référence.",
        en: "Visible separation between approved treatments, experimental trials, and the reference trajectory.",
      },
      {
        fr: "Aucune recommandation, aucun diagnostic et aucune sauvegarde d'information médicale.",
        en: "No recommendations, diagnosis, or storage of medical information.",
      },
    ],
    testing: [
      {
        fr: "Validation des états clavier, tactiles, mobiles et à mouvement réduit.",
        en: "Keyboard, touch, mobile, and reduced-motion state validation.",
      },
      {
        fr: "Vérification que chaque valeur dynamique demeure annoncée et que les sources sont accessibles.",
        en: "Checks that every dynamic value remains announced and all sources are reachable.",
      },
      {
        fr: "Tests de cohérence entre traitement, biomarqueurs, courbe et région cérébrale sélectionnée.",
        en: "Consistency tests across treatment, biomarkers, chart, and selected brain region.",
      },
    ],
    results: [
      {
        fr: "Une pièce de portfolio immersive qui démontre la capacité à construire un produit scientifique complet, pas seulement un graphique.",
        en: "An immersive portfolio piece demonstrating the ability to build a complete scientific product, not merely a chart.",
      },
      {
        fr: "Un modèle de documentation où provenance, incertitude et interaction restent visibles au même endroit.",
        en: "A documentation model where provenance, uncertainty, and interaction remain visible in one place.",
      },
    ],
    lessons: [
      {
        fr: "Une visualisation médicale puissante doit rendre ses limites aussi lisibles que ses résultats.",
        en: "A powerful medical visualization must make its limitations as legible as its results.",
      },
      {
        fr: "Le niveau de preuve est une donnée de produit, pas une note de bas de page.",
        en: "Evidence level is product data, not a footnote.",
      },
    ],
    currentStatus: {
      fr: "Démonstrateur éducatif avancé créé pour le portfolio. Les valeurs de simulation sont synthétiques et ne représentent ni un outil clinique ni l'efficacité réelle d'un traitement.",
      en: "Advanced educational demonstrator created for the portfolio. Simulation values are synthetic and represent neither a clinical tool nor real treatment efficacy.",
    },
  },
  {
    slug: "operations-crm",
    index: "01",
    title: { fr: "CRM opérations", en: "Operations CRM" },
    status: "applied",
    statusLabel: { fr: "Travail appliqué", en: "Applied work" },
    tagline: {
      fr: "Unifier le suivi opérationnel sans perdre la réalité du terrain.",
      en: "Unify operational tracking without losing the reality of field work.",
    },
    summary: {
      fr: "Une plateforme interne anonymisée combinant API .NET, modules JavaScript, PostgreSQL, calendrier d’opérations et mécanismes de synchronisation.",
      en: "An anonymized internal platform combining a .NET API, JavaScript modules, PostgreSQL, an operations calendar, and synchronization mechanisms.",
    },
    context: {
      fr: "Des équipes doivent suivre des projets, des opérations planifiées, des échanges et plusieurs entités organisationnelles dans un même environnement.",
      en: "Teams need to track projects, scheduled operations, conversations, and multiple organizational entities in one environment.",
    },
    problem: {
      fr: "L’information répartie entre outils et fichiers crée des doubles saisies, des décalages et une visibilité inégale.",
      en: "Information spread across tools and files creates duplicate entry, synchronization gaps, and uneven visibility.",
    },
    role: {
      fr: "Analyse des flux, conception de modules, développement applicatif, diagnostic et documentation technique.",
      en: "Workflow analysis, module design, application development, diagnostics, and technical documentation.",
    },
    approach: {
      fr: "Séparer les responsabilités entre une API métier, une couche de données relationnelle et des modules d’interface. Concevoir la synchronisation comme un processus explicite, observable et récupérable plutôt qu’une opération implicite.",
      en: "Separate responsibilities across a business API, relational data layer, and interface modules. Treat synchronization as an explicit, observable, recoverable process rather than an implicit operation.",
    },
    architecture: {
      fr: [
        "Interface modulaire",
        "API .NET",
        "Moteur de synchronisation",
        "PostgreSQL",
      ],
      en: [
        "Modular interface",
        ".NET API",
        "Synchronization engine",
        "PostgreSQL",
      ],
    },
    technologies: [".NET", "C#", "JavaScript", "PostgreSQL", "REST", "Git"],
    security: [
      {
        fr: "Limiter chaque opération au contexte d’entreprise autorisé.",
        en: "Scope every operation to the authorized company context.",
      },
      {
        fr: "Éviter l’exposition de données sensibles dans les journaux et les messages de synchronisation.",
        en: "Keep sensitive data out of logs and synchronization messages.",
      },
      {
        fr: "Valider les entrées côté API et documenter les limites de confiance.",
        en: "Validate input at the API and document trust boundaries.",
      },
    ],
    testing: [
      {
        fr: "Tests ciblés de logique métier et scénarios de synchronisation.",
        en: "Targeted business-logic and synchronization scenario tests.",
      },
      {
        fr: "Validation manuelle des flux critiques avec cas de reprise.",
        en: "Manual validation of critical flows, including recovery cases.",
      },
    ],
    results: [
      {
        fr: "Une architecture capable de regrouper calendrier, projets et communication sans couplage direct à un seul écran.",
        en: "An architecture that can bring calendars, projects, and communication together without coupling them to one screen.",
      },
      {
        fr: "Une base structurée pour explorer des concepts de cache ou de fonctionnement hors ligne.",
        en: "A structured base for exploring cache and offline-operation concepts.",
      },
    ],
    lessons: [
      {
        fr: "La synchronisation exige des règles de conflit et d’idempotence définies tôt.",
        en: "Synchronization needs conflict and idempotency rules defined early.",
      },
      {
        fr: "Le vocabulaire opérationnel partagé est aussi important que le schéma de données.",
        en: "Shared operational vocabulary matters as much as the data schema.",
      },
    ],
    currentStatus: {
      fr: "Travail appliqué en évolution. Cette étude décrit les capacités sans affirmer que chaque concept présenté est déployé en production.",
      en: "Evolving applied work. This case study describes capabilities without claiming that every concept shown is deployed in production.",
    },
  },
  {
    slug: "secure-client-portal",
    index: "02",
    title: { fr: "Portail client sécurisé", en: "Secure client portal" },
    status: "prototype",
    statusLabel: { fr: "Prototype avancé", en: "Advanced prototype" },
    tagline: {
      fr: "Publier les bons documents à la bonne personne, avec une trace vérifiable.",
      en: "Publish the right documents to the right person, with a verifiable trail.",
    },
    summary: {
      fr: "Un portail axé sur l’accès aux projets et rapports, la publication documentaire, les notifications et la validation des téléchargements.",
      en: "A portal focused on project and report access, document publishing, notifications, and download validation.",
    },
    context: {
      fr: "Les clients doivent consulter des livrables sans recevoir de liens permanents ou accéder à des données hors de leur mandat.",
      en: "Clients need to consult deliverables without receiving permanent links or accessing data outside their mandate.",
    },
    problem: {
      fr: "Un simple partage de fichiers ne suffit pas pour gérer l’identité, l’autorisation, la publication progressive et la révocation.",
      en: "Basic file sharing is not enough to manage identity, authorization, staged publishing, and revocation.",
    },
    role: {
      fr: "Modélisation des autorisations, conception des parcours, développement de fonctions de publication et revue de sécurité.",
      en: "Authorization modelling, journey design, publishing-feature development, and security review.",
    },
    approach: {
      fr: "Évaluer chaque demande avec une identité, une relation au projet et une politique de document. Isoler la publication du stockage, utiliser des indicateurs de fonctionnalité et tester les refus autant que les succès.",
      en: "Evaluate each request using identity, project relationship, and document policy. Separate publishing from storage, use feature flags, and test denials as thoroughly as success paths.",
    },
    architecture: {
      fr: [
        "Client authentifié",
        "Politique d’accès",
        "Catalogue de projets",
        "Stockage de documents",
      ],
      en: [
        "Authenticated client",
        "Access policy",
        "Project catalogue",
        "Document storage",
      ],
    },
    technologies: [
      ".NET",
      "REST",
      "Authentication",
      "Feature flags",
      "Automated tests",
    ],
    security: [
      {
        fr: "Autorisation par ressource et vérification côté serveur.",
        en: "Per-resource authorization with server-side enforcement.",
      },
      {
        fr: "Téléchargements temporaires, journalisés et limités aux documents publiés.",
        en: "Temporary, logged downloads limited to published documents.",
      },
      {
        fr: "Notifications sans contenu confidentiel et gestion explicite de la révocation.",
        en: "Notifications without confidential content and explicit revocation handling.",
      },
    ],
    testing: [
      {
        fr: "Tests d’autorisation négatifs entre clients, projets et états de publication.",
        en: "Negative authorization tests across clients, projects, and publication states.",
      },
      {
        fr: "Validation automatisée des indicateurs de fonctionnalité et des politiques de téléchargement.",
        en: "Automated validation of feature flags and download policies.",
      },
    ],
    results: [
      {
        fr: "Un modèle de publication qui sépare clairement disponibilité interne et visibilité client.",
        en: "A publishing model that clearly separates internal availability from client visibility.",
      },
      {
        fr: "Une liste de contrôles de sécurité intégrée aux scénarios de test.",
        en: "A security-control checklist integrated into test scenarios.",
      },
    ],
    lessons: [
      {
        fr: "L’autorisation doit être testée comme une fonction métier, pas seulement comme un middleware.",
        en: "Authorization must be tested as business logic, not merely middleware.",
      },
      {
        fr: "Les états de publication réduisent les erreurs mieux que des conventions informelles.",
        en: "Publishing states reduce mistakes better than informal conventions.",
      },
    ],
    currentStatus: {
      fr: "Prototype avancé et travail de validation. Les politiques décrites représentent l’objectif de sécurité; toute mise en production exige une revue d’identité et de stockage.",
      en: "Advanced prototype and validation work. The policies describe the security objective; production use requires an identity and storage review.",
    },
  },
  {
    slug: "mario-ai",
    index: "03",
    title: { fr: "MarioAI", en: "MarioAI" },
    status: "research",
    statusLabel: { fr: "Recherche appliquée", en: "Applied research" },
    tagline: {
      fr: "Préparer des médias d’inspection pour une IA révisable par l’humain.",
      en: "Prepare inspection media for AI that remains reviewable by people.",
    },
    summary: {
      fr: "Une chaîne exploratoire pour scanner des médias, extraire des images vidéo, préparer des jeux de données et organiser les files de revue.",
      en: "An exploratory pipeline for scanning media, extracting video frames, preparing datasets, and organizing review queues.",
    },
    context: {
      fr: "Les inspections d’infrastructure génèrent de grands volumes de vidéos et de métadonnées hétérogènes.",
      en: "Infrastructure inspections generate large volumes of heterogeneous video and metadata.",
    },
    problem: {
      fr: "Avant d’entraîner ou d’évaluer un modèle, il faut rendre les données repérables, cohérentes, étiquetables et auditables.",
      en: "Before training or evaluating a model, the data must be discoverable, consistent, label-ready, and auditable.",
    },
    role: {
      fr: "Conception de pipeline, scripts de scan, extraction de trames, préparation de métadonnées et expérimentation de similarité.",
      en: "Pipeline design, scanning scripts, frame extraction, metadata preparation, and similarity experiments.",
    },
    approach: {
      fr: "Séparer l’inventaire, l’extraction, l’étiquetage et la revue. Conserver la provenance de chaque trame et rendre FFmpeg/ffprobe optionnels afin que le pipeline puisse signaler clairement les capacités disponibles.",
      en: "Separate inventory, extraction, labelling, and review. Preserve provenance for every frame and keep FFmpeg/ffprobe optional so the pipeline can clearly report available capabilities.",
    },
    architecture: {
      fr: [
        "Médias sources",
        "Scan et ffprobe",
        "Extraction de trames",
        "Jeu de données + revue",
      ],
      en: [
        "Source media",
        "Scan and ffprobe",
        "Frame extraction",
        "Dataset + review",
      ],
    },
    technologies: [
      "Python",
      "FFmpeg",
      "ffprobe",
      "SQLite",
      "Computer vision",
      "Metadata",
    ],
    security: [
      {
        fr: "Anonymiser les noms de clients, emplacements et métadonnées avant toute démonstration.",
        en: "Anonymize client names, locations, and metadata before any demonstration.",
      },
      {
        fr: "Traiter les médias comme des entrées non fiables et limiter les processus externes.",
        en: "Treat media as untrusted input and constrain external processes.",
      },
      {
        fr: "Conserver les jeux de données dans des emplacements contrôlés.",
        en: "Keep datasets in controlled locations.",
      },
    ],
    testing: [
      {
        fr: "Jeux d’échantillons synthétiques pour valider l’inventaire et l’extraction.",
        en: "Synthetic sample sets to validate inventory and extraction.",
      },
      {
        fr: "Contrôles de provenance, de formats et de reprise après fichier illisible.",
        en: "Provenance, format, and unreadable-file recovery checks.",
      },
    ],
    results: [
      {
        fr: "Une structure reproductible pour passer de médias bruts à des lots révisables.",
        en: "A repeatable structure for moving from raw media to reviewable batches.",
      },
      {
        fr: "Une base pour explorer la similarité visuelle sans confondre expérimentation et classification validée.",
        en: "A basis for exploring visual similarity without confusing experiments with validated classification.",
      },
    ],
    lessons: [
      {
        fr: "La qualité des métadonnées et de la revue humaine détermine la valeur du modèle.",
        en: "Metadata quality and human review determine model value.",
      },
      {
        fr: "La provenance doit survivre à chaque transformation.",
        en: "Provenance must survive every transformation.",
      },
    ],
    currentStatus: {
      fr: "Recherche et prototype. Aucun taux de précision ni déploiement autonome n’est revendiqué.",
      en: "Research and prototype. No accuracy rate or autonomous deployment is claimed.",
    },
  },
  {
    slug: "remote-assist",
    index: "04",
    title: { fr: "Remote Assist", en: "Remote Assist" },
    status: "prototype",
    statusLabel: { fr: "Prototype de sécurité", en: "Security prototype" },
    tagline: {
      fr: "Assister à distance sans transformer l’aide en accès implicite.",
      en: "Provide remote assistance without turning help into implicit access.",
    },
    summary: {
      fr: "Un concept d’assistance visuelle en lecture seule, fondé sur le consentement, l’authentification, TLS et la traçabilité.",
      en: "A read-only visual-assistance concept built around consent, authentication, TLS, and auditability.",
    },
    context: {
      fr: "Le soutien à distance accélère le diagnostic, mais augmente fortement le risque si l’accès est permanent ou peu visible.",
      en: "Remote support speeds up diagnostics but sharply increases risk when access is persistent or poorly visible.",
    },
    problem: {
      fr: "Permettre de voir l’écran nécessaire au diagnostic sans autoriser silencieusement le contrôle ou une collecte continue.",
      en: "Allow the screen visibility needed for diagnostics without silently enabling control or continuous collection.",
    },
    role: {
      fr: "Analyse de menace, conception du protocole de consentement, limites de session et critères d’audit.",
      en: "Threat analysis, consent-protocol design, session limits, and audit criteria.",
    },
    approach: {
      fr: "Désactiver la fonction par défaut, exiger une action locale visible, établir une session courte et authentifiée, chiffrer le transport et imposer des limites de fréquence et de qualité.",
      en: "Disable the feature by default, require visible local action, establish a short authenticated session, encrypt transport, and enforce rate and quality limits.",
    },
    architecture: {
      fr: [
        "Consentement local",
        "Capture lecture seule",
        "Relais TLS limité",
        "Technicien authentifié",
      ],
      en: [
        "Local consent",
        "Read-only capture",
        "Constrained TLS relay",
        "Authenticated technician",
      ],
    },
    technologies: [
      "TLS",
      "Authentication",
      "Audit logs",
      "Rate limits",
      "Windows concepts",
    ],
    security: [
      {
        fr: "Désactivé par défaut; consentement explicite et révocable.",
        en: "Disabled by default with explicit, revocable consent.",
      },
      {
        fr: "Aucun contrôle clavier ou souris dans le périmètre du prototype.",
        en: "No keyboard or mouse control within the prototype scope.",
      },
      {
        fr: "Session courte, qualité plafonnée et journal d’accès minimal.",
        en: "Short sessions, capped quality, and minimal access logging.",
      },
    ],
    testing: [
      {
        fr: "Scénarios de refus, d’expiration, de révocation et de limitation.",
        en: "Denial, expiry, revocation, and throttling scenarios.",
      },
      {
        fr: "Validation que l’état par défaut reste inactif après redémarrage.",
        en: "Validation that the default state remains inactive after restart.",
      },
    ],
    results: [
      {
        fr: "Un modèle de menace et un parcours de consentement avant toute fonction de contrôle.",
        en: "A threat model and consent journey defined before any control capability.",
      },
      {
        fr: "Des limites fonctionnelles utilisées comme mécanismes de sécurité.",
        en: "Functional limits used as security mechanisms.",
      },
    ],
    lessons: [
      {
        fr: "Un écran partagé est une donnée sensible, même sans interaction.",
        en: "A shared screen is sensitive data even without interaction.",
      },
      {
        fr: "L’absence de contrôle est plus facile à vérifier quand elle est architecturale.",
        en: "The absence of control is easier to verify when it is architectural.",
      },
    ],
    currentStatus: {
      fr: "Prototype limité et désactivé par défaut. Il ne s’agit pas d’un outil de contrôle à distance prêt pour la production.",
      en: "Limited prototype, disabled by default. It is not a production-ready remote-control tool.",
    },
  },
  {
    slug: "boreal",
    index: "05",
    title: { fr: "Boréal", en: "Boréal" },
    status: "concept",
    statusLabel: { fr: "Concept planifié", en: "Planned concept" },
    tagline: {
      fr: "Imaginer une plateforme RMM/PSA sobre, canadienne et vérifiable.",
      en: "Explore a focused, Canadian, and verifiable RMM/PSA platform.",
    },
    summary: {
      fr: "Un concept de gestion d’appareils, d’automatisation et de soutien à distance axé sur la résidence canadienne des données.",
      en: "A device-management, automation, and remote-support concept focused on Canadian data residency.",
    },
    context: {
      fr: "Les plateformes de gestion TI combinent de puissants privilèges, de nombreuses intégrations et des volumes importants de données techniques.",
      en: "IT management platforms combine powerful privileges, many integrations, and substantial volumes of technical data.",
    },
    problem: {
      fr: "Concilier gestion d’appareils, automatisation et soutien sans banaliser l’accès administratif ni la conformité.",
      en: "Balance device management, automation, and support without normalizing administrative access or compliance risk.",
    },
    role: {
      fr: "Architecture conceptuelle, définition du périmètre, analyse de résidence des données et planification de conformité.",
      en: "Conceptual architecture, scope definition, data-residency analysis, and compliance planning.",
    },
    approach: {
      fr: "Découper la plateforme en plans de contrôle et d’exécution, utiliser des files de travaux signés, limiter les privilèges des agents et définir la résidence des données avant les choix d’hébergement.",
      en: "Split the platform into control and execution planes, use signed job queues, limit agent privileges, and define data residency before choosing hosting.",
    },
    architecture: {
      fr: [
        "Console opérateur",
        "Plan de contrôle canadien",
        "File de travaux signés",
        "Agents à privilège limité",
      ],
      en: [
        "Operator console",
        "Canadian control plane",
        "Signed job queue",
        "Least-privilege agents",
      ],
    },
    technologies: [
      "RMM/PSA concepts",
      "Automation",
      "Device management",
      "Canadian cloud planning",
    ],
    security: [
      {
        fr: "Séparer les rôles d’administration, d’automatisation et de soutien.",
        en: "Separate administration, automation, and support roles.",
      },
      {
        fr: "Signer les travaux et limiter leur durée, leur portée et leur contexte.",
        en: "Sign jobs and limit their lifetime, scope, and context.",
      },
      {
        fr: "Prévoir résidence, rétention, accès et suppression des données dès l’architecture.",
        en: "Plan data residency, retention, access, and deletion at the architecture stage.",
      },
    ],
    testing: [
      {
        fr: "Plan de tests de privilège, de rotation de clés, d’isolement et de reprise.",
        en: "Planned privilege, key-rotation, isolation, and recovery tests.",
      },
      {
        fr: "Exercices de modélisation des menaces avant prototype connecté.",
        en: "Threat-modelling exercises before any connected prototype.",
      },
    ],
    results: [
      {
        fr: "Un périmètre conceptuel qui place la sécurité et la résidence des données avant la liste de fonctions.",
        en: "A conceptual scope that puts security and data residency before the feature list.",
      },
      {
        fr: "Des limites explicites pour éviter de présenter une idée comme un produit.",
        en: "Explicit boundaries that avoid presenting an idea as a product.",
      },
    ],
    lessons: [
      {
        fr: "Dans un RMM, l’agent est une frontière de sécurité majeure.",
        en: "In an RMM, the agent is a major security boundary.",
      },
      {
        fr: "La conformité doit influencer les flux de données, pas seulement la documentation.",
        en: "Compliance must influence data flows, not just documentation.",
      },
    ],
    currentStatus: {
      fr: "Concept et planification seulement. Aucun produit commercial, agent déployé ou conformité certifiée n’est revendiqué.",
      en: "Concept and planning only. No commercial product, deployed agent, or certified compliance is claimed.",
    },
  },
  {
    slug: "pipe360-profiler",
    index: "06",
    title: { fr: "Pipe360 Profiler", en: "Pipe360 Profiler" },
    status: "prototype",
    statusLabel: { fr: "Prototype technique", en: "Technical prototype" },
    tagline: {
      fr: "Transformer l’imagerie 360° en mesures, textures et livrables révisables.",
      en: "Turn 360° imagery into reviewable measurements, textures, and deliverables.",
    },
    summary: {
      fr: "Un pipeline Python et OpenCV pour traiter l’imagerie d’infrastructure, organiser les stations et exporter des rapports PDF, PNG et CSV.",
      en: "A Python and OpenCV pipeline for processing infrastructure imagery, organizing stations, and exporting PDF, PNG, and CSV reports.",
    },
    context: {
      fr: "Les images 360° d’inspection doivent être reliées aux stations, transformées et présentées dans des livrables compréhensibles.",
      en: "360° inspection images must be tied to stations, transformed, and presented in understandable deliverables.",
    },
    problem: {
      fr: "Les étapes manuelles de préparation, de mesure et d’export sont lentes et sujettes aux incohérences.",
      en: "Manual preparation, measurement, and export steps are slow and prone to inconsistency.",
    },
    role: {
      fr: "Développement du pipeline, traitement d’image, modélisation des stations, génération de livrables et exploration d’un visualiseur.",
      en: "Pipeline development, image processing, station modelling, deliverable generation, and viewer exploration.",
    },
    approach: {
      fr: "Traiter chaque station comme une unité traçable, séparer les transformations d’image des mesures et générer les sorties depuis une représentation commune. Explorer Three.js pour la consultation, sans l’assimiler au moteur de calcul.",
      en: "Treat each station as a traceable unit, separate image transforms from measurements, and generate outputs from a shared representation. Explore Three.js for viewing without treating it as the calculation engine.",
    },
    architecture: {
      fr: [
        "Images 360° + stations",
        "Pipeline OpenCV",
        "Mesures et textures",
        "PDF · PNG · CSV · visionneuse",
      ],
      en: [
        "360° imagery + stations",
        "OpenCV pipeline",
        "Measurements and textures",
        "PDF · PNG · CSV · viewer",
      ],
    },
    technologies: [
      "Python",
      "OpenCV",
      "360° imagery",
      "PDF",
      "PNG",
      "CSV",
      "Three.js concepts",
    ],
    security: [
      {
        fr: "Retirer les identifiants de client et d’emplacement des démonstrations.",
        en: "Remove client and location identifiers from demonstrations.",
      },
      {
        fr: "Valider les chemins, formats et dimensions avant traitement.",
        en: "Validate paths, formats, and dimensions before processing.",
      },
      {
        fr: "Conserver les sources intactes et écrire les dérivés dans des emplacements séparés.",
        en: "Keep source media intact and write derivatives to separate locations.",
      },
    ],
    testing: [
      {
        fr: "Images synthétiques et stations connues pour vérifier les transformations.",
        en: "Synthetic images and known stations to verify transformations.",
      },
      {
        fr: "Contrôle de cohérence entre sorties PDF, PNG et CSV.",
        en: "Cross-output consistency checks for PDF, PNG, and CSV.",
      },
    ],
    results: [
      {
        fr: "Une chaîne de traitement réutilisable avec sorties multiples à partir des mêmes données.",
        en: "A reusable processing chain with multiple outputs from the same data.",
      },
      {
        fr: "Une séparation plus nette entre calcul, présentation et révision.",
        en: "A clearer separation between calculation, presentation, and review.",
      },
    ],
    lessons: [
      {
        fr: "Les conventions de coordonnées doivent être explicites et testées.",
        en: "Coordinate conventions must be explicit and tested.",
      },
      {
        fr: "Un export visuel doit toujours rester traçable vers les données sources.",
        en: "A visual export must always remain traceable to source data.",
      },
    ],
    currentStatus: {
      fr: "Prototype technique et expérimentation. Les concepts de mesure et de visualisation nécessitent une validation terrain avant usage décisionnel.",
      en: "Technical prototype and experimentation. Measurement and visualization concepts require field validation before decision-making use.",
    },
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function localize(text: LocalizedText, locale: Locale) {
  return text[locale];
}
