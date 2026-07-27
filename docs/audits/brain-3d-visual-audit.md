# Audit visuel — cerveau 3D NeuroLens

Date : 2026-07-27

## Périmètre observé

- `src/components/ProjectDemo.tsx` contient le cerveau actuellement visible dans l’étude de cas publique. Il s’agit d’une illustration CSS composée d’un cercle, de deux pseudo-éléments ovales et de quelques repères. C’est cette construction qui produit l’impression de « deux sphères collées ».
- `app/globals.css` contient la scène CSS visible (`.demo-brain`) ainsi que les styles de la scène WebGL avancée (`.brain-3d-host`, `.neuro-brain-stage`).
- `src/components/Brain3DViewer.tsx` contient une scène cérébrale Three.js beaucoup plus avancée, mais elle n’est actuellement importée par aucune route rendue.
- `src/components/AlzheimerResearchLab.tsx` configure cette scène WebGL et ses couches, mais ce laboratoire n’est actuellement monté par aucune page.
- Aucun fichier GLB, GLTF, OBJ, FBX, HDR ou EXR local n’est présent dans le dépôt.

## Technologie

- Three.js direct, sans React Three Fiber ni Babylon.js.
- Géométrie entièrement procédurale.
- `OrbitControls` pour la caméra.
- Aucun shader personnalisé.
- Aucun post-traitement.
- Aucun modèle ou asset anatomique externe.

## Inventaire de la scène Three.js existante

### Géométrie principale

- Deux `IcosahedronGeometry` de détail 5, transformées par `cortexPoint`.
- Déformation par fonctions sinusoïdales pour suggérer les plis.
- Fissure longitudinale construite avec un `TubeGeometry`.
- Sillons secondaires et majeurs dessinés par plusieurs courbes tubulaires.
- Cervelet, pont et tronc cérébral procéduraux.

### Matériaux

- Cortex : `MeshPhysicalMaterial`, couleur par vertex, légère transmission, clearcoat et émission turquoise.
- Sillons : `MeshBasicMaterial` sombre semi-transparent.
- Cervelet et tronc : `MeshPhysicalMaterial`.
- Réseau, marqueurs et effets : matériaux additifs ou émissifs.

### Lumières

- Une lumière ambiante turquoise.
- Deux lumières ponctuelles turquoise et ambre.
- Une lumière directionnelle de contour bleue.

### Particules et marqueurs

- Charge amyloïde : 160 sphères dans un `InstancedMesh`.
- Réseau neuronal : 460 points et 620 segments.
- Charge Tau : 120 branches principales avec ramifications.
- Quatre marqueurs régionaux et quatre volumes de différence.
- Champ d’étoiles, ligne de balayage et anneaux orbitaux décoratifs.

### Animation et caméra

- Boucle `requestAnimationFrame` permanente.
- Pulsation des marqueurs et rotation des anneaux.
- Caméra perspective et rotation orbitale manuelle.
- Pas de prise en charge explicite de `prefers-reduced-motion`.
- Pas de rotation automatique du cerveau.

### Performance et nettoyage

- Particules amyloïdes déjà instanciées.
- Nettoyage des géométries, matériaux, contrôles et du renderer au démontage.
- Ratio de pixels limité à 2, mais aucun niveau de qualité adaptatif.
- Les nombreux sillons en `TubeGeometry` augmentent les draw calls.

## Diagnostic

1. Le rendu public n’utilise pas la scène Three.js existante : il affiche la version CSS très simplifiée.
2. La silhouette CSS est circulaire et symétrique; ses deux pseudo-lobes sont immédiatement perçus comme deux masses ovales.
3. La scène Three.js possède une base technique solide, mais sa géométrie principale reste dérivée de deux icosphères et son déplacement de surface repose sur des ondulations trop uniformes.
4. Les particules amyloïdes sont trop lumineuses et leur plage de tailles est trop large.
5. Les réseaux sont générés par segments aléatoires; leur structure ne suit pas suffisamment les volumes anatomiques.
6. L’éclairage très intense et l’émission élevée réduisent la lecture des sillons.
7. L’absence de qualité adaptative et de gestion du mouvement réduit peut nuire aux performances et à l’accessibilité.

## Direction retenue

- Monter la scène Three.js améliorée directement dans la mini-application NeuroLens publique.
- Conserver l’architecture procédurale et les contrôles existants.
- Remodeler les hémisphères par régions anatomiques et renforcer la fissure centrale.
- Produire les gyri dans la géométrie elle-même, puis utiliser moins de courbes de sillons, mieux orientées.
- Conserver l’instanciation des plaques, réduire leur taille, leur émission et leur nombre visible.
- Construire les réseaux à l’intérieur de chaque hémisphère avec des courbes plus fines.
- Ajouter une qualité adaptative `high`, `medium`, `low`, le respect de `prefers-reduced-motion` et un panneau de réglage uniquement en développement.
- Ne télécharger ni modèle ni texture externe.

## Résultat après amélioration

- La mini-application publique monte maintenant la scène Three.js réelle à la place de l’ancienne illustration CSS.
- La silhouette combine deux hémisphères asymétriques, des volumes frontal, pariétal, temporal et occipital différenciés, une fissure longitudinale profonde, un cervelet et un tronc cérébral.
- Les plis principaux sont intégrés à la géométrie; les sillons majeurs et secondaires suivent ensuite la surface avec une densité dépendante du niveau de qualité.
- La couche biomarqueurs utilise moins de plaques amyloïdes, plus petites et moins émissives. La couche réseaux utilise des ramifications courbes contenues dans chaque hémisphère.
- Le rendu choisit automatiquement un niveau `high`, `medium` ou `low` selon la mémoire, le nombre de cœurs et le ratio de pixels. Three.js est isolé dans son propre module chargé seulement par NeuroLens.
- `prefers-reduced-motion` limite le rendu à environ 15 images par seconde et désactive l’autorotation.
- Le panneau `3D DEBUG` permet d’ajuster l’opacité, les sillons, les particules, les réseaux, la vitesse, l’autorotation et la qualité en développement. Il est absent du HTML de production.
- Les ressources Three.js, les contrôles, les écouteurs, le media query et les animations sont nettoyés au démontage.

## Validation

- TypeScript : réussi.
- ESLint : réussi.
- Build de production : réussi, 23 routes pré-rendues.
- Tests de rendu : 7 sur 7 réussis.
- Liens internes : 23 pages validées.
- Analyse de secrets : réussie.
- Console navigateur sur la vue biomarqueurs et la vue réseaux : aucune erreur et aucun avertissement.
- Interaction vérifiée : changement d’onglet et sélection d’une région depuis la scène.

## Captures après modification

- `docs/audits/brain-3d-after.png` : vue biomarqueurs.
- `docs/audits/brain-3d-network-after.png` : vue connectome.

La capture automatisée de l’ancien rendu a échoué avant modification. Le diagnostic et l’inventaire ci-dessus conservent donc la référence vérifiable de cet état.
