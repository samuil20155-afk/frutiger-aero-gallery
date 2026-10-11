import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Droplets, X } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { AeroCard, downloadPiece } from "@/components/AeroCard";
import { PlaceCard } from "@/components/PlaceCard";
import {
  PIECES,
  STYLE_LABELS,
  renderAeroSVG,
  svgDataUrl,
  type AeroPiece,
  type AeroStyle,
} from "@/lib/aero";
import { PLACES, PLACE_GROUPS, downloadPlace, type AeroPlace, type PlaceGroup } from "@/lib/places";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aqua Archives — 120 Frutiger Aero Wallpapers & 18 Aero Places" },
      {
        name: "description",
        content:
          "A glossy Frutiger Aero archive: 120 generated wallpapers plus 18 real Aero Places scenes — sunlit interiors, hotel lobbies, parks and lone trees. Everything is free to download.",
      },
      {
        property: "og:title",
        content: "Aqua Archives — 120 Frutiger Aero Wallpapers & 18 Aero Places",
      },
      {
        property: "og:description",
        content:
          "Browse and download 120 glossy Frutiger Aero wallpapers and 18 photographic Aero Places scenes, free for everyone.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const FILTERS: (AeroStyle | "all")[] = [
  "all",
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

type Tab = "wallpapers" | "places";
type Active = { kind: "piece"; piece: AeroPiece } | { kind: "place"; place: AeroPlace };

function Index() {
  const [tab, setTab] = useState<Tab>("wallpapers");
  const [filter, setFilter] = useState<AeroStyle | "all">("all");
  const [placeFilter, setPlaceFilter] = useState<PlaceGroup | "all">("all");
  const [active, setActive] = useState<Active | null>(null);
  const [busy, setBusy] = useState(false);

  const shown = useMemo(
    () => (filter === "all" ? PIECES : PIECES.filter((p) => p.style === filter)),
    [filter],
  );
  const shownPlaces = useMemo(
    () => (placeFilter === "all" ? PLACES : PLACES.filter((p) => p.group === placeFilter)),
    [placeFilter],
  );

  const activePiece = active?.kind === "piece" ? active.piece : null;
  const activePlace = active?.kind === "place" ? active.place : null;
  const activeSvg = useMemo(() => (activePiece ? renderAeroSVG(activePiece) : ""), [activePiece]);
  const heroSvg = useMemo(() => renderAeroSVG(PIECES[3]!), []);

  return (
    <div className="min-h-screen">
      <Toaster position="top-center" />

      {/* decorative floating bubbles */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        {[
          [8, 18, 160],
          [78, 12, 220],
          [62, 68, 120],
          [22, 74, 190],
          [46, 34, 90],
        ].map(([x, y, s], i) => (
          <span
            key={i}
            className="aero-float absolute rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: s,
              height: s,
              animationDelay: `${i * 1.4}s`,
              background:
                "radial-gradient(circle at 32% 28%, rgba(255,255,255,.9), rgba(255,255,255,.18) 42%, rgba(120,220,255,.28) 70%, rgba(255,255,255,.05))",
              boxShadow: "inset 0 0 40px rgba(255,255,255,.5)",
            }}
          />
        ))}
      </div>

      <header className="relative mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6">
        <div className="aero-glass overflow-hidden rounded-[2rem] p-2">
          <div className="relative overflow-hidden rounded-[1.6rem]">
            {tab === "wallpapers" ? (
              <img
                src={svgDataUrl(heroSvg)}
                alt="Glossy Frutiger Aero bubbles floating over a bright blue sky gradient"
                className="h-56 w-full object-cover sm:h-80"
              />
            ) : (
              <img
                src={PLACES[0]!.src}
                alt={PLACES[0]!.alt}
                className="h-56 w-full object-cover sm:h-80"
              />
            )}
            <div className="absolute inset-0 flex flex-col justify-end gap-3 bg-gradient-to-t from-[oklch(0.3_0.12_250/70%)] to-transparent p-5 sm:p-8">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/60 bg-white/30 px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur">
                <Droplets className="size-3.5" /> FRUTIGER AERO ARCHIVE
              </span>
              <h1 className="font-display text-3xl leading-tight font-bold text-white drop-shadow-[0_2px_8px_rgba(0,40,90,.6)] sm:text-5xl">
                Aqua Archives
              </h1>
              <p className="max-w-xl text-sm text-white/90 sm:text-base">
                {PIECES.length} glossy, bubble-drenched wallpapers generated in-browser, plus{" "}
                {PLACES.length} real Aero Places scenes — sunlit interiors, lobbies, parks and lone
                trees. Free for everyone, every one downloadable.
              </p>
            </div>
          </div>
        </div>
      </header>

      <nav className="mx-auto max-w-7xl px-4 pb-3 sm:px-6">
        <div className="aero-glass flex w-fit gap-1 rounded-full p-1.5">
          {(
            [
              ["wallpapers", `Wallpapers ${PIECES.length}`],
              ["places", `Places ${PLACES.length}`],
            ] as [Tab, string][]
          ).map(([t, label]) => {
            const on = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-5 py-2 text-xs font-bold tracking-wide uppercase transition sm:text-sm ${
                  on
                    ? "bg-primary text-primary-foreground shadow-[0_6px_16px_-8px_oklch(0.4_0.15_250)]"
                    : "text-foreground/70 hover:bg-white/50"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </nav>

      <nav className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
        <div className="aero-glass flex flex-wrap gap-2 rounded-full p-2">
          {tab === "wallpapers"
            ? FILTERS.map((f) => {
                const on = filter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                      on
                        ? "bg-primary text-primary-foreground shadow-[0_6px_16px_-8px_oklch(0.4_0.15_250)]"
                        : "text-foreground/70 hover:bg-white/50"
                    }`}
                  >
                    {f === "all" ? `All ${PIECES.length}` : STYLE_LABELS[f]}
                  </button>
                );
              })
            : ["all" as const, ...PLACE_GROUPS].map((g) => {
                const on = placeFilter === g;
                const count = g === "all" ? PLACES.length : PLACES.filter((p) => p.group === g).length;
                return (
                  <button
                    key={g}
                    onClick={() => setPlaceFilter(g)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                      on
                        ? "bg-primary text-primary-foreground shadow-[0_6px_16px_-8px_oklch(0.4_0.15_250)]"
                        : "text-foreground/70 hover:bg-white/50"
                    }`}
                  >
                    {g === "all" ? `All ${count}` : `${g} ${count}`}
                  </button>
                );
              })}
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        {tab === "wallpapers" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((piece) => (
              <AeroCard key={piece.id} piece={piece} onOpen={(p) => setActive({ kind: "piece", piece: p })} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shownPlaces.map((place) => (
              <PlaceCard key={place.slug} place={place} onOpen={(p) => setActive({ kind: "place", place: p })} />
            ))}
          </div>
        )}
      </main>

      <footer className="pb-10 text-center text-xs text-white/80">
        Wallpapers are generated procedurally, places are hand-made scenes — yours to keep, share
        and remix.
      </footer>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[oklch(0.25_0.1_250/70%)] p-4 backdrop-blur-md"
          onClick={() => setActive(null)}
        >
          <div
            className="aero-glass w-full max-w-4xl rounded-3xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            {activePiece ? (
              <img
                src={svgDataUrl(activeSvg)}
                alt={`${activePiece.title} full preview`}
                className="w-full rounded-2xl"
              />
            ) : (
              <img
                src={activePlace!.src}
                alt={activePlace!.alt}
                className="w-full rounded-2xl"
              />
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-3">
              <div>
                <p className="font-semibold text-foreground">
                  {activePiece ? activePiece.title : activePlace!.title}
                </p>
                <p className="text-xs text-foreground/60">
                  {activePiece
                    ? `${STYLE_LABELS[activePiece.style]} · ${activePiece.palette} · 1600×1000 PNG`
                    : `${activePlace!.group} · photographic scene · 1600×1000 JPG`}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    setBusy(true);
                    if (activePiece) await downloadPiece(activePiece, activeSvg);
                    else {
                      try {
                        await downloadPlace(activePlace!);
                      } catch {
                        /* toast handled in PlaceCard-free path below */
                      }
                    }
                    setBusy(false);
                  }}
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-60"
                >
                  <Download className="size-4" />
                  {busy
                    ? "Exporting…"
                    : activePiece
                      ? "Download PNG"
                      : "Download JPG"}
                </button>
                <button
                  onClick={() => setActive(null)}
                  className="rounded-full border border-white/60 bg-white/50 p-2.5 text-foreground/80 hover:bg-white/80"
                  aria-label="Close preview"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
