// One-shot: inline the vendor libraries into index.html so the file is fully
// self-contained (works on double-click / file://, no external requests).
const fs = require('fs');
const p = require('path');
const d = __dirname;

let html = fs.readFileSync(p.join(d, 'index.html'), 'utf8');

// Escape any literal </script> inside the JS so it can't terminate the inline tag.
const esc = (js) => js.replace(/<\/script>/gi, '<\\/script>');

const react    = esc(fs.readFileSync(p.join(d, 'vendor', 'react.production.min.js'), 'utf8'));
const reactDom = esc(fs.readFileSync(p.join(d, 'vendor', 'react-dom.production.min.js'), 'utf8'));
const babel    = esc(fs.readFileSync(p.join(d, 'vendor', 'babel.min.js'), 'utf8'));

const swaps = [
  ['<script src="vendor/react.production.min.js"></script>',     '<script>\n' + react + '\n</script>'],
  ['<script src="vendor/react-dom.production.min.js"></script>', '<script>\n' + reactDom + '\n</script>'],
  ['<script src="vendor/babel.min.js"></script>',               '<script>\n' + babel + '\n</script>'],
];

for (const [from, to] of swaps) {
  if (!html.includes(from)) throw new Error('Marker not found (already inlined?): ' + from);
  html = html.replace(from, to);
}

fs.writeFileSync(p.join(d, 'index.html'), html, 'utf8');
console.log('Self-contained index.html written. Size = ' + (html.length / 1024).toFixed(0) + ' KB');
