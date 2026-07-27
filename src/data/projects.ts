import type { Locale, LocalizedText } from "./profile";

export type ProjectStatus = "applied" | "prototype" | "research" | "concept";

export type ProjectTrack = "work" | "lab";

export type ImpactMetric = {
  value: string;
  label: LocalizedText;
};

export type Project = {
  slug: string;
  index: string;
  track: ProjectTrack;
  title: LocalizedText;
  status: ProjectStatus;
  statusLabel: LocalizedText;
  sector: LocalizedText;
  tagline: LocalizedText;
  summary: LocalizedText;
  impact: ImpactMetric[];
  before: LocalizedText;
  after: LocalizedText;
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
    slug: "operations-crm",
    index: "01",
    track: "work",
    title: { fr: "CRM opérations", en: "Operations CRM" },
    status: "applied",
    statusLabel: { fr: "En usage interne", en: "In internal use" },
    sector: {
      fr: "Inspection d’infrastructures municipales",
      en: "Municipal infrastructure inspection",
    },
    tagline: {
      fr: "Une seule source de vérité pour les projets, le terrain et la facturation.",
      en: "One source of truth for projects, field work, and billing.",
    },
    summary: {
      fr: "La plateforme interne qui relie les projets d’inspection, le calendrier d’opérations, les livrables clients et la facturation dans un même environnement : API .NET, PostgreSQL, modules JavaScript et moteur de synchronisation.",
      en: "The internal platform connecting inspection projects, the operations calendar, client deliverables, and billing in a single environment: a .NET API, PostgreSQL, JavaScript modules, and a synchronization engine.",
    },
    impact: [
      {
        value: "6",
        label: {
          fr: "modules livrés et utilisés au quotidien",
          en: "modules delivered and used daily",
        },
      },
      {
        value: "1",
        label: {
          fr: "source de vérité au lieu de quatre outils séparés",
          en: "source of truth instead of four separate tools",
        },
      },
      {
        value: "0",
        label: {
          fr: "double saisie entre planification et facturation",
          en: "duplicate entry between planning and billing",
        },
      },
    ],
    before: {
      fr: "Les projets vivaient dans des fichiers Excel, des courriels, des dossiers réseau et SharePoint. Chaque équipe recopiait la même information, et personne n’avait la vue complète d’un mandat.",
      en: "Projects lived in Excel files, emails, network folders, and SharePoint. Every team retyped the same information, and nobody had the full view of a mandate.",
    },
    after: {
      fr: "Un environnement unique où projets, calendrier d’opérations, livrables et facturation partagent la même base de données, avec une synchronisation observable et reprenable après incident.",
      en: "A single environment where projects, the operations calendar, deliverables, and billing share one database, with synchronization that stays observable and recoverable after an incident.",
    },
    context: {
      fr: "Dans une firme d’inspection d’infrastructures municipales, un même mandat traverse la planification terrain, la captation vidéo, l’analyse, la production de rapports, la publication au client et la facturation. Chaque étape appartenait à un outil différent.",
      en: "In a municipal infrastructure inspection firm, a single mandate crosses field planning, video capture, analysis, report production, client delivery, and billing. Each step belonged to a different tool.",
    },
    problem: {
      fr: "L’information éclatée créait des doubles saisies, des écarts entre ce qui était planifié et ce qui était facturé, et une visibilité inégale selon l’équipe consultée.",
      en: "Scattered information created duplicate entry, gaps between what was planned and what was billed, and uneven visibility depending on which team you asked.",
    },
    role: {
      fr: "Analyse des flux existants avec les équipes, conception du modèle de données, développement de l’API et des modules d’interface, moteur de synchronisation, détection automatique des assignations, mode de synchronisation nocturne, campagnes d’audit et de correction, documentation technique.",
      en: "Workflow analysis with the teams, data-model design, API and interface-module development, the synchronization engine, automatic assignment detection, a nightly synchronization mode, audit and correction campaigns, and technical documentation.",
    },
    approach: {
      fr: "Séparer les responsabilités entre une API métier, une couche de données relationnelle et des modules d’interface indépendants. Traiter la synchronisation comme un processus explicite — observable, journalisé et reprenable — plutôt qu’une opération invisible qui échoue en silence. Chaque module a été livré et validé avec les équipes avant de passer au suivant.",
      en: "Separate responsibilities across a business API, a relational data layer, and independent interface modules. Treat synchronization as an explicit process—observable, logged, and recoverable—rather than an invisible operation that fails silently. Each module was delivered and validated with the teams before moving to the next.",
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
    technologies: [
      ".NET",
      "C#",
      "JavaScript",
      "PostgreSQL",
      "REST",
      "Git",
      "AWS",
    ],
    security: [
      {
        fr: "Chaque opération est limitée au contexte d’entreprise autorisé.",
        en: "Every operation is scoped to the authorized company context.",
      },
      {
        fr: "Les journaux et messages de synchronisation ne contiennent aucune donnée client identifiante.",
        en: "Logs and synchronization messages carry no identifying client data.",
      },
      {
        fr: "Les entrées sont validées côté API et les limites de confiance sont documentées.",
        en: "Input is validated at the API and trust boundaries are documented.",
      },
    ],
    testing: [
      {
        fr: "Tests ciblés de logique métier et scénarios de synchronisation, incluant les cas de reprise après interruption.",
        en: "Targeted business-logic tests and synchronization scenarios, including recovery after interruption.",
      },
      {
        fr: "Campagnes d’audit systématiques du module projets, du portail et du moteur de facturation, avec correction suivie dans Git.",
        en: "Systematic audit passes over the projects module, the portal, and the billing engine, with fixes tracked in Git.",
      },
    ],
    results: [
      {
        fr: "Les projets, le calendrier d’opérations et les livrables sont consultables au même endroit, sans recopie d’une équipe à l’autre.",
        en: "Projects, the operations calendar, and deliverables are consultable in one place, with no retyping between teams.",
      },
      {
        fr: "La détection automatique des assignations et la synchronisation nocturne suppriment une étape manuelle récurrente de la préparation des mandats.",
        en: "Automatic assignment detection and nightly synchronization remove a recurring manual step from mandate preparation.",
      },
      {
        fr: "L’écart entre ce qui est planifié et ce qui est facturé devient visible au lieu d’être découvert en fin de mois.",
        en: "The gap between what is planned and what is billed becomes visible instead of being discovered at month end.",
      },
    ],
    lessons: [
      {
        fr: "La synchronisation exige des règles de conflit et d’idempotence définies dès le départ : les ajouter après coup coûte beaucoup plus cher.",
        en: "Synchronization needs conflict and idempotency rules defined from the start; retrofitting them costs far more.",
      },
      {
        fr: "Le vocabulaire opérationnel partagé avec les équipes est aussi structurant que le schéma de données.",
        en: "The operational vocabulary shared with the teams shapes the system as much as the data schema does.",
      },
    ],
    currentStatus: {
      fr: "En usage interne et en développement continu. Les données affichées dans la démonstration ci-dessus sont anonymisées.",
      en: "In internal use and under continuous development. The data shown in the demonstration above is anonymized.",
    },
  },
  {
    slug: "report-automation",
    index: "02",
    track: "work",
    title: {
      fr: "Automatisation des rapports",
      en: "Report automation",
    },
    status: "applied",
    statusLabel: { fr: "En usage interne", en: "In internal use" },
    sector: {
      fr: "Livrables d’inspection CCTV et télé-observation",
      en: "CCTV and remote-observation inspection deliverables",
    },
    tagline: {
      fr: "Reconstruire un rapport complet en une commande, pas en une avant-midi.",
      en: "Rebuild a complete report with one command, not one morning.",
    },
    summary: {
      fr: "Une chaîne d’outils qui assemble les rapports d’inspection à partir de leurs fichiers source : fusion ordonnée de dizaines de PDF, génération de gabarits Excel et PDF, normalisation des noms de fichiers médias.",
      en: "A toolchain that assembles inspection reports from their source files: ordered merging of dozens of PDFs, Excel and PDF template generation, and media filename normalization.",
    },
    impact: [
      {
        value: "29",
        label: {
          fr: "PDF de graphiques fusionnés en un seul livrable ordonné",
          en: "graph PDFs merged into a single ordered deliverable",
        },
      },
      {
        value: "1",
        label: {
          fr: "commande pour régénérer un rapport après correction",
          en: "command to regenerate a report after a correction",
        },
      },
      {
        value: "0",
        label: {
          fr: "page réordonnée ou renumérotée à la main",
          en: "page reordered or renumbered by hand",
        },
      },
    ],
    before: {
      fr: "Assembler un rapport voulait dire ouvrir des dizaines de PDF un par un, les ordonner, les fusionner, vérifier la numérotation — puis tout recommencer si une seule page changeait.",
      en: "Assembling a report meant opening dozens of PDFs one by one, ordering them, merging them, checking the pagination—then starting over if a single page changed.",
    },
    after: {
      fr: "Le livrable se reconstruit à partir des fichiers source, avec un ordre déterministe et un index généré. Une correction coûte une nouvelle exécution, pas un nouvel assemblage.",
      en: "The deliverable is rebuilt from its source files, with deterministic ordering and a generated index. A correction costs one more run, not another assembly.",
    },
    context: {
      fr: "Une inspection produit des rapports CCTV, des rapports de télé-observation, des graphiques de profilométrie et des médias vidéo, chacun généré par un outil différent, dans un format et un ordre différents.",
      en: "An inspection produces CCTV reports, remote-observation reports, profilometry graphs, and video media, each generated by a different tool, in a different format and order.",
    },
    problem: {
      fr: "L’assemblage final était entièrement manuel, donc lent, non reproductible et sensible à l’erreur humaine — d’autant plus qu’une correction tardive obligeait à refaire tout le montage.",
      en: "Final assembly was entirely manual: slow, non-reproducible, and error-prone—especially since a late correction forced the whole montage to be redone.",
    },
    role: {
      fr: "Conception et développement des scripts de fusion, définition des règles d’ordre et de nommage, génération des gabarits Excel et PDF aux normes visuelles de l’entreprise, normalisation des noms de médias par numéro de regard.",
      en: "Design and development of the merge scripts, ordering and naming rules, Excel and PDF template generation matching the company's visual standards, and media filename normalization by manhole number.",
    },
    approach: {
      fr: "Traiter l’assemblage comme une fonction pure : mêmes fichiers source, même livrable. L’ordre vient d’une règle explicite plutôt que du hasard du système de fichiers, et chaque étape valide ses entrées avant d’écrire quoi que ce soit. Les sources ne sont jamais modifiées : les dérivés partent dans un emplacement distinct.",
      en: "Treat assembly as a pure function: same source files, same deliverable. Ordering comes from an explicit rule rather than filesystem chance, and each step validates its inputs before writing anything. Sources are never modified; derivatives go to a separate location.",
    },
    architecture: {
      fr: [
        "Fichiers source (CCTV · TO · graphiques)",
        "Inventaire et validation",
        "Fusion ordonnée",
        "Livrable PDF + index",
      ],
      en: [
        "Source files (CCTV · RO · graphs)",
        "Inventory and validation",
        "Ordered merge",
        "PDF deliverable + index",
      ],
    },
    technologies: [
      "Python",
      "PDF",
      "Excel",
      "Traitement par lots",
      "Gabarits",
      "PowerShell",
    ],
    security: [
      {
        fr: "Les identifiants de client et d’emplacement sont retirés des démonstrations et des exemples.",
        en: "Client and location identifiers are removed from demonstrations and examples.",
      },
      {
        fr: "Les fichiers source restent intacts; les dérivés sont écrits dans un emplacement séparé.",
        en: "Source files remain intact; derivatives are written to a separate location.",
      },
      {
        fr: "Les chemins et formats sont validés avant tout traitement par lots.",
        en: "Paths and formats are validated before any batch processing.",
      },
    ],
    testing: [
      {
        fr: "Lots d’essai avec un nombre de pages connu pour vérifier l’ordre et la numérotation du livrable.",
        en: "Test batches with a known page count to verify deliverable ordering and pagination.",
      },
      {
        fr: "Contrôle de reprise sur fichier illisible ou manquant, sans corruption du livrable partiel.",
        en: "Recovery checks for unreadable or missing files, without corrupting the partial deliverable.",
      },
    ],
    results: [
      {
        fr: "Un lot de 29 PDF de graphiques a été fusionné en un livrable unique et ordonné, reproductible à la demande.",
        en: "A batch of 29 graph PDFs was merged into a single ordered deliverable, reproducible on demand.",
      },
      {
        fr: "Les gabarits Excel et PDF sortent directement aux normes visuelles de l’entreprise, sans remise en forme manuelle.",
        en: "Excel and PDF templates come out matching the company's visual standards, with no manual reformatting.",
      },
      {
        fr: "Une correction de dernière minute ne remet plus en cause tout le montage du rapport.",
        en: "A last-minute correction no longer jeopardizes the entire report assembly.",
      },
    ],
    lessons: [
      {
        fr: "Une règle d’ordre explicite vaut mieux qu’une convention de nommage que tout le monde doit respecter de mémoire.",
        en: "An explicit ordering rule beats a naming convention everyone has to remember.",
      },
      {
        fr: "L’automatisation la plus rentable n’est pas la plus complexe : c’est celle qui vise la tâche répétée chaque semaine.",
        en: "The most profitable automation is not the most complex one; it is the one aimed at the task repeated every week.",
      },
    ],
    currentStatus: {
      fr: "En usage interne pour la production de livrables. Les exemples présentés utilisent des données anonymisées.",
      en: "In internal use for deliverable production. The examples shown use anonymized data.",
    },
  },
  {
    slug: "pipe360-profiler",
    index: "03",
    track: "work",
    title: { fr: "Pipe360 Profiler", en: "Pipe360 Profiler" },
    status: "prototype",
    statusLabel: { fr: "Prototype avancé", en: "Advanced prototype" },
    sector: {
      fr: "Imagerie 360° et profilométrie laser de conduites",
      en: "360° imagery and laser profilometry of pipes",
    },
    tagline: {
      fr: "Transformer l’imagerie 360° en mesures, textures et livrables révisables.",
      en: "Turn 360° imagery into reviewable measurements, textures, and deliverables.",
    },
    summary: {
      fr: "Un pipeline Python et OpenCV qui traite l’imagerie d’inspection, relie chaque image à sa station et exporte PDF, PNG et CSV depuis une représentation commune — incluant la compilation d’un FFmpeg spécialisé pour l’assemblage 360°.",
      en: "A Python and OpenCV pipeline that processes inspection imagery, ties each image to its station, and exports PDF, PNG, and CSV from a shared representation—including a specialized FFmpeg build for 360° stitching.",
    },
    impact: [
      {
        value: "3",
        label: {
          fr: "formats de livrables générés d’une seule passe (PDF, PNG, CSV)",
          en: "deliverable formats generated in a single pass (PDF, PNG, CSV)",
        },
      },
      {
        value: "360°",
        label: {
          fr: "d’imagerie assemblée grâce à un FFmpeg compilé sur mesure",
          en: "of imagery stitched using a custom-compiled FFmpeg",
        },
      },
      {
        value: "1",
        label: {
          fr: "chaîne partagée entre imagerie 360° et profilométrie laser",
          en: "shared chain across 360° imagery and laser profilometry",
        },
      },
    ],
    before: {
      fr: "La préparation, la mesure et l’export se faisaient à la main, outil par outil, sans garantie que deux livrables issus des mêmes données racontent la même chose.",
      en: "Preparation, measurement, and export were done by hand, tool by tool, with no guarantee that two deliverables from the same data would tell the same story.",
    },
    after: {
      fr: "Chaque station devient une unité traçable. Les mesures et les rendus sortent d’une représentation commune, donc les trois formats de livrables restent cohérents entre eux.",
      en: "Each station becomes a traceable unit. Measurements and renders come from a shared representation, so all three deliverable formats stay consistent with one another.",
    },
    context: {
      fr: "Les caméras 360° et les profilomètres laser produisent des données brutes volumineuses qui doivent être reliées à une position dans la conduite avant de devenir exploitables.",
      en: "360° cameras and laser profilometers produce bulky raw data that must be tied to a position in the pipe before it becomes usable.",
    },
    problem: {
      fr: "L’assemblage 360° natif des caméras n’est pas accessible aux outils standards, et les étapes manuelles de mesure et d’export sont lentes et sujettes aux incohérences entre formats.",
      en: "The cameras' native 360° stitching is not accessible to standard tools, and manual measurement and export steps are slow and prone to inconsistency across formats.",
    },
    role: {
      fr: "Développement du pipeline, traitement d’image, modélisation des stations, compilation d’un FFmpeg spécialisé pour le format d’assemblage propriétaire, génération des livrables, amélioration de la qualité des graphiques de profilométrie et exploration d’un visualiseur.",
      en: "Pipeline development, image processing, station modelling, compiling a specialized FFmpeg for the proprietary stitching format, deliverable generation, profilometry graph quality improvements, and viewer exploration.",
    },
    approach: {
      fr: "Traiter chaque station comme une unité traçable, séparer strictement les transformations d’image des mesures, et générer toutes les sorties depuis une représentation commune. Explorer Three.js pour la consultation, sans jamais le confondre avec le moteur de calcul.",
      en: "Treat each station as a traceable unit, strictly separate image transforms from measurements, and generate every output from a shared representation. Explore Three.js for viewing without ever confusing it with the calculation engine.",
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
      "FFmpeg",
      "Imagerie 360°",
      "PDF",
      "CSV",
      "Three.js",
    ],
    security: [
      {
        fr: "Les identifiants de client et d’emplacement sont retirés des démonstrations.",
        en: "Client and location identifiers are removed from demonstrations.",
      },
      {
        fr: "Les chemins, formats et dimensions sont validés avant traitement.",
        en: "Paths, formats, and dimensions are validated before processing.",
      },
      {
        fr: "Les médias sources restent intacts et les dérivés sont écrits séparément.",
        en: "Source media stays intact and derivatives are written separately.",
      },
    ],
    testing: [
      {
        fr: "Images synthétiques et stations connues pour vérifier les transformations géométriques.",
        en: "Synthetic images and known stations to verify geometric transforms.",
      },
      {
        fr: "Contrôle de cohérence croisée entre les sorties PDF, PNG et CSV.",
        en: "Cross-output consistency checks across PDF, PNG, and CSV.",
      },
    ],
    results: [
      {
        fr: "Une chaîne de traitement réutilisable qui produit plusieurs livrables à partir des mêmes données, sans divergence entre eux.",
        en: "A reusable processing chain producing several deliverables from the same data, with no divergence between them.",
      },
      {
        fr: "L’assemblage 360° propriétaire est devenu exploitable en compilant une version spécialisée de FFmpeg.",
        en: "The proprietary 360° stitching became usable by compiling a specialized FFmpeg build.",
      },
      {
        fr: "Les graphiques de profilométrie ont gagné en lisibilité sans changer les données mesurées.",
        en: "Profilometry graphs gained legibility without altering the measured data.",
      },
    ],
    lessons: [
      {
        fr: "Les conventions de coordonnées doivent être explicites et testées, sinon l’erreur ne se voit qu’au livrable final.",
        en: "Coordinate conventions must be explicit and tested, otherwise the error only shows up in the final deliverable.",
      },
      {
        fr: "Un export visuel doit toujours rester traçable jusqu’à la donnée source.",
        en: "A visual export must always stay traceable back to its source data.",
      },
    ],
    currentStatus: {
      fr: "Prototype avancé et expérimentation technique. Les mesures nécessitent une validation terrain avant usage décisionnel.",
      en: "Advanced prototype and technical experimentation. Measurements require field validation before decision-making use.",
    },
  },
  {
    slug: "secure-client-portal",
    index: "04",
    track: "work",
    title: { fr: "Portail client sécurisé", en: "Secure client portal" },
    status: "prototype",
    statusLabel: { fr: "Prototype avancé", en: "Advanced prototype" },
    sector: {
      fr: "Publication de livrables aux clients municipaux",
      en: "Deliverable publishing for municipal clients",
    },
    tagline: {
      fr: "Publier les bons documents à la bonne personne, avec une trace vérifiable.",
      en: "Publish the right documents to the right person, with a verifiable trail.",
    },
    summary: {
      fr: "Le module de publication du CRM : accès aux projets et rapports par client, publication progressive, notifications et téléchargements temporaires journalisés.",
      en: "The CRM's publishing module: per-client project and report access, staged publishing, notifications, and temporary logged downloads.",
    },
    impact: [
      {
        value: "0",
        label: {
          fr: "lien permanent : chaque téléchargement expire et est journalisé",
          en: "permanent link: every download expires and is logged",
        },
      },
      {
        value: "2",
        label: {
          fr: "niveaux séparés : disponibilité interne et visibilité client",
          en: "separate levels: internal availability and client visibility",
        },
      },
      {
        value: "1:1",
        label: {
          fr: "test de refus pour chaque test d’accès autorisé",
          en: "denial test for every authorized-access test",
        },
      },
    ],
    before: {
      fr: "Les livrables partaient par courriel ou par lien de partage : impossible de savoir qui avait accès à quoi, ni de retirer un document publié par erreur.",
      en: "Deliverables went out by email or share link: no way to know who had access to what, and no way to withdraw a document published by mistake.",
    },
    after: {
      fr: "Chaque demande est évaluée à partir d’une identité, d’une relation au projet et d’une politique de document. Un document publié peut être révoqué, et chaque téléchargement laisse une trace.",
      en: "Each request is evaluated from an identity, a project relationship, and a document policy. A published document can be revoked, and every download leaves a trace.",
    },
    context: {
      fr: "Les clients municipaux doivent consulter leurs rapports d’inspection sans recevoir de liens permanents ni accéder à des données hors de leur mandat.",
      en: "Municipal clients need to consult their inspection reports without receiving permanent links or accessing data outside their mandate.",
    },
    problem: {
      fr: "Un simple partage de fichiers ne gère ni l’identité, ni l’autorisation par ressource, ni la publication progressive, ni la révocation.",
      en: "Plain file sharing handles neither identity, nor per-resource authorization, nor staged publishing, nor revocation.",
    },
    role: {
      fr: "Modélisation des autorisations, conception des parcours client, développement des fonctions de publication, indicateurs de fonctionnalité et revue de sécurité.",
      en: "Authorization modelling, client journey design, publishing-feature development, feature flags, and security review.",
    },
    approach: {
      fr: "Évaluer chaque demande avec une identité, une relation au projet et une politique de document. Isoler la publication du stockage, protéger les nouvelles capacités derrière des indicateurs de fonctionnalité, et tester les refus avec autant de soin que les succès.",
      en: "Evaluate each request using identity, project relationship, and document policy. Separate publishing from storage, put new capabilities behind feature flags, and test denials as carefully as successes.",
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
      "Authentification",
      "Feature flags",
      "Tests automatisés",
    ],
    security: [
      {
        fr: "Autorisation par ressource, appliquée côté serveur et jamais déduite du client.",
        en: "Per-resource authorization enforced server-side and never inferred from the client.",
      },
      {
        fr: "Téléchargements temporaires, journalisés et limités aux documents effectivement publiés.",
        en: "Temporary, logged downloads limited to documents that are actually published.",
      },
      {
        fr: "Notifications sans contenu confidentiel et gestion explicite de la révocation.",
        en: "Notifications carry no confidential content, and revocation is handled explicitly.",
      },
    ],
    testing: [
      {
        fr: "Tests d’autorisation négatifs croisant clients, projets et états de publication.",
        en: "Negative authorization tests crossing clients, projects, and publication states.",
      },
      {
        fr: "Validation automatisée des indicateurs de fonctionnalité et des politiques de téléchargement.",
        en: "Automated validation of feature flags and download policies.",
      },
    ],
    results: [
      {
        fr: "Un modèle de publication qui sépare nettement ce qui est disponible en interne de ce qui est visible par le client.",
        en: "A publishing model that cleanly separates what is available internally from what is visible to the client.",
      },
      {
        fr: "Une liste de contrôles de sécurité directement intégrée aux scénarios de test plutôt que documentée à part.",
        en: "A security-control checklist wired into the test scenarios rather than documented on the side.",
      },
    ],
    lessons: [
      {
        fr: "L’autorisation doit être testée comme une règle métier, pas seulement comme un middleware qu’on suppose actif.",
        en: "Authorization must be tested as business logic, not merely as middleware assumed to be active.",
      },
      {
        fr: "Des états de publication explicites réduisent les erreurs bien mieux que des conventions informelles.",
        en: "Explicit publication states reduce mistakes far better than informal conventions.",
      },
    ],
    currentStatus: {
      fr: "Prototype avancé intégré au CRM. Une mise en production complète demande une revue d’identité et de stockage.",
      en: "Advanced prototype integrated into the CRM. Full production use requires an identity and storage review.",
    },
  },
  {
    slug: "remote-assist",
    index: "05",
    track: "work",
    title: { fr: "ADE Assist", en: "ADE Assist" },
    status: "prototype",
    statusLabel: { fr: "Prototype de sécurité", en: "Security prototype" },
    sector: {
      fr: "Soutien TI interne et parc d’appareils",
      en: "Internal IT support and device fleet",
    },
    tagline: {
      fr: "Assister à distance sans transformer l’aide en accès permanent.",
      en: "Provide remote assistance without turning help into permanent access.",
    },
    summary: {
      fr: "Une plateforme de soutien TI interne conçue autour du consentement : assistance visuelle en lecture seule, authentification, TLS et traçabilité complète des sessions.",
      en: "An internal IT support platform designed around consent: read-only visual assistance, authentication, TLS, and full session auditability.",
    },
    impact: [
      {
        value: "0",
        label: {
          fr: "contrôle clavier ou souris : lecture seule par conception",
          en: "keyboard or mouse control: read-only by design",
        },
      },
      {
        value: "OFF",
        label: {
          fr: "état par défaut, y compris après un redémarrage",
          en: "default state, including after a restart",
        },
      },
      {
        value: "1",
        label: {
          fr: "consentement local explicite requis à chaque session",
          en: "explicit local consent required for every session",
        },
      },
    ],
    before: {
      fr: "Le dépannage à distance reposait sur des outils grand public offrant un contrôle total et permanent, sans trace de qui avait vu quoi, ni quand.",
      en: "Remote troubleshooting relied on consumer tools offering full permanent control, with no record of who saw what, or when.",
    },
    after: {
      fr: "L’assistance est désactivée par défaut, exige une action locale visible, dure le temps d’une session courte et authentifiée, et ne permet jamais de prendre le contrôle.",
      en: "Assistance is disabled by default, requires a visible local action, lasts only a short authenticated session, and never permits taking control.",
    },
    context: {
      fr: "Le soutien à distance accélère beaucoup le diagnostic sur un parc réparti, mais augmente fortement le risque quand l’accès est permanent ou peu visible pour l’utilisateur.",
      en: "Remote support greatly speeds up diagnosis across a distributed fleet, but sharply increases risk when access is permanent or barely visible to the user.",
    },
    problem: {
      fr: "Permettre de voir l’écran nécessaire au diagnostic sans autoriser silencieusement le contrôle de la machine ni une collecte continue.",
      en: "Allow the screen visibility needed for diagnosis without silently enabling machine control or continuous collection.",
    },
    role: {
      fr: "Analyse de menace, architecture de la plateforme, conception du protocole de consentement, définition des limites de session et des critères d’audit.",
      en: "Threat analysis, platform architecture, consent-protocol design, session-limit definition, and audit criteria.",
    },
    approach: {
      fr: "Désactiver la fonction par défaut, exiger une action locale visible de l’utilisateur, établir une session courte et authentifiée, chiffrer le transport, et imposer des limites de fréquence et de qualité. L’absence de contrôle est garantie par l’architecture, pas par une case à cocher.",
      en: "Disable the feature by default, require a visible local user action, establish a short authenticated session, encrypt transport, and enforce rate and quality limits. The absence of control is guaranteed by the architecture, not by a checkbox.",
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
      "Authentification",
      "Journaux d’audit",
      "Rate limits",
      "Windows",
      "PowerShell",
    ],
    security: [
      {
        fr: "Désactivé par défaut, avec un consentement explicite et révocable à tout moment.",
        en: "Disabled by default, with explicit consent that stays revocable at any time.",
      },
      {
        fr: "Aucun contrôle clavier ou souris n’existe dans le périmètre du prototype.",
        en: "No keyboard or mouse control exists within the prototype's scope.",
      },
      {
        fr: "Sessions courtes, qualité plafonnée et journal d’accès réduit au minimum nécessaire.",
        en: "Short sessions, capped quality, and access logging reduced to the necessary minimum.",
      },
    ],
    testing: [
      {
        fr: "Scénarios de refus, d’expiration, de révocation et de limitation de débit.",
        en: "Denial, expiry, revocation, and throttling scenarios.",
      },
      {
        fr: "Validation que l’état par défaut reste inactif après un redémarrage complet.",
        en: "Validation that the default state stays inactive after a full restart.",
      },
    ],
    results: [
      {
        fr: "Un modèle de menace et un parcours de consentement définis avant toute capacité de contrôle.",
        en: "A threat model and a consent journey defined before any control capability.",
      },
      {
        fr: "Des limites fonctionnelles utilisées délibérément comme mécanismes de sécurité.",
        en: "Functional limits deliberately used as security mechanisms.",
      },
    ],
    lessons: [
      {
        fr: "Un écran partagé est une donnée sensible, même sans aucune interaction.",
        en: "A shared screen is sensitive data, even without any interaction.",
      },
      {
        fr: "L’absence de contrôle est bien plus facile à vérifier quand elle est architecturale que quand elle est configurée.",
        en: "The absence of control is far easier to verify when it is architectural than when it is configured.",
      },
    ],
    currentStatus: {
      fr: "Prototype de sécurité, désactivé par défaut. L’architecture est définie; le déploiement au parc complet reste à faire.",
      en: "Security prototype, disabled by default. The architecture is defined; fleet-wide deployment remains to be done.",
    },
  },
  {
    slug: "mario-ai",
    index: "06",
    track: "work",
    title: { fr: "MarioAI", en: "MarioAI" },
    status: "research",
    statusLabel: { fr: "Recherche appliquée", en: "Applied research" },
    sector: {
      fr: "Préparation de médias d’inspection pour l’IA",
      en: "Inspection media preparation for AI",
    },
    tagline: {
      fr: "Préparer des médias d’inspection pour une IA qui reste révisable par l’humain.",
      en: "Prepare inspection media for AI that stays reviewable by people.",
    },
    summary: {
      fr: "Une chaîne exploratoire pour inventorier les médias, extraire les trames vidéo, préparer les jeux de données et organiser les files de revue humaine.",
      en: "An exploratory pipeline to inventory media, extract video frames, prepare datasets, and organize human review queues.",
    },
    impact: [
      {
        value: "4",
        label: {
          fr: "étapes séparées : inventaire, extraction, étiquetage, revue",
          en: "separate stages: inventory, extraction, labelling, review",
        },
      },
      {
        value: "0",
        label: {
          fr: "décision automatique sans passage par une revue humaine",
          en: "automatic decision without passing through human review",
        },
      },
      {
        value: "100 %",
        label: {
          fr: "des trames rattachées à leur média source",
          en: "of frames tied back to their source media",
        },
      },
    ],
    before: {
      fr: "Des téraoctets de vidéos d’inspection dormaient sans inventaire : impossible de retrouver un cas précis, encore moins de constituer un jeu de données cohérent.",
      en: "Terabytes of inspection video sat without an inventory: no way to find a specific case, let alone build a coherent dataset.",
    },
    after: {
      fr: "Les médias sont inventoriés, les trames extraites conservent leur provenance, et la revue humaine est une étape du processus plutôt qu’une vérification faite après coup.",
      en: "Media is inventoried, extracted frames keep their provenance, and human review is a stage in the process rather than an afterthought.",
    },
    context: {
      fr: "Les inspections d’infrastructure génèrent de grands volumes de vidéos et de métadonnées hétérogènes, produites par plusieurs générations d’équipement.",
      en: "Infrastructure inspections generate large volumes of heterogeneous video and metadata, produced by several equipment generations.",
    },
    problem: {
      fr: "Avant d’entraîner ou même d’évaluer un modèle, il faut rendre ces données repérables, cohérentes, étiquetables et auditables.",
      en: "Before training or even evaluating a model, this data must be discoverable, consistent, label-ready, and auditable.",
    },
    role: {
      fr: "Conception du pipeline, scripts de scan, extraction de trames, préparation des métadonnées et expérimentation de similarité visuelle.",
      en: "Pipeline design, scanning scripts, frame extraction, metadata preparation, and visual-similarity experiments.",
    },
    approach: {
      fr: "Séparer strictement l’inventaire, l’extraction, l’étiquetage et la revue. Conserver la provenance de chaque trame, et garder FFmpeg et ffprobe optionnels pour que le pipeline signale clairement les capacités réellement disponibles sur la machine.",
      en: "Strictly separate inventory, extraction, labelling, and review. Preserve provenance for every frame, and keep FFmpeg and ffprobe optional so the pipeline clearly reports which capabilities are actually available on the machine.",
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
      "Vision par ordinateur",
      "Métadonnées",
    ],
    security: [
      {
        fr: "Les noms de clients, emplacements et métadonnées sont anonymisés avant toute démonstration.",
        en: "Client names, locations, and metadata are anonymized before any demonstration.",
      },
      {
        fr: "Les médias sont traités comme des entrées non fiables et les processus externes sont contraints.",
        en: "Media is treated as untrusted input and external processes are constrained.",
      },
      {
        fr: "Les jeux de données restent dans des emplacements contrôlés.",
        en: "Datasets stay in controlled locations.",
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
        fr: "Une structure reproductible pour passer de médias bruts à des lots révisables par un humain.",
        en: "A repeatable structure for moving from raw media to human-reviewable batches.",
      },
      {
        fr: "Une base pour explorer la similarité visuelle sans confondre une expérimentation avec une classification validée.",
        en: "A basis for exploring visual similarity without confusing an experiment with validated classification.",
      },
    ],
    lessons: [
      {
        fr: "La qualité des métadonnées et de la revue humaine détermine la valeur du modèle bien plus que le choix de l’algorithme.",
        en: "Metadata quality and human review determine model value far more than the choice of algorithm.",
      },
      {
        fr: "La provenance doit survivre à chaque transformation, sinon un résultat devient invérifiable.",
        en: "Provenance must survive every transformation, otherwise a result becomes unverifiable.",
      },
    ],
    currentStatus: {
      fr: "Recherche appliquée et prototype. La préparation des données est fonctionnelle; l’entraînement d’un modèle reste une étape ultérieure.",
      en: "Applied research and prototype. Data preparation works; training a model remains a later step.",
    },
  },
  {
    slug: "boreal",
    index: "07",
    track: "work",
    title: { fr: "Boréal", en: "Boréal" },
    status: "concept",
    statusLabel: { fr: "Concept d’architecture", en: "Architecture concept" },
    sector: {
      fr: "Gestion de parc TI et automatisation",
      en: "IT fleet management and automation",
    },
    tagline: {
      fr: "Concevoir une plateforme RMM/PSA sobre, canadienne et vérifiable.",
      en: "Design a focused, Canadian, and verifiable RMM/PSA platform.",
    },
    summary: {
      fr: "Un exercice d’architecture complet sur la gestion d’appareils, l’automatisation et le soutien à distance, avec la résidence canadienne des données définie avant les choix d’hébergement.",
      en: "A full architecture exercise on device management, automation, and remote support, with Canadian data residency defined before any hosting choice.",
    },
    impact: [
      {
        value: "2",
        label: {
          fr: "plans séparés : contrôle et exécution",
          en: "separate planes: control and execution",
        },
      },
      {
        value: "0",
        label: {
          fr: "privilège permanent accordé aux agents",
          en: "permanent privilege granted to agents",
        },
      },
      {
        value: "CA",
        label: {
          fr: "résidence des données décidée avant l’architecture technique",
          en: "data residency decided before the technical architecture",
        },
      },
    ],
    before: {
      fr: "Les plateformes de gestion TI disponibles concentrent des privilèges très élevés, de nombreuses intégrations et des données techniques hébergées hors du pays.",
      en: "Available IT management platforms concentrate very high privileges, many integrations, and technical data hosted outside the country.",
    },
    after: {
      fr: "Un périmètre conceptuel où la sécurité et la résidence des données précèdent la liste de fonctionnalités, avec des limites explicites entre ce qui est conçu et ce qui est construit.",
      en: "A conceptual scope where security and data residency come before the feature list, with explicit boundaries between what is designed and what is built.",
    },
    context: {
      fr: "Les plateformes de gestion TI combinent de puissants privilèges, de nombreuses intégrations et des volumes importants de données techniques sur le parc d’une organisation.",
      en: "IT management platforms combine powerful privileges, many integrations, and substantial volumes of technical data about an organization's fleet.",
    },
    problem: {
      fr: "Concilier gestion d’appareils, automatisation et soutien sans banaliser l’accès administratif ni reporter la question de la conformité à plus tard.",
      en: "Balance device management, automation, and support without normalizing administrative access or deferring compliance to later.",
    },
    role: {
      fr: "Architecture conceptuelle, définition du périmètre, analyse de résidence des données et planification de conformité.",
      en: "Conceptual architecture, scope definition, data-residency analysis, and compliance planning.",
    },
    approach: {
      fr: "Découper la plateforme en plan de contrôle et plan d’exécution, utiliser des files de travaux signés, limiter les privilèges des agents à la tâche en cours, et définir la résidence des données avant tout choix d’hébergement.",
      en: "Split the platform into a control plane and an execution plane, use signed job queues, limit agent privileges to the task at hand, and define data residency before any hosting choice.",
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
      "RMM/PSA",
      "Automatisation",
      "Gestion de parc",
      "Infonuagique canadienne",
    ],
    security: [
      {
        fr: "Séparation des rôles d’administration, d’automatisation et de soutien.",
        en: "Separation of administration, automation, and support roles.",
      },
      {
        fr: "Travaux signés, avec durée, portée et contexte limités.",
        en: "Signed jobs with limited lifetime, scope, and context.",
      },
      {
        fr: "Résidence, rétention, accès et suppression des données prévus dès l’architecture.",
        en: "Data residency, retention, access, and deletion planned at the architecture stage.",
      },
    ],
    testing: [
      {
        fr: "Plan de tests de privilège, de rotation de clés, d’isolement et de reprise.",
        en: "Planned privilege, key-rotation, isolation, and recovery tests.",
      },
      {
        fr: "Exercices de modélisation des menaces avant tout prototype connecté.",
        en: "Threat-modelling exercises before any connected prototype.",
      },
    ],
    results: [
      {
        fr: "Un périmètre conceptuel qui place la sécurité et la résidence des données avant la liste de fonctions.",
        en: "A conceptual scope that puts security and data residency ahead of the feature list.",
      },
      {
        fr: "Une démonstration de conception d’architecture complète, du modèle de menace jusqu’au plan de conformité.",
        en: "A demonstration of complete architecture design, from threat model to compliance plan.",
      },
    ],
    lessons: [
      {
        fr: "Dans un RMM, l’agent est la frontière de sécurité la plus critique de tout le système.",
        en: "In an RMM, the agent is the most critical security boundary in the whole system.",
      },
      {
        fr: "La conformité doit influencer les flux de données eux-mêmes, pas seulement la documentation.",
        en: "Compliance must shape the data flows themselves, not just the documentation.",
      },
    ],
    currentStatus: {
      fr: "Concept et architecture documentés. Aucun code de production, aucun agent déployé : c’est un exercice de conception, présenté comme tel.",
      en: "Documented concept and architecture. No production code, no deployed agent: this is a design exercise, presented as such.",
    },
  },
  {
    slug: "neuro-lens",
    index: "LAB",
    track: "lab",
    title: { fr: "NeuroLens", en: "NeuroLens" },
    status: "research",
    statusLabel: {
      fr: "Laboratoire personnel",
      en: "Personal laboratory",
    },
    sector: {
      fr: "Projet d’apprentissage · visualisation scientifique",
      en: "Learning project · scientific visualization",
    },
    tagline: {
      fr: "Comparer des trajectoires neurodégénératives dans un jumeau cérébral 3D interactif.",
      en: "Compare neurodegenerative trajectories in an interactive 3D brain twin.",
    },
    summary: {
      fr: "Un laboratoire bilingue multi-pathologies construit pour repousser mes limites techniques : cerveau anatomique temps réel en WebGL, connectome, concepteur d’étude, statistiques et analyses par région.",
      en: "A bilingual multi-pathology lab built to push my technical limits: a real-time anatomical brain in WebGL, a connectome, a study designer, statistics, and per-region analyses.",
    },
    impact: [
      {
        value: "3",
        label: {
          fr: "vues liées en temps réel : cerveau 3D, connectome, trajectoires",
          en: "views linked in real time: 3D brain, connectome, trajectories",
        },
      },
      {
        value: "WebGL",
        label: {
          fr: "rendu anatomique temps réel directement dans le navigateur",
          en: "real-time anatomical rendering directly in the browser",
        },
      },
      {
        value: "0",
        label: {
          fr: "donnée de patient : tous les profils sont synthétiques",
          en: "patient data: every profile is synthetic",
        },
      },
    ],
    before: {
      fr: "Je voulais savoir jusqu’où je pouvais pousser une interface scientifique dans un navigateur, sans framework de visualisation tout fait ni serveur de calcul.",
      en: "I wanted to find out how far I could push a scientific interface in a browser, with no ready-made visualization framework and no compute server.",
    },
    after: {
      fr: "Un démonstrateur complet où le cerveau, les réseaux et les courbes réagissent ensemble en temps réel, avec la provenance et l’incertitude affichées au même niveau que les résultats.",
      en: "A complete demonstrator where the brain, networks, and curves react together in real time, with provenance and uncertainty displayed at the same level as the results.",
    },
    context: {
      fr: "La recherche sur les maladies neurodégénératives combine imagerie, biomarqueurs, scores cognitifs, essais cliniques et niveaux de preuve difficiles à relier pour un lecteur non spécialiste.",
      en: "Neurodegenerative research combines imaging, biomarkers, cognitive scores, clinical trials, and evidence levels that are hard for a non-specialist to connect.",
    },
    problem: {
      fr: "Permettre l’exploration sans masquer l’incertitude ni laisser croire qu’une courbe isolée constitue une prédiction clinique.",
      en: "Enable exploration without hiding uncertainty or letting an isolated curve pass for a clinical prediction.",
    },
    role: {
      fr: "Conception produit, modélisation de données, expérience interactive, rendu 3D temps réel, architecture documentaire, accessibilité et garde-fous.",
      en: "Product design, data modelling, interactive experience, real-time 3D rendering, documentation architecture, accessibility, and safeguards.",
    },
    approach: {
      fr: "Séparer strictement les faits sourcés des paramètres synthétiques. Chaque traitement affiche son statut, son mécanisme, ses limites et sa source. Le cerveau, les trajectoires et les réseaux réagissent ensemble en temps réel, tout en restant explicitement des scénarios éducatifs.",
      en: "Strictly separate sourced facts from synthetic parameters. Every treatment exposes its status, mechanism, limitations, and source. The brain, trajectories, and networks react together in real time while remaining explicitly educational scenarios.",
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
      "Connectome",
      "Modélisation statistique",
      "Visualisation de données",
      "Accessibilité",
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
        fr: "Aucune recommandation, aucun diagnostic et aucune sauvegarde d’information médicale.",
        en: "No recommendations, no diagnosis, and no storage of medical information.",
      },
    ],
    testing: [
      {
        fr: "Validation des états clavier, tactiles, mobiles et à mouvement réduit.",
        en: "Keyboard, touch, mobile, and reduced-motion state validation.",
      },
      {
        fr: "Vérification que chaque valeur dynamique reste annoncée et que les sources demeurent accessibles.",
        en: "Checks that every dynamic value stays announced and all sources remain reachable.",
      },
      {
        fr: "Tests de cohérence entre traitement, biomarqueurs, courbe et région cérébrale sélectionnée.",
        en: "Consistency tests across treatment, biomarkers, chart, and selected brain region.",
      },
    ],
    results: [
      {
        fr: "Un rendu 3D anatomique fluide dans le navigateur, sans dépendance à un serveur de calcul.",
        en: "Smooth anatomical 3D rendering in the browser, with no dependency on a compute server.",
      },
      {
        fr: "Un modèle de documentation où provenance, incertitude et interaction restent visibles au même endroit.",
        en: "A documentation model where provenance, uncertainty, and interaction all stay visible in one place.",
      },
    ],
    lessons: [
      {
        fr: "Une visualisation puissante doit rendre ses limites aussi lisibles que ses résultats.",
        en: "A powerful visualization must make its limits as legible as its results.",
      },
      {
        fr: "Le niveau de preuve est une donnée de produit, pas une note de bas de page.",
        en: "Evidence level is product data, not a footnote.",
      },
    ],
    currentStatus: {
      fr: "Projet d’apprentissage personnel, sans lien avec mon travail. Démonstrateur éducatif : les valeurs sont synthétiques et ne représentent ni un outil clinique ni l’efficacité réelle d’un traitement.",
      en: "Personal learning project, unrelated to my work. Educational demonstrator: values are synthetic and represent neither a clinical tool nor real treatment efficacy.",
    },
  },
];

export const workProjects = projects.filter(
  (project) => project.track === "work",
);

export const labProjects = projects.filter(
  (project) => project.track === "lab",
);

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function localize(text: LocalizedText, locale: Locale) {
  return text[locale];
}
