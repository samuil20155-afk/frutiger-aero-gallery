// Procedural Frutiger Aero wallpaper generator.
// Every piece is a deterministic, seeded SVG rendered at 1600x1000
// so it can be exported as a crisp PNG in the browser.

export type AeroStyle =
  | "bubbles"
  | "aqua-wave"
  | "meadow"
  | "glass-orb"
  | "ribbon"
  | "grid-horizon"
  | "liquid-chrome"
  | "leaf-macro"
  | "water-drops"
  | "aurora-glass";

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
  "liquid-chrome": "Liquid Chrome",
  "leaf-macro": "Leaf Macro",
  "water-drops": "Water Drops",
  "aurora-glass": "Aurora Glass",
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
  {
    name: "Teal Depths",
    sky: ["#c7fff4", "#20c9b0", "#04475c"],
    accent: "#69f0d0",
    glow: "#f0fffb",
    deep: "#022c3a",
  },
  {
    name: "Sand & Sky",
    sky: ["#fff4e0", "#ffd9a3", "#5aa9e6"],
    accent: "#ffbe6b",
    glow: "#fffaf2",
    deep: "#2f5f8f",
  },
  {
    name: "Violet Dusk",
    sky: ["#efe0ff", "#a58bff", "#241a6b"],
    accent: "#b9a3ff",
    glow: "#f7f1ff",
    deep: "#140d3f",
  },
  {
    name: "Lime White",
    sky: ["#ffffff", "#e2ffb0", "#63c96b"],
    accent: "#a8ee45",
    glow: "#ffffff",
    deep: "#2f6b2c",
  },
];

const STYLES: AeroStyle[] = [
  "bubbles",
  "aqua-wave",
  "meadow",
  "glass-orb",
  "ribbon",
  "grid-horizon",
  "liquid-chrome",
  "leaf-macro",
  "water-drops",
  "aurora-glass",
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
  const style = STYLES[i % STYLES.length]!;
  const palette = PALETTES[Math.floor(rnd() * PALETTES.length)]!;
  const title = `${NAMES_A[Math.floor(rnd() * NAMES_A.length)]!} ${
    NAMES_B[Math.floor(rnd() * NAMES_B.length)]!
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
  return PALETTES[Math.floor(rnd() * PALETTES.length)]!;
}

const W = WIDTH;
const H = HEIGHT;
const n = (v: number) => v.toFixed(1);

interface Ctx {
  uid: string;
  p: Palette;
  rnd: () => number;
  defs: string[];
  body: string[];
}

function glossBubble(c: Ctx, cx: number, cy: number, r: number, opacity: number) {
  const { p, rnd } = c;
  const hue = rnd() > 0.5 ? p.accent : p.glow;
  c.body.push(`
  <g opacity="${opacity.toFixed(2)}">
    <circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="${hue}" opacity="0.32"/>
    <circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="none" stroke="${p.glow}" stroke-opacity="0.8" stroke-width="${n(r * 0.055)}"/>
    <ellipse cx="${n(cx - r * 0.3)}" cy="${n(cy - r * 0.42)}" rx="${n(r * 0.4)}" ry="${n(r * 0.28)}" fill="${p.glow}" opacity="0.72" transform="rotate(-25 ${n(cx)} ${n(cy)})"/>
    <ellipse cx="${n(cx + r * 0.28)}" cy="${n(cy + r * 0.45)}" rx="${n(r * 0.3)}" ry="${n(r * 0.15)}" fill="${p.glow}" opacity="0.3"/>
  </g>`);
}

/* ---------- per-style painters ---------- */

function paintBubbles(c: Ctx) {
  const { rnd } = c;
  const count = 24 + Math.floor(rnd() * 22);
  for (let i = 0; i < count; i++) {
    glossBubble(c, rnd() * W, rnd() * H, 16 + rnd() * 180, 0.3 + rnd() * 0.55);
  }
}

function paintWaves(c: Ctx, ribbon: boolean) {
  const { p, rnd, uid, body } = c;
  const bands = ribbon ? 6 + Math.floor(rnd() * 4) : 4 + Math.floor(rnd() * 3);
  const tilt = (rnd() - 0.5) * (ribbon ? 26 : 10);
  body.push(`<g transform="rotate(${n(tilt)} ${W / 2} ${H / 2})">`);
  for (let i = 0; i < bands; i++) {
    const y = H * (0.12 + (0.78 / bands) * i) + rnd() * 70;
    const amp = 50 + rnd() * 180;
    const th = ribbon ? 30 + rnd() * 90 : 70 + rnd() * 170;
    const col = i % 3 === 0 ? p.glow : i % 3 === 1 ? p.accent : p.sky[0];
    body.push(`
    <path d="M -300 ${n(y)}
      C ${n(W * 0.25)} ${n(y - amp)}, ${n(W * 0.55)} ${n(y + amp)}, ${n(W + 300)} ${n(y - amp * 0.4)}
      L ${n(W + 300)} ${n(y - amp * 0.4 + th)}
      C ${n(W * 0.55)} ${n(y + amp + th)}, ${n(W * 0.25)} ${n(y - amp + th)}, -300 ${n(y + th)} Z"
      fill="${col}" opacity="${(0.16 + rnd() * 0.34).toFixed(2)}" filter="url(#soft-${uid})"/>`);
  }
  body.push(`</g>`);
}

function paintMeadow(c: Ctx) {
  const { p, rnd, body } = c;
  const hy = H * (0.45 + rnd() * 0.32);
  body.push(
    `<path d="M 0 ${n(hy)} C ${n(W * 0.3)} ${n(hy - 90 - rnd() * 60)}, ${n(W * 0.7)} ${n(hy + 70)}, ${W} ${n(hy - 40)} L ${W} ${H} L 0 ${H} Z" fill="${p.deep}" opacity="0.72"/>`,
  );
  body.push(
    `<path d="M 0 ${n(hy + 70)} C ${n(W * 0.35)} ${n(hy - 10)}, ${n(W * 0.65)} ${n(hy + 170)}, ${W} ${n(hy + 60)} L ${W} ${H} L 0 ${H} Z" fill="${p.accent}" opacity="0.55"/>`,
  );
  const blades = 30 + Math.floor(rnd() * 60);
  for (let i = 0; i < blades; i++) {
    const x = rnd() * W;
    const y = hy + rnd() * (H - hy);
    const h = 30 + rnd() * 130;
    body.push(
      `<path d="M ${n(x)} ${n(y + h)} Q ${n(x + (rnd() - 0.5) * 60)} ${n(y + h / 2)}, ${n(x + (rnd() - 0.5) * 100)} ${n(y)}" stroke="${p.glow}" stroke-opacity="${(0.12 + rnd() * 0.42).toFixed(2)}" stroke-width="${n(2 + rnd() * 5)}" fill="none" stroke-linecap="round"/>`,
    );
  }
}

function paintGrid(c: Ctx) {
  const { p, rnd, uid, body } = c;
  const hy = H * (0.45 + rnd() * 0.28);
  const cols = 18 + Math.floor(rnd() * 18);
  for (let i = 0; i <= cols; i++) {
    const x = (i / cols) * W;
    body.push(
      `<line x1="${n(x)}" y1="${n(hy)}" x2="${n((x - W / 2) * 3.2 + W / 2)}" y2="${H}" stroke="${p.glow}" stroke-opacity="0.26" stroke-width="2"/>`,
    );
  }
  const rows = 10 + Math.floor(rnd() * 8);
  for (let i = 1; i <= rows; i++) {
    const t = i / rows;
    const y = hy + Math.pow(t, 2.3) * (H - hy);
    body.push(
      `<line x1="0" y1="${n(y)}" x2="${W}" y2="${n(y)}" stroke="${p.glow}" stroke-opacity="0.22" stroke-width="2"/>`,
    );
  }
  body.push(
    `<rect x="0" y="${n(hy - 3)}" width="${W}" height="6" fill="${p.glow}" opacity="0.85" filter="url(#soft-${uid})"/>`,
  );
  body.push(
    `<circle cx="${n(W * (0.2 + rnd() * 0.6))}" cy="${n(hy - 40 - rnd() * 120)}" r="${n(40 + rnd() * 70)}" fill="${p.glow}" opacity="0.6" filter="url(#soft-${uid})"/>`,
  );
}

function paintOrb(c: Ctx) {
  const { p, rnd, uid, defs, body } = c;
  const cx = W * (0.22 + rnd() * 0.56);
  const cy = H * (0.3 + rnd() * 0.38);
  const r = 150 + rnd() * 230;
  defs.push(`
  <radialGradient id="orb-${uid}" cx="0.35" cy="0.3" r="0.85">
    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
    <stop offset="45%" stop-color="${p.accent}" stop-opacity="0.55"/>
    <stop offset="100%" stop-color="${p.deep}" stop-opacity="0.82"/>
  </radialGradient>`);
  for (let i = 3; i > 0; i--) {
    body.push(
      `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r + i * 44)}" fill="${p.glow}" opacity="${0.07 * i}" filter="url(#blur-${uid})"/>`,
    );
  }
  body.push(`<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="url(#orb-${uid})"/>`);
  body.push(
    `<ellipse cx="${n(cx - r * 0.25)}" cy="${n(cy - r * 0.5)}" rx="${n(r * 0.55)}" ry="${n(r * 0.3)}" fill="#ffffff" opacity="0.7" filter="url(#soft-${uid})"/>`,
  );
  body.push(
    `<ellipse cx="${n(cx)}" cy="${n(cy + r * 0.62)}" rx="${n(r * 0.7)}" ry="${n(r * 0.11)}" fill="${p.glow}" opacity="0.42" filter="url(#soft-${uid})"/>`,
  );
  // small satellites
  const sat = 2 + Math.floor(rnd() * 4);
  for (let i = 0; i < sat; i++) {
    glossBubble(c, cx + (rnd() - 0.5) * r * 3.4, cy + (rnd() - 0.5) * r * 2.4, 18 + rnd() * 60, 0.6);
  }
}

function paintChrome(c: Ctx) {
  const { p, rnd, uid, defs, body } = c;
  defs.push(`
  <linearGradient id="chrome-${uid}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
    <stop offset="30%" stop-color="${p.accent}" stop-opacity="0.7"/>
    <stop offset="55%" stop-color="${p.deep}" stop-opacity="0.7"/>
    <stop offset="80%" stop-color="#ffffff" stop-opacity="0.85"/>
    <stop offset="100%" stop-color="${p.sky[1]}" stop-opacity="0.7"/>
  </linearGradient>`);
  const swoops = 3 + Math.floor(rnd() * 3);
  for (let i = 0; i < swoops; i++) {
    const y0 = H * (0.15 + rnd() * 0.6);
    const th = 90 + rnd() * 200;
    const k = 200 + rnd() * 420;
    body.push(`
    <path d="M -200 ${n(y0)}
      C ${n(W * 0.3)} ${n(y0 - k)}, ${n(W * 0.7)} ${n(y0 + k)}, ${n(W + 200)} ${n(y0 - k * 0.25)}
      L ${n(W + 200)} ${n(y0 - k * 0.25 + th)}
      C ${n(W * 0.7)} ${n(y0 + k + th)}, ${n(W * 0.3)} ${n(y0 - k + th)}, -200 ${n(y0 + th)} Z"
      fill="url(#chrome-${uid})" opacity="${(0.45 + rnd() * 0.4).toFixed(2)}"/>`);
    body.push(`
    <path d="M -200 ${n(y0 + 6)}
      C ${n(W * 0.3)} ${n(y0 - k + 6)}, ${n(W * 0.7)} ${n(y0 + k + 6)}, ${n(W + 200)} ${n(y0 - k * 0.25 + 6)}"
      stroke="#ffffff" stroke-opacity="0.85" stroke-width="${n(2 + rnd() * 4)}" fill="none"/>`);
  }
  body.push(
    `<ellipse cx="${n(W * rnd())}" cy="${n(H * rnd())}" rx="420" ry="260" fill="${p.glow}" opacity="0.22" filter="url(#blur-${uid})"/>`,
  );
}

function paintLeaf(c: Ctx) {
  const { p, rnd, uid, defs, body } = c;
  defs.push(`
  <linearGradient id="leaf-${uid}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${p.accent}" stop-opacity="0.9"/>
    <stop offset="100%" stop-color="${p.deep}" stop-opacity="0.85"/>
  </linearGradient>`);
  const leaves = 7 + Math.floor(rnd() * 7);
  for (let i = 0; i < leaves; i++) {
    const cx = rnd() * W;
    const cy = rnd() * H;
    const len = 260 + rnd() * 620;
    const wid = len * (0.22 + rnd() * 0.2);
    const rot = rnd() * 360;
    body.push(`
    <g transform="translate(${n(cx)} ${n(cy)}) rotate(${n(rot)})" opacity="${(0.3 + rnd() * 0.45).toFixed(2)}">
      <path d="M 0 0 C ${n(wid)} ${n(-len * 0.32)}, ${n(wid)} ${n(-len * 0.7)}, 0 ${n(-len)}
               C ${n(-wid)} ${n(-len * 0.7)}, ${n(-wid)} ${n(-len * 0.32)}, 0 0 Z"
            fill="url(#leaf-${uid})"/>
      <path d="M 0 0 L 0 ${n(-len)}" stroke="${p.glow}" stroke-opacity="0.6" stroke-width="3"/>
      ${Array.from({ length: 7 }, (_, k) => {
        const t = (k + 1) / 8;
        const y = -len * t;
        const spread = wid * (1 - Math.abs(t - 0.45) * 1.5);
        return `<path d="M 0 ${n(y)} Q ${n(spread * 0.5)} ${n(y - len * 0.05)}, ${n(spread * 0.85)} ${n(y - len * 0.1)}" stroke="${p.glow}" stroke-opacity="0.35" stroke-width="2" fill="none"/>
                <path d="M 0 ${n(y)} Q ${n(-spread * 0.5)} ${n(y - len * 0.05)}, ${n(-spread * 0.85)} ${n(y - len * 0.1)}" stroke="${p.glow}" stroke-opacity="0.35" stroke-width="2" fill="none"/>`;
      }).join("")}
    </g>`);
  }
  // light rays
  const rays = 5 + Math.floor(rnd() * 5);
  const ox = W * rnd();
  for (let i = 0; i < rays; i++) {
    const x = ox + (i - rays / 2) * (60 + rnd() * 90);
    body.push(
      `<path d="M ${n(x)} -50 L ${n(x + 140)} -50 L ${n(x + 520)} ${H + 50} L ${n(x + 340)} ${H + 50} Z" fill="${p.glow}" opacity="${(0.06 + rnd() * 0.12).toFixed(2)}" filter="url(#soft-${uid})"/>`,
    );
  }
}

function paintDrops(c: Ctx) {
  const { p, rnd, uid, defs, body } = c;
  defs.push(`
  <radialGradient id="drop-${uid}" cx="0.35" cy="0.3" r="0.8">
    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
    <stop offset="60%" stop-color="${p.accent}" stop-opacity="0.28"/>
    <stop offset="100%" stop-color="${p.deep}" stop-opacity="0.45"/>
  </radialGradient>`);
  // soft out-of-focus background bokeh
  for (let i = 0; i < 14; i++) {
    body.push(
      `<circle cx="${n(rnd() * W)}" cy="${n(rnd() * H)}" r="${n(40 + rnd() * 150)}" fill="${p.glow}" opacity="${(0.07 + rnd() * 0.14).toFixed(2)}" filter="url(#blur-${uid})"/>`,
    );
  }
  const drops = 40 + Math.floor(rnd() * 50);
  for (let i = 0; i < drops; i++) {
    const cx = rnd() * W;
    const cy = rnd() * H;
    const r = 8 + rnd() * 70;
    body.push(`
    <g>
      <ellipse cx="${n(cx)}" cy="${n(cy + r * 0.12)}" rx="${n(r)}" ry="${n(r * 0.92)}" fill="url(#drop-${uid})"/>
      <ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(r)}" ry="${n(r * 0.92)}" fill="none" stroke="${p.glow}" stroke-opacity="0.55" stroke-width="1.5"/>
      <ellipse cx="${n(cx - r * 0.32)}" cy="${n(cy - r * 0.38)}" rx="${n(r * 0.26)}" ry="${n(r * 0.18)}" fill="#ffffff" opacity="0.9"/>
      <ellipse cx="${n(cx + r * 0.25)}" cy="${n(cy + r * 0.4)}" rx="${n(r * 0.3)}" ry="${n(r * 0.14)}" fill="${p.glow}" opacity="0.35"/>
    </g>`);
  }
}

function paintAurora(c: Ctx) {
  const { p, rnd, uid, defs, body } = c;
  const sheets = 4 + Math.floor(rnd() * 4);
  for (let i = 0; i < sheets; i++) {
    const id = `aur-${uid}-${i}`;
    const col = i % 2 === 0 ? p.accent : p.glow;
    defs.push(`
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0.4">
      <stop offset="0%" stop-color="${col}" stop-opacity="0"/>
      <stop offset="45%" stop-color="${col}" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="${p.sky[1]}" stop-opacity="0"/>
    </linearGradient>`);
    const y = H * (0.1 + rnd() * 0.75);
    const th = 90 + rnd() * 240;
    const a1 = (rnd() - 0.5) * 380;
    const a2 = (rnd() - 0.5) * 380;
    body.push(`
    <path d="M -200 ${n(y)}
      C ${n(W * 0.33)} ${n(y + a1)}, ${n(W * 0.66)} ${n(y + a2)}, ${n(W + 200)} ${n(y + a1 * 0.4)}
      L ${n(W + 200)} ${n(y + a1 * 0.4 + th)}
      C ${n(W * 0.66)} ${n(y + a2 + th)}, ${n(W * 0.33)} ${n(y + a1 + th)}, -200 ${n(y + th)} Z"
      fill="url(#${id})" opacity="${(0.5 + rnd() * 0.4).toFixed(2)}" filter="url(#blur-${uid})"/>`);
  }
  for (let i = 0; i < 3; i++) {
    body.push(
      `<circle cx="${n(rnd() * W)}" cy="${n(rnd() * H)}" r="${n(3 + rnd() * 6)}" fill="#ffffff" opacity="0.8" filter="url(#soft-${uid})"/>`,
    );
  }
}

/** Returns a standalone SVG document string for a piece. */
export function renderAeroSVG(piece: AeroPiece): string {
  const p = paletteFor(piece.seed);
  const rnd = mulberry(piece.seed + 99);
  const uid = piece.slug;
  const c: Ctx = { uid, p, rnd, defs: [], body: [] };
  const { defs, body } = c;

  const sunX = (0.1 + rnd() * 0.8).toFixed(2);
  const sunY = (0.05 + rnd() * 0.5).toFixed(2);
  const skyAngle = rnd() < 0.3 ? { x2: "1", y2: "0.7" } : { x2: (rnd() * 0.5).toFixed(2), y2: "1" };

  defs.push(`
  <linearGradient id="sky-${uid}" x1="0" y1="0" x2="${skyAngle.x2}" y2="${skyAngle.y2}">
    <stop offset="0%" stop-color="${p.sky[0]}"/>
    <stop offset="${(35 + rnd() * 30).toFixed(0)}%" stop-color="${p.sky[1]}"/>
    <stop offset="100%" stop-color="${p.sky[2]}"/>
  </linearGradient>
  <radialGradient id="sun-${uid}" cx="${sunX}" cy="${sunY}" r="${(0.5 + rnd() * 0.4).toFixed(2)}">
    <stop offset="0%" stop-color="${p.glow}" stop-opacity="0.95"/>
    <stop offset="55%" stop-color="${p.glow}" stop-opacity="0.12"/>
    <stop offset="100%" stop-color="${p.glow}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="gloss-${uid}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
    <stop offset="55%" stop-color="#ffffff" stop-opacity="0.1"/>
    <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
  </linearGradient>
  <filter id="blur-${uid}" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation="${(18 + rnd() * 24).toFixed(0)}"/>
  </filter>
  <filter id="soft-${uid}" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation="${(4 + rnd() * 8).toFixed(0)}"/>
  </filter>`);

  body.push(`<rect width="${W}" height="${H}" fill="url(#sky-${uid})"/>`);
  body.push(`<rect width="${W}" height="${H}" fill="url(#sun-${uid})"/>`);

  const blobs = Math.floor(rnd() * 5);
  for (let i = 0; i < blobs; i++) {
    body.push(
      `<ellipse cx="${n(rnd() * W)}" cy="${n(rnd() * H)}" rx="${n(160 + rnd() * 340)}" ry="${n(100 + rnd() * 240)}" fill="${p.accent}" opacity="${(0.06 + rnd() * 0.14).toFixed(2)}" filter="url(#blur-${uid})"/>`,
    );
  }

  switch (piece.style) {
    case "bubbles":
      paintBubbles(c);
      break;
    case "aqua-wave":
      paintWaves(c, false);
      break;
    case "ribbon":
      paintWaves(c, true);
      break;
    case "meadow":
      paintMeadow(c);
      break;
    case "grid-horizon":
      paintGrid(c);
      break;
    case "glass-orb":
      paintOrb(c);
      break;
    case "liquid-chrome":
      paintChrome(c);
      break;
    case "leaf-macro":
      paintLeaf(c);
      break;
    case "water-drops":
      paintDrops(c);
      break;
    case "aurora-glass":
      paintAurora(c);
      break;
  }

  // sparse accent bubbles for a few non-bubble styles only
  if (piece.style !== "bubbles" && piece.style !== "water-drops" && rnd() > 0.45) {
    const extra = 2 + Math.floor(rnd() * 5);
    for (let i = 0; i < extra; i++) {
      glossBubble(c, rnd() * W, rnd() * H, 22 + rnd() * 90, 0.3 + rnd() * 0.4);
    }
  }

  if (rnd() > 0.35) {
    body.push(
      `<rect width="${W}" height="${n(H * (0.3 + rnd() * 0.25))}" fill="url(#gloss-${uid})" opacity="${(0.25 + rnd() * 0.35).toFixed(2)}"/>`,
    );
  }

  defs.push(`
  <radialGradient id="vig-${uid}" cx="0.5" cy="0.5" r="0.75">
    <stop offset="55%" stop-color="#000000" stop-opacity="0"/>
    <stop offset="100%" stop-color="${p.deep}" stop-opacity="${(0.2 + rnd() * 0.28).toFixed(2)}"/>
  </radialGradient>`);
  body.push(`<rect width="${W}" height="${H}" fill="url(#vig-${uid})"/>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs.join("")}</defs>${body.join("")}</svg>`;
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
