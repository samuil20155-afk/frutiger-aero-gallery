import livingRoom from "@/assets/places/living-room.jpg";
import kitchen from "@/assets/places/kitchen.jpg";
import hotelLobby from "@/assets/places/hotel-lobby.jpg";
import infinityPool from "@/assets/places/infinity-pool.jpg";
import loneTree from "@/assets/places/lone-tree.jpg";
import parkPath from "@/assets/places/park-path.jpg";
import dewGrass from "@/assets/places/dew-grass.jpg";
import koiPond from "@/assets/places/koi-pond.jpg";
import glassBalcony from "@/assets/places/glass-balcony.jpg";
import waterfall from "@/assets/places/waterfall.jpg";
import bathroom from "@/assets/places/bathroom.jpg";
import homeOffice from "@/assets/places/home-office.jpg";
import terminal from "@/assets/places/terminal.jpg";
import glassHouse from "@/assets/places/glass-house.jpg";
import resortWalk from "@/assets/places/resort-walk.jpg";
import leafDrops from "@/assets/places/leaf-drops.jpg";
import atrium from "@/assets/places/atrium.jpg";
import greenHills from "@/assets/places/green-hills.jpg";

export type PlaceGroup = "Interiors" | "Escapes" | "Nature";

export interface AeroPlace {
  slug: string;
  title: string;
  group: PlaceGroup;
  src: string;
  alt: string;
}

export const PLACE_GROUPS: PlaceGroup[] = ["Interiors", "Escapes", "Nature"];

export const PLACES: AeroPlace[] = [
  {
    slug: "living-room",
    title: "Cloudline Living Room",
    group: "Interiors",
    src: livingRoom,
    alt: "Glossy white living room with curved sofas and floor-to-ceiling windows over a blue sea",
  },
  {
    slug: "kitchen",
    title: "Chrome Kitchen",
    group: "Interiors",
    src: kitchen,
    alt: "Bright white gloss kitchen with chrome tap, green sprig and a sunlit blue sky window",
  },
  {
    slug: "bathroom",
    title: "Still Water Bath",
    group: "Interiors",
    src: bathroom,
    alt: "Minimal white bathroom with glass shower and ocean view windows",
  },
  {
    slug: "home-office",
    title: "Blue Chair Studio",
    group: "Interiors",
    src: homeOffice,
    alt: "White curved desk home office with a translucent blue chair and cloud-filled window",
  },
  {
    slug: "hotel-lobby",
    title: "Lagoon Lobby",
    group: "Interiors",
    src: hotelLobby,
    alt: "Hotel lobby with teal glass wall, indoor pool and glossy white lounge chairs",
  },
  {
    slug: "atrium",
    title: "Palm Atrium",
    group: "Interiors",
    src: atrium,
    alt: "White mall atrium with palm trees, fountain and a blue glass roof",
  },
  {
    slug: "terminal",
    title: "Departure Light",
    group: "Interiors",
    src: terminal,
    alt: "Sunlit airport terminal with glass walls, palms and mirror-polished floor",
  },
  {
    slug: "infinity-pool",
    title: "Infinity Edge",
    group: "Escapes",
    src: infinityPool,
    alt: "Infinity pool overlooking a turquoise ocean under a bright blue sky",
  },
  {
    slug: "resort-walk",
    title: "Colonnade Blue",
    group: "Escapes",
    src: resortWalk,
    alt: "White resort colonnade opening onto palms and a turquoise sea",
  },
  {
    slug: "glass-balcony",
    title: "Bay Balcony",
    group: "Escapes",
    src: glassBalcony,
    alt: "Glass balcony with a potted plant looking over a calm blue bay",
  },
  {
    slug: "glass-house",
    title: "Meadow Glass House",
    group: "Escapes",
    src: glassHouse,
    alt: "Modern glass house on a green meadow under towering white clouds",
  },
  {
    slug: "park-path",
    title: "Fountain Park",
    group: "Escapes",
    src: parkPath,
    alt: "Sunlit park path with vivid green grass and a spraying fountain",
  },
  {
    slug: "lone-tree",
    title: "Solitary Oak",
    group: "Nature",
    src: loneTree,
    alt: "A single green oak tree on a vivid green hill under a deep blue sky",
  },
  {
    slug: "green-hills",
    title: "River Hills",
    group: "Nature",
    src: greenHills,
    alt: "Rolling green hills with a winding river and a small white house",
  },
  {
    slug: "waterfall",
    title: "Emerald Falls",
    group: "Nature",
    src: waterfall,
    alt: "Tropical waterfall falling into an emerald pool with sun rays through leaves",
  },
  {
    slug: "koi-pond",
    title: "Koi Surface",
    group: "Nature",
    src: koiPond,
    alt: "Clear turquoise koi pond seen from above with lily pads and orange koi",
  },
  {
    slug: "dew-grass",
    title: "Morning Dew",
    group: "Nature",
    src: dewGrass,
    alt: "Macro of dew droplets on bright green grass blades at sunrise",
  },
  {
    slug: "leaf-drops",
    title: "Leaf Refraction",
    group: "Nature",
    src: leafDrops,
    alt: "Macro of water droplets refracting light on a glossy green leaf",
  },
];

export async function downloadPlace(place: AeroPlace) {
  const res = await fetch(place.src);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `aero-${place.slug}.jpg`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
