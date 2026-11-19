import { mkdir, writeFile } from 'node:fs/promises';
const images = [
  ['cover', '1793372888272-a8ab079d4834', 'Resource Database', 'rOgf4YVQj4Q'],
  ['about', '1528212919119-f1093b9be6aa', 'Joel Filipe', 'SIyGeJeWAcY'],
  ['tools', '1752751788742-e79cac56ba4f', 'Declan Sun', 'CnWkn7-rAh8'],
  ['ground', '1770068511771-7c146210a55b', 'Daniel Miksha', 'PNX3H9jkT4c'],
  ['rooftop', '1668097613569-3405bb63262b', 'Markus Spiske', 'rN9BTsKUc1E'],
  ['tracker', '1780273035811-d1b63f76bfb9', 'Sebastian Schuster', 'EQaY0H9KeWg'],
  ['mobile', '1650785603924-160f4fe544bc', 'Jackery Power Station', 'uIz2frN4s8g'],
  ['battery', '1650785652040-5a2fc88ce902', 'Jackery Power Station', 'YWwdljlQfUM'],
];
await mkdir('public/images/editorial', { recursive: true });
for (const [name, photo] of images) {
  await Promise.all([640, 1600].map(async width => {
    const url = `https://images.unsplash.com/photo-${photo}?fm=webp&fit=max&w=${width}&q=82`;
    const response = await fetch(url);
    if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`Image request failed: ${name} / ${response.status}`);
    await writeFile(`public/images/editorial/${name}-${width}.webp`, Buffer.from(await response.arrayBuffer()));
  }));
  console.log(`Saved ${name} at 640 and 1600 px.`);
}
await writeFile('public/images/editorial/credits.json', JSON.stringify(images.map(([name, photo, author, id]) => ({ name, author, source: `https://unsplash.com/photos/${id}`, original: `https://images.unsplash.com/photo-${photo}`, license: 'https://unsplash.com/license' })), null, 2));
