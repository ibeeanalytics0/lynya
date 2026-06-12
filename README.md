# Lynya Organics — E-Commerce Website

Clean static HTML/CSS/JS website with Stripe payment integration via Vercel Functions.

---

## Folder Structure

```
lynya/
├── index.html              ← Homepage
├── pages/
│   ├── shop.html           ← Product catalog with filters
│   ├── product.html        ← Individual product detail (?id=1)
│   ├── checkout.html       ← Checkout form + Stripe redirect
│   ├── success.html        ← After successful payment
│   ├── cancel.html         ← After cancelled payment
│   ├── about.html          ← About Lynya page
│   └── contact.html        ← Contact form + FAQ
├── css/
│   └── style.css           ← All styles (no build step needed)
├── js/
│   ├── products.js         ← Product data + Cart (localStorage) + helpers
│   └── nav.js              ← Navbar + cart sidebar (injected on every page)
├── api/
│   └── create-checkout.js  ← Vercel Function: creates Stripe checkout session
├── assets/
│   └── images/             ← Product + brand images (add here)
├── vercel.json             ← Vercel routing config
├── package.json            ← Only dependency: stripe
├── .env.local.example      ← Copy to .env.local and fill in keys
└── .gitignore
```

---

## Running Locally

Just open `index.html` in a browser — no build step, no server needed for the frontend.

To test Stripe payments locally:
```bash
npm install
npx vercel dev
```
Then open http://localhost:3000

---

## Stripe Setup (when account is approved)

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com) → Developers → API Keys
2. Copy your **Secret Key** (`sk_live_...`)
3. In Vercel dashboard → Project → Settings → Environment Variables, add:
   - `STRIPE_SECRET_KEY` = `sk_live_...`
   - `YOUR_DOMAIN` = `https://lynya02.vercel.app`
4. Redeploy

**Test mode** (before approval): use `sk_test_...` key and test card `4242 4242 4242 4242`

---

## Payment Methods Supported

| Method | Details |
|--------|---------|
| Debit Card | Visa, Mastercard, Amex via Stripe |
| Credit Card | All major cards via Stripe |
| Pay As You Go | Affirm BNPL — 4 payments, 0% interest (orders ≥ $50) |

**Pay As You Go model:** Stripe charges 2.9% + $0.30 per transaction only when a sale happens. No monthly fees, no setup fees.

---

## Adding Real Products

Edit `js/products.js` — add/edit the `PRODUCTS` array. Each product needs:
- `id`, `name`, `category`, `price`, `emoji`, `bg`, `description`, `ingredients`, `size`
- `stripePriceId` — create products in Stripe dashboard and paste the price ID here

## Adding Real Images

Replace emoji placeholders by adding images to `assets/images/` and updating the product card HTML in `js/products.js`.
