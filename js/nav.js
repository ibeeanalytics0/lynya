/* ============================================================
   js/nav.js — injects navbar + cart sidebar on every page
   Call: initNav('pageName') at bottom of each HTML file
   Page names: 'home' | 'shop' | 'about' | 'contact'
   ============================================================ */

function initNav(activePage, base) {
  /* base = '' for root pages, '../' for /pages/ */
  base = base || '';

  /* ── Inject Navbar ── */
  document.body.insertAdjacentHTML('afterbegin', `
    <nav class="navbar" id="navbar">
      <a href="${base}index.html" class="navbar-logo">🌿 Lynya <span>Organics</span></a>
      <ul class="navbar-links">
        <li><a href="${base}index.html"          ${activePage==='home'   ?'class="active"':''}>Home</a></li>
        <li><a href="${base}pages/shop.html"     ${activePage==='shop'   ?'class="active"':''}>Shop</a></li>
        <li><a href="${base}pages/about.html"    ${activePage==='about'  ?'class="active"':''}>About Us</a></li>
        <li><a href="${base}pages/contact.html"  ${activePage==='contact'?'class="active"':''}>Contact</a></li>
      </ul>
      <div class="navbar-actions">
        <button aria-label="Search" onclick="toast('Search coming soon!')">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </button>
        <button class="cart-btn" id="cartToggle" aria-label="Open cart">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <span class="cart-badge" id="cartCount">0</span>
        </button>
      </div>
    </nav>
  `);

  /* ── Inject Cart Sidebar + Toast ── */
  document.body.insertAdjacentHTML('beforeend', `
    <div class="cart-overlay" id="cartOverlay"></div>
    <aside class="cart-sidebar" id="cartSidebar">
      <div class="cart-head">
        <div class="cart-title">Your Cart 🛍️</div>
        <button class="cart-close" id="cartClose">✕</button>
      </div>
      <div class="cart-items" id="cartItems"></div>
      <div class="cart-foot" id="cartFoot" style="display:none;">
        <div class="cart-total-row">
          <span class="cart-total-label">Total</span>
          <span class="cart-total-val" id="cartTotal">$0.00</span>
        </div>
        <a href="${base}pages/checkout.html" class="btn-primary" style="width:100%;justify-content:center;">
          Proceed to Checkout →
        </a>
      </div>
    </aside>
    <div class="toast" id="toast"></div>
  `);

  /* ── Cart open/close ── */
  const sidebar  = document.getElementById('cartSidebar');
  const overlay  = document.getElementById('cartOverlay');

  function openCart()  {
    renderCart();
    sidebar.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('cartToggle').addEventListener('click', () =>
    sidebar.classList.contains('open') ? closeCart() : openCart()
  );
  document.getElementById('cartClose').addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

  /* ── Navbar scroll shadow ── */
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 8);
  });

  /* ── Init badge ── */
  Cart.updateBadge();
}

/* ── Render cart sidebar contents ── */
function renderCart() {
  const items    = Cart.items();
  const itemsEl  = document.getElementById('cartItems');
  const footEl   = document.getElementById('cartFoot');
  const totalEl  = document.getElementById('cartTotal');

  if (!itemsEl) return;

  if (items.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛍️</div>
        <strong>Your cart is empty</strong>
        <p>Add some organic goodness!</p>
      </div>`;
    if (footEl) footEl.style.display = 'none';
    return;
  }

  itemsEl.innerHTML = items.map(item => `
    <div class="cart-item">
      <div class="ci-img" style="background:${item.bg};">${item.emoji}</div>
      <div style="flex:1;min-width:0;">
        <div class="ci-name">${item.name}</div>
        <div class="ci-price">${fmt(item.price)}</div>
        <div class="ci-qty">
          <button class="qty-btn" onclick="Cart.setQty(${item.id},${item.qty-1});renderCart();Cart.updateBadge();">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="Cart.setQty(${item.id},${item.qty+1});renderCart();Cart.updateBadge();">+</button>
        </div>
      </div>
      <button class="ci-remove" onclick="Cart.remove(${item.id});renderCart();Cart.updateBadge();">✕</button>
    </div>`).join('');

  if (footEl) footEl.style.display = 'block';
  if (totalEl) totalEl.textContent = fmt(Cart.totalPrice());
}
