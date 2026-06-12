/* ============================================================
   js/products.js — product data + cart (localStorage)
   Included in every page via <script src="../js/products.js">
   ============================================================ */

const PRODUCTS = [
  {
    id: 1,
    name: 'Rose Quartz Hydrating Serum',
    category: 'skincare',
    categoryLabel: 'Skincare',
    price: 34.20,
    oldPrice: 42.00,
    rating: 4.8,
    reviews: 148,
    badge: 'Bestseller',
    emoji: '🌹',
    bg: 'linear-gradient(135deg,#f8d7e3,#e8b4c8)',
    description: 'A deeply hydrating serum infused with organic rose extract and hyaluronic acid. Visibly plumps, brightens, and softens skin within 2 weeks of daily use.',
    ingredients: 'Organic Rose Water, Hyaluronic Acid, Vitamin E, Aloe Vera, Jojoba Oil, Rosehip Seed Oil',
    size: '30ml',
    stripePriceId: 'price_TEST_rose_serum'
  },
  {
    id: 2,
    name: 'Green Tea Brightening Moisturiser',
    category: 'skincare',
    categoryLabel: 'Skincare',
    price: 29.50,
    oldPrice: null,
    rating: 4.9,
    reviews: 206,
    badge: 'New',
    emoji: '🍵',
    bg: 'linear-gradient(135deg,#c9e8d0,#7fb88a)',
    description: 'Lightweight daily moisturiser packed with antioxidant-rich green tea extract. Protects against environmental stressors while delivering 72-hour hydration.',
    ingredients: 'Green Tea Extract, Niacinamide, Ceramides, Shea Butter, Squalane, Zinc PCA',
    size: '50ml',
    stripePriceId: 'price_TEST_green_tea'
  },
  {
    id: 3,
    name: 'Vitamin C Glow Face Oil',
    category: 'skincare',
    categoryLabel: 'Skincare',
    price: 14.75,
    oldPrice: 20.00,
    rating: 4.6,
    reviews: 53,
    badge: null,
    emoji: '🍊',
    bg: 'linear-gradient(135deg,#fde8c0,#f4a940)',
    description: 'Potent vitamin C face oil that fades dark spots, evens skin tone, and restores radiance. Non-greasy formula absorbs instantly.',
    ingredients: 'Vitamin C (Ascorbic Acid), Rosehip Oil, Sea Buckthorn, Argan Oil, Calendula Extract',
    size: '20ml',
    stripePriceId: 'price_TEST_vit_c'
  },
  {
    id: 4,
    name: 'Aloe Vera Soothing Body Lotion',
    category: 'bodycare',
    categoryLabel: 'Body Care',
    price: 38.30,
    oldPrice: null,
    rating: 4.7,
    reviews: 128,
    badge: 'Bestseller',
    emoji: '🌵',
    bg: 'linear-gradient(135deg,#d4eee0,#52b788)',
    description: 'Rich, fast-absorbing body lotion that soothes, hydrates, and repairs dry skin. Organic aloe vera calms irritation while shea butter seals in moisture all day.',
    ingredients: 'Organic Aloe Vera, Shea Butter, Coconut Oil, Vitamin E, Chamomile Extract, Lavender Oil',
    size: '200ml',
    stripePriceId: 'price_TEST_aloe'
  },
  {
    id: 5,
    name: 'Argan Oil Deep Repair Hair Mask',
    category: 'haircare',
    categoryLabel: 'Haircare',
    price: 21.70,
    oldPrice: 28.00,
    rating: 4.5,
    reviews: 89,
    badge: null,
    emoji: '✨',
    bg: 'linear-gradient(135deg,#f5e6c8,#d4a55e)',
    description: 'Intensive weekly treatment that repairs damage, reduces frizz, and restores shine. Liquid gold argan oil penetrates each strand for silky, manageable hair.',
    ingredients: 'Argan Oil, Keratin, Avocado Oil, Panthenol, Hydrolysed Wheat Protein, Camellia Oil',
    size: '150ml',
    stripePriceId: 'price_TEST_argan'
  },
  {
    id: 6,
    name: 'Lavender Calming Night Cream',
    category: 'skincare',
    categoryLabel: 'Skincare',
    price: 23.50,
    oldPrice: 30.00,
    rating: 4.8,
    reviews: 175,
    badge: 'Sale',
    emoji: '💜',
    bg: 'linear-gradient(135deg,#e8d5f5,#9b72cf)',
    description: 'A rich overnight cream that works while you sleep. Organic lavender calms the senses while bakuchiol renews skin overnight.',
    ingredients: 'Organic Lavender Oil, Bakuchiol, Peptides, Ceramides, Evening Primrose Oil, Magnesium',
    size: '50ml',
    stripePriceId: 'price_TEST_lavender'
  }
];

/* ── Cart (localStorage) ─────────────────────────────────────────────────── */
const Cart = {
  get() {
    try { return JSON.parse(localStorage.getItem('lynya_cart') || '{}'); }
    catch { return {}; }
  },
  save(data) { localStorage.setItem('lynya_cart', JSON.stringify(data)); },
  add(id, qty = 1) {
    const c = this.get();
    c[id] = (c[id] || 0) + qty;
    this.save(c);
    this.updateBadge();
  },
  remove(id) {
    const c = this.get();
    delete c[id];
    this.save(c);
    this.updateBadge();
  },
  setQty(id, qty) {
    const c = this.get();
    if (qty <= 0) delete c[id]; else c[id] = qty;
    this.save(c);
    this.updateBadge();
  },
  items() {
    return Object.entries(this.get()).map(([id, qty]) => {
      const p = PRODUCTS.find(p => p.id === Number(id));
      return p ? { ...p, qty } : null;
    }).filter(Boolean);
  },
  totalQty()   { return Object.values(this.get()).reduce((s, q) => s + q, 0); },
  totalPrice() {
    return this.items().reduce((s, i) => s + i.price * i.qty, 0);
  },
  clear() { localStorage.removeItem('lynya_cart'); this.updateBadge(); },
  updateBadge() {
    const b = document.getElementById('cartCount');
    if (b) b.textContent = this.totalQty();
  }
};

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function fmt(n)  { return '$' + Number(n).toFixed(2); }
function stars(r){ return '★'.repeat(Math.floor(r)) + (r % 1 >= 0.5 ? '½' : ''); }

let _toastT = null;
function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(_toastT);
  _toastT = setTimeout(() => el.classList.remove('show'), 3000);
}

/* ── Product card HTML (reused on index + shop) ──────────────────────────── */
function productCardHTML(p, base = '') {
  return `
  <article class="product-card">
    <a href="${base}pages/product.html?id=${p.id}">
      <div class="product-img" style="background:${p.bg};">
        <span>${p.emoji}</span>
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <button class="wishlist-btn" onclick="event.preventDefault();toast('💚 Saved to wishlist!')">♡</button>
      </div>
      <div class="product-info">
        <div class="product-cat">${p.categoryLabel}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-stars">
          <span class="stars">${stars(p.rating)}</span>
          <span class="review-count">${p.rating} (${p.reviews})</span>
        </div>
        <div class="product-footer">
          <div>
            <span class="product-price">${fmt(p.price)}</span>
            ${p.oldPrice ? `<span class="product-old">${fmt(p.oldPrice)}</span>` : ''}
          </div>
          <button class="add-cart-btn" onclick="event.preventDefault();Cart.add(${p.id});toast('✅ Added to cart!');Cart.updateBadge();">+</button>
        </div>
      </div>
    </a>
  </article>`;
}
