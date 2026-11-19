import sharp from 'sharp';
import { readdir, mkdir, stat, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

// Generate web delivery copies; retain every original packaging/logo asset.
export async function optimizeImages(root) {
  const directory = path.join(root, 'public/assets');
  const output = path.join(directory, 'optimized');
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  const manifest = {};
  for (const filename of await readdir(directory)) {
    if (!/\.(png|jpg)$/i.test(filename)) continue;
    const input = path.join(directory, filename);
    const original = await stat(input);
    if (original.size < 500_000 && filename !== 'logo.jpg') continue;
    const { width } = await sharp(input).metadata();
    const hash = createHash('sha256').update(await readFile(input)).update('webp-q95-v2').digest('hex').slice(0, 10);
    const variants = [];
    for (const target of [320, 480, 640, 960]) {
      const actual = Math.min(target, width);
      if (variants.some(item => item.width === actual)) continue;
      const name = `${path.parse(filename).name}-${hash}-${actual}.webp`;
      const destination = path.join(output, name);
      const info = await sharp(input).resize({ width: actual, withoutEnlargement: true })
        .webp({ lossless: filename === 'logo.jpg', quality: 95, alphaQuality: 100, smartSubsample: true, effort: 5 }).toFile(destination);
      variants.push({ width: info.width, height: info.height, bytes: info.size, url: `/assets/optimized/${name}` });
    }
    manifest[filename] = { originalBytes: original.size, variants };
  }
  return manifest;
}

export function responsiveImage(manifest, filename) {
  const entry = manifest[filename];
  if (!entry) return null;
  const fallback = entry.variants.find(image => image.width >= 640) || entry.variants.at(-1);
  return { src: fallback.url, srcset: entry.variants.map(image => `${image.url} ${image.width}w`).join(', ') };
}

export function optimizeHtmlImages(html, manifest) {
  return html.replace(/<img\b[^>]*>/g, tag => {
    const source = tag.match(/\bsrc="(?:\/?assets\/)([^"/]+)"/);
    const image = source && responsiveImage(manifest, source[1]);
    if (!image) return tag;
    const sizes = /class="[^"]*\bside\b/.test(tag)
      ? '(max-width: 600px) 45vw, 300px'
      : /id="hero-pack"/.test(tag) ? '(max-width: 600px) 75vw, 550px'
      : /class="catalog-image"/.test(tag) ? '(max-width: 600px) 45vw, (max-width: 1000px) 30vw, 280px'
      : source[1] === 'logo.jpg' ? '125px'
      : /friends-v3/.test(source[1]) ? '(max-width: 800px) 100vw, 900px'
      : '(max-width: 600px) 80vw, 600px';
    return tag.replace(/\bsrc="[^"]+"/, `src="${image.src}"`).replace(/>$/, ` srcset="${image.srcset}" sizes="${sizes}">`);
  });
}
