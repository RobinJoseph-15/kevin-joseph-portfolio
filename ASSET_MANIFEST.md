# Asset provenance

## Photography

All eight photographs are local WebP assets in `public/images/editorial/`, with 640px and 1600px variants. CSS provides monochrome treatment. Sources were selected under the [Unsplash License](https://unsplash.com/license); source records are also included in `credits.json`.

| File stem | Photographer | Source |
| --- | --- | --- |
| cover | Resource Database | [Original photograph](https://unsplash.com/photos/rOgf4YVQj4Q) |
| about | Joel Filipe | [Original photograph](https://unsplash.com/photos/SIyGeJeWAcY) |
| tools | Declan Sun | [Original photograph](https://unsplash.com/photos/CnWkn7-rAh8) |
| ground | Daniel Miksha | [Original photograph](https://unsplash.com/photos/PNX3H9jkT4c) |
| rooftop | Markus Spiske | [Original photograph](https://unsplash.com/photos/rN9BTsKUc1E) |
| tracker | Sebastian Schuster | [Original photograph](https://unsplash.com/photos/EQaY0H9KeWg) |
| mobile | Jackery Power Station | [Original photograph](https://unsplash.com/photos/uIz2frN4s8g) |
| battery | Jackery Power Station | [Original photograph](https://unsplash.com/photos/YWwdljlQfUM) |

These are reference photographs, not photographs of work delivered by Kevin. The public presentation uses neutral engineering category descriptions. Asset provenance is retained here rather than shown as development disclaimers. The tracker image is a structural reference, and the battery image shows portable storage. No client, capacity, outcome or project ownership is inferred.

`scripts/fetch-editorial-assets.mjs` records source URLs and downloads both resolutions. No AI-generated photography, runtime 3D models or former turbine illustrations are used.

## Fonts and graphics

- Anton, Inter and Caveat are self-hosted through Fontsource. Their SIL Open Font License notices are copied to `public/licenses/`.
- Lucide React provides interface, education and award icons; its ISC notice is in `public/licenses/lucide.txt`.
- The KJ wordmark, favicon, asterisks and handwritten-style SVG strokes are code-native graphics created for this site.
- The supplied BORCELLE CREATIVE PDF is a visual reference only; its pages are not distributed with the production site.

License notices are included in the production build.
