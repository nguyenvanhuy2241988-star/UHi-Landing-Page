const fs = require('fs');
const path = require('path');

const pixelHead = `
    <!-- Meta Pixel Code -->
    <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1117198146781464');
    fbq('track', 'PageView');
    </script>
    <!-- End Meta Pixel Code -->
    <link rel="icon" type="image/jpeg" href="/assets/logo.jpg">
    <link rel="stylesheet" href="/floating-cta.css">
`;

const pixelBody = `
<!-- Meta Pixel Code (noscript) -->
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=1117198146781464&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code (noscript) -->
`;

const floatingCtaHtml = `
<div class="floating-cta" id="floating-cta" aria-label="Liên hệ nhanh">
  <a href="https://zalo.me/0969069798" target="_blank" rel="noopener" class="cta-btn cta-zalo" title="Chat Zalo">
    <svg width="22" height="22" viewBox="0 0 48 48" fill="none"><path d="M24 4C12.954 4 4 12.06 4 22c0 5.485 2.766 10.36 7.125 13.625L9 44l9.219-4.625C20.062 39.75 22 40 24 40c11.046 0 20-8.06 20-18S35.046 4 24 4z" fill="#0068FF"/><path d="M19 17h10v3H22.5l6.5 8v3H19v-3h6.5l-6.5-8v-3z" fill="#fff"/></svg>
    <span>Chat Zalo</span>
  </a>
  <a href="tel:0969069798" class="cta-btn cta-phone" title="Gọi Hotline">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
    <span>0969 069 798</span>
  </a>
</div>
`;

const htmlFiles = [
  'index.html',
  'san-pham-soda.html',
  'san-pham-cola.html',
  'san-pham-peach.html',
  'san-pham-lemon.html',
  'san-pham-cream.html',
  'san-pham-lemoncola.html',
  'san-pham-rock.html',
  'san-pham-toast.html',
  've-uhi.html',
  'hop-tac.html',
  'dat-hang.html',
  'quan-ly-don.html'
];

const projectDir = path.resolve(__dirname, '..');

for (const file of htmlFiles) {
  const filePath = path.join(projectDir, file);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // Strip previously inserted head pixel or noscript in head
  content = content.replace(/<!-- Meta Pixel Code -->[\s\S]*?<!-- End Meta Pixel Code -->/g, '');
  content = content.replace(/<!-- Meta Pixel Code \(noscript\) -->[\s\S]*?<!-- End Meta Pixel Code \(noscript\) -->/g, '');
  content = content.replace(/<link rel="stylesheet" href="\/floating-cta\.css">/g, '');
  content = content.replace(/<link rel="icon" type="image\/jpeg" href="\/assets\/logo\.jpg">/g, '');
  content = content.replace(/<div class="floating-cta"[\s\S]*?<\/div>\s*<\/div>/g, '');

  // Add pixel script to head
  content = content.replace('</head>', `${pixelHead}\n</head>`);

  // Add pixel noscript after <body>
  content = content.replace(/(<body[^>]*>)/i, `$1\n${pixelBody}`);

  // Add floating CTA if not present
  if (!content.includes('floating-cta')) {
    content = content.replace('</body>', `${floatingCtaHtml}\n</body>`);
  }

  // Normalize script tags to use absolute paths so they work on any sub-route
  content = content.replace(/<script src="([^"]+\.js)"><\/script>/g, '<script src="/$1"></script>');
  content = content.replace(/src="assets\//g, 'src="/assets/');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Patched ${file}`);
}
