/**
 * Generates clean illustrated SVG placeholders so the site looks finished
 * before you have real photography.  Run:  npm run placeholders
 *
 * To go live with real photos: drop files named  <slug>-1.jpg, <slug>-2.jpg  into
 * public/images/products/  and change IMAGE_EXT to "jpg" in src/data/images.js.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(process.cwd(), "public", "images");
for (const d of ["products", "categories", "hero", "branding"]) mkdirSync(join(ROOT, d), { recursive: true });

const C = {
  rani: "#B4154F", raniDark: "#8E0F3D", marigold: "#F2B544", marigoldSoft: "#FBE9C2",
  ink: "#24131E", paper: "#FAF6F3", kraft: "#C99A6B", wood: "#B98254", sage: "#6F8F6B",
  sageDark: "#4F6E4C", gold: "#D9A441", indigo: "#2F3E6B", blush: "#F5E2E1", blushDeep: "#EBC9CB",
};
const BG = { blush: "#F4DDE0", haldi: "#F8E6BE", sage: "#E1E8DA", lilac: "#E6DEEE", sand: "#F0E2D4", sky: "#DCE6EE" };
const BG_ORDER = ["blush", "haldi", "sage", "lilac", "sand", "sky"];

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}
function rng(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const shadow = (cx = 400, cy = 800, rx = 210) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="22" fill="#24131E" opacity=".14"/>`;
const heart = (x, y, s, fill, op = 1) =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M0 8 C0 -8 -28 -12 -28 8 C-28 26 0 44 0 44 C0 44 28 26 28 8 C28 -12 0 -8 0 8Z" fill="${fill}" opacity="${op}"/>`;
const bow = (cx, cy, color) => `
  <path d="M${cx} ${cy} C${cx - 70} ${cy - 85} ${cx - 150} ${cy - 55} ${cx - 110} ${cy - 10} C${cx - 80} ${cy + 15} ${cx - 20} ${cy + 7} ${cx} ${cy}Z" fill="${color}"/>
  <path d="M${cx} ${cy} C${cx + 70} ${cy - 85} ${cx + 150} ${cy - 55} ${cx + 110} ${cy - 10} C${cx + 80} ${cy + 15} ${cx + 20} ${cy + 7} ${cx} ${cy}Z" fill="${color}"/>
  <circle cx="${cx}" cy="${cy}" r="20" fill="${shade(color, -0.18)}"/>`;

const mugShape = (cx, base, s, color) => `<g transform="translate(${cx} ${base}) scale(${s})">
  <path d="M110 -215 q78 0 78 62 q0 62 -78 62" fill="none" stroke="${color}" stroke-width="26"/>
  <rect x="-110" y="-260" width="220" height="260" rx="24" fill="${color}"/>
  <ellipse cx="0" cy="-260" rx="110" ry="18" fill="${shade(color, -0.2)}"/>
  <ellipse cx="0" cy="-260" rx="94" ry="11" fill="#5A3A2B"/>
  ${heart(0, -160, 1.15, "#fff", 0.92)}</g>`;

const candle = (cx, base, w, h, wax) => {
  const top = base - h * 0.72;
  return `<rect x="${cx - w / 2}" y="${base - h}" width="${w}" height="${h}" rx="16" fill="#fff" opacity=".7" stroke="#E7DCD4" stroke-width="3"/>
  <rect x="${cx - w / 2 + 10}" y="${top}" width="${w - 20}" height="${h * 0.7}" rx="8" fill="${wax}"/>
  <line x1="${cx}" y1="${top}" x2="${cx}" y2="${top - 22}" stroke="#24131E" stroke-width="4"/>
  <path d="M${cx} ${top - 82} C${cx - 22} ${top - 52} ${cx - 16} ${top - 28} ${cx} ${top - 22} C${cx + 16} ${top - 28} ${cx + 22} ${top - 52} ${cx} ${top - 82}Z" fill="${C.marigold}"/>`;
};

const diya = (cx, base, s) => `<g transform="translate(${cx} ${base}) scale(${s})">
  <circle cx="0" cy="-150" r="95" fill="${C.marigold}" opacity=".22"/>
  <path d="M-135 -80 C-115 5 115 5 135 -80 Z" fill="#B88A32"/>
  <ellipse cx="0" cy="-80" rx="135" ry="20" fill="#E3B964"/>
  <ellipse cx="0" cy="-80" rx="114" ry="13" fill="#7A5617"/>
  <path d="M120 -86 q50 -12 70 -40 q-10 40 -60 56Z" fill="#E3B964"/>
  <path d="M0 -200 C-30 -158 -22 -112 0 -96 C22 -112 30 -158 0 -200Z" fill="#F59E0B"/>
  <path d="M0 -160 C-12 -138 -9 -116 0 -106 C9 -116 12 -138 0 -160Z" fill="#FDE68A"/></g>`;

const pot = (cx, base, s, color, seed) => {
  const r = rng(seed);
  let leaves = "";
  [-62, -36, -12, 12, 36, 62, -85, 85].forEach((a, i) => {
    const len = 52 + r() * 18;
    leaves += `<ellipse cx="0" cy="${-len * 0.9}" rx="${17 + r() * 5}" ry="${len}" transform="rotate(${a})" fill="${i % 2 ? C.sage : C.sageDark}"/>`;
  });
  return `<g transform="translate(${cx} ${base}) scale(${s})">
  <g transform="translate(0 -138)">${leaves}</g>
  <path d="M-100 -140 H100 L78 0 H-78Z" fill="${color}"/>
  <rect x="-108" y="-156" width="216" height="26" rx="6" fill="${shade(color, -0.15)}"/>
  <ellipse cx="0" cy="-140" rx="94" ry="8" fill="#4A3426"/></g>`;
};

const motifs = {
  box: ({ body = C.kraft, lid, ribbon = C.rani } = {}) => `${shadow()}
  <rect x="210" y="450" width="380" height="330" rx="6" fill="${body}"/>
  <rect x="210" y="450" width="380" height="16" fill="#000" opacity=".1"/>
  <rect x="190" y="385" width="420" height="85" rx="6" fill="${lid || shade(body, -0.14)}"/>
  <rect x="378" y="450" width="44" height="330" fill="${ribbon}"/>
  <rect x="378" y="385" width="44" height="85" fill="${ribbon}"/>
  ${bow(400, 385, ribbon)}`,

  frame: ({ wood = C.wood } = {}) => `${shadow(400, 790, 190)}
  <path d="M440 330 L560 790 L500 790 Z" fill="${shade(wood, -0.3)}"/>
  <rect x="235" y="290" width="330" height="440" rx="4" fill="${wood}"/>
  <rect x="235" y="290" width="330" height="440" rx="4" fill="none" stroke="${shade(wood, -0.25)}" stroke-width="4"/>
  <rect x="262" y="317" width="276" height="386" fill="#FBF6EE"/>
  <rect x="288" y="343" width="224" height="324" fill="${C.marigoldSoft}"/>
  <circle cx="455" cy="425" r="32" fill="${C.marigold}"/>
  <path d="M288 600 C330 520 380 540 420 590 C450 550 490 540 512 575 V667 H288Z" fill="${C.sage}"/>
  <path d="M288 640 C340 600 400 620 512 630 V667 H288Z" fill="${C.sageDark}"/>
  ${heart(400, 505, 1.2, C.rani)}`,

  mug: ({ color = C.rani, pair = false } = {}) =>
    pair ? `${shadow(400, 795, 290)}${mugShape(300, 780, 0.88, color)}${mugShape(515, 792, 0.88, C.indigo)}`
         : `${shadow()}${mugShape(380, 780, 1.1, color)}`,

  candle: ({ wax = C.indigo, trio = false } = {}) =>
    trio ? `${shadow(400, 790, 270)}${candle(255, 780, 150, 230, wax)}${candle(400, 790, 170, 300, shade(wax, 0.25))}${candle(550, 780, 150, 200, C.rani)}`
         : `${shadow()}${candle(400, 780, 220, 300, wax)}`,

  hamper: ({ basket = C.kraft, items = [C.rani, C.marigold, C.sage] } = {}) => {
    let weave = "";
    [585, 625, 665, 705, 745].forEach((y) => {
      const t = (y - 540) / 230;
      weave += `<line x1="${215 + 37 * t}" x2="${585 - 37 * t}" y1="${y}" y2="${y}" stroke="${shade(basket, -0.3)}" stroke-opacity=".5" stroke-width="3"/>`;
    });
    return `${shadow(400, 800, 230)}
    <path d="M250 540 C250 330 550 330 550 540" stroke="${shade(basket, -0.2)}" stroke-width="14" fill="none"/>
    <rect x="300" y="360" width="76" height="210" rx="10" fill="${items[0]}"/>
    <rect x="324" y="318" width="28" height="48" rx="4" fill="${C.ink}"/>
    <rect x="405" y="410" width="130" height="160" rx="6" fill="${items[1]}"/>
    <rect x="462" y="410" width="16" height="160" fill="${C.paper}" opacity=".8"/>
    <circle cx="260" cy="520" r="34" fill="${items[2]}"/><circle cx="560" cy="505" r="26" fill="${items[2]}"/>
    <path d="M215 540 H585 L548 770 H252Z" fill="${basket}"/>${weave}
    <rect x="205" y="528" width="390" height="28" rx="8" fill="${shade(basket, -0.2)}"/>
    ${bow(400, 600, C.rani)}`;
  },

  book: ({ cover = C.indigo, accent = C.marigold } = {}) => `${shadow(400, 790, 200)}
  <rect x="265" y="300" width="290" height="440" rx="10" fill="${cover}"/>
  <rect x="265" y="300" width="34" height="440" rx="10" fill="${shade(cover, -0.25)}"/>
  <rect x="505" y="300" width="14" height="440" fill="${accent}"/>
  <rect x="335" y="380" width="150" height="92" rx="4" fill="#FBF6EE" opacity=".93"/>
  <rect x="352" y="404" width="116" height="9" rx="4" fill="${cover}" opacity=".6"/>
  <rect x="352" y="428" width="76" height="9" rx="4" fill="${cover}" opacity=".35"/>
  <g transform="translate(300 705) rotate(-7)"><rect width="250" height="18" rx="9" fill="${accent}"/><rect width="34" height="18" rx="9" fill="${C.ink}"/></g>`,

  lamp: ({ pair = true } = {}) => pair ? `${shadow(400, 800, 290)}${diya(280, 780, 1)}${diya(530, 790, 0.78)}` : `${shadow()}${diya(400, 780, 1.2)}`,

  planter: ({ duo = true, color = C.rani } = {}) =>
    duo ? `${shadow(400, 790, 270)}${pot(290, 780, 1, color, 3)}${pot(520, 790, 0.82, C.marigold, 9)}`
        : `${shadow()}${pot(400, 780, 1.2, color, 3)}`,

  jar: () => {
    const r = rng(11), cols = [C.rani, C.marigold, C.blush, C.paper, C.sage, C.marigoldSoft];
    let slips = "";
    for (let i = 0; i < 34; i++) {
      slips += `<rect x="${318 + r() * 140}" y="${520 + r() * 210}" width="${40 + r() * 16}" height="${18 + r() * 8}" rx="2" transform="rotate(${r() * 90 - 45} 400 620)" fill="${cols[i % cols.length]}" stroke="#24131E" stroke-opacity=".08"/>`;
    }
    return `${shadow(400, 790, 190)}
    <rect x="290" y="470" width="220" height="300" rx="26" fill="#fff" opacity=".6" stroke="#E7DCD4" stroke-width="3"/>
    ${slips}
    <rect x="290" y="470" width="220" height="300" rx="26" fill="#fff" opacity=".25"/>
    <rect x="303" y="405" width="194" height="72" rx="12" fill="${C.wood}"/>
    <circle cx="400" cy="645" r="52" fill="#FBF6EE"/>${heart(400, 626, 1.15, C.rani)}`;
  },

  cushion: ({ color = C.rani } = {}) => `${shadow(400, 790, 240)}
  <path d="M250 410 Q400 380 550 410 Q575 560 550 710 Q400 740 250 710 Q225 560 250 410Z" fill="${color}"/>
  <path d="M270 430 Q400 406 530 430 Q550 560 530 690 Q400 714 270 690 Q250 560 270 430Z" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-dasharray="7 9"/>
  <ellipse cx="400" cy="560" rx="104" ry="124" fill="#FBF6EE"/>
  <ellipse cx="400" cy="560" rx="88" ry="108" fill="${C.marigoldSoft}"/>
  <path d="M312 610 C350 560 390 580 430 620 C455 590 480 585 488 600 V650 C440 690 360 690 312 650Z" fill="${C.sage}"/>
  ${heart(400, 530, 1.1, color)}
  <circle cx="245" cy="410" r="16" fill="${C.marigold}"/><circle cx="555" cy="410" r="16" fill="${C.marigold}"/>
  <circle cx="245" cy="712" r="16" fill="${C.marigold}"/><circle cx="555" cy="712" r="16" fill="${C.marigold}"/>`,

  blocks: () => `${shadow(400, 795, 240)}
  <rect x="225" y="640" width="150" height="140" rx="10" fill="${C.rani}"/><circle cx="300" cy="710" r="38" fill="#fff" opacity=".92"/>
  <rect x="425" y="640" width="150" height="140" rx="10" fill="${C.marigold}"/><path d="M500 668 L538 744 H462Z" fill="${C.ink}" opacity=".85"/>
  <g transform="rotate(-7 400 560)"><rect x="325" y="495" width="150" height="140" rx="10" fill="${C.indigo}"/><rect x="368" y="538" width="64" height="54" rx="4" fill="#fff" opacity=".92"/></g>`,

  bracelet: () => {
    let beads = "";
    for (let i = 0; i < 30; i++) {
      const a = (i / 30) * Math.PI * 2;
      beads += `<circle cx="${400 + 175 * Math.cos(a)}" cy="${520 + 175 * Math.sin(a)}" r="15" fill="${[C.gold, C.paper, C.rani][i % 3]}" stroke="#24131E" stroke-opacity=".1"/>`;
    }
    return `<ellipse cx="400" cy="560" rx="270" ry="260" fill="#24131E" opacity=".07"/>${beads}
    <line x1="400" y1="695" x2="400" y2="760" stroke="${C.gold}" stroke-width="4"/>
    <path d="M400 760 l30 38 l-30 46 l-30 -46Z" fill="${C.rani}"/><path d="M400 760 l30 38 h-60Z" fill="#fff" opacity=".25"/>`;
  },

  rakhi: () => {
    let petals = "";
    for (let i = 0; i < 8; i++) petals += `<ellipse cx="0" cy="-62" rx="26" ry="46" transform="rotate(${i * 45})" fill="${i % 2 ? C.marigold : C.gold}"/>`;
    return `${shadow(400, 800, 230)}
    <rect x="230" y="600" width="340" height="190" rx="8" fill="${C.kraft}"/>
    <rect x="210" y="562" width="380" height="58" rx="8" fill="${shade(C.kraft, -0.15)}"/>
    <rect x="380" y="562" width="40" height="228" fill="${C.marigold}"/>
    <g transform="translate(400 470)">
      <path d="M-30 20 C-110 90 -150 200 -170 300" stroke="${C.rani}" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M30 20 C110 90 150 200 170 300" stroke="${C.rani}" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M-12 40 C-60 120 -90 230 -100 320" stroke="${C.marigold}" stroke-width="7" fill="none" stroke-linecap="round"/>
      ${petals}<circle r="48" fill="${C.rani}"/><circle r="30" fill="${C.marigoldSoft}"/><circle r="13" fill="${C.rani}"/>
    </g>`;
  },
};

function svg({ bg, motif, scale = 1, dy = 0, pattern = false, w = 800, h = 1000, raw = false }) {
  const cx = w / 2, cy = 540;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-hidden="true">
  ${bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : ""}
  ${pattern ? `<defs><pattern id="d" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="2" fill="#24131E" opacity=".07"/></pattern></defs><rect width="${w}" height="${h}" fill="url(#d)"/>` : ""}
  ${bg && !raw ? `<circle cx="${cx}" cy="520" r="310" fill="#fff" opacity=".32"/>` : ""}
  ${raw ? motif : `<g transform="translate(${cx} ${cy + dy}) scale(${scale}) translate(-${cx} -${cy})">${motif}</g>`}
</svg>`;
}
const write = (dir, name, content) => writeFileSync(join(ROOT, dir, name), content);

/* ---------- products: slug -> motif ---------- */
const PRODUCTS = [
  ["personalized-photo-frame", motifs.frame(), "blush"],
  ["wooden-love-gift-box", motifs.box({ body: C.wood, ribbon: C.rani }), "sand"],
  ["couple-name-mug-pair", motifs.mug({ pair: true }), "sky"],
  ["starry-night-candle-trio", motifs.candle({ trio: true }), "lilac"],
  ["birthday-surprise-box", motifs.box({ body: C.rani, ribbon: C.marigold }), "haldi"],
  ["storybook-night-gift-set", motifs.book({ cover: C.indigo, accent: C.marigold }), "sky"],
  ["monogram-diary-pen-set", motifs.book({ cover: C.ink, accent: C.gold }), "sand"],
  ["diwali-dry-fruit-diya-hamper", motifs.hamper(), "haldi"],
  ["handcrafted-brass-diya-set", motifs.lamp(), "lilac"],
  ["succulent-planter-duo", motifs.planter(), "sage"],
  ["birthstone-charm-bracelet", motifs.bracelet(), "blush"],
  ["executive-welcome-kit", motifs.hamper({ basket: C.ink, items: [C.indigo, C.gold, C.paper] }), "sand"],
  ["our-story-photo-cushion", motifs.cushion(), "sky"],
  ["name-puzzle-wooden-blocks", motifs.blocks(), "haldi"],
  ["365-notes-love-jar", motifs.jar(), "blush"],
  ["chai-lovers-gift-crate", motifs.hamper({ basket: C.wood, items: [C.indigo, C.marigold, C.sage] }), "sage"],
  ["rakhi-and-mithai-box", motifs.rakhi(), "haldi"],
  ["little-thank-you-box", motifs.box({ body: C.blush, lid: C.blushDeep, ribbon: C.marigold }), "sage"],
];
PRODUCTS.forEach(([slug, motif, bg]) => {
  write("products", `${slug}-1.svg`, svg({ bg: BG[bg], motif }));
  const next = BG_ORDER[(BG_ORDER.indexOf(bg) + 2) % BG_ORDER.length];
  write("products", `${slug}-2.svg`, svg({ bg: BG[next], motif, scale: 1.28, dy: 30, pattern: true }));
});

/* ---------- categories ---------- */
const CATS = {
  "birthday-gifts": [motifs.box({ body: C.rani, ribbon: C.marigold }), "haldi"],
  "anniversary-gifts": [motifs.jar(), "blush"],
  "personalised-gifts": [motifs.frame(), "sand"],
  "couple-gifts": [motifs.mug({ pair: true }), "sky"],
  "kids-gifts": [motifs.blocks(), "sage"],
  "corporate-gifts": [motifs.book({ cover: C.ink, accent: C.gold }), "lilac"],
  "home-decor": [motifs.candle({ trio: true }), "blush"],
  "special-occasions": [motifs.lamp(), "haldi"],
};
Object.entries(CATS).forEach(([slug, [motif, bg]]) => write("categories", `${slug}.svg`, svg({ bg: BG[bg], motif, scale: 1.1 })));

/* ---------- hero (transparent) ---------- */
write("hero", "hero-frame.svg", svg({ motif: motifs.frame(), scale: 1.05 }));
write("hero", "hero-box.svg", svg({ motif: motifs.box({ body: C.rani, ribbon: C.marigold }) }));
write("hero", "hero-candle.svg", svg({ motif: motifs.candle({ wax: C.indigo }) }));

/* seasonal (Diwali) */
{
  const r = rng(5);
  let petals = "";
  for (let i = 0; i < 40; i++) petals += `<circle cx="${r() * 800}" cy="${r() * 1000}" r="${5 + r() * 9}" fill="${[C.marigold, C.rani, C.gold][i % 3]}" opacity=".7"/>`;
  const motif = `${petals}${shadow(400, 800, 300)}${diya(230, 800, 0.9)}${diya(560, 790, 0.9)}${diya(400, 700, 1.1)}`;
  write("hero", "seasonal.svg", svg({ bg: BG.haldi, motif }));
}
/* story (wide) */
{
  const r = rng(21);
  let hearts = "";
  for (let i = 0; i < 14; i++) hearts += heart(r() * 1600, r() * 1000, 0.5 + r() * 0.8, i % 2 ? C.rani : C.marigold, 0.55);
  const motif = `${hearts}
    <g transform="translate(750 0)">${motifs.hamper()}</g>
    <g transform="translate(-60 110) scale(.92)">${motifs.frame()}</g>
    <g transform="translate(1000 330) scale(.7)">${motifs.box({ body: C.rani, ribbon: C.marigold })}</g>`;
  write("hero", "story.svg", svg({ bg: BG.blush, motif, w: 1600, h: 1000, raw: true }));
}

/* shop front (replace with your own photo: public/images/shop/shop-front.jpg) */
{
  mkdirSync(join(ROOT, "shop"), { recursive: true });
  let stripes = "";
  for (let i = 0; i < 12; i++) stripes += `<path d="M${300 + i * 83} 330 h83 l-14 70 h-83z" fill="${i % 2 ? C.paper : C.rani}"/>`;
  const win = (x, motif, sc) => `<rect x="${x}" y="470" width="270" height="300" rx="4" fill="#FFF8EC" stroke="${C.ink}" stroke-opacity=".25" stroke-width="4"/>
    <g transform="translate(${x + 135} 770) scale(${sc}) translate(-400 -800)">${motif}</g>`;
  const motif = `
    <rect width="1600" height="1000" fill="${BG.sky}"/>
    <circle cx="1380" cy="150" r="70" fill="${C.marigold}" opacity=".8"/>
    <rect x="0" y="820" width="1600" height="180" fill="#CFC3B8"/><rect x="0" y="820" width="1600" height="14" fill="#B5A89B"/>
    <rect x="250" y="190" width="1100" height="640" fill="#F4E6D8"/>
    <rect x="250" y="190" width="1100" height="40" fill="${shade("#F4E6D8", -0.12)}"/>
    <rect x="450" y="215" width="700" height="100" rx="8" fill="${C.ink}"/>
    <text x="800" y="285" text-anchor="middle" font-family="Georgia, serif" font-size="64" fill="${C.marigold}">${"Tohfa"}</text>
    ${stripes}
    <rect x="300" y="400" width="1000" height="12" fill="${C.raniDark}" opacity=".35"/>
    ${win(300, motifs.frame(), 0.5)}
    <rect x="665" y="470" width="270" height="360" rx="4" fill="${C.wood}"/><rect x="690" y="495" width="220" height="335" fill="#FFF8EC" opacity=".55"/>
    <circle cx="905" cy="665" r="9" fill="${C.ink}"/>
    ${win(1030, motifs.box({ body: C.rani, ribbon: C.marigold }), 0.5)}
    <rect x="1130" y="740" width="0" height="0"/>
    <g transform="translate(1440 790) scale(.5)">${motifs.planter()}</g>
    <g transform="translate(160 790) scale(.45) translate(-400 0)">${motifs.planter({ duo: false, color: C.marigold })}</g>`;
  write("shop", "shop-front.svg", svg({ motif, w: 1600, h: 1000, raw: true }));
}

write("branding", "README.txt", "Put your logo here (logo.png / logo.svg) and set siteConfig.logo.image to its path.\n");
console.log("Placeholders written to public/images");
