import path from 'path';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import { optimizeImages, responsiveImage, optimizeHtmlImages } from './scripts/optimize-images.mjs';

let imageManifest = {};

export default defineConfig({
  plugins: [{
    name: 'uhi-public-analytics',
    async buildStart() { imageManifest = await optimizeImages(__dirname); },
    transformIndexHtml(html, ctx) {
      // Never instrument the internal order-management page.
      if (/quan-ly-don(?:\.html)?$/.test(ctx.path)) return html;
      if (ctx.path === '/' || ctx.path === '/index.html') {
        const products = JSON.parse(readFileSync(path.resolve(__dirname, 'public/catalog.json'), 'utf8')) as Array<{
          id: string; name: string; category: string; weight: string; image: string;
          color: string; word: string; long?: boolean; width: number; height: number;
        }>;
        const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({
          '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
        }[char]!));
        const cards = products.map(product => `<a href="/san-pham-${escapeHtml(product.id)}" class="product-card ${product.long ? 'long' : ''}" data-product="${escapeHtml(product.id)}" aria-label="Xem ${escapeHtml(product.name)}, ${escapeHtml(product.weight)}"><div class="product-picture" style="--tile:${escapeHtml(product.color)}" data-word="${escapeHtml(product.word.replaceAll('"', ''))}"><span class="product-weight">${escapeHtml(product.weight)}</span><img src="/assets/${escapeHtml(product.image)}" alt="Bao bì ${escapeHtml(product.name)} ${escapeHtml(product.weight)}" width="${product.width}" height="${product.height}" loading="lazy"><span class="arrow" aria-hidden="true">↗</span></div><span class="category">${escapeHtml(product.category)}</span><h3>${escapeHtml(product.name)}</h3><p>Khám phá sản phẩm ↗</p></a>`).join('');
        const placeholder = '<div class="product-grid" id="products"></div>';
        if (!html.includes(placeholder)) throw new Error('Homepage product grid placeholder is missing');
        const deliveryProducts = products.map(product => {
          const image = responsiveImage(imageManifest, product.image);
          return image ? { ...product, image: image.src.replace('/assets/', ''), srcset: image.srcset } : product;
        });
        const data = JSON.stringify(deliveryProducts).replace(/</g, '\\u003c');
        html = html.replace(placeholder, `<script type="application/json" id="uhi-catalog-data">${data}</script><div class="product-grid" id="products">${cards}</div>`);
      }
      html = optimizeHtmlImages(html, imageManifest);
      return { html, tags: [{ tag: 'script', attrs: { src: '/uhi-analytics.js', defer: true }, injectTo: 'head' }] };
    },
  }],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        sanPham: path.resolve(__dirname, 'san-pham.html'),
        soda: path.resolve(__dirname, 'san-pham-soda.html'),
        cola: path.resolve(__dirname, 'san-pham-cola.html'),
        peach: path.resolve(__dirname, 'san-pham-peach.html'),
        lemon: path.resolve(__dirname, 'san-pham-lemon.html'),
        cream: path.resolve(__dirname, 'san-pham-cream.html'),
        lemoncola: path.resolve(__dirname, 'san-pham-lemoncola.html'),
        rock: path.resolve(__dirname, 'san-pham-rock.html'),
        toast: path.resolve(__dirname, 'san-pham-toast.html'),
        veUhi: path.resolve(__dirname, 've-uhi.html'),
        hopTac: path.resolve(__dirname, 'hop-tac.html'),
        datHang: path.resolve(__dirname, 'dat-hang.html'),
        quanLyDon: path.resolve(__dirname, 'quan-ly-don.html'),
      }
    }
  }
});
