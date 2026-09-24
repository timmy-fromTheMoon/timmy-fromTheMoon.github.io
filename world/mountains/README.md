# Expedition mountains

One painting per project. `src/world/mountainArt.ts` assigns them by a hash of
the project's id — stable per project, and probed so no two expeditions share a
peak while there are enough to go round.

Anything missing falls back to `default.webp` rather than showing a broken
image, so a half-filled folder is fine and adding a painting is a one-line
change to the catalogue.

| File | Shape | The one it is |
| --- | --- | --- |
| `valley-lake.webp`   | 16:9 | green valley, lake winding to the horizon, sunset |
| `desert-canyon.webp` | 16:9 | red mesa and river, orange sky |
| `pale-crags.webp`    | 4:3  | jagged pale spires, pines at the foot |
| `green-ridge.webp`   | 4:3  | green ridge over a river valley |
| `snow-crag.webp`     | 16:9 | steep snow peak, pines, heavy cloud |
| `blue-peak.webp`     | 4:3  | broad snow mountain, lake below, pines both sides |
| `default.webp`       | 4:3  | the generic peak, for an empty desk or a missing file |

**Mind the shape.** A 4:3 painting in a 16:9 window loses 24% of its height to
the `cover` crop, and centred that is 12% off the top — enough to take the tip
off `pale-crags`. Every painting therefore carries its own framing in
`mountainArt.ts`; a new one needs a `y` chosen by looking at it, not the
default. Where the painting and the window agree about shape there is nothing
to crop and the number does nothing.

Converted with `python docs/webp.py <in> <out.webp>` — about 3 MB down to
150 KB each, which is what soft-edged paintings do under webp.
