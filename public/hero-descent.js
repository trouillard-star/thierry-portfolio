/**
 * Hero descent — a scroll-driven pass through an inspected pipe.
 *
 * Loaded as a plain module rather than a React component: the static build
 * strips the framework runtime from informational pages, so anything that
 * depends on hydration would never run on the home page.
 *
 * Progressive enhancement. Without WebGL2, or under reduced-motion, the
 * capability map already in the markup stays exactly as it is.
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
uniform float uTravel;   // metres travelled down the pipe
uniform float uPhase;    // 0 at rest, 1 at the end of the hero
uniform vec2 uLook;      // pointer-driven camera offset

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

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 p = (uv - 0.5) * 2.0;
  p.x *= uResolution.x / uResolution.y;
  p -= uLook * 0.14;

  float radius = max(length(p), 0.0015);
  float angle = atan(p.y, p.x);
  float depth = 0.34 / radius + uTravel;
  vec2 wallUv = vec2(angle / 6.28318, depth);

  // Concrete, then vertical staining where water has run down the barrel.
  float wall = fbm(vec2(wallUv.x * 26.0, wallUv.y * 6.0));
  wall = 0.34 + wall * 0.52;
  wall *= 0.86 + 0.14 * fbm(vec2(wallUv.x * 64.0, wallUv.y * 1.1));

  // Segment joints, one per metre of pipe.
  float segment = fract(depth);
  float joint = smoothstep(0.05, 0.0, abs(segment - 0.5));

  // Defects sit on a slower cycle and on one side of the barrel. They fade in
  // during the second half of the descent, once the survey is "reading".
  float defectRun = mod(depth, 3.0);
  float defectDepth = smoothstep(0.14, 0.0, abs(defectRun - 1.7));
  float defectArc = smoothstep(0.12, 0.0, abs(fract(wallUv.x + 0.25) - 0.5));
  float defect = defectDepth * defectArc * smoothstep(0.35, 0.75, uPhase);

  // Measurement sweep running ahead of the camera, introduced mid-descent.
  float sweep = smoothstep(0.035, 0.0, abs(fract(depth * 0.5 - uTravel * 0.6) - 0.5));
  sweep *= smoothstep(0.12, 0.45, uPhase);

  vec3 navy = vec3(0.027, 0.075, 0.122);
  vec3 teal = vec3(0.294, 0.831, 0.769);
  vec3 amber = vec3(0.941, 0.706, 0.345);

  vec3 color = mix(navy, vec3(0.40, 0.48, 0.55), wall);
  color = mix(color, navy * 0.45, joint * 0.72);
  color += teal * joint * 0.34;
  color += amber * defect * 1.25;
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

  let running = false;
  let frame = 0;
  let startedAt = 0;
  let lastMarker = -1;
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

    if (distanceOut) distanceOut.textContent = (travel * 3.0).toFixed(1);
    const marker = Math.floor(travel / 3.0);
    if (marker !== lastMarker && travel > 1.0) {
      lastMarker = marker;
      defectCount += 1;
      if (defectsOut) defectsOut.textContent = String(defectCount);
    }

    frame = requestAnimationFrame(draw);
  }

  function renderStillFrame() {
    gl.uniform2f(uResolution, canvas.width, canvas.height);
    gl.uniform1f(uTravel, 4.0);
    gl.uniform1f(uPhase, 0.5);
    gl.uniform2f(uLook, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
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
