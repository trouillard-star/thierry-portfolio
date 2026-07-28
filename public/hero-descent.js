/**
 * Hero descent — a scroll-driven pass through an inspected pipe.
 *
 * Loaded as a plain module rather than a React component: the static build
 * strips the framework runtime from informational pages, so anything that
 * depends on hydration would never run on the home page.
 *
 * Defects are procedural. Every slot down the pipe derives its type, severity,
 * position and size from an integer hash of its index, so the pipe is
 * effectively endless without repeating, and identical on every visit.
 *
 * The same hash runs in GLSL and in JavaScript. It is written with 32-bit
 * integer operations rather than the usual sin() trick precisely so both sides
 * agree bit for bit — otherwise the log would drift out of step with what the
 * shader actually draws.
 *
 * Progressive enhancement. Without WebGL2 the capability map already in the
 * markup stays exactly as it is.
 */

(() => {
  const stage = document.querySelector("[data-hero-descent]");
  if (!stage) return;

  const canvas = stage.querySelector("canvas");
  if (!canvas) return;

  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  if (!gl) return;

  /** Metres of pipe between defect slots, in shader units. */
  const SLOT = 2.6;
  /** Shader units to metres, for the readout. */
  const METRES = 3.0;

  const VERTEX_SHADER = `#version 300 es
void main() {
  vec2 corner = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}`;

  // The tunnel is polar, not raymarched: each pixel maps straight to an angle
  // and a depth, so cost per pixel is constant and independent of scene size.
  const FRAGMENT_SHADER = `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2 uResolution;
uniform float uTravel;
uniform float uPhase;
uniform vec2 uLook;

const float SLOT = ${SLOT.toFixed(4)};

// Integer hash. Mirrored exactly in JavaScript so the on-screen log and the
// rendered defects describe the same pipe.
uint hashU(uint x) {
  x ^= x >> 16; x *= 0x7feb352du;
  x ^= x >> 15; x *= 0x846ca68bu;
  x ^= x >> 16;
  return x;
}

float h01(uint x) {
  return float(hashU(x) & 0xffffffu) / float(0xffffffu);
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.03;
    amplitude *= 0.5;
  }
  return value;
}

// Shortest distance between two angular coordinates expressed in turns.
float turnDist(float a, float b) {
  float d = abs(fract(a - b + 0.5) - 0.5);
  return d;
}

// One defect slot. Returns coverage in x and severity 1..5 in y.
vec2 defectAt(uint slot, float depth, float turn) {
  float type = floor(h01(slot * 4u + 1u) * 5.0);
  float severity = floor(h01(slot * 4u + 2u) * 5.0) + 1.0;
  float around = h01(slot * 4u + 3u);
  float jitter = h01(slot * 4u + 4u);

  float centre = float(slot) * SLOT + 0.6 + jitter * 1.2;
  float dz = depth - centre;
  float coverage = 0.0;

  if (type < 1.0) {
    // Longitudinal crack: narrow across the barrel, long down the pipe, with
    // a noise-driven wander so it never reads as a straight ruled line.
    float wander = (fbm(vec2(depth * 5.0, float(slot))) - 0.5) * 0.06;
    float across = turnDist(turn, around + wander);
    coverage = smoothstep(0.012, 0.0, across) * smoothstep(0.85, 0.0, abs(dz));
  } else if (type < 2.0) {
    // Root intrusion: a soft organic cluster hanging into the barrel. The
    // noise gate has to stay generous, otherwise the cluster reads as a few
    // stray pixels against the concrete instead of a mass.
    float across = turnDist(turn, around);
    float blob = fbm(vec2(turn * 22.0, depth * 5.0 + float(slot)));
    float mask = smoothstep(0.15, 0.0, across) * smoothstep(0.55, 0.0, abs(dz));
    coverage = mask * smoothstep(0.26, 0.60, blob) * 1.35;
  } else if (type < 3.0) {
    // Offset joint: a band right at the segment ring. Kept well below full
    // coverage so a severe grade tints the ring rather than clipping it white.
    coverage = smoothstep(0.055, 0.0, abs(dz)) * (0.30 + 0.26 * sin(turn * 6.28318));
  } else if (type < 4.0) {
    // Infiltration: a wet patch running down from the crown.
    float across = turnDist(turn, around);
    float wet = fbm(vec2(turn * 14.0, depth * 3.0 + float(slot) * 2.0));
    coverage = smoothstep(0.13, 0.0, across) * smoothstep(0.55, 0.0, abs(dz)) * wet * 1.4;
  } else {
    // Sediment: settles along the invert, so it is pinned to the bottom of
    // the barrel rather than placed at a random angle.
    float across = turnDist(turn, 0.75);
    float bed = fbm(vec2(turn * 8.0, depth * 2.0));
    coverage = smoothstep(0.16, 0.0, across) * smoothstep(0.75, 0.0, abs(dz)) * (0.5 + bed);
  }

  return vec2(clamp(coverage, 0.0, 1.0), severity);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 p = (uv - 0.5) * 2.0;
  p.x *= uResolution.x / uResolution.y;
  p -= uLook * 0.14;

  float radius = max(length(p), 0.0015);
  float angle = atan(p.y, p.x);
  float depth = 0.34 / radius + uTravel;
  float turn = angle / 6.28318;
  vec2 wallUv = vec2(turn, depth);

  // Concrete, then vertical staining where water has run down the barrel.
  float wall = fbm(vec2(wallUv.x * 26.0, wallUv.y * 6.0));
  wall = 0.34 + wall * 0.52;
  wall *= 0.86 + 0.14 * fbm(vec2(wallUv.x * 64.0, wallUv.y * 1.1));

  // Segment joints, one per metre of pipe.
  float segment = fract(depth);
  float joint = smoothstep(0.05, 0.0, abs(segment - 0.5));

  // Only the two slots straddling this fragment can contribute, so the cost
  // stays flat however far down the pipe the camera has travelled.
  float reach = min(depth, uTravel + 46.0);
  float slotF = floor(reach / SLOT);
  vec2 near = vec2(0.0);
  if (slotF >= 0.0) {
    vec2 a = defectAt(uint(slotF), reach, turn);
    vec2 b = defectAt(uint(slotF) + 1u, reach, turn);
    near = a.x >= b.x ? a : b;
  }

  float reveal = smoothstep(0.30, 0.70, uPhase);
  float defect = near.x * reveal;
  float severity = near.y;

  // Measurement sweep running ahead of the camera, introduced mid-descent.
  float sweep = smoothstep(0.035, 0.0, abs(fract(depth * 0.5 - uTravel * 0.6) - 0.5));
  sweep *= smoothstep(0.12, 0.45, uPhase);

  vec3 navy = vec3(0.027, 0.075, 0.122);
  vec3 teal = vec3(0.294, 0.831, 0.769);
  vec3 amber = vec3(0.941, 0.706, 0.345);
  vec3 alarm = vec3(1.000, 0.404, 0.353);

  // Severity drives the colour: minor readings stay in the accent, moderate
  // turn amber, severe go red. Same scale as the log.
  vec3 defectColor = severity <= 2.0 ? teal : (severity <= 3.0 ? amber : alarm);

  vec3 color = mix(navy, vec3(0.40, 0.48, 0.55), wall);
  color = mix(color, navy * 0.45, joint * 0.72);
  color += teal * joint * 0.34;
  // Severity raises the intensity, but the ceiling stays under 1.15 so a
  // grade 5 reads as saturated colour rather than blown-out white.
  color += defectColor * defect * (0.55 + severity * 0.11);
  color += teal * sweep * 0.09;
  color += teal * 0.055 * smoothstep(0.30, 1.45, radius);

  // Darkness towards the vanishing point; the mouth opens up as we descend.
  color *= smoothstep(0.0, 0.82 - uPhase * 0.16, radius);
  color *= 1.0 - 0.34 * smoothstep(0.95, 1.95, radius);
  color += (hash(gl_FragCoord.xy + fract(uTravel)) - 0.5) * 0.022;

  outColor = vec4(max(color, 0.0), 1.0);
}`;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexShader = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vertexShader || !fragmentShader) return;

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);

  const uResolution = gl.getUniformLocation(program, "uResolution");
  const uTravel = gl.getUniformLocation(program, "uTravel");
  const uPhase = gl.getUniformLocation(program, "uPhase");
  const uLook = gl.getUniformLocation(program, "uLook");

  // Everything below here only runs once the shader is known to work, so the
  // fallback markup is never removed on a machine that cannot draw the pipe.
  const host = stage.closest(".hero-system") ?? stage.parentElement;
  host?.classList.add("is-descent-active");

  // The capability map this replaces is now display:none, so its label would
  // describe content no longer in the accessibility tree.
  const label = stage.getAttribute("data-descent-label");
  if (host && label) host.setAttribute("aria-label", label);

  const distanceOut = stage.querySelector("[data-descent-distance]");
  const defectsOut = stage.querySelector("[data-descent-defects]");
  const logOut = stage.querySelector("[data-descent-log]");

  const english = document.documentElement.lang.startsWith("en");
  const CATALOGUE = english
    ? [
        { code: "CRK", name: "Longitudinal crack" },
        { code: "ROO", name: "Root intrusion" },
        { code: "JNT", name: "Offset joint" },
        { code: "INF", name: "Infiltration" },
        { code: "DEP", name: "Sediment deposit" },
      ]
    : [
        { code: "FIS", name: "Fissure longitudinale" },
        { code: "RAC", name: "Intrusion de racines" },
        { code: "JNT", name: "Joint déboîté" },
        { code: "INF", name: "Infiltration" },
        { code: "DEP", name: "Dépôt de sédiments" },
      ];
  const GRADE = english ? "Grade" : "Cote";

  // --- The JavaScript half of the shared hash -------------------------------

  function hashU(x) {
    x = (x ^ (x >>> 16)) >>> 0;
    x = Math.imul(x, 0x7feb352d) >>> 0;
    x = (x ^ (x >>> 15)) >>> 0;
    x = Math.imul(x, 0x846ca68b) >>> 0;
    x = (x ^ (x >>> 16)) >>> 0;
    return x;
  }

  function h01(x) {
    return (hashU(x >>> 0) & 0xffffff) / 0xffffff;
  }

  function defectForSlot(slot) {
    const type = Math.floor(h01(slot * 4 + 1) * 5);
    const severity = Math.floor(h01(slot * 4 + 2) * 5) + 1;
    const around = h01(slot * 4 + 3);
    const jitter = h01(slot * 4 + 4);
    const centre = slot * SLOT + 0.6 + jitter * 1.2;
    // Sediment settles along the invert in the shader, so its marker has to
    // follow the same rule rather than the slot's random angle.
    const turn = type === 4 ? 0.75 : around;
    // Presented confidence, derived from the same seed so it never flickers.
    const confidence = 88 + Math.floor(h01(slot * 4 + 2) * 12);
    return { type, severity, centre, turn, confidence };
  }

  // --- Detection markers ----------------------------------------------------

  const trackHost = stage.querySelector("[data-descent-track]");
  const MARKERS = 3;
  const markers = [];
  let markersEnabled = true;

  if (trackHost) {
    for (let i = 0; i < MARKERS; i++) {
      const marker = document.createElement("div");
      marker.className = "descent-marker";
      marker.innerHTML = "<i></i><i></i><i></i><i></i><b></b>";
      marker.style.opacity = "0";
      trackHost.append(marker);
      markers.push({ el: marker, label: marker.querySelector("b"), slot: -1 });
    }
  }

  /**
   * Projects a defect back to screen space by inverting the shader's mapping:
   * depth = 0.34 / radius + travel, so radius = 0.34 / (depth - travel). The
   * pointer offset is applied after the aspect correction there, so it has to
   * be added back in the same order here or the markers drift off the defect.
   */
  function placeMarkers(travel) {
    if (!markers.length) return;
    const aspect = canvas.clientHeight
      ? canvas.clientWidth / canvas.clientHeight
      : 1;
    const firstSlot = Math.max(Math.floor(travel / SLOT), 0);

    for (let i = 0; i < MARKERS; i++) {
      const slot = firstSlot + i;
      const { centre, severity, turn, confidence, type } = defectForSlot(slot);
      const marker = markers[i];
      const ahead = centre - travel;

      // Behind the camera, or so far off it would sit outside the barrel.
      const radius = ahead > 0.02 ? 0.34 / ahead : 99;
      if (ahead <= 0.02 || radius > 1.25) {
        marker.el.style.opacity = "0";
        continue;
      }

      const angle = turn * Math.PI * 2;
      const x = (radius * Math.cos(angle) + lookX * 0.14) / (2 * aspect) + 0.5;
      const y = (radius * Math.sin(angle) + lookY * 0.14) / 2 + 0.5;
      const scale = 0.45 + Math.min(radius, 1.25) * 0.9;

      // Fade in as it emerges from the dark and out again as it sweeps past.
      const opacity = Math.min(radius / 0.28, 1) * Math.min((1.25 - radius) / 0.3, 1);

      // Pixel offsets rather than percentages: markers are pinned at the
      // stage origin and moved with transform alone, so no frame touches
      // layout.
      const left = x * canvas.clientWidth;
      const top = (1 - y) * canvas.clientHeight;
      marker.el.style.transform =
        `translate(-50%, -50%) translate(${left.toFixed(1)}px, ` +
        `${top.toFixed(1)}px) scale(${scale.toFixed(3)})`;
      marker.el.style.opacity = Math.max(opacity, 0).toFixed(2);
      marker.el.dataset.grade = String(severity);

      if (marker.slot !== slot) {
        marker.slot = slot;
        const entry = CATALOGUE[type] ?? CATALOGUE[0];
        if (marker.label) {
          marker.label.textContent = `${entry.code} ${confidence}%`;
        }
      }
    }
  }

  // --- Rendering ------------------------------------------------------------

  // The image is low-frequency, so rendering below device resolution is free
  // visually and roughly halves the fragment work on weak GPUs.
  const RENDER_SCALE = 0.75;
  const MAX_DPR = 1.5;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, MAX_DPR) * RENDER_SCALE;
    const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
    const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
    if (canvas.width === width && canvas.height === height) return;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  }

  if ("ResizeObserver" in window) {
    new ResizeObserver(resize).observe(canvas);
  } else {
    addEventListener("resize", resize, { passive: true });
  }
  resize();

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;

  let lookTargetX = 0;
  let lookTargetY = 0;
  let lookX = 0;
  let lookY = 0;

  if (finePointer && !reducedMotion) {
    stage.addEventListener(
      "pointermove",
      (event) => {
        const bounds = stage.getBoundingClientRect();
        lookTargetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
        lookTargetY = -((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      },
      { passive: true },
    );
    stage.addEventListener("pointerleave", () => {
      lookTargetX = 0;
      lookTargetY = 0;
    });
  }

  const MAX_LOG_ROWS = 4;

  function logDefect(slot, travel) {
    if (!logOut) return;
    const { type, severity } = defectForSlot(slot);
    const entry = CATALOGUE[type] ?? CATALOGUE[0];

    const row = document.createElement("li");
    row.dataset.grade = String(severity);
    const metres = (travel * METRES).toFixed(1).replace(".", english ? "." : ",");
    row.innerHTML =
      `<b>${metres} m</b><span>${entry.code}</span>` +
      `<em>${entry.name}</em><i>${GRADE} ${severity}</i>`;

    logOut.prepend(row);
    while (logOut.children.length > MAX_LOG_ROWS) {
      logOut.lastElementChild?.remove();
    }
  }

  let running = false;
  let frame = 0;
  let startedAt = 0;
  let lastSlot = -1;
  let defectCount = 0;

  function draw(now) {
    frame = 0;
    if (!running) return;

    if (!startedAt) startedAt = now;
    const elapsed = (now - startedAt) / 1000;

    // Scroll position is sampled here rather than in a scroll listener: no
    // extra event work, and no style writes outside the animation frame.
    const heroHeight = Math.max(host?.offsetHeight ?? window.innerHeight, 1);
    const phase = Math.min(Math.max(window.scrollY / heroHeight, 0), 1);

    // The descent always drifts, and scrolling pushes it further in.
    const travel = elapsed * 0.34 + phase * 6.0;

    lookX += (lookTargetX - lookX) * 0.06;
    lookY += (lookTargetY - lookY) * 0.06;

    gl.uniform2f(uResolution, canvas.width, canvas.height);
    gl.uniform1f(uTravel, travel);
    gl.uniform1f(uPhase, phase);
    gl.uniform2f(uLook, lookX, lookY);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // The overlay is an enhancement on top of the shader. If its projection
    // ever throws, the exception would break the frame chain and freeze the
    // pipe itself, so it is isolated and retired rather than allowed to.
    if (markersEnabled) {
      try {
        placeMarkers(travel);
      } catch {
        markersEnabled = false;
        markers.forEach(({ el }) => {
          el.style.display = "none";
        });
      }
    }

    if (distanceOut) distanceOut.textContent = (travel * METRES).toFixed(1);

    // Log a slot once the camera has actually passed its centre, so the entry
    // appears at the moment the defect sweeps by rather than before it.
    const slot = Math.floor(travel / SLOT);
    if (slot > lastSlot) {
      for (let s = Math.max(lastSlot + 1, 0); s <= slot; s++) {
        if (travel >= defectForSlot(s).centre) {
          defectCount += 1;
          logDefect(s, travel);
          lastSlot = s;
        }
      }
      if (defectsOut) defectsOut.textContent = String(defectCount);
    }

    frame = requestAnimationFrame(draw);
  }

  function renderStillFrame() {
    gl.uniform2f(uResolution, canvas.width, canvas.height);
    gl.uniform1f(uTravel, 4.0);
    gl.uniform1f(uPhase, 0.6);
    gl.uniform2f(uLook, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    placeMarkers(4.0);
    if (distanceOut) distanceOut.textContent = (4.0 * METRES).toFixed(1);
    logDefect(1, 4.0);
  }

  if (reducedMotion) {
    renderStillFrame();
    return;
  }

  // Off-screen frames are wasted work and drain battery on laptops.
  const visibility = new IntersectionObserver(
    (entries) => {
      running = entries[0].isIntersecting;
      if (running && !frame) {
        startedAt = 0;
        frame = requestAnimationFrame(draw);
      } else if (!running && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    { threshold: 0 },
  );
  visibility.observe(canvas);

  addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else if (!document.hidden && running && !frame) {
        startedAt = 0;
        frame = requestAnimationFrame(draw);
      }
    },
    { passive: true },
  );
})();
