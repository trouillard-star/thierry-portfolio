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
  const SLOT = 1.9;
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

// One defect slot. Defects are cut into the surface rather than painted over
// it: x darkens the concrete (a gap, a shadow, a wet patch), y adds the
// highlight that a broken lip or a wet crest catches, z is how much of the
// severity colour the detector overlay should add, w is the grade.
vec4 defectAt(uint slot, float depth, float turn) {
  float type = floor(h01(slot * 4u + 1u) * 5.0);
  float severity = floor(h01(slot * 4u + 2u) * 5.0) + 1.0;
  float around = h01(slot * 4u + 3u);
  float jitter = h01(slot * 4u + 4u);

  float centre = float(slot) * SLOT + 0.6 + jitter * 1.2;
  // A joint defect has to sit on a joint. The rings are at fract(depth) == 0.5,
  // so the slot's jittered position is snapped to the nearest one instead of
  // landing on plain barrel.
  if (type > 1.5 && type < 2.5) centre = floor(centre) + 0.5;

  float dz = depth - centre;
  float dark = 0.0;
  float light = 0.0;
  float tint = 0.0;

  if (type < 1.0) {
    // Longitudinal crack: a dark gap with a lit lip where the broken edge
    // catches the camera light. The wander keeps it off a ruled line.
    float wander = (fbm(vec2(depth * 5.0, float(slot))) - 0.5) * 0.06;
    float across = turnDist(turn, around + wander);
    float along = smoothstep(1.30, 0.0, abs(dz));
    float gap = smoothstep(0.014, 0.0, across) * along;
    float lip = smoothstep(0.030, 0.014, across) * along;
    dark = gap * 1.15;
    light = lip * 0.42;
    tint = gap * 0.5;
  } else if (type < 2.0) {
    // Roots: ridged noise, domain-warped, so the mass resolves into strands
    // instead of a smudge. Tips catch light, the body blocks it.
    float across = turnDist(turn, around);
    float along = smoothstep(0.95, 0.0, abs(dz));
    vec2 rp = vec2(turn * 30.0, depth * 7.0 + float(slot) * 3.0);
    float fil = fbm(rp + vec2(fbm(rp * 0.6) * 1.6, 0.0));
    float ridge = 1.0 - abs(fil * 2.0 - 1.0);
    float envelope = smoothstep(0.19, 0.0, across) * along;
    float mass = smoothstep(0.52, 0.92, ridge);
    dark = mass * envelope * 1.2;
    light = smoothstep(0.88, 1.0, ridge) * envelope * 0.38;
    tint = mass * envelope * 0.55;
  } else if (type < 3.0) {
    // Displaced joint: half the ring steps out of line, throwing a shadow on
    // one side while the exposed edge opposite catches light.
    float side = step(0.5, fract(turn - around + 1.0));
    float ring = smoothstep(0.075, 0.0, abs(dz));
    float shadow = smoothstep(0.045, 0.0, abs(dz + 0.012));
    dark = ring * (0.35 + 0.85 * side) + shadow * 0.4 * side;
    light = smoothstep(0.022, 0.0, abs(dz - 0.020)) * (1.0 - side) * 0.75;
    tint = ring * 0.45;
  } else if (type < 4.0) {
    // Infiltration: wet concrete reads darker than dry, with glints where the
    // water actually runs.
    float across = turnDist(turn, around);
    float along = smoothstep(0.95, 0.0, abs(dz));
    float wet = fbm(vec2(turn * 14.0, depth * 3.0 + float(slot) * 2.0));
    float streak = smoothstep(0.15, 0.0, across) * along;
    dark = streak * (0.45 + wet * 0.55) * 0.95;
    light = streak * smoothstep(0.62, 0.96, wet) * 0.85;
    tint = streak * 0.4;
  } else {
    // Sediment: a mound in the invert with a defined crest, so it occludes the
    // bottom of the barrel rather than tinting it.
    float fill = 0.085 + severity * 0.016;
    float across = turnDist(turn, 0.75);
    float along = smoothstep(1.25, 0.0, abs(dz));
    float body = smoothstep(fill, fill - 0.022, across) * along;
    float crest = (smoothstep(fill, fill - 0.008, across)
                 - smoothstep(fill - 0.010, fill - 0.020, across)) * along;
    dark = body * 1.0;
    light = max(crest, 0.0) * 0.55;
    tint = body * 0.35;
  }

  return vec4(
    clamp(dark, 0.0, 1.4),
    clamp(light, 0.0, 1.0),
    clamp(tint, 0.0, 1.0),
    severity
  );
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

  // Texture detail has to fade with distance. Depth goes to infinity at the
  // vanishing point, so full-frequency noise there samples faster than the
  // pixel grid and turns the far barrel into radial smear.
  float detail = smoothstep(0.05, 0.42, radius);

  // Concrete, then vertical staining where water has run down the barrel.
  float wall = fbm(vec2(wallUv.x * 30.0, wallUv.y * 4.5));
  wall = 0.30 + wall * 0.44;
  wall += (fbm(vec2(wallUv.x * 88.0, wallUv.y * 12.0)) - 0.5) * 0.30 * detail;
  wall *= 0.88 + 0.12 * fbm(vec2(wallUv.x * 64.0, wallUv.y * 1.1));

  // Segment joints, one per metre of pipe: a recessed groove with a lit lip on
  // the near side. Several rings receding is what sells the depth.
  float segment = fract(depth);
  float toJoint = abs(segment - 0.5);
  float joint = smoothstep(0.045, 0.0, toJoint);
  float jointLip = smoothstep(0.075, 0.045, toJoint);

  // Three slots, not two: the depth windows are wider than the slot spacing,
  // so a defect centred one slot back can still reach this fragment. Checking
  // only the two ahead dropped roughly every second finding. Cost stays flat
  // however far down the pipe the camera has travelled.
  float reach = min(depth, uTravel + 46.0);
  float slotF = floor(reach / SLOT);
  vec4 near = vec4(0.0, 0.0, 0.0, 1.0);
  if (slotF >= 1.0) {
    vec4 a = defectAt(uint(slotF) - 1u, reach, turn);
    vec4 b = defectAt(uint(slotF), reach, turn);
    vec4 c = defectAt(uint(slotF) + 1u, reach, turn);
    near = (a.x + a.z) >= (b.x + b.z) ? a : b;
    near = (c.x + c.z) >= (near.x + near.z) ? c : near;
  } else if (slotF >= 0.0) {
    vec4 b = defectAt(uint(slotF), reach, turn);
    vec4 c = defectAt(uint(slotF) + 1u, reach, turn);
    near = (c.x + c.z) >= (b.x + b.z) ? c : b;
  }

  // Defects are always drawn. Gating them on scroll progress meant nothing was
  // visible at the top of the page, while the brackets and the log still
  // announced findings the image did not show.
  float severity = near.w;

  // Measurement sweep running ahead of the camera. The hero is only about half
  // a screen tall, so scroll progress never climbs far before it leaves the
  // viewport; anything held back for later would simply never be seen.
  float sweep = smoothstep(0.035, 0.0, abs(fract(depth * 0.5 - uTravel * 0.6) - 0.5));

  vec3 navy = vec3(0.027, 0.075, 0.122);
  vec3 teal = vec3(0.294, 0.831, 0.769);
  vec3 amber = vec3(0.941, 0.706, 0.345);
  vec3 alarm = vec3(1.000, 0.404, 0.353);

  // Severity drives the colour: minor readings stay in the accent, moderate
  // turn amber, severe go red. Same scale as the log.
  vec3 defectColor = severity <= 2.0 ? teal : (severity <= 3.0 ? amber : alarm);

  vec3 color = mix(navy, vec3(0.46, 0.53, 0.59), wall);

  // Joints read as a dark groove with a lit lip, not a glowing hoop.
  color *= 1.0 - joint * 0.80;
  color += vec3(0.52, 0.58, 0.63) * jointLip * 0.40;

  // Damage is cut into the surface before any distance shading, so it reads as
  // part of the pipe rather than a wash laid over it.
  color *= 1.0 - min(near.x * 0.88, 0.96);
  color += vec3(0.60, 0.66, 0.72) * near.y;

  color += teal * sweep * 0.07;

  // A camera ring light: bright close to the lens, falling away hard down the
  // barrel. This is what makes it read as a pipe rather than a flat disc.
  float lamp = smoothstep(0.03, 0.62, radius);
  lamp *= 1.0 - 0.42 * smoothstep(0.85, 1.9, radius);
  color *= lamp;
  color += teal * 0.05 * smoothstep(0.35, 1.3, radius);

  // The classification tint is applied after the falloff and keeps a floor, so
  // a finding stays legible well down the barrel. It stays deliberately light:
  // the damage itself should carry the image, not the colour over it.
  color += defectColor * near.z * (0.30 + severity * 0.07)
         * (0.34 + 0.66 * smoothstep(0.02, 0.40, radius));
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
    let centre = slot * SLOT + 0.6 + jitter * 1.2;
    // Mirrors the shader: a joint defect is snapped onto an actual joint ring,
    // otherwise the bracket would sit on plain barrel next to it.
    if (type === 2) centre = Math.floor(centre) + 0.5;
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
