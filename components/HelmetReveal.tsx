'use client';

// Lando Norris-style: face + depth parallax + fluid brush reveals skeleton
// Contour lines background with dark/light mode

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ─── Shared Vertex Shader (fullscreen quad) ──────────────────────────────────

const baseVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// ─── Perspective Vertex Shader (for the face plane) ──────────────────────────

const perspVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// ─── Fluid Simulation Shaders ───────────────────────────────────────────────

const splatFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform vec2 point;
  uniform float radius;
  void main() {
    vec2 p = vUv - point;
    p.x *= aspectRatio;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`;

const advectionFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform float dt;
  uniform float dissipation;
  void main() {
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    vec4 result = dissipation * texture2D(uSource, coord);
    gl_FragColor = result;
  }
`;

const curlFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform vec2 texelSize;
  void main() {
    float L = texture2D(uVelocity, vUv - vec2(texelSize.x, 0.0)).y;
    float R = texture2D(uVelocity, vUv + vec2(texelSize.x, 0.0)).y;
    float T = texture2D(uVelocity, vUv + vec2(0.0, texelSize.y)).x;
    float B = texture2D(uVelocity, vUv - vec2(0.0, texelSize.y)).x;
    float vorticity = R - L - T + B;
    gl_FragColor = vec4(vorticity, 0.0, 0.0, 1.0);
  }
`;

const vorticityFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform vec2 texelSize;
  uniform float curl;
  uniform float dt;
  void main() {
    float L = texture2D(uCurl, vUv - vec2(texelSize.x, 0.0)).x;
    float R = texture2D(uCurl, vUv + vec2(texelSize.x, 0.0)).x;
    float T = texture2D(uCurl, vUv + vec2(0.0, texelSize.y)).x;
    float B = texture2D(uCurl, vUv - vec2(0.0, texelSize.y)).x;
    float C = texture2D(uCurl, vUv).x;
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= curl * C;
    force.y *= -1.0;
    vec2 vel = texture2D(uVelocity, vUv).xy;
    vel += force * dt;
    gl_FragColor = vec4(vel, 0.0, 1.0);
  }
`;

const divergenceFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform vec2 texelSize;
  void main() {
    float L = texture2D(uVelocity, vUv - vec2(texelSize.x, 0.0)).x;
    float R = texture2D(uVelocity, vUv + vec2(texelSize.x, 0.0)).x;
    float T = texture2D(uVelocity, vUv + vec2(0.0, texelSize.y)).y;
    float B = texture2D(uVelocity, vUv - vec2(0.0, texelSize.y)).y;
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

const pressureFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  uniform vec2 texelSize;
  void main() {
    float L = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x;
    float R = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
    float T = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x;
    float B = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x;
    float div = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - div) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`;

const gradientSubtractFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  uniform vec2 texelSize;
  void main() {
    float L = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x;
    float R = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
    float T = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x;
    float B = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x;
    vec2 vel = texture2D(uVelocity, vUv).xy;
    vel -= vec2(R - L, T - B) * 0.5;
    gl_FragColor = vec4(vel, 0.0, 1.0);
  }
`;

// ─── Composite Shader (face + skeleton + fluid mask) ─────────────────────────

const compositeFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform sampler2D uFaceTexture;
  uniform sampler2D uFaceDepth;
  uniform sampler2D uSkelTexture;
  uniform sampler2D uSkelDepth;
  uniform sampler2D uFluidMask;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform float uTime;

  vec2 uvFauxDepth(vec2 uv, sampler2D depthMap, vec2 mouse, float strength) {
    float depth = texture2D(depthMap, uv).r;
    vec2 offset = mouse * depth * strength;
    return clamp(uv + offset, 0.0, 1.0);
  }

  // Sobel edge detection on FACE for wireframe effect
  float faceEdge(vec2 uv, vec2 texel) {
    float tl = dot(texture2D(uFaceTexture, uv + vec2(-texel.x, texel.y)).rgb, vec3(0.299, 0.587, 0.114));
    float t  = dot(texture2D(uFaceTexture, uv + vec2(0.0, texel.y)).rgb, vec3(0.299, 0.587, 0.114));
    float tr = dot(texture2D(uFaceTexture, uv + vec2(texel.x, texel.y)).rgb, vec3(0.299, 0.587, 0.114));
    float l  = dot(texture2D(uFaceTexture, uv + vec2(-texel.x, 0.0)).rgb, vec3(0.299, 0.587, 0.114));
    float r  = dot(texture2D(uFaceTexture, uv + vec2(texel.x, 0.0)).rgb, vec3(0.299, 0.587, 0.114));
    float bl = dot(texture2D(uFaceTexture, uv + vec2(-texel.x, -texel.y)).rgb, vec3(0.299, 0.587, 0.114));
    float b  = dot(texture2D(uFaceTexture, uv + vec2(0.0, -texel.y)).rgb, vec3(0.299, 0.587, 0.114));
    float br = dot(texture2D(uFaceTexture, uv + vec2(texel.x, -texel.y)).rgb, vec3(0.299, 0.587, 0.114));

    float gx = -tl - 2.0*l - bl + tr + 2.0*r + br;
    float gy = -tl - 2.0*t - tr + bl + 2.0*b + br;
    return sqrt(gx*gx + gy*gy);
  }

  void main() {
    vec2 uv = vUv;
    vec2 texel = vec2(1.0 / 1215.0, 1.0 / 1620.0);

    // Face with depth parallax
    vec2 faceUV = uvFauxDepth(uv, uFaceDepth, uMouse * 0.03, 1.0);
    vec4 face = texture2D(uFaceTexture, faceUV);

    // Skeleton with depth parallax (gentler)
    vec2 skelUV = uvFauxDepth(uv, uSkelDepth, uMouse * 0.015, 0.6);
    vec4 skeleton = texture2D(uSkelTexture, skelUV);

    // Wireframe overlay — edge detection on FACE with thin light slit pulse
    float edge = faceEdge(faceUV, texel * 2.0);
    edge = smoothstep(0.05, 0.3, edge);

    // Bright slit of light sweeps top→bottom, ~3.5 sec cycle
    float scanY = 1.0 - fract(uTime * 0.285);
    // Bright core — wider and punchy
    float core = exp(-pow((uv.y - scanY) * 30.0, 2.0));
    // Larger trailing glow behind the slit
    float trail = smoothstep(scanY + 0.25, scanY, uv.y) * smoothstep(scanY - 0.02, scanY, uv.y);
    float slit = core * 0.8 + trail * 0.25;
    vec3 wireColor = vec3(0.65, 0.65, 0.72);

    // Fluid mask — sample in SCREEN space (gl_FragCoord), not plane UV
    vec2 screenUV = gl_FragCoord.xy / uResolution;
    float mask = texture2D(uFluidMask, screenUV).r;
    mask = smoothstep(0.0, 0.6, mask);

    // Reveal skeleton where painted, face shows through skeleton transparency
    vec4 color = mix(face, skeleton, mask * skeleton.a);

    // Add thin light slit wireframe on top (face edges)
    color.rgb = mix(color.rgb, wireColor, edge * slit * face.a);

    gl_FragColor = color;
  }
`;

// ─── Contour Background Shader ──────────────────────────────────────────────

const contourFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;
  uniform vec3 uBgColor;
  uniform vec3 uLineColor;
  uniform vec3 uInkBg;
  uniform vec3 uInkLine;
  uniform sampler2D uFluidMask;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 10.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m * m * m;
    vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x_) - 0.5;
    vec3 ox = floor(x_ + 0.5);
    vec3 a0 = x_ - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    uv.x *= uAspect;
    float t = uTime * 0.06;
    float n = snoise(uv * 1.5 + vec2(t, t * 0.7))
            + snoise(uv * 3.0 + vec2(-t * 0.5, t * 0.3)) * 0.5
            + snoise(uv * 5.0 + vec2(t * 0.3, -t * 0.6)) * 0.25;
    float contourSpacing = 0.18;
    float contour = abs(fract(n / contourSpacing) - 0.5) * 2.0;
    float fw = fwidth(n / contourSpacing);
    float line = 1.0 - smoothstep(fw * 0.5, fw * 1.5, contour);
    // Normal contour colors
    vec3 normalColor = mix(uBgColor, uLineColor, line * 0.6);

    // Inked contour colors — driven by uniforms (dark in light mode, white in dark mode)
    vec3 inkedColor = mix(uInkBg, uInkLine, line * 0.8);

    // Blend based on fluid brush
    float ink = texture2D(uFluidMask, vUv).r;
    ink = smoothstep(0.0, 0.5, ink);
    vec3 color = mix(normalColor, inkedColor, ink);

    gl_FragColor = vec4(color, 1.0);
  }
`;

// ─── Component ──────────────────────────────────────────────────────────────

const HelmetReveal = ({ dark = false }: { dark?: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contourMatRef = useRef<THREE.ShaderMaterial | null>(null);

  // Smoothly lerp contour colors on dark/light toggle
  useEffect(() => {
    const mat = contourMatRef.current;
    if (!mat) return;
    const lightBg = new THREE.Vector3(0.941, 0.929, 0.902);
    const lightLine = new THREE.Vector3(0.78, 0.76, 0.73);
    const darkBg = new THREE.Vector3(0.11, 0.122, 0.149);
    const darkLine = new THREE.Vector3(0.22, 0.24, 0.28);
    // Ink colors: dark mode → white brush, light mode → dark brush
    const lightInkBg = new THREE.Vector3(0.03, 0.03, 0.05);
    const lightInkLine = new THREE.Vector3(0.1, 0.1, 0.14);
    const darkInkBg = new THREE.Vector3(0.92, 0.91, 0.88);
    const darkInkLine = new THREE.Vector3(0.98, 0.97, 0.95);
    const targetBg = dark ? darkBg : lightBg;
    const targetLine = dark ? darkLine : lightLine;
    const targetInkBg = dark ? darkInkBg : lightInkBg;
    const targetInkLine = dark ? darkInkLine : lightInkLine;
    let raf = 0;
    const lerp = () => {
      const bg = mat.uniforms.uBgColor.value as THREE.Vector3;
      const ln = mat.uniforms.uLineColor.value as THREE.Vector3;
      const iBg = mat.uniforms.uInkBg.value as THREE.Vector3;
      const iLn = mat.uniforms.uInkLine.value as THREE.Vector3;
      bg.lerp(targetBg, 0.06);
      ln.lerp(targetLine, 0.06);
      iBg.lerp(targetInkBg, 0.06);
      iLn.lerp(targetInkLine, 0.06);
      if (bg.distanceTo(targetBg) > 0.001) raf = requestAnimationFrame(lerp);
    };
    raf = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(raf);
  }, [dark]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cw = container.clientWidth;
    let ch = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(cw, ch);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ── Mouse tracking ──────────────────────────────────────────────────────
    const mousePos = { x: 0, y: 0 };
    const prevMousePos = { x: 0, y: 0 };
    const smoothMouse = new THREE.Vector2(0, 0);
    let hasMoved = false;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      prevMousePos.x = mousePos.x;
      prevMousePos.y = mousePos.y;
      mousePos.x = (e.clientX - rect.left) / cw;
      mousePos.y = 1.0 - (e.clientY - rect.top) / ch;
      hasMoved = true;
    };
    container.addEventListener('pointermove', onPointerMove);

    // ── Fluid Simulation Setup ──────────────────────────────────────────────
    const SIM_RES = 512;
    const DYE_RES = 1024;

    const fboOpts: THREE.RenderTargetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
    };

    function createDoubleFBO(w: number, h: number) {
      return {
        read: new THREE.WebGLRenderTarget(w, h, fboOpts),
        write: new THREE.WebGLRenderTarget(w, h, fboOpts),
        swap() { const t = this.read; this.read = this.write; this.write = t; },
      };
    }

    const velocity = createDoubleFBO(SIM_RES, SIM_RES);
    const pressure = createDoubleFBO(SIM_RES, SIM_RES);
    const divergenceFBO = new THREE.WebGLRenderTarget(SIM_RES, SIM_RES, fboOpts);
    const curlFBO = new THREE.WebGLRenderTarget(SIM_RES, SIM_RES, fboOpts);
    const dye = createDoubleFBO(DYE_RES, DYE_RES);

    // Fullscreen quad for sim passes
    const simScene = new THREE.Scene();
    const simCam = new THREE.Camera();
    const simQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    simScene.add(simQuad);

    const simTexel = new THREE.Vector2(1 / SIM_RES, 1 / SIM_RES);
    const dyeTexel = new THREE.Vector2(1 / DYE_RES, 1 / DYE_RES);

    // Fluid shader materials
    const splatMat = new THREE.ShaderMaterial({
      vertexShader: baseVert, fragmentShader: splatFrag,
      uniforms: {
        uTarget: { value: null },
        aspectRatio: { value: cw / ch },
        color: { value: new THREE.Vector3() },
        point: { value: new THREE.Vector2() },
        radius: { value: 0.0003 },
      },
    });

    const advectionMat = new THREE.ShaderMaterial({
      vertexShader: baseVert, fragmentShader: advectionFrag,
      uniforms: {
        uVelocity: { value: null },
        uSource: { value: null },
        texelSize: { value: simTexel },
        dt: { value: 0.016 },
        dissipation: { value: 0.98 },
      },
    });

    const curlMat = new THREE.ShaderMaterial({
      vertexShader: baseVert, fragmentShader: curlFrag,
      uniforms: { uVelocity: { value: null }, texelSize: { value: simTexel } },
    });

    const vorticityMat = new THREE.ShaderMaterial({
      vertexShader: baseVert, fragmentShader: vorticityFrag,
      uniforms: {
        uVelocity: { value: null },
        uCurl: { value: null },
        texelSize: { value: simTexel },
        curl: { value: 25 },
        dt: { value: 0.016 },
      },
    });

    const divergenceMat = new THREE.ShaderMaterial({
      vertexShader: baseVert, fragmentShader: divergenceFrag,
      uniforms: { uVelocity: { value: null }, texelSize: { value: simTexel } },
    });

    const pressureMat = new THREE.ShaderMaterial({
      vertexShader: baseVert, fragmentShader: pressureFrag,
      uniforms: {
        uPressure: { value: null },
        uDivergence: { value: null },
        texelSize: { value: simTexel },
      },
    });

    const gradSubMat = new THREE.ShaderMaterial({
      vertexShader: baseVert, fragmentShader: gradientSubtractFrag,
      uniforms: {
        uPressure: { value: null },
        uVelocity: { value: null },
        texelSize: { value: simTexel },
      },
    });

    // Helper: render a sim pass
    function blit(mat: THREE.ShaderMaterial, target: THREE.WebGLRenderTarget) {
      simQuad.material = mat;
      renderer.setRenderTarget(target);
      renderer.render(simScene, simCam);
    }

    function splatSingle(x: number, y: number, dx: number, dy: number) {
      // Splat velocity
      splatMat.uniforms.uTarget.value = velocity.read.texture;
      splatMat.uniforms.point.value.set(x, y);
      splatMat.uniforms.color.value.set(dx * 10000, dy * 10000, 0);
      splatMat.uniforms.radius.value = 0.002;
      blit(splatMat, velocity.write);
      velocity.swap();

      // Splat dye — lower intensity so gradients are visible
      splatMat.uniforms.uTarget.value = dye.read.texture;
      splatMat.uniforms.color.value.set(0.35, 0.35, 0.35);
      splatMat.uniforms.radius.value = 0.004;
      blit(splatMat, dye.write);
      dye.swap();
    }

    // Interpolate splats along mouse path for smooth fluid strokes
    function splatAt(x: number, y: number, dx: number, dy: number) {
      const dist = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(1, Math.floor(dist * 80));
      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        const px = x - dx * (1 - t);
        const py = y - dy * (1 - t);
        splatSingle(px, py, dx, dy);
      }
    }

    function fluidStep() {
      // Curl
      curlMat.uniforms.uVelocity.value = velocity.read.texture;
      blit(curlMat, curlFBO);

      // Vorticity
      vorticityMat.uniforms.uVelocity.value = velocity.read.texture;
      vorticityMat.uniforms.uCurl.value = curlFBO.texture;
      blit(vorticityMat, velocity.write);
      velocity.swap();

      // Divergence
      divergenceMat.uniforms.uVelocity.value = velocity.read.texture;
      blit(divergenceMat, divergenceFBO);

      // Pressure solve (Jacobi iterations)
      pressureMat.uniforms.uDivergence.value = divergenceFBO.texture;
      for (let i = 0; i < 32; i++) {
        pressureMat.uniforms.uPressure.value = pressure.read.texture;
        blit(pressureMat, pressure.write);
        pressure.swap();
      }

      // Gradient subtract
      gradSubMat.uniforms.uPressure.value = pressure.read.texture;
      gradSubMat.uniforms.uVelocity.value = velocity.read.texture;
      blit(gradSubMat, velocity.write);
      velocity.swap();

      // Advect velocity
      advectionMat.uniforms.uVelocity.value = velocity.read.texture;
      advectionMat.uniforms.uSource.value = velocity.read.texture;
      advectionMat.uniforms.texelSize.value = simTexel;
      advectionMat.uniforms.dissipation.value = 0.92;
      blit(advectionMat, velocity.write);
      velocity.swap();

      // Advect dye — MUST use simTexel (velocity is at sim resolution)
      advectionMat.uniforms.uVelocity.value = velocity.read.texture;
      advectionMat.uniforms.uSource.value = dye.read.texture;
      advectionMat.uniforms.texelSize.value = simTexel;
      advectionMat.uniforms.dissipation.value = 0.97;
      blit(advectionMat, dye.write);
      dye.swap();
    }

    // ── Load textures ────────────────────────────────────────────────────────
    const texLoader = new THREE.TextureLoader();
    const faceTex = texLoader.load('/models/face.png');
    const faceDepthTex = texLoader.load('/models/face-depth.png');
    const skelTex = texLoader.load('/models/skeleton.png');
    const skelDepthTex = texLoader.load('/models/skeleton-depth.png');
    faceTex.colorSpace = THREE.SRGBColorSpace;
    skelTex.colorSpace = THREE.SRGBColorSpace;

    // ── Main composite plane ─────────────────────────────────────────────────
    const mainScene = new THREE.Scene();
    const mainCam = new THREE.PerspectiveCamera(45, cw / ch, 0.1, 100);
    mainCam.position.z = 5;

    const imgAspect = 1215 / 1620;
    const fovRad = (mainCam.fov * Math.PI) / 180;
    const planeH = 2 * Math.tan(fovRad / 2) * mainCam.position.z;
    const planeW = planeH * imgAspect;

    const compositeMat = new THREE.ShaderMaterial({
      vertexShader: perspVert,
      fragmentShader: compositeFrag,
      uniforms: {
        uFaceTexture: { value: faceTex },
        uFaceDepth: { value: faceDepthTex },
        uSkelTexture: { value: skelTex },
        uSkelDepth: { value: skelDepthTex },
        uFluidMask: { value: dye.read.texture },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uResolution: { value: new THREE.Vector2(cw, ch) },
        uTime: { value: 0 },
      },
      transparent: true,
    });

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(planeW, planeH, 64, 64),
      compositeMat,
    );
    plane.position.y = -planeH * 0.2;
    mainScene.add(plane);

    // ── Contour background ───────────────────────────────────────────────────
    const contourMat = new THREE.ShaderMaterial({
      depthWrite: false,
      depthTest: false,
      vertexShader: baseVert,
      fragmentShader: contourFrag,
      uniforms: {
        uTime: { value: 0 },
        uAspect: { value: cw / ch },
        uBgColor: { value: new THREE.Vector3(0.11, 0.122, 0.149) },
        uLineColor: { value: new THREE.Vector3(0.22, 0.24, 0.28) },
        uInkBg: { value: new THREE.Vector3(0.92, 0.91, 0.88) },
        uInkLine: { value: new THREE.Vector3(0.98, 0.97, 0.95) },
        uFluidMask: { value: dye.read.texture },
      },
    });
    contourMatRef.current = contourMat;
    const bgScene = new THREE.Scene();
    bgScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), contourMat));
    const bgCam = new THREE.Camera();

    // ── Auto brush strokes state ──────────────────────────────────────────────
    let autoTimer = 0;
    const AUTO_INTERVAL = 5.0;

    // Stroke definitions: 3 per set — face, neck, chest
    // y coords: face ~0.40-0.48, neck ~0.28-0.33, chest ~0.15-0.22
    interface Stroke { x: number; y: number; angle: number; delay: number; len: number; }
    const strokeSets: Stroke[][] = [
      [
        { x: 0.44, y: 0.44, angle: -0.5, delay: 0.0, len: 7 },  // face — left cheek diagonal
        { x: 0.52, y: 0.30, angle:  0.7, delay: 0.15, len: 6 },  // neck — angled right
        { x: 0.46, y: 0.18, angle: -0.3, delay: 0.30, len: 8 },  // chest — shallow slash
      ],
      [
        { x: 0.55, y: 0.42, angle:  0.9, delay: 0.0, len: 6 },   // face — right cheek steep
        { x: 0.48, y: 0.32, angle: -0.6, delay: 0.14, len: 7 },  // neck — angled left
        { x: 0.53, y: 0.20, angle:  0.4, delay: 0.28, len: 6 },  // chest — angled right
      ],
      [
        { x: 0.48, y: 0.46, angle: -0.8, delay: 0.0, len: 7 },   // face — forehead slash
        { x: 0.50, y: 0.28, angle:  0.2, delay: 0.12, len: 6 },  // neck — near horizontal
        { x: 0.44, y: 0.16, angle: -1.0, delay: 0.26, len: 7 },  // chest — steep diagonal
      ],
    ];
    let currentStrokeSet = 0;
    let burstActive = false;
    let burstTime = 0;

    // ── Animation loop ───────────────────────────────────────────────────────
    let disposed = false;
    let animId = 0;
    let prevTime = performance.now() / 1000;

    function animate() {
      if (disposed) return;
      animId = requestAnimationFrame(animate);
      const now = performance.now() / 1000;
      const delta = Math.min(now - prevTime, 0.1); // cap delta to avoid huge jumps
      prevTime = now;
      const t = now;

      // Smooth mouse for parallax (normalized -1 to 1)
      const mx = mousePos.x * 2 - 1;
      const my = mousePos.y * 2 - 1;
      smoothMouse.x += (mx - smoothMouse.x) * 0.08;
      smoothMouse.y += (my - smoothMouse.y) * 0.08;

      // Splat fluid where cursor moves
      if (hasMoved) {
        const dx = mousePos.x - prevMousePos.x;
        const dy = mousePos.y - prevMousePos.y;
        if (Math.abs(dx) > 0.0001 || Math.abs(dy) > 0.0001) {
          splatAt(mousePos.x, mousePos.y, dx, dy);
        }
        hasMoved = false;
      }

      // Auto brush strokes — fire individual angled strokes every AUTO_INTERVAL
      autoTimer += delta;
      if (autoTimer >= AUTO_INTERVAL && !burstActive) {
        burstActive = true;
        burstTime = 0;
        currentStrokeSet = (currentStrokeSet + 1) % strokeSets.length;
      }
      if (burstActive) {
        burstTime += delta;
        const strokes = strokeSets[currentStrokeSet];
        let allDone = true;
        for (const stroke of strokes) {
          // Each stroke fires at its delay and runs for a short duration
          const strokeStart = stroke.delay;
          const strokeEnd = stroke.delay + 0.12;
          if (burstTime >= strokeStart && burstTime < strokeEnd) {
            allDone = false;
            // Progress along this stroke (0→1)
            const sp = (burstTime - strokeStart) / 0.12;
            const cos = Math.cos(stroke.angle);
            const sin = Math.sin(stroke.angle);
            // Walk along the stroke direction
            const stepLen = 0.015;
            const px = stroke.x + cos * stepLen * sp * stroke.len;
            const py = stroke.y + sin * stepLen * sp * stroke.len;
            const vx = cos * 0.006;
            const vy = sin * 0.006;
            splatSingle(px, py, vx, vy);
          } else if (burstTime < strokeEnd) {
            allDone = false;
          }
        }
        if (allDone) {
          burstActive = false;
          autoTimer = 0;
        }
      }

      // Run fluid simulation
      fluidStep();

      // Update uniforms
      compositeMat.uniforms.uFluidMask.value = dye.read.texture;
      compositeMat.uniforms.uMouse.value.set(smoothMouse.x, smoothMouse.y);
      compositeMat.uniforms.uTime.value = t;
      contourMat.uniforms.uTime.value = t;
      contourMat.uniforms.uFluidMask.value = dye.read.texture;

      // Render: contour bg → composite face/skeleton on top
      renderer.setRenderTarget(null);
      renderer.autoClear = true;
      renderer.render(bgScene, bgCam);
      renderer.autoClear = false;
      renderer.render(mainScene, mainCam);
      renderer.autoClear = true;
    }
    animate();

    // ── Resize ───────────────────────────────────────────────────────────────
    const handleResize = () => {
      cw = container.clientWidth;
      ch = container.clientHeight;
      mainCam.aspect = cw / ch;
      mainCam.updateProjectionMatrix();
      renderer.setSize(cw, ch);
      contourMat.uniforms.uAspect.value = cw / ch;
      splatMat.uniforms.aspectRatio.value = cw / ch;
      compositeMat.uniforms.uResolution.value.set(cw, ch);

      const newH = 2 * Math.tan(fovRad / 2) * mainCam.position.z;
      const newW = newH * imgAspect;
      plane.geometry.dispose();
      plane.geometry = new THREE.PlaneGeometry(newW, newH, 64, 64);
      plane.position.y = -newH * 0.2;
    };
    window.addEventListener('resize', handleResize);

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', onPointerMove);

      // Dispose FBOs
      velocity.read.dispose(); velocity.write.dispose();
      pressure.read.dispose(); pressure.write.dispose();
      dye.read.dispose(); dye.write.dispose();
      divergenceFBO.dispose(); curlFBO.dispose();

      // Dispose materials
      splatMat.dispose(); advectionMat.dispose(); curlMat.dispose();
      vorticityMat.dispose(); divergenceMat.dispose(); pressureMat.dispose();
      gradSubMat.dispose(); compositeMat.dispose(); contourMat.dispose();

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0"
      style={{ pointerEvents: 'auto' }}
    />
  );
};

export default HelmetReveal;
