/* ============================================================
   Lynya Organics — script.js
   All JavaScript: product data, cart, UI interactions
   ============================================================ */

'use strict';

// ─── Product Data ─────────────────────────────────────────────────────────────
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
  },
];

// ─── Cart State ───────────────────────────────────────────────────────────────
const cart = {};

// ─── DOM References ───────────────────────────────────────────────────────────
const cartSidebar         = document.getElementById('cartSidebar');
const cartOverlay         = document.getElementById('cartOverlay');
const cartToggleBtn       = document.getElementById('cartToggleBtn');
const cartCloseBtn        = document.getElementById('cartCloseBtn');
const cartCountBadge      = document.getElementById('cartCount');
const cartItemsContainer  = document.getElementById('cartItemsContainer');
const cartFooter          = document.getElementById('cartFooter');
const cartTotalEl         = document.getElementById('cartTotal');
const productsGrid        = document.getElementById('productsGrid');
const newsletterForm      = document.getElementById('newsletterForm');
const toastEl             = document.getElementById('toast');

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatPrice(n) {
  return '$' + n.toFixed(2);
}

function starsHTML(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  let html = '';
  for (let i = 0; i < full; i++) html += '★';
  if (half) html += '½';
  return html;
}

let toastTimer = null;
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3000);
}

// ─── Product Rendering ────────────────────────────────────────────────────────
function renderProducts(products) {
  productsGrid.innerHTML = '';

  if (products.length === 0) {
    productsGrid.innerHTML = '<p style="color:var(--color-text-muted);grid-column:1/-1;text-align:center;padding:3rem 0;">No products found in this category.</p>';
    return;
  }

  products.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.id = product.id;

    card.innerHTML = `
      <div class="product-img-wrap" style="background:${product.bg};">
        <div style="font-size:5rem;">${product.emoji}</div>
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        <button class="product-wishlist" aria-label="Add to wishlist" onclick="handleWishlist(event, ${product.id})">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>
      <div class="product-info">
        <div class="product-category">${product.categoryLabel}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-stars">
          <span class="stars">${starsHTML(product.rating)}</span>
          <span class="product-reviews">${product.rating} (${product.reviews} reviews)</span>
        </div>
        <div class="product-footer">
          <div>
            <span class="product-price">${formatPrice(product.price)}</span>
            ${product.oldPrice ? `<span class="product-price-old">${formatPrice(product.oldPrice)}</span>` : ''}
          </div>
          <button class="btn-add-cart" aria-label="Add to cart" onclick="addToCart(${product.id})">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          </button>
        </div>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}

// ─── Filter Products ──────────────────────────────────────────────────────────
function filterProducts(category) {
  const filtered = category === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === category);
  renderProducts(filtered);
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// ─── Cart Logic ───────────────────────────────────────────────────────────────
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  if (cart[productId]) {
    cart[productId].qty += 1;
  } else {
    cart[productId] = { ...product, qty: 1 };
  }

  updateCartUI();
  openCart();
  showToast(`✅ ${product.name} added to cart!`);
}

function removeFromCart(productId) {
  delete cart[productId];
  updateCartUI();
}

function changeQty(productId, delta) {
  if (!cart[productId]) return;
  cart[productId].qty += delta;
  if (cart[productId].qty <= 0) {
    removeFromCart(productId);
  } else {
    updateCartUI();
  }
}

function updateCartUI() {
  const items = Object.values(cart);
  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  // Update badge
  cartCountBadge.textContent = totalQty;

  // Render items
  if (items.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛍️</div>
        <p style="font-weight:600;color:var(--color-text-main);">Your cart is empty</p>
        <p style="font-size:0.85rem;">Add some organic goodness!</p>
      </div>
    `;
    cartFooter.style.display = 'none';
  } else {
    cartItemsContainer.innerHTML = items.map(item => `
      <div class="cart-item">
        <div class="cart-item-img" style="background:${item.bg};">${item.emoji}</div>
        <div style="flex:1;">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatPrice(item.price)}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <button onclick="removeFromCart(${item.id})" style="background:none;border:none;cursor:pointer;color:var(--color-text-light);font-size:1rem;padding:0.25rem;" aria-label="Remove item">✕</button>
      </div>
    `).join('');
    cartFooter.style.display = 'block';
    cartTotalEl.textContent = formatPrice(totalPrice);
  }
}

// ─── Cart Sidebar Toggle ──────────────────────────────────────────────────────
function openCart() {
  cartSidebar.classList.add('active');
  cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartSidebar.classList.remove('active');
  cartOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

cartToggleBtn.addEventListener('click', () => {
  cartSidebar.classList.contains('active') ? closeCart() : openCart();
});

cartCloseBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Close cart on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeCart();
});

// ─── Wishlist (UI only) ───────────────────────────────────────────────────────
function handleWishlist(event, productId) {
  event.stopPropagation();
  const product = PRODUCTS.find(p => p.id === productId);
  showToast(`💚 ${product.name} saved to wishlist!`);
}

// ─── Newsletter Form ──────────────────────────────────────────────────────────
newsletterForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('newsletterEmail').value.trim();
  if (!email) return;
  showToast('🎉 Welcome! Check your inbox for 15% off.');
  newsletterForm.reset();
});

// ─── Navbar scroll shadow ─────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 10) {
    navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
  } else {
    navbar.style.boxShadow = '0 1px 0 #e5e7eb';
  }
});

// ─── Scroll-in animation ──────────────────────────────────────────────────────
const observerOpts = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOpts);

function initScrollAnimations() {
  const targets = document.querySelectorAll('.product-card, .category-card, .testimonial-card, .pillar-card, .feature-item');
  targets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
    observer.observe(el);
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────
function init() {
  renderProducts(PRODUCTS);
  updateCartUI();
  // Run animation init after products are rendered
  setTimeout(initScrollAnimations, 50);
}

document.addEventListener('DOMContentLoaded', init);
