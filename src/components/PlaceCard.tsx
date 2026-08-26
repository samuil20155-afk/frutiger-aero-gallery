import { useState } from "react";
import { Download, Maximize2 } from "lucide-react";
import { downloadPlace, type AeroPlace } from "@/lib/places";
import { toast } from "sonner";

export function PlaceCard({
  place,
  onOpen,
}: {
  place: AeroPlace;
  onOpen: (p: AeroPlace) => void;
}) {
  const [busy, setBusy] = useState(false);

  return (
    <figure className="aero-glass group relative overflow-hidden rounded-3xl p-2 transition-transform duration-300 hover:-translate-y-1">
      <button
        type="button"
        onClick={() => onOpen(place)}
        className="block w-full overflow-hidden rounded-2xl"
        aria-label={`Preview ${place.title}`}
      >
        <img
          src={place.src}
          alt={place.alt}
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
          <p className="truncate text-sm font-semibold text-foreground">{place.title}</p>
          <p className="truncate text-xs text-foreground/60">{place.group}</p>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={() => onOpen(place)}
            className="rounded-full border border-white/60 bg-white/50 p-2 text-foreground/80 transition hover:bg-white/80"
            aria-label={`Open ${place.title} full size`}
          >
            <Maximize2 className="size-4" />
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await downloadPlace(place);
                toast.success(`Downloaded ${place.title}`);
              } catch {
                toast.error("Could not download that one — try again.");
              }
              setBusy(false);
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-[0_6px_16px_-6px_oklch(0.4_0.15_250)] transition hover:brightness-110 disabled:opacity-60"
          >
            <Download className="size-4" />
            {busy ? "…" : "JPG"}
          </button>
        </div>
      </figcaption>
    </figure>
  );
}
