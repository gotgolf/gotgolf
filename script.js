const STRIPE_CHECKOUT_LINK = "https://buy.stripe.com/5kQbJ18Bd9GDgLH8NTbZe00";

const PRODUCT = {
 name: "Anti-Slice Rub",
 price: 24.99,
 compareAt: 29.99,
 currency: "USD"
};

const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

function money(n){
 return n.toLocaleString(undefined, { style:"currency", currency: PRODUCT.currency });
}

// Set pricing UI
$("#priceNow").textContent = money(PRODUCT.price);
$("#priceCompare").textContent = money(PRODUCT.compareAt);
const savePct = Math.max(0, Math.round((1 - (PRODUCT.price / PRODUCT.compareAt)) * 100));
$("#saveBadge").textContent = savePct ? `Save ${savePct}%` : "";

// Gallery thumbnails
const mainImage = $("#mainImage");
$$(".thumb").forEach(btn => {
 btn.addEventListener("click", () => {
   $$(".thumb").forEach(b => b.classList.remove("isActive"));
   btn.classList.add("isActive");
   mainImage.src = btn.dataset.src;
 });
});

// Quantity controls
const qtyInput = $("#qty");
const qtyDown = $("#qtyDown");
const qtyUp = $("#qtyUp");

function clampQty(){
 const q = Math.max(1, parseInt(qtyInput.value || "1", 10));
 qtyInput.value = String(q);
 return q;
}

qtyDown.addEventListener("click", () => { qtyInput.value = String(clampQty() - 1); clampQty(); syncCheckoutLink(); });
qtyUp.addEventListener("click", () => { qtyInput.value = String(clampQty() + 1); clampQty(); syncCheckoutLink(); });
qtyInput.addEventListener("input", () => { clampQty(); syncCheckoutLink(); });

// Stripe checkout link handling
const buyNow = $("#buyNow");
const checkoutLink = $("#checkoutLink");

function syncCheckoutLink(){
 const q = clampQty();
 const url = new URL(STRIPE_CHECKOUT_LINK);
 // NOTE: Stripe Payment Links may not honor quantity query params unless configured.
 // Still useful for tracking / future integration.
 url.searchParams.set("quantity", q);
 buyNow.href = url.toString();
 checkoutLink.href = url.toString();
}
syncCheckoutLink();

// Cart state (simple local state)
let cartQty = 0;

const cartCount = $("#cartCount");
const cartQtyEl = $("#cartQty");
const cartTotal = $("#cartTotal");

function renderCart(){
 cartCount.textContent = String(cartQty);
 cartQtyEl.textContent = String(Math.max(1, cartQty));
 cartTotal.textContent = money(PRODUCT.price * Math.max(1, cartQty));
}

// Drawer controls
const drawer = $("#drawer");
const overlay = $("#drawerOverlay");
const openMiniCart = $("#openMiniCart");
const closeDrawer = $("#closeDrawer");

function openDrawer(){
 drawer.classList.add("isOpen");
 drawer.setAttribute("aria-hidden", "false");
 document.body.style.overflow = "hidden";
}
function closeDrawerFn(){
 drawer.classList.remove("isOpen");
 drawer.setAttribute("aria-hidden", "true");
 document.body.style.overflow = "";
}

openMiniCart.addEventListener("click", openDrawer);
closeDrawer.addEventListener("click", closeDrawerFn);
overlay.addEventListener("click", closeDrawerFn);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawerFn(); });

// Add to cart
$("#addToCart").addEventListener("click", () => {
 cartQty += clampQty();
 renderCart();
 openDrawer();
});

// Sticky buy (mobile)
$("#stickyBuy").addEventListener("click", () => {
 // mimic Shopify: open cart after add
 cartQty += clampQty();
 renderCart();
 openDrawer();
});

const buyStickyMobile = $("#buyStickyMobile");
if (buyStickyMobile){
 buyStickyMobile.addEventListener("click", () => {
   cartQty += clampQty();
   renderCart();
   openDrawer();
 });
}

// Mobile menu
const burger = $("#burger");
const mobileNav = $("#mobileNav");
burger.addEventListener("click", () => {
 const hidden = mobileNav.hasAttribute("hidden");
 if (hidden) mobileNav.removeAttribute("hidden");
 else mobileNav.setAttribute("hidden", "");
});

// Videos: mute all
$("#muteAll").addEventListener("click", () => {
 $$("video").forEach(v => v.muted = true);
});

// Review count sync
const reviewCount = 128;
$("#reviewCount").textContent = String(reviewCount);
$("#reviewCount2").textContent = String(reviewCount);

// Footer year
$("#year").textContent = String(new Date().getFullYear());

// Init cart
renderCart();