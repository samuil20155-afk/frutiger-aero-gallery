import { useMemo, useState } from "react";
import { Download, Maximize2 } from "lucide-react";
import {
  downloadBlob,
  renderAeroSVG,
  svgDataUrl,
  svgToPngBlob,
  STYLE_LABELS,
  type AeroPiece,
} from "@/lib/aero";
import { toast } from "sonner";

export function useAeroSvg(piece: AeroPiece) {
  return useMemo(() => renderAeroSVG(piece), [piece]);
}

export async function downloadPiece(piece: AeroPiece, svg: string) {
  try {
    const blob = await svgToPngBlob(svg);
    downloadBlob(blob, `${piece.slug}-${piece.title.toLowerCase().replace(/\s+/g, "-")}.png`);
    toast.success(`Downloaded ${piece.title}`);
  } catch {
    toast.error("Could not export that one — try again.");
  }
}

export function AeroCard({ piece, onOpen }: { piece: AeroPiece; onOpen: (p: AeroPiece) => void }) {
  const svg = useAeroSvg(piece);
  const [busy, setBusy] = useState(false);

  return (
    <figure className="aero-glass group relative overflow-hidden rounded-3xl p-2 transition-transform duration-300 hover:-translate-y-1">
      <button
        type="button"
        onClick={() => onOpen(piece)}
        className="block w-full overflow-hidden rounded-2xl"
        aria-label={`Preview ${piece.title}`}
      >
        <img
          src={svgDataUrl(svg)}
          alt={`${piece.title} — ${STYLE_LABELS[piece.style]} Frutiger Aero wallpaper in ${piece.palette} colours`}
          width={1600}
          height={1000}
          loading="lazy"
          className="aspect-[8/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </button>

      <div
        aria-hidden
        className="aero-shine pointer-events-none absolute inset-x-2 top-2 h-1/3 rounded-t-2xl"
      />

      <figcaption className="flex items-end justify-between gap-3 px-3 pt-3 pb-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{piece.title}</p>
          <p className="truncate text-xs text-foreground/60">
            {STYLE_LABELS[piece.style]} · {piece.palette}
          </p>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={() => onOpen(piece)}
            className="rounded-full border border-white/60 bg-white/50 p-2 text-foreground/80 transition hover:bg-white/80"
            aria-label={`Open ${piece.title} full size`}
          >
            <Maximize2 className="size-4" />
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              await downloadPiece(piece, svg);
              setBusy(false);
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-[0_6px_16px_-6px_oklch(0.4_0.15_250)] transition hover:brightness-110 disabled:opacity-60"
          >
            <Download className="size-4" />
            {busy ? "…" : "PNG"}
          </button>
        </div>
      </figcaption>
    </figure>
  );
}
