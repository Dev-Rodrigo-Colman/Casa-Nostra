/**
 * CASA NOSTRA PIZZERÍA — Ypacaraí, Paraguay
 * Lógica del menú interactivo, carrito persistente y pedidos por WhatsApp
 */

/* ==========================================================================
   1. CONSTANTES Y DATOS DEL NEGOCIO
   ========================================================================== */
const WHATSAPP_NUMBER = "595981661163"; // +595 981 661163
const BUSINESS_NAME = "Casa Nostra Pizzería";
const INSTAGRAM_HANDLE = "@casanostra_pizzeria_ypacarai";

// Horarios: Martes a domingo desde las 18:00 (Lunes cerrado)
const OPENING_HOUR = 18;
const CLOSED_DAY = 1; // 1 = Lunes

// Promo martes a jueves
const PROMO_DAYS = [2, 3, 4]; // Martes, Miércoles, Jueves
const PROMO_MOZZARELLA_PRICE = 30000;

// Almacenamiento local
const STORAGE_KEY_CART = "casa_nostra_cart_v2";
const STORAGE_KEY_LAST_ORDER = "casa_nostra_last_order_v2";

/* ==========================================================================
   2. DATOS DE LA CARTA COMPLETA
   ========================================================================== */
const PIZZAS = [
  { id: "mozzarella", name: "Mozzarella", desc: "Salsa de tomate, mozzarella, orégano, aceituna.", price: 35000, img: "mozzarella.jpg", badge: "Más pedida" },
  { id: "marinara", name: "Marinara", desc: "Salsa de tomate, anchoas, orégano, ajo.", price: 55000 },
  { id: "putanessca", name: "Putanessca", desc: "Salsa de tomate, mozzarella, alcaparras, anchoas, ajo, aceituna, albahaca.", price: 65000 },
  { id: "oreganatto", name: "Oreganatto", desc: "Salsa de tomate, mozzarella, rodajas de tomate, ajo, aceituna, orégano.", price: 50000 },
  { id: "burguer4quesos", name: "Burguer 4 quesos", desc: "Salsa de tomate, mozzarella, roquefort, catupiry, cheddar, hamburguesa, aceituna.", price: 65000, badge: "Especial" },
  { id: "panchopapa", name: "Pancho papa", desc: "Salsa de tomate, mozzarella, catupiry, pancho, papitas, aceitunas.", price: 60000 },
  { id: "mexicana", name: "Mexicana", desc: "Salsa de tomate, mozzarella, cebolla, locote picante, calabresa, pepperoni, aceituna.", price: 65000, badge: "Picante" },
  { id: "tomatealbahaca", name: "Tómate albahaca", desc: "Salsa de tomate, mozzarella, tomate en rodajas, albahaca, aceituna.", price: 45000 },
  { id: "napolitana", name: "Napolitana", desc: "Salsa de tomate, mozzarella, tomate en rodajas, jamón, aceituna.", price: 50000, badge: "Clásica" },
  { id: "jamon", name: "Jamón", desc: "Salsa de tomate, mozzarella, jamón, aceituna.", price: 40000 },
  { id: "choclo", name: "Choclo", desc: "Salsa de tomate, mozzarella, choclo, aceituna.", price: 40000 },
  { id: "jamoncheddar", name: "Jamón cheddar", desc: "Salsa de tomate, mozzarella, cheddar, jamón, aceituna.", price: 50000 },
  { id: "choclocatupiry", name: "Choclo catupiry", desc: "Salsa de tomate, mozzarella, choclo, aceituna, catupiry.", price: 50000 },
  { id: "4quesos", name: "4 Quesos", desc: "Salsa de tomate, mozzarella, roquefort, catupiry, cheddar, aceituna.", price: 60000, badge: "Favorita" },
  { id: "cheddar", name: "Cheddar", desc: "Salsa de tomate, mozzarella, cheddar, aceituna.", price: 50000 },
  { id: "pollocatupiry", name: "Pollo Catupiry", desc: "Salsa de tomate, mozzarella, pollo, catupiry, aceituna.", price: 60000 },
  { id: "bacon", name: "Bacón", desc: "Salsa de tomate, mozzarella, panceta, aceituna.", price: 55000 },
  { id: "rockefeller", name: "Rockefeller", desc: "Salsa de tomate, mozzarella, panceta, cebolla, aceituna.", price: 55000, img: "rockefeller.jpg", badge: "De la casa" },
  { id: "palmito", name: "Palmito", desc: "Salsa de tomate, mozzarella, palmito, aceituna.", price: 50000 },
  { id: "pepperoni", name: "Pepperoni", desc: "Salsa de tomate, mozzarella, pepperoni, aceituna.", price: 50000, img: "pepperoni.jpg", badge: "Más pedida" },
  { id: "morronesrojos", name: "Morrones Rojos", desc: "Salsa de tomate, mozzarella, morrones, albahaca, aceituna.", price: 50000 },
  { id: "vegetariana", name: "Vegetariana", desc: "Salsa de tomate, mozzarella, cebolla morada, albahaca, locote verde, tomate, aceituna.", price: 55000 }
];

const CALZONE_PRICE = 50000;
const PIZZA_CORRIDA_PRICE = 50000;

const PAPAS = [
  { id: "chico", label: "Chico", price: 12000 },
  { id: "grande", label: "Grande", price: 20000 }
];

const BEBIDAS = [
  { id: "coca500", label: "Coca Cola 500 ml", price: 10000 },
  { id: "coca1l", label: "Coca Cola 1 Litro", price: 13000 },
  { id: "coca15l", label: "Coca Cola 1.5 Litros", price: 18000 }
];

const CATEGORIES = [
  { id: "pizzas", label: "Pizzas" },
  { id: "corrida", label: "Pizza Corrida" },
  { id: "calzones", label: "Calzones" },
  { id: "papas", label: "Papas fritas" },
  { id: "bebidas", label: "Bebidas" }
];

/* ==========================================================================
   3. ESTADO ABIERTO / CERRADO Y PROMOCIONES
   ========================================================================== */
function isOpenNow() {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  if (day === CLOSED_DAY) return false;
  return hour >= OPENING_HOUR;
}

function renderHoursStatus() {
  const el = document.getElementById("hoursStatus");
  if (!el) return;
  const open = isOpenNow();
  el.classList.remove("open", "closed");
  el.classList.add(open ? "open" : "closed");
  el.innerHTML = `<span class="dot" aria-hidden="true"></span> ${open ? "Abierto ahora" : "Cerrado ahora"} · Mar a Dom desde las 18:00`;
}

function isPromoActive() {
  const day = new Date().getDay();
  return PROMO_DAYS.includes(day);
}

function effectivePizzaPrice(pizza) {
  if (pizza.id === "mozzarella" && isPromoActive()) {
    return { price: PROMO_MOZZARELLA_PRICE, original: pizza.price };
  }
  return { price: pizza.price, original: null };
}

function money(n) {
  return "₲ " + Math.round(n).toLocaleString("es-PY");
}

/* ==========================================================================
   4. ESTADO Y PERSISTENCIA DEL CARRITO (localStorage con try/catch)
   ========================================================================== */
let cart = []; // Array de { key, name, variant, note, price, qty }

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CART);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        cart = parsed;
      }
    }
  } catch (err) {
    console.warn("No se pudo restaurar el carrito desde localStorage:", err);
    cart = [];
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
  } catch (err) {
    console.warn("No se pudo guardar el carrito en localStorage:", err);
  }
}

function clearCart() {
  cart = [];
  try {
    localStorage.removeItem(STORAGE_KEY_CART);
  } catch (err) {
    console.warn("Error al limpiar localStorage:", err);
  }
  renderCartBadge();
  renderCartDrawer();
}

function saveLastOrder(orderData) {
  try {
    localStorage.setItem(STORAGE_KEY_LAST_ORDER, JSON.stringify(orderData));
  } catch (err) {
    console.warn("No se pudo guardar el último pedido:", err);
  }
}

function getLastOrder() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LAST_ORDER);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn("No se pudo leer el último pedido:", err);
    return null;
  }
}

function cartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function cartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function addToCart(line) {
  const existing = cart.find(item => item.key === line.key && item.note === line.note);
  if (existing) {
    existing.qty += line.qty;
  } else {
    cart.push(line);
  }
  saveCartToStorage();
  renderCartBadge();
  renderCartDrawer();
}

function renderCartBadge() {
  const badge = document.getElementById("cartBadge");
  const fab = document.getElementById("cartFab");
  const count = cartCount();
  if (badge) badge.textContent = count;
  if (fab) {
    fab.setAttribute("aria-label", `Abrir carrito de compras: ${count} ${count === 1 ? 'ítem' : 'ítems'}`);
  }
}

/* ==========================================================================
   5. RENDERIZADO DEL MENÚ Y PLACEHOLDERS
   ========================================================================== */
function getPlaceholderSVG() {
  return `
    <div class="item-placeholder" aria-hidden="true">
      <svg viewBox="0 0 64 64" fill="none" stroke="#EAD9B0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="32" cy="32" r="26" stroke="#C97A4A" stroke-width="3"/>
        <path d="M32 6 A26 26 0 0 1 58 32 L32 32 Z" fill="rgba(226,96,74,0.22)"/>
        <circle cx="23" cy="22" r="3" fill="#E2604A" stroke="none"/>
        <circle cx="39" cy="23" r="3" fill="#E2604A" stroke="none"/>
        <circle cx="29" cy="37" r="3" fill="#E2604A" stroke="none"/>
        <circle cx="43" cy="38" r="3" fill="#E2604A" stroke="none"/>
        <path d="M15 41 Q20 36 26 43" stroke="#EAD9B0" stroke-width="2"/>
      </svg>
      <span class="placeholder-caption">Horno a leña</span>
    </div>
  `;
}

function pizzaCardHTML(p) {
  const eff = effectivePizzaPrice(p);
  const priceHTML = eff.original
    ? `<span class="price-strike">${money(eff.original)}</span>${money(eff.price)}<span class="promo-tag">Oferta</span>`
    : `${money(eff.price)}`;

  const badgeHTML = p.badge
    ? `<div class="item-badge-wrap"><span class="item-badge badge-popular">${p.badge}</span></div>`
    : "";

  const mediaHTML = p.img
    ? `<div class="item-media-wrap">${badgeHTML}<img class="item-img" src="${p.img}" alt="Pizza ${p.name} de Casa Nostra" loading="lazy" decoding="async"></div>`
    : `<div class="item-media-wrap">${badgeHTML}${getPlaceholderSVG()}</div>`;

  return `
  <article class="item-card" data-search="${p.name.toLowerCase()} ${p.desc.toLowerCase()} pizza">
    ${mediaHTML}
    <div class="item-top">
      <h3 class="item-name">${p.name}</h3>
      <span class="item-price-single" data-price="${eff.price}">${priceHTML}</span>
    </div>
    <p class="item-desc">${p.desc}</p>
    <button type="button" class="note-toggle" data-action="toggle-note" aria-expanded="false">+ Agregar nota o preferencia</button>
    <textarea class="note-input" placeholder="Ej: bien tostada, orégano aparte, sin aceitunas..." aria-label="Nota para ${p.name}"></textarea>
    <div class="item-actions">
      <div class="qty-stepper" role="group" aria-label="Cantidad para ${p.name}">
        <button type="button" data-action="dec" aria-label="Disminuir cantidad">-</button>
        <span data-role="qty" aria-live="polite">1</span>
        <button type="button" data-action="inc" aria-label="Aumentar cantidad">+</button>
      </div>
      <button type="button" class="add-btn" data-action="add" aria-label="Agregar ${p.name} al pedido">
        <span>Agregar</span>
      </button>
    </div>
  </article>`;
}

function pizzaCorridaCardHTML() {
  return `
  <article class="item-card" data-search="pizza corrida libre por persona" data-per-person="true">
    <div class="item-top">
      <h3 class="item-name">Pizza Corrida</h3>
      <span class="item-price-single" data-price="${PIZZA_CORRIDA_PRICE}">${money(PIZZA_CORRIDA_PRICE)}<span class="per-person"> / persona</span></span>
    </div>
    <p class="item-desc">Pizza libre y variada para compartir en el local: servimos rondas continuas de distintos sabores hasta que estés satisfecho. Ideal para mesas y grupos.</p>
    <p class="flavor-note">Indicá la cantidad de personas en la mesa</p>
    <button type="button" class="note-toggle" data-action="toggle-note" aria-expanded="false">+ Agregar nota o preferencia</button>
    <textarea class="note-input" placeholder="Ej: sin anchoas, preferencia por sabores con queso..." aria-label="Notas para pizza corrida"></textarea>
    <div class="item-actions">
      <div class="qty-stepper" role="group" aria-label="Cantidad de personas">
        <button type="button" data-action="dec" aria-label="Menos personas">-</button>
        <span data-role="qty" aria-live="polite">1</span>
        <button type="button" data-action="inc" aria-label="Más personas">+</button>
      </div>
      <button type="button" class="add-btn" data-action="add" aria-label="Agregar Pizza Corrida al pedido">
        <span>Agregar</span>
      </button>
    </div>
  </article>`;
}

function calzoneCardHTML() {
  const flavorsHTML = PIZZAS.map(p =>
    `<button type="button" class="flavor-pill" data-flavor="${p.name}" aria-pressed="false">${p.name}</button>`
  ).join('');

  return `
  <article class="item-card" data-search="calzon calzones">
    <div class="item-media-wrap">
      <img class="item-img" src="calzone.jpg" alt="Calzone artesanal cocinado en horno a leña" loading="lazy" decoding="async">
    </div>
    <div class="item-top">
      <h3 class="item-name">Calzone Artesanal</h3>
      <span class="item-price-single">${money(CALZONE_PRICE)}</span>
    </div>
    <p class="item-desc">Masa fermentada cerrada y cocinada a la leña. Elegí hasta 2 sabores de la carta para tu relleno.</p>
    <p class="flavor-note" data-role="flavor-count" aria-live="polite">0 de 2 sabores elegidos</p>
    <div class="flavor-grid" data-role="flavors" role="group" aria-label="Sabores para calzone">${flavorsHTML}</div>
    <button type="button" class="note-toggle" data-action="toggle-note" aria-expanded="false">+ Agregar nota</button>
    <textarea class="note-input" placeholder="Ej: bien cerrado, con salsa arriba, sin orégano..." aria-label="Notas para calzone"></textarea>
    <div class="item-actions">
      <div class="qty-stepper" role="group" aria-label="Cantidad de calzones">
        <button type="button" data-action="dec" aria-label="Disminuir calzones">-</button>
        <span data-role="qty" aria-live="polite">1</span>
        <button type="button" data-action="inc" aria-label="Aumentar calzones">+</button>
      </div>
      <button type="button" class="add-btn" data-action="add" disabled aria-label="Agregar Calzone">
        <span>Elegí un sabor</span>
      </button>
    </div>
  </article>`;
}

function papaCardHTML() {
  const variantsHTML = PAPAS.map(v =>
    `<button type="button" class="variant-pill" data-price="${v.price}" data-label="${v.label}" aria-pressed="false">
      <span>${v.label}</span>
      <small>${money(v.price)}</small>
    </button>`
  ).join('');

  return `
  <article class="item-card" data-search="papas fritas porcion guarnicion">
    <div class="item-top">
      <h3 class="item-name">Papas Fritas</h3>
    </div>
    <p class="item-desc">Papas crocantes doradas al punto justo. Elegí el tamaño de tu porción.</p>
    <div class="variant-grid" data-role="variants" role="group" aria-label="Tamaños de papas fritas">${variantsHTML}</div>
    <button type="button" class="note-toggle" data-action="toggle-note" aria-expanded="false">+ Agregar nota</button>
    <textarea class="note-input" placeholder="Ej: bien crujientes, con poca sal..." aria-label="Notas para papas"></textarea>
    <div class="item-actions">
      <div class="qty-stepper" role="group" aria-label="Cantidad de porciones">
        <button type="button" data-action="dec" aria-label="Disminuir porciones">-</button>
        <span data-role="qty" aria-live="polite">1</span>
        <button type="button" data-action="inc" aria-label="Aumentar porciones">+</button>
      </div>
      <button type="button" class="add-btn" data-action="add" disabled aria-label="Agregar Papas Fritas">
        <span>Elegí un tamaño</span>
      </button>
    </div>
  </article>`;
}

function bebidaCardHTML() {
  const variantsHTML = BEBIDAS.map(v =>
    `<button type="button" class="variant-pill" data-price="${v.price}" data-label="${v.label}" aria-pressed="false">
      <span>${v.label}</span>
      <small>${money(v.price)}</small>
    </button>`
  ).join('');

  return `
  <article class="item-card" data-search="coca cola gaseosa bebida refrigerante">
    <div class="item-top">
      <h3 class="item-name">Bebidas · Coca Cola</h3>
    </div>
    <p class="item-desc">Bien fría para acompañar tu pizza.</p>
    <div class="variant-grid" data-role="variants" role="group" aria-label="Tamaño de bebida">${variantsHTML}</div>
    <div class="item-actions">
      <div class="qty-stepper" role="group" aria-label="Cantidad de botellas">
        <button type="button" data-action="dec" aria-label="Disminuir bebidas">-</button>
        <span data-role="qty" aria-live="polite">1</span>
        <button type="button" data-action="inc" aria-label="Aumentar bebidas">+</button>
      </div>
      <button type="button" class="add-btn" data-action="add" disabled aria-label="Agregar Bebida">
        <span>Elegí un tamaño</span>
      </button>
    </div>
  </article>`;
}

/* ==========================================================================
   6. RENDERIZADO DE SECCIONES Y SCROLL SPY FLUIDO
   ========================================================================== */
function renderNav() {
  const nav = document.getElementById("catNav");
  if (!nav) return;

  nav.innerHTML = CATEGORIES.map((c, i) =>
    `<button type="button" data-cat="${c.id}" class="${i === 0 ? 'active' : ''}" role="tab" aria-selected="${i === 0}">
      ${c.label}
    </button>`
  ).join('');

  nav.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = `cat-${btn.dataset.cat}`;
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        // Scroll suave con offset
        targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveCategory(btn.dataset.cat);
      }
    });
  });
}

function setActiveCategory(catId) {
  const nav = document.getElementById("catNav");
  if (!nav) return;
  const buttons = nav.querySelectorAll("button");
  buttons.forEach(btn => {
    const isTarget = btn.dataset.cat === catId;
    btn.classList.toggle("active", isTarget);
    btn.setAttribute("aria-selected", isTarget);
    if (isTarget) {
      // Auto-centra el botón en la barra deslizante
      btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  });
}

function renderSections() {
  const main = document.getElementById("mainContent");
  if (!main) return;

  main.innerHTML = `
    <section class="category" id="cat-pizzas" aria-labelledby="heading-pizzas">
      <h2 class="cat-heading" id="heading-pizzas">Pizzas a la leña</h2>
      <p class="cat-note">22 sabores artesanales con masa fermentada y cocinadas a la piedra.</p>
      ${PIZZAS.map(pizzaCardHTML).join('')}
    </section>

    <section class="category" id="cat-corrida" aria-labelledby="heading-corrida">
      <h2 class="cat-heading" id="heading-corrida">Pizza Corrida</h2>
      <p class="cat-note">Pizza libre para compartir en mesa, precio por persona.</p>
      ${pizzaCorridaCardHTML()}
    </section>

    <section class="category" id="cat-calzones" aria-labelledby="heading-calzones">
      <h2 class="cat-heading" id="heading-calzones">Calzones</h2>
      <p class="cat-note">Cerrados y dorados en el horno a leña. Podés combinar 1 o 2 sabores.</p>
      ${calzoneCardHTML()}
    </section>

    <section class="category" id="cat-papas" aria-labelledby="heading-papas">
      <h2 class="cat-heading" id="heading-papas">Papas fritas</h2>
      <p class="cat-note">Crocantes y doradas, en porción chica o grande.</p>
      ${papaCardHTML()}
    </section>

    <section class="category" id="cat-bebidas" aria-labelledby="heading-bebidas">
      <h2 class="cat-heading" id="heading-bebidas">Bebidas</h2>
      <p class="cat-note">Gaseosas bien frías para acompañar tu comida.</p>
      ${bebidaCardHTML()}
    </section>
  `;

  wireCardEvents();
  setupScrollSpy();
}

/**
 * ScrollSpy mediante IntersectionObserver para marcar la categoría activa al deslizar
 */
function setupScrollSpy() {
  const sections = document.querySelectorAll("section.category");
  if (!sections.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const catId = entry.target.id.replace("cat-", "");
        setActiveCategory(catId);
      }
    });
  }, {
    rootMargin: "-20% 0px -70% 0px",
    threshold: 0
  });

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   7. CONTROLADORES DE EVENTOS EN TARJETAS
   ========================================================================== */
function wireCardEvents() {
  document.querySelectorAll(".item-card").forEach(card => {
    const qtyEl = card.querySelector('[data-role="qty"]');
    let qty = 1;

    // Toggle de notas
    const noteToggle = card.querySelector('[data-action="toggle-note"]');
    const noteInput = card.querySelector(".note-input");
    if (noteToggle && noteInput) {
      noteToggle.addEventListener("click", () => {
        const isOpen = noteInput.classList.toggle("show");
        noteToggle.setAttribute("aria-expanded", isOpen);
        noteToggle.textContent = isOpen ? "- Ocultar nota" : "+ Agregar nota o preferencia";
        if (isOpen) noteInput.focus();
      });
    }

    // Stepper (+ / -)
    const decBtn = card.querySelector('[data-action="dec"]');
    const incBtn = card.querySelector('[data-action="inc"]');
    if (decBtn) {
      decBtn.addEventListener("click", () => {
        qty = Math.max(1, qty - 1);
        if (qtyEl) qtyEl.textContent = qty;
      });
    }
    if (incBtn) {
      incBtn.addEventListener("click", () => {
        qty = qty + 1;
        if (qtyEl) qtyEl.textContent = qty;
      });
    }

    const addBtn = card.querySelector('[data-action="add"]');

    // Variantes (Papas / Bebidas)
    const variantWrap = card.querySelector('[data-role="variants"]');
    let selectedVariant = null;
    if (variantWrap && addBtn) {
      variantWrap.querySelectorAll(".variant-pill").forEach(pill => {
        pill.addEventListener("click", () => {
          variantWrap.querySelectorAll(".variant-pill").forEach(p => {
            p.classList.remove("selected");
            p.setAttribute("aria-pressed", "false");
          });
          pill.classList.add("selected");
          pill.setAttribute("aria-pressed", "true");
          selectedVariant = { label: pill.dataset.label, price: Number(pill.dataset.price) };
          addBtn.disabled = false;
          addBtn.querySelector("span").textContent = "Agregar";
        });
      });
    }

    // Calzones: hasta 2 sabores
    const flavorWrap = card.querySelector('[data-role="flavors"]');
    let selectedFlavors = [];
    const flavorCountEl = card.querySelector('[data-role="flavor-count"]');

    if (flavorWrap && addBtn) {
      flavorWrap.querySelectorAll(".flavor-pill").forEach(pill => {
        pill.addEventListener("click", () => {
          const flavor = pill.dataset.flavor;
          if (pill.classList.contains("selected")) {
            selectedFlavors = selectedFlavors.filter(f => f !== flavor);
            pill.classList.remove("selected");
            pill.setAttribute("aria-pressed", "false");
          } else {
            if (selectedFlavors.length >= 2) return;
            selectedFlavors.push(flavor);
            pill.classList.add("selected");
            pill.setAttribute("aria-pressed", "true");
          }

          if (flavorCountEl) {
            flavorCountEl.textContent = `${selectedFlavors.length} de 2 sabores elegidos`;
          }

          flavorWrap.querySelectorAll(".flavor-pill").forEach(p => {
            if (!p.classList.contains("selected") && selectedFlavors.length >= 2) {
              p.classList.add("disabled");
            } else {
              p.classList.remove("disabled");
            }
          });

          if (selectedFlavors.length > 0) {
            addBtn.disabled = false;
            addBtn.querySelector("span").textContent = "Agregar";
          } else {
            addBtn.disabled = true;
            addBtn.querySelector("span").textContent = "Elegí un sabor";
          }
        });
      });
    }

    // Botón Agregar al Carrito
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        const note = noteInput ? noteInput.value.trim() : "";
        let line;

        if (variantWrap) {
          const itemName = card.querySelector(".item-name").textContent;
          line = {
            key: itemName + "-" + selectedVariant.label,
            name: itemName,
            variant: selectedVariant.label,
            note,
            price: selectedVariant.price,
            qty
          };
        } else if (flavorWrap) {
          const variantLabel = selectedFlavors.join(" + ");
          line = {
            key: "calzone-" + selectedFlavors.slice().sort().join("-"),
            name: "Calzone",
            variant: variantLabel,
            note,
            price: CALZONE_PRICE,
            qty
          };
        } else {
          const name = card.querySelector(".item-name").textContent;
          const price = Number(card.querySelector(".item-price-single").dataset.price);
          const isPerPerson = card.dataset.perPerson === "true";
          line = {
            key: "pizza-" + name,
            name,
            variant: isPerPerson ? `${qty} ${qty === 1 ? 'persona' : 'personas'}` : "",
            note,
            price,
            qty
          };
        }

        addToCart(line);

        // Micro-animación visual y feedback
        addBtn.classList.add("added");
        const span = addBtn.querySelector("span");
        const prevText = span ? span.textContent : "Agregar";
        if (span) span.textContent = "¡Agregado! ✓";

        setTimeout(() => {
          addBtn.classList.remove("added");
          if (span) span.textContent = prevText === "¡Agregado! ✓" ? "Agregar" : prevText;
        }, 850);

        // Reset stepper
        qty = 1;
        if (qtyEl) qtyEl.textContent = 1;
        if (noteInput && noteInput.classList.contains("show")) {
          noteInput.value = "";
          noteInput.classList.remove("show");
          if (noteToggle) {
            noteToggle.setAttribute("aria-expanded", "false");
            noteToggle.textContent = "+ Agregar nota o preferencia";
          }
        }
      });
    }
  });
}

/* ==========================================================================
   8. BÚSQUEDA REACTIVA EN TIEMPO REAL
   ========================================================================== */
const searchInput = document.getElementById("searchInput");
const searchClearBtn = document.getElementById("searchClearBtn");

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    const cards = document.querySelectorAll(".item-card");
    const sections = document.querySelectorAll("section.category");

    if (searchClearBtn) {
      searchClearBtn.style.display = q !== "" ? "flex" : "none";
    }

    if (q === "") {
      cards.forEach(c => c.style.display = "");
      sections.forEach(s => s.style.display = "");
      document.querySelectorAll(".no-results").forEach(n => n.remove());
      return;
    }

    let totalMatches = 0;
    sections.forEach(section => {
      let sectionMatches = 0;
      section.querySelectorAll(".item-card").forEach(card => {
        const text = card.dataset.search || "";
        const match = text.includes(q);
        card.style.display = match ? "" : "none";
        if (match) {
          sectionMatches++;
          totalMatches++;
        }
      });
      // Ocultar sección si no tiene productos coincidentes
      section.style.display = sectionMatches > 0 ? "" : "none";
    });

    document.querySelectorAll(".no-results").forEach(n => n.remove());
    if (totalMatches === 0) {
      const main = document.getElementById("mainContent");
      const noRes = document.createElement("div");
      noRes.className = "no-results";
      noRes.setAttribute("role", "alert");
      noRes.textContent = `No encontramos pizzas ni calzones para "${q}". Probá con otro ingrediente o limpiá la búsqueda.`;
      main.appendChild(noRes);
    }
  });
}

if (searchClearBtn && searchInput) {
  searchClearBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchClearBtn.style.display = "none";
    searchInput.dispatchEvent(new Event("input"));
    searchInput.focus();
  });
}

/* ==========================================================================
   9. CARRITO: DRAWER, REPETIR PEDIDO Y ACCESIBILIDAD
   ========================================================================== */
const overlay = document.getElementById("overlay");
const drawer = document.getElementById("drawer");
const cartFab = document.getElementById("cartFab");
const closeDrawerBtn = document.getElementById("closeDrawer");
const repeatOrderWrap = document.getElementById("repeatOrderWrap");
const repeatOrderBtn = document.getElementById("repeatOrderBtn");
const repeatOrderInfo = document.getElementById("repeatOrderInfo");
const clearCartBtn = document.getElementById("clearCartBtn");
const cartToolsWrap = document.getElementById("cartToolsWrap");

function openDrawer() {
  if (!drawer || !overlay) return;
  overlay.classList.add("show");
  drawer.classList.add("show");
  drawer.setAttribute("aria-hidden", "false");
  overlay.setAttribute("aria-hidden", "false");
  if (cartFab) cartFab.setAttribute("aria-expanded", "true");

  checkLastOrderUI();
  renderCartDrawer();

  // Foco accesible
  if (closeDrawerBtn) closeDrawerBtn.focus();
}

function closeDrawer() {
  if (!drawer || !overlay) return;
  overlay.classList.remove("show");
  drawer.classList.remove("show");
  drawer.setAttribute("aria-hidden", "true");
  overlay.setAttribute("aria-hidden", "true");
  if (cartFab) {
    cartFab.setAttribute("aria-expanded", "false");
    cartFab.focus();
  }
}

if (cartFab) cartFab.addEventListener("click", openDrawer);
if (closeDrawerBtn) closeDrawerBtn.addEventListener("click", closeDrawer);
if (overlay) overlay.addEventListener("click", closeDrawer);

// Cerrar con tecla Escape (Accesibilidad WCAG)
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && drawer && drawer.classList.contains("show")) {
    closeDrawer();
  }
});

function checkLastOrderUI() {
  const last = getLastOrder();
  if (repeatOrderWrap && repeatOrderBtn && repeatOrderInfo) {
    if (last && Array.isArray(last.items) && last.items.length > 0) {
      repeatOrderWrap.style.display = "flex";
      const summaryText = last.items.map(it => `${it.qty}x ${it.name}`).join(", ");
      repeatOrderInfo.textContent = `Último pedido: ${summaryText} (${money(last.total)})`;
    } else {
      repeatOrderWrap.style.display = "none";
    }
  }
}

if (repeatOrderBtn) {
  repeatOrderBtn.addEventListener("click", () => {
    const last = getLastOrder();
    if (last && Array.isArray(last.items)) {
      cart = JSON.parse(JSON.stringify(last.items));
      saveCartToStorage();
      renderCartBadge();
      renderCartDrawer();
      repeatOrderBtn.textContent = "¡Pedido restaurado!";
      setTimeout(() => {
        repeatOrderBtn.innerHTML = `<span aria-hidden="true">↺</span> Repetir último pedido`;
      }, 1200);
    }
  });
}

if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    if (confirm("¿Querés vaciar todos los productos del carrito?")) {
      clearCart();
    }
  });
}

function renderCartDrawer() {
  const linesWrap = document.getElementById("cartLines");
  if (!linesWrap) return;

  if (cart.length === 0) {
    linesWrap.innerHTML = `<div class="empty-cart">Todavía no agregaste nada al pedido.<br>¡Elegí tu pizza o calzone favorito en la carta!</div>`;
    if (cartToolsWrap) cartToolsWrap.style.display = "none";
  } else {
    if (cartToolsWrap) cartToolsWrap.style.display = "flex";
    linesWrap.innerHTML = cart.map((line, idx) => `
      <div class="cart-line">
        <div class="cart-line-info">
          <div class="cart-line-name">${line.name}</div>
          ${line.variant ? `<div class="cart-line-variant">${line.variant}</div>` : ''}
          ${line.note ? `<div class="cart-line-note">"${line.note}"</div>` : ''}
        </div>
        <div class="cart-line-right">
          <span class="cart-line-price">${money(line.price * line.qty)}</span>
          <div class="mini-stepper" role="group" aria-label="Cantidad para ${line.name}">
            <button type="button" data-idx="${idx}" data-action="line-dec" aria-label="Restar una unidad">-</button>
            <span>${line.qty}</span>
            <button type="button" data-idx="${idx}" data-action="line-inc" aria-label="Sumar una unidad">+</button>
          </div>
          <button type="button" class="remove-line" data-idx="${idx}" data-action="line-remove" aria-label="Eliminar ${line.name} del pedido">Quitar</button>
        </div>
      </div>
    `).join('');

    linesWrap.querySelectorAll('[data-action="line-inc"]').forEach(b => {
      b.addEventListener("click", () => {
        const i = Number(b.dataset.idx);
        cart[i].qty++;
        saveCartToStorage();
        renderCartBadge();
        renderCartDrawer();
      });
    });

    linesWrap.querySelectorAll('[data-action="line-dec"]').forEach(b => {
      b.addEventListener("click", () => {
        const i = Number(b.dataset.idx);
        cart[i].qty = Math.max(1, cart[i].qty - 1);
        saveCartToStorage();
        renderCartBadge();
        renderCartDrawer();
      });
    });

    linesWrap.querySelectorAll('[data-action="line-remove"]').forEach(b => {
      b.addEventListener("click", () => {
        const i = Number(b.dataset.idx);
        cart.splice(i, 1);
        saveCartToStorage();
        renderCartBadge();
        renderCartDrawer();
      });
    });
  }

  const totalEl = document.getElementById("cartTotal");
  if (totalEl) totalEl.textContent = money(cartTotal());
  updateWaButtonState();
}

/* ==========================================================================
   10. SELECTOR DE TIPO DE PEDIDO Y CAMPOS
   ========================================================================== */
let orderType = "delivery";
const orderTypeToggle = document.getElementById("orderTypeToggle");
const addressField = document.getElementById("addressField");
const tableField = document.getElementById("tableField");
const vehicleField = document.getElementById("vehicleField");

if (orderTypeToggle) {
  orderTypeToggle.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      orderTypeToggle.querySelectorAll("button").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-checked", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-checked", "true");
      orderType = btn.dataset.type;

      if (addressField) addressField.style.display = orderType === "delivery" ? "" : "none";
      if (tableField) tableField.style.display = orderType === "local" ? "" : "none";
      if (vehicleField) vehicleField.style.display = orderType === "autopizza" ? "" : "none";

      const deliveryPromoHint = document.getElementById("deliveryPromoHint");
      if (deliveryPromoHint) {
        deliveryPromoHint.style.display = (orderType === "delivery" && isPromoActive()) ? "" : "none";
      }

      updateWaButtonState();
    });
  });
}

/* ==========================================================================
   11. UBICACIÓN GEOLOCALIZADA
   ========================================================================== */
const locationBtn = document.getElementById("locationBtn");
const locationStatus = document.getElementById("locationStatus");
let sharedLocationLink = "";

if (locationBtn && locationStatus) {
  locationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      locationStatus.textContent = "Tu navegador no soporta geolocalización. Ingresá tu dirección manualmente.";
      locationStatus.classList.add("error");
      return;
    }

    locationStatus.textContent = "Obteniendo coordenadas...";
    locationStatus.classList.remove("error");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        sharedLocationLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        locationBtn.classList.add("captured");
        locationBtn.textContent = "📍 Ubicación GPS lista ✓";
        locationStatus.innerHTML = `Listo, tu ubicación se enviará con el pedido.`;
        updateWaButtonState();
      },
      () => {
        locationStatus.textContent = "No se pudo obtener la ubicación automáticamente. Podés escribirla en el campo de dirección.";
        locationStatus.classList.add("error");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
}

/* ==========================================================================
   12. VALIDACIONES Y ENVÍO DEL PEDIDO POR WHATSAPP
   ========================================================================== */
const waBtn = document.getElementById("waBtn");
const custNameInput = document.getElementById("custName");
const custAddressInput = document.getElementById("custAddress");
const nameError = document.getElementById("nameError");
const addressError = document.getElementById("addressError");

function validateForm(showErrors = false) {
  const name = custNameInput ? custNameInput.value.trim() : "";
  const address = custAddressInput ? custAddressInput.value.trim() : "";

  let isValid = true;

  // Validación de carrito no vacío
  if (cart.length === 0) {
    isValid = false;
  }

  // Validación de nombre
  if (!name) {
    isValid = false;
    if (showErrors && custNameInput && nameError) {
      custNameInput.classList.add("input-invalid");
      nameError.textContent = "Por favor ingresá tu nombre para identificar el pedido.";
    }
  } else {
    if (custNameInput && nameError) {
      custNameInput.classList.remove("input-invalid");
      nameError.textContent = "";
    }
  }

  // Validación de dirección (solo en delivery)
  if (orderType === "delivery" && !address && !sharedLocationLink) {
    isValid = false;
    if (showErrors && custAddressInput && addressError) {
      custAddressInput.classList.add("input-invalid");
      addressError.textContent = "Para delivery necesitamos tu dirección o tu ubicación GPS.";
    }
  } else {
    if (custAddressInput && addressError) {
      custAddressInput.classList.remove("input-invalid");
      addressError.textContent = "";
    }
  }

  return isValid;
}

function updateWaButtonState() {
  if (!waBtn) return;
  const ok = validateForm(false);
  waBtn.disabled = !ok;
}

if (custNameInput) custNameInput.addEventListener("input", updateWaButtonState);
if (custAddressInput) custAddressInput.addEventListener("input", updateWaButtonState);

/**
 * Genera el mensaje ordenado para WhatsApp con formato negrita (*texto*)
 */
function buildWhatsAppMessage() {
  const name = custNameInput ? custNameInput.value.trim() : "";
  const address = custAddressInput ? custAddressInput.value.trim() : "";
  const table = document.getElementById("custTable") ? document.getElementById("custTable").value.trim() : "";
  const vehicle = document.getElementById("custVehicle") ? document.getElementById("custVehicle").value.trim() : "";
  const notes = document.getElementById("custNotes") ? document.getElementById("custNotes").value.trim() : "";

  const orderTypeLabels = {
    delivery: "🛵 DELIVERY A DOMICILIO",
    autopizza: "🚗 AUTO-PIZZA (Retiro por ventanilla)",
    retiro: "🥡 RETIRO / PARA LLEVAR",
    local: "🍽️ CONSUMO EN EL LOCAL"
  };

  const currentTypeLabel = orderTypeLabels[orderType] || orderType.toUpperCase();

  let msg = `🍕 *NUEVO PEDIDO — ${BUSINESS_NAME.toUpperCase()}*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `*TIPO DE PEDIDO:* ${currentTypeLabel}\n`;
  msg += `*CLIENTE:* ${name}\n\n`;

  msg += `📋 *DETALLE DEL PEDIDO:*\n`;
  cart.forEach(item => {
    const itemSubtotal = money(item.price * item.qty);
    msg += `• *${item.qty}x ${item.name}*`;
    if (item.variant) {
      msg += ` (${item.variant})`;
    }
    msg += ` — ${itemSubtotal}\n`;
    if (item.note) {
      msg += `  ↳ _Nota: ${item.note}_\n`;
    }
  });

  msg += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💰 *TOTAL A PAGAR:* *${money(cartTotal())}*\n`;
  if (orderType === "delivery" && isPromoActive()) {
    msg += `🔥 _Promo aplicada: Delivery gratis en pizzas (Martes a Jueves)_\n`;
  }
  msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  // Datos específicos del tipo de pedido
  if (orderType === "delivery") {
    msg += `📍 *DATOS DE ENTREGA:*\n`;
    if (address) msg += `• *Dirección:* ${address}\n`;
    if (sharedLocationLink) msg += `• *Ubicación GPS:* ${sharedLocationLink}\n`;
  } else if (orderType === "autopizza") {
    msg += `🚗 *DATOS DE AUTO-PIZZA:*\n`;
    if (vehicle) msg += `• *Vehículo:* ${vehicle}\n`;
    msg += `• _Retiro rápido por ventanilla en menos de 5 min_\n`;
  } else if (orderType === "local") {
    msg += `🍽️ *DATOS DE SALÓN:*\n`;
    if (table) msg += `• *Mesa / Personas:* ${table}\n`;
  }

  if (notes) {
    msg += `\n📝 *NOTAS ADICIONALES:*\n${notes}\n`;
  }

  msg += `\n_Pedido enviado desde la web oficial de Casa Nostra_`;
  return msg;
}

if (waBtn) {
  waBtn.addEventListener("click", () => {
    if (!validateForm(true)) {
      return;
    }

    // 1. Guardar como último pedido para poder repetirlo luego
    saveLastOrder({
      items: JSON.parse(JSON.stringify(cart)),
      total: cartTotal(),
      orderType,
      date: new Date().toISOString()
    });

    // 2. Construir mensaje ordenado y codificarlo
    const message = buildWhatsAppMessage();
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    // 3. Limpiar carrito y persistencia
    clearCart();

    // 4. Cerrar drawer
    closeDrawer();

    // 5. Abrir WhatsApp
    window.open(waUrl, "_blank");
  });
}

/* ==========================================================================
   13. INICIALIZACIÓN
   ========================================================================== */
function initApp() {
  renderHoursStatus();
  setInterval(renderHoursStatus, 60000);

  loadCartFromStorage();
  renderNav();
  renderSections();
  renderCartBadge();
  renderCartDrawer();
  checkLastOrderUI();
}

// Ejecutar al cargar el DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
