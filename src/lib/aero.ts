// Procedural Frutiger Aero wallpaper generator.
// Every piece is a deterministic, seeded SVG rendered at 1600x1000
// so it can be exported as a crisp PNG in the browser.

export type AeroStyle =
  | "bubbles"
  | "aqua-wave"
  | "meadow"
  | "glass-orb"
  | "ribbon"
  | "grid-horizon";

export interface AeroPiece {
  id: number;
  slug: string;
  title: string;
  style: AeroStyle;
  palette: string;
  seed: number;
}

export const STYLE_LABELS: Record<AeroStyle, string> = {
  bubbles: "Bubblestream",
  "aqua-wave": "Aqua Wave",
  meadow: "Meadow Sky",
  "glass-orb": "Glass Orb",
  ribbon: "Silk Ribbon",
  "grid-horizon": "Grid Horizon",
};

interface Palette {
  name: string;
  sky: [string, string, string];
  accent: string;
  glow: string;
  deep: string;
}

const PALETTES: Palette[] = [
  {
    name: "Aqua Vista",
    sky: ["#bff6ff", "#4fc3f7", "#0a63c9"],
    accent: "#8affd8",
    glow: "#ffffff",
    deep: "#053a7a",
  },
  {
    name: "Fresh Meadow",
    sky: ["#d9ffe0", "#5ede9b", "#0f8fd8"],
    accent: "#c8ff5e",
    glow: "#f4ffe8",
    deep: "#0b5f45",
  },
  {
    name: "Sunbeam Lagoon",
    sky: ["#fff6cf", "#7fe3ff", "#1c7fe0"],
    accent: "#ffd166",
    glow: "#ffffff",
    deep: "#0a4f8f",
  },
  {
    name: "Bubblegum Tech",
    sky: ["#ffe3f6", "#8ad7ff", "#4a4be0"],
    accent: "#ff8ad0",
    glow: "#fff4fb",
    deep: "#3a1f7a",
  },
  {
    name: "Deep Dive",
    sky: ["#9df3ff", "#1aa5e0", "#032b63"],
    accent: "#59ffe0",
    glow: "#e8fdff",
    deep: "#01152f",
  },
  {
    name: "Citrus Glass",
    sky: ["#fffbd6", "#a8f06a", "#12b0a0"],
    accent: "#ffb020",
    glow: "#ffffff",
    deep: "#0d6b56",
  },
  {
    name: "Frost Chrome",
    sky: ["#ffffff", "#cfe6f7", "#6f8fb5"],
    accent: "#7fd7ff",
    glow: "#ffffff",
    deep: "#2c4a67",
  },
  {
    name: "Sunset Vista",
    sky: ["#ffe9c9", "#ff9fb0", "#6a4bd0"],
    accent: "#ffc48a",
    glow: "#fff3e6",
    deep: "#3b1e63",
  },
];

const STYLES: AeroStyle[] = [
  "bubbles",
  "aqua-wave",
  "meadow",
  "glass-orb",
  "ribbon",
  "grid-horizon",
];

const NAMES_A = [
  "Hydro",
  "Lumen",
  "Vista",
  "Bloom",
  "Nimbus",
  "Crystal",
  "Pulse",
  "Aero",
  "Prism",
  "Drift",
  "Zephyr",
  "Glide",
  "Cascade",
  "Halo",
  "Echo",
];
const NAMES_B = [
  "Bubble",
  "Meadow",
  "Chrome",
  "Lagoon",
  "Signal",
  "Garden",
  "Surface",
  "Horizon",
  "Ripple",
  "Beacon",
  "Field",
  "Stream",
];

function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const WIDTH = 1600;
export const HEIGHT = 1000;

export const PIECES: AeroPiece[] = Array.from({ length: 120 }, (_, i) => {
  const seed = 1337 + i * 7919;
  const rnd = mulberry(seed);
  const style = STYLES[i % STYLES.length];
  const palette = PALETTES[Math.floor(rnd() * PALETTES.length)];
  const title = `${NAMES_A[Math.floor(rnd() * NAMES_A.length)]} ${
    NAMES_B[Math.floor(rnd() * NAMES_B.length)]
  } ${String(i + 1).padStart(3, "0")}`;
  return {
    id: i + 1,
    slug: `aero-${String(i + 1).padStart(3, "0")}`,
    title,
    style,
    palette: palette.name,
    seed,
  };
});

function paletteFor(seed: number): Palette {
  const rnd = mulberry(seed);
  rnd();
  return PALETTES[Math.floor(rnd() * PALETTES.length)];
}

function bubble(
  cx: number,
  cy: number,
  r: number,
  hue: string,
  glow: string,
  opacity: number,
): string {
  return `
  <g opacity="${opacity.toFixed(2)}">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${hue}" opacity="0.35"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${glow}" stroke-opacity="0.85" stroke-width="${(r * 0.06).toFixed(1)}"/>
    <ellipse cx="${(cx - r * 0.3).toFixed(1)}" cy="${(cy - r * 0.42).toFixed(1)}" rx="${(r * 0.42).toFixed(1)}" ry="${(r * 0.3).toFixed(1)}" fill="${glow}" opacity="0.75" transform="rotate(-25 ${cx} ${cy})"/>
    <ellipse cx="${(cx + r * 0.28).toFixed(1)}" cy="${(cy + r * 0.45).toFixed(1)}" rx="${(r * 0.3).toFixed(1)}" ry="${(r * 0.16).toFixed(1)}" fill="${glow}" opacity="0.35"/>
  </g>`;
}

/** Returns a standalone SVG document string for a piece. */
export function renderAeroSVG(piece: AeroPiece): string {
  const p = paletteFor(piece.seed);
  const rnd = mulberry(piece.seed + 99);
  const W = WIDTH;
  const H = HEIGHT;
  const defs: string[] = [];
  const body: string[] = [];
  const uid = piece.slug;

  defs.push(`
  <linearGradient id="sky-${uid}" x1="0" y1="0" x2="0.35" y2="1">
    <stop offset="0%" stop-color="${p.sky[0]}"/>
    <stop offset="48%" stop-color="${p.sky[1]}"/>
    <stop offset="100%" stop-color="${p.sky[2]}"/>
  </linearGradient>
  <radialGradient id="sun-${uid}" cx="0.22" cy="0.16" r="0.7">
    <stop offset="0%" stop-color="${p.glow}" stop-opacity="0.95"/>
    <stop offset="55%" stop-color="${p.glow}" stop-opacity="0.12"/>
    <stop offset="100%" stop-color="${p.glow}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="gloss-${uid}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85"/>
    <stop offset="55%" stop-color="#ffffff" stop-opacity="0.12"/>
    <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
  </linearGradient>
  <filter id="blur-${uid}" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation="26"/>
  </filter>
  <filter id="soft-${uid}" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation="7"/>
  </filter>`);

  body.push(`<rect width="${W}" height="${H}" fill="url(#sky-${uid})"/>`);
  body.push(`<rect width="${W}" height="${H}" fill="url(#sun-${uid})"/>`);

  // soft light blobs everywhere
  for (let i = 0; i < 5; i++) {
    body.push(
      `<ellipse cx="${(rnd() * W).toFixed(0)}" cy="${(rnd() * H).toFixed(0)}" rx="${(180 + rnd() * 320).toFixed(0)}" ry="${(120 + rnd() * 220).toFixed(0)}" fill="${p.accent}" opacity="${(0.08 + rnd() * 0.14).toFixed(2)}" filter="url(#blur-${uid})"/>`,
    );
  }

  if (piece.style === "aqua-wave" || piece.style === "ribbon") {
    const bands = piece.style === "ribbon" ? 7 : 5;
    for (let i = 0; i < bands; i++) {
      const y = H * (0.25 + 0.11 * i) + rnd() * 60;
      const amp = 70 + rnd() * 130;
      const th = 60 + rnd() * 140;
      const c = i % 2 === 0 ? p.accent : p.glow;
      body.push(`
      <path d="M -100 ${y.toFixed(0)}
        C ${(W * 0.25).toFixed(0)} ${(y - amp).toFixed(0)}, ${(W * 0.55).toFixed(0)} ${(y + amp).toFixed(0)}, ${(W + 100).toFixed(0)} ${(y - amp * 0.4).toFixed(0)}
        L ${(W + 100).toFixed(0)} ${(y - amp * 0.4 + th).toFixed(0)}
        C ${(W * 0.55).toFixed(0)} ${(y + amp + th).toFixed(0)}, ${(W * 0.25).toFixed(0)} ${(y - amp + th).toFixed(0)}, -100 ${(y + th).toFixed(0)} Z"
        fill="${c}" opacity="${(0.18 + rnd() * 0.3).toFixed(2)}" filter="url(#soft-${uid})"/>`);
    }
  }

  if (piece.style === "meadow") {
    const hy = H * (0.6 + rnd() * 0.12);
    body.push(
      `<path d="M 0 ${hy.toFixed(0)} C ${(W * 0.3).toFixed(0)} ${(hy - 90).toFixed(0)}, ${(W * 0.7).toFixed(0)} ${(hy + 70).toFixed(0)}, ${W} ${(hy - 40).toFixed(0)} L ${W} ${H} L 0 ${H} Z" fill="${p.deep}" opacity="0.75"/>`,
    );
    body.push(
      `<path d="M 0 ${(hy + 70).toFixed(0)} C ${(W * 0.35).toFixed(0)} ${(hy - 10).toFixed(0)}, ${(W * 0.65).toFixed(0)} ${(hy + 160).toFixed(0)}, ${W} ${(hy + 60).toFixed(0)} L ${W} ${H} L 0 ${H} Z" fill="${p.accent}" opacity="0.55"/>`,
    );
    for (let i = 0; i < 40; i++) {
      const x = rnd() * W;
      const y = hy + rnd() * (H - hy);
      const h = 30 + rnd() * 110;
      body.push(
        `<path d="M ${x.toFixed(0)} ${(y + h).toFixed(0)} Q ${(x + (rnd() - 0.5) * 60).toFixed(0)} ${(y + h / 2).toFixed(0)}, ${(x + (rnd() - 0.5) * 90).toFixed(0)} ${y.toFixed(0)}" stroke="${p.glow}" stroke-opacity="${(0.15 + rnd() * 0.4).toFixed(2)}" stroke-width="${(2 + rnd() * 5).toFixed(1)}" fill="none" stroke-linecap="round"/>`,
      );
    }
  }

  if (piece.style === "grid-horizon") {
    const hy = H * 0.62;
    for (let i = 0; i <= 26; i++) {
      const x = (i / 26) * W;
      body.push(
        `<line x1="${x.toFixed(0)}" y1="${hy}" x2="${((x - W / 2) * 3 + W / 2).toFixed(0)}" y2="${H}" stroke="${p.glow}" stroke-opacity="0.28" stroke-width="2"/>`,
      );
    }
    for (let i = 1; i <= 14; i++) {
      const t = i / 14;
      const y = hy + Math.pow(t, 2.3) * (H - hy);
      body.push(
        `<line x1="0" y1="${y.toFixed(0)}" x2="${W}" y2="${y.toFixed(0)}" stroke="${p.glow}" stroke-opacity="0.24" stroke-width="2"/>`,
      );
    }
    body.push(
      `<rect x="0" y="${hy - 3}" width="${W}" height="6" fill="${p.glow}" opacity="0.8" filter="url(#soft-${uid})"/>`,
    );
  }

  if (piece.style === "glass-orb") {
    const cx = W * (0.35 + rnd() * 0.3);
    const cy = H * (0.4 + rnd() * 0.2);
    const r = 200 + rnd() * 140;
    defs.push(`
    <radialGradient id="orb-${uid}" cx="0.35" cy="0.3" r="0.85">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="45%" stop-color="${p.accent}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${p.deep}" stop-opacity="0.8"/>
    </radialGradient>`);
    for (let i = 3; i > 0; i--) {
      body.push(
        `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${(r + i * 40).toFixed(0)}" fill="${p.glow}" opacity="${0.08 * i}" filter="url(#blur-${uid})"/>`,
      );
    }
    body.push(
      `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${r.toFixed(0)}" fill="url(#orb-${uid})"/>`,
    );
    body.push(
      `<ellipse cx="${(cx - r * 0.25).toFixed(0)}" cy="${(cy - r * 0.5).toFixed(0)}" rx="${(r * 0.55).toFixed(0)}" ry="${(r * 0.3).toFixed(0)}" fill="#ffffff" opacity="0.7" filter="url(#soft-${uid})"/>`,
    );
    body.push(
      `<ellipse cx="${cx.toFixed(0)}" cy="${(cy + r * 0.62).toFixed(0)}" rx="${(r * 0.7).toFixed(0)}" ry="${(r * 0.12).toFixed(0)}" fill="${p.glow}" opacity="0.4" filter="url(#soft-${uid})"/>`,
    );
  }

  // bubbles float over every style
  const count = piece.style === "bubbles" ? 34 : 16;
  for (let i = 0; i < count; i++) {
    const r = 18 + rnd() * (piece.style === "bubbles" ? 150 : 90);
    bubbleSafe(body, rnd() * W, rnd() * H, r, p, rnd);
  }

  // top gloss + vignette
  body.push(
    `<rect width="${W}" height="${(H * 0.45).toFixed(0)}" fill="url(#gloss-${uid})" opacity="0.5"/>`,
  );
  defs.push(`
  <radialGradient id="vig-${uid}" cx="0.5" cy="0.5" r="0.75">
    <stop offset="60%" stop-color="#000000" stop-opacity="0"/>
    <stop offset="100%" stop-color="${p.deep}" stop-opacity="0.35"/>
  </radialGradient>`);
  body.push(`<rect width="${W}" height="${H}" fill="url(#vig-${uid})"/>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs.join("")}</defs>${body.join("")}</svg>`;
}

function bubbleSafe(
  body: string[],
  cx: number,
  cy: number,
  r: number,
  p: Palette,
  rnd: () => number,
) {
  const hue = rnd() > 0.5 ? p.accent : p.glow;
  body.push(bubble(cx, cy, r, hue, p.glow, 0.35 + rnd() * 0.5));
}

export function svgDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** Rasterize an SVG string to a PNG blob in the browser. */
export async function svgToPngBlob(svg: string, scale = 1): Promise<Blob> {
  const img = new Image();
  img.crossOrigin = "anonymous";
  const url = svgDataUrl(svg);
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("render failed"));
    img.src = url;
  });
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH * scale;
  canvas.height = HEIGHT * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas context");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("encode failed"))), "image/png"),
  );
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
