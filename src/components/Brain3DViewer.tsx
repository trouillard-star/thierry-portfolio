"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export type BrainRegionId = "hippocampus" | "temporal" | "parietal" | "frontal";

type BrainMetrics = {
  amyloid: number;
  tau: number;
  atrophy: number;
  cognition: number;
  hippocampus: number;
};

type LayerVisibility = {
  amyloid: boolean;
  tau: boolean;
  network: boolean;
};

type Props = {
  metrics: BrainMetrics;
  year: number;
  selectedRegion: BrainRegionId;
  layers: LayerVisibility;
  onSelectRegion: (region: BrainRegionId) => void;
  ariaLabel: string;
};

type BrainRuntime = {
  amyloid: THREE.InstancedMesh;
  amyloidMatrices: THREE.Matrix4[];
  amyloidBaseScales: number[];
  brainMaterials: THREE.MeshPhysicalMaterial[];
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  markers: Map<BrainRegionId, THREE.Mesh>;
  modelRoot: THREE.Group;
  network: THREE.Points;
  renderer: THREE.WebGLRenderer;
  scanLine: THREE.Mesh;
  tauMaterial: THREE.LineBasicMaterial;
};

const regions: Array<{
  id: BrainRegionId;
  position: [number, number, number];
}> = [
  { id: "frontal", position: [-0.66, 0.78, 0.72] },
  { id: "parietal", position: [0.7, 0.35, 0.76] },
  { id: "temporal", position: [0.82, -0.58, 0.55] },
  { id: "hippocampus", position: [-0.32, -0.38, 0.82] },
];

function seededRandom(seed: number) {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function makeCortexGeometry(side: -1 | 1) {
  const geometry = new THREE.IcosahedronGeometry(1, 5);
  const positions = geometry.attributes.position;
  const colors: number[] = [];
  const low = new THREE.Color("#0b7778");
  const high = new THREE.Color("#71f1df");

  for (let index = 0; index < positions.count; index += 1) {
    const sourceX = positions.getX(index);
    const sourceY = positions.getY(index);
    const sourceZ = positions.getZ(index);
    const ridge =
      Math.sin(sourceY * 15 + sourceZ * 7) * 0.5 +
      Math.sin(sourceX * 19 - sourceY * 6) * 0.28 +
      Math.sin((sourceX + sourceZ) * 24) * 0.22;
    const fold = 1 + ridge * 0.055;
    const frontShape = 1 - Math.max(0, -sourceY) * 0.035;
    const innerFlatten = 1 - Math.max(0, -side * sourceX) * 0.16;

    positions.setXYZ(
      index,
      sourceX * 0.86 * fold * innerFlatten,
      sourceY * 1.16 * fold * frontShape,
      sourceZ * 0.8 * fold,
    );

    const color = low.clone().lerp(high, 0.42 + ridge * 0.2);
    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const smoothGeometry = mergeVertices(geometry, 0.0001);
  smoothGeometry.computeVertexNormals();
  smoothGeometry.computeBoundingSphere();
  geometry.dispose();
  return smoothGeometry;
}

function pointOnHemisphere(index: number) {
  const side = index % 2 === 0 ? -1 : 1;
  const u = seededRandom(index * 3 + 1);
  const v = seededRandom(index * 3 + 2);
  const theta = u * Math.PI * 2;
  const phi = Math.acos(2 * v - 1);
  const sinPhi = Math.sin(phi);
  const direction = new THREE.Vector3(
    Math.cos(theta) * sinPhi,
    Math.cos(phi),
    Math.sin(theta) * sinPhi,
  );
  const ridge =
    1 +
    (Math.sin(direction.y * 15 + direction.z * 7) +
      Math.sin(direction.x * 18 - direction.y * 5)) *
      0.024;
  return new THREE.Vector3(
    side * 0.53 + direction.x * 0.84 * ridge,
    direction.y * 1.14 * ridge,
    direction.z * 0.79 * ridge,
  );
}

function buildTauNetwork() {
  const positions: number[] = [];

  for (let index = 0; index < 120; index += 1) {
    const start = pointOnHemisphere(index + 310).multiplyScalar(
      0.48 + seededRandom(index + 18) * 0.35,
    );
    const branchLength = 0.12 + seededRandom(index + 81) * 0.26;
    const direction = new THREE.Vector3(
      seededRandom(index + 91) - 0.5,
      seededRandom(index + 117) - 0.5,
      seededRandom(index + 153) - 0.5,
    )
      .normalize()
      .multiplyScalar(branchLength);
    const end = start.clone().add(direction);
    positions.push(start.x, start.y, start.z, end.x, end.y, end.z);

    if (index % 3 === 0) {
      const branch = direction
        .clone()
        .applyAxisAngle(
          new THREE.Vector3(0, 0, 1),
          (seededRandom(index + 202) - 0.5) * 1.5,
        )
        .multiplyScalar(0.65);
      const split = start.clone().lerp(end, 0.6);
      const splitEnd = split.clone().add(branch);
      positions.push(
        split.x,
        split.y,
        split.z,
        splitEnd.x,
        splitEnd.y,
        splitEnd.z,
      );
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  return geometry;
}

function createNeuralField() {
  const positions: number[] = [];

  for (let index = 0; index < 900; index += 1) {
    const point = pointOnHemisphere(index + 700);
    positions.push(point.x, point.y, point.z);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  const material = new THREE.PointsMaterial({
    color: "#a7fff3",
    size: 0.012,
    transparent: true,
    opacity: 0.58,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Points(geometry, material);
}

function createStarField() {
  const positions: number[] = [];
  for (let index = 0; index < 380; index += 1) {
    positions.push(
      (seededRandom(index * 3 + 1200) - 0.5) * 9,
      (seededRandom(index * 3 + 1201) - 0.5) * 6,
      (seededRandom(index * 3 + 1202) - 0.5) * 5 - 1.5,
    );
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: "#4bd4c4",
      size: 0.018,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    }),
  );
}

function createCorticalFurrows(side: -1 | 1) {
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({
    color: "#052e33",
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
  });

  for (let curveIndex = 0; curveIndex < 24; curveIndex += 1) {
    const points: THREE.Vector3[] = [];
    const seed = curveIndex + (side === -1 ? 1700 : 2100);
    const radius = Math.sqrt(seededRandom(seed + 1)) * 0.72;
    const placementAngle = seededRandom(seed + 2) * Math.PI * 2;
    const centerX = Math.cos(placementAngle) * radius * 0.78;
    const centerY = Math.sin(placementAngle) * radius * 1.02;
    const direction = seededRandom(seed + 3) * Math.PI * 2;
    const length = 0.34 + seededRandom(seed + 4) * 0.44;
    const bend = (seededRandom(seed + 5) - 0.5) * 0.18;
    const pointCount = 5 + Math.floor(seededRandom(seed + 6) * 3);

    for (let step = 0; step < pointCount; step += 1) {
      const progress = step / (pointCount - 1) - 0.5;
      const along = progress * length;
      const wave =
        Math.sin(progress * Math.PI * 2.2 + seed) *
          (0.035 + seededRandom(seed + 7) * 0.035) +
        bend * progress * progress * Math.sign(progress);
      const localX =
        centerX +
        Math.cos(direction) * along +
        Math.cos(direction + Math.PI / 2) * wave;
      const y =
        centerY +
        Math.sin(direction) * along +
        Math.sin(direction + Math.PI / 2) * wave;
      const normalized = 1 - Math.pow(localX / 0.87, 2) - Math.pow(y / 1.17, 2);
      if (normalized <= 0.035) continue;
      const z = Math.sqrt(normalized) * 0.812 + 0.018;
      points.push(new THREE.Vector3(side * 0.51 + localX, y, z));
    }

    if (points.length > 2) {
      const curve = new THREE.CatmullRomCurve3(points);
      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 22, 0.0045, 5, false),
        material,
      );
      tube.renderOrder = 2;
      group.add(tube);
    }
  }

  return group;
}

export function Brain3DViewer({
  metrics,
  year,
  selectedRegion,
  layers,
  onSelectRegion,
  ariaLabel,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const runtimeRef = useRef<BrainRuntime | null>(null);
  const regionHandlerRef = useRef(onSelectRegion);
  const selectedRegionRef = useRef(selectedRegion);

  useEffect(() => {
    regionHandlerRef.current = onSelectRegion;
  }, [onSelectRegion]);

  useEffect(() => {
    selectedRegionRef.current = selectedRegion;
  }, [selectedRegion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      host.dataset.webgl = "unavailable";
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#02080d", 0.09);

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.05, 5.8);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.enablePan = false;
    controls.minDistance = 3.4;
    controls.maxDistance = 8.2;
    controls.autoRotate = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    controls.autoRotateSpeed = 0.48;
    controls.target.set(0, 0, 0);

    const ambient = new THREE.AmbientLight("#8ceee2", 1.05);
    const tealLight = new THREE.PointLight("#4bd4c4", 13, 10);
    tealLight.position.set(-3.6, 2.5, 4.5);
    const amberLight = new THREE.PointLight("#f0b458", 9, 9);
    amberLight.position.set(3.2, -2.1, 3.5);
    const rimLight = new THREE.DirectionalLight("#8ed9ff", 2.8);
    rimLight.position.set(0, 2, -4);
    scene.add(ambient, tealLight, amberLight, rimLight);

    const modelRoot = new THREE.Group();
    modelRoot.rotation.x = -0.05;
    scene.add(modelRoot);

    const brainMaterials: THREE.MeshPhysicalMaterial[] = [];
    for (const side of [-1, 1] as const) {
      const cortexGeometry = makeCortexGeometry(side);
      const cortexMaterial = new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        roughness: 0.28,
        metalness: 0.08,
        clearcoat: 0.55,
        clearcoatRoughness: 0.22,
        transmission: 0.08,
        thickness: 0.8,
        transparent: true,
        opacity: 0.83,
        emissive: new THREE.Color("#063d42"),
        emissiveIntensity: 0.72,
        side: THREE.DoubleSide,
      });
      brainMaterials.push(cortexMaterial);
      const cortex = new THREE.Mesh(cortexGeometry, cortexMaterial);
      cortex.position.x = side * 0.51;
      cortex.rotation.z = side * -0.035;
      modelRoot.add(cortex);

      const wireframe = new THREE.LineSegments(
        new THREE.WireframeGeometry(cortexGeometry),
        new THREE.LineBasicMaterial({
          color: "#8ffff0",
          transparent: true,
          opacity: 0.055,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      wireframe.position.copy(cortex.position);
      wireframe.rotation.copy(cortex.rotation);
      modelRoot.add(wireframe);
      modelRoot.add(createCorticalFurrows(side));
    }

    const neuralField = createNeuralField();
    modelRoot.add(neuralField);

    const tauMaterial = new THREE.LineBasicMaterial({
      color: "#ff786d",
      transparent: true,
      opacity: 0.58,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const tauNetwork = new THREE.LineSegments(buildTauNetwork(), tauMaterial);
    modelRoot.add(tauNetwork);

    const amyloidGeometry = new THREE.SphereGeometry(0.028, 8, 8);
    const amyloidMaterial = new THREE.MeshStandardMaterial({
      color: "#ffbd55",
      emissive: "#ff9d2e",
      emissiveIntensity: 1.6,
      roughness: 0.34,
      metalness: 0.1,
    });
    const amyloid = new THREE.InstancedMesh(
      amyloidGeometry,
      amyloidMaterial,
      160,
    );
    amyloid.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const amyloidMatrices: THREE.Matrix4[] = [];
    const amyloidBaseScales: number[] = [];
    const dummy = new THREE.Object3D();
    for (let index = 0; index < 160; index += 1) {
      const position = pointOnHemisphere(index + 40).multiplyScalar(1.015);
      const scale = 0.65 + seededRandom(index + 520) * 1.8;
      dummy.position.copy(position);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      amyloid.setMatrixAt(index, dummy.matrix);
      amyloidMatrices.push(dummy.matrix.clone());
      amyloidBaseScales.push(scale);
    }
    amyloid.instanceMatrix.needsUpdate = true;
    modelRoot.add(amyloid);

    const markers = new Map<BrainRegionId, THREE.Mesh>();
    for (const region of regions) {
      const material = new THREE.MeshStandardMaterial({
        color: "#102a32",
        emissive: "#4bd4c4",
        emissiveIntensity: 1.4,
        roughness: 0.28,
      });
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 18, 18),
        material,
      );
      marker.position.set(...region.position);
      marker.userData.region = region.id;
      marker.renderOrder = 4;
      markers.set(region.id, marker);
      modelRoot.add(marker);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.105, 0.009, 8, 36),
        new THREE.MeshBasicMaterial({
          color: "#4bd4c4",
          transparent: true,
          opacity: 0.52,
          depthWrite: false,
        }),
      );
      ring.position.copy(marker.position);
      ring.userData.regionRing = region.id;
      modelRoot.add(ring);
    }

    const scanLine = new THREE.Mesh(
      new THREE.PlaneGeometry(4.2, 0.035),
      new THREE.MeshBasicMaterial({
        color: "#7effee",
        transparent: true,
        opacity: 0.76,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    scanLine.position.z = 1.08;
    scene.add(scanLine);

    const scanGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(4.2, 0.28),
      new THREE.MeshBasicMaterial({
        color: "#4bd4c4",
        transparent: true,
        opacity: 0.055,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    scanLine.add(scanGlow);

    const orbitRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.05, 0.008, 6, 160),
      new THREE.MeshBasicMaterial({
        color: "#4bd4c4",
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
      }),
    );
    orbitRing.rotation.x = Math.PI * 0.37;
    orbitRing.rotation.y = Math.PI * 0.08;
    scene.add(orbitRing);

    const orbitRing2 = orbitRing.clone();
    orbitRing2.scale.setScalar(1.14);
    orbitRing2.rotation.x = Math.PI * -0.24;
    orbitRing2.rotation.y = Math.PI * 0.45;
    const orbitRing2Material = (
      orbitRing2.material as THREE.MeshBasicMaterial
    ).clone();
    orbitRing2Material.color.set("#f0b458");
    orbitRing2Material.opacity = 0.11;
    orbitRing2.material = orbitRing2Material;
    scene.add(orbitRing2);

    const grid = new THREE.GridHelper(9, 28, "#16444b", "#0b242b");
    grid.rotation.x = Math.PI / 2;
    grid.position.z = -1.45;
    const gridMaterials = Array.isArray(grid.material)
      ? grid.material
      : [grid.material];
    for (const material of gridMaterials) {
      material.transparent = true;
      material.opacity = 0.33;
    }
    scene.add(grid);

    const starField = createStarField();
    scene.add(starField);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDown = { x: 0, y: 0 };

    const onPointerDown = (event: PointerEvent) => {
      pointerDown = { x: event.clientX, y: event.clientY };
      canvas.dataset.dragging = "true";
    };

    const onPointerUp = (event: PointerEvent) => {
      canvas.dataset.dragging = "false";
      const movement = Math.hypot(
        event.clientX - pointerDown.x,
        event.clientY - pointerDown.y,
      );
      if (movement > 5) return;
      const bounds = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const intersections = raycaster.intersectObjects([...markers.values()]);
      const selected = intersections[0]?.object.userData.region as
        BrainRegionId | undefined;
      if (selected) regionHandlerRef.current(selected);
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", () => {
      canvas.dataset.dragging = "false";
    });

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    runtimeRef.current = {
      amyloid,
      amyloidMatrices,
      amyloidBaseScales,
      brainMaterials,
      camera,
      controls,
      markers,
      modelRoot,
      network: neuralField,
      renderer,
      scanLine,
      tauMaterial,
    };

    const animationStartedAt = performance.now();
    let animationFrame = 0;
    const animate = (now: number) => {
      const elapsed = (now - animationStartedAt) / 1000;
      controls.update();
      orbitRing.rotation.z = elapsed * 0.045;
      orbitRing2.rotation.z = -elapsed * 0.032;
      starField.rotation.z = elapsed * 0.006;

      for (const marker of markers.values()) {
        const pulse =
          1 + Math.sin(elapsed * 2.1 + marker.position.x * 3) * 0.12;
        const isSelected = marker.userData.region === selectedRegionRef.current;
        marker.scale.setScalar(isSelected ? pulse * 1.75 : pulse);
      }

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };
    animate(animationStartedAt);

    host.dataset.webgl = "ready";

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      controls.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry?.dispose();
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          materials.forEach((material) => material?.dispose());
        }
      });
      renderer.dispose();
      runtimeRef.current = null;
    };
  }, []);

  useEffect(() => {
    const runtime = runtimeRef.current;
    if (!runtime) return;

    const visiblePlaques = Math.round(
      (metrics.amyloid / 100) * runtime.amyloidMatrices.length,
    );
    const dummy = new THREE.Object3D();
    for (let index = 0; index < runtime.amyloidMatrices.length; index += 1) {
      runtime.amyloidMatrices[index].decompose(
        dummy.position,
        dummy.quaternion,
        dummy.scale,
      );
      const visible = layers.amyloid && index < visiblePlaques;
      const scale = visible ? runtime.amyloidBaseScales[index] : 0;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      runtime.amyloid.setMatrixAt(index, dummy.matrix);
    }
    runtime.amyloid.instanceMatrix.needsUpdate = true;

    runtime.tauMaterial.opacity = layers.tau
      ? 0.12 + (metrics.tau / 100) * 0.74
      : 0;
    runtime.network.visible = layers.network;
    const networkMaterial = runtime.network.material as THREE.PointsMaterial;
    networkMaterial.opacity = 0.34 + (metrics.cognition / 100) * 0.38;

    const atrophyScale = 1 - metrics.atrophy * 0.00165;
    runtime.modelRoot.scale.setScalar(atrophyScale);
    runtime.brainMaterials.forEach((material) => {
      material.opacity = 0.86 - metrics.atrophy * 0.0022;
      material.emissiveIntensity = 0.5 + (metrics.cognition / 100) * 0.36;
    });

    runtime.scanLine.position.y = THREE.MathUtils.lerp(1.42, -1.42, year / 10);
  }, [layers, metrics, year]);

  useEffect(() => {
    const runtime = runtimeRef.current;
    if (!runtime) return;
    for (const [region, marker] of runtime.markers) {
      const material = marker.material as THREE.MeshStandardMaterial;
      const isSelected = region === selectedRegion;
      material.color.set(isSelected ? "#e7fff9" : "#102a32");
      material.emissive.set(isSelected ? "#f0b458" : "#4bd4c4");
      // Three.js materials are intentionally updated in place.
      // eslint-disable-next-line react-hooks/immutability
      material.emissiveIntensity = isSelected ? 3.4 : 1.4;
    }
  }, [selectedRegion]);

  return (
    <div className="brain-3d-host" ref={hostRef}>
      <canvas ref={canvasRef} role="img" aria-label={ariaLabel} />
      <div className="brain-3d-fallback" role="status">
        WebGL indisponible — activez l’accélération graphique pour afficher le
        cerveau 3D.
      </div>
      <div className="brain-3d-reticle" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="brain-3d-axis" aria-hidden="true">
        <span>S</span>
        <i />
        <span>A</span>
      </div>
    </div>
  );
}
