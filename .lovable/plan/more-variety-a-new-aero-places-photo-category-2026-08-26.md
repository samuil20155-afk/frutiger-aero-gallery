# More variety + a new "Aero Places" photo category

Two problems to solve: the generated wallpapers look too alike, and there's no category showing real Frutiger Aero *scenes* (homes, kitchens, hotels, parks, single trees).

## 1. Make the abstract wallpapers genuinely different

Right now every piece shares the same recipe: sky gradient, blurred blobs, floating bubbles, top gloss. That sameness is the real issue, not the count.

Changes:
- Bubbles stop being universal — only the Bubblestream style keeps a heavy bubble field; other styles get them sparingly or not at all.
- Wider variation per piece: random composition (centered, off-axis, horizon-low, horizon-high), varying zoom/scale, rotation of wave and ribbon bands, differing bubble density and blur.
- Four new styles to break the rhythm: Liquid Chrome (metallic swoops), Leaf Macro (translucent overlapping leaves with light rays), Water Drops (dew beads with refraction highlights), Aurora Glass (soft folded light sheets).
- More palettes (add deep teal, warm sand-and-sky, violet dusk, pure lime-white) and per-piece palette shifting so two pieces in the same family never read as twins.

## 2. New category: Aero Places

A separate section of true Frutiger Aero *scene* imagery — glossy sunlit interiors and nature, in the 2005-2010 Windows-wallpaper/HP-ad look:

- Living rooms with white gloss furniture and huge windows
- Bright glass-and-chrome kitchens with green plants
- Hotel lobbies, infinity pools, resort terraces
- Parks, meadow paths, waterfalls
- Single hero trees against a blue sky with lens flare
- Detail shots: dew on grass, koi pond, glass balcony

These are AI-generated photographic images saved into the project (about 16-20 hand-crafted scenes, each with its own prompt so none repeat). They are real image files, downloadable like everything else.

Note on scale: 100+ *photographic* scenes isn't practical to generate one by one, so the archive stays at 120+ abstract wallpapers plus this curated Aero Places set. If you want more scenes later, we can keep adding batches.

## 3. Gallery updates

- New top-level toggle: **Wallpapers** / **Places**, with the existing style filters under Wallpapers.
- Places cards use the same glass card, lightbox, and download button.
- Download works for both: procedural pieces still export via canvas to PNG; photo scenes download the source file directly.

## Technical notes

- `src/lib/aero.ts`: refactor the renderer into per-style draw functions, add the four new styles, expand palettes, add per-piece composition/variation parameters.
- New `src/lib/places.ts`: typed manifest of scene images imported from `src/assets/places/`.
- `src/components/AeroCard.tsx`: accept either a procedural piece or a static image, branch the download path.
- `src/routes/index.tsx`: category toggle + filtered grids, keep head metadata updated to mention both collections.
