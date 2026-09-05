/* ================= DATOS DEL NEGOCIO ================= */
const WHATSAPP_NUMBER = "595981661163"; // +595 981 661163
const BUSINESS_NAME = "Casa Nostra Pizzeria";

/* ================= HORARIO =================
   Martes a domingo, desde las 18:00 (cierre a definir por el dueño) */
function isOpenNow(){
  const now = new Date();
  const day = now.getDay(); // 0 = domingo ... 1 = lunes ... 6 = sábado
  const hour = now.getHours();
  if (day === 1) return false; // cerrado los lunes
  return hour >= 18;
}

function renderHoursStatus(){
  const el = document.getElementById('hoursStatus');
  const open = isOpenNow();
  el.classList.remove('open','closed');
  el.classList.add(open ? 'open' : 'closed');
  el.innerHTML = `<span class="dot"></span> ${open ? 'Abierto ahora' : 'Cerrado ahora'} · Mar a Dom desde las 18:00`;
}

/* ================= CARTA ================= */
const PIZZAS = [
  { id:"mozzarella", name:"Mozzarella", desc:"Salsa de tomate, mozzarella, orégano, aceituna.", price:35000 },
  { id:"marinara", name:"Marinara", desc:"Salsa de tomate, anchoas, orégano, ajo.", price:55000 },
  { id:"putanessca", name:"Putanessca", desc:"Salsa de tomate, mozzarella, alcaparras, anchoas, ajo, aceituna, albahaca.", price:65000 },
  { id:"oreganatto", name:"Oreganatto", desc:"Salsa de tomate, mozzarella, rodajas de tomate, ajo, aceituna, orégano.", price:50000 },
  { id:"burguer4quesos", name:"Burguer 4 quesos", desc:"Salsa de tomate, mozzarella, roquefort, catupiry, cheddar, hamburguesa, aceituna.", price:65000 },
  { id:"panchopapa", name:"Pancho papa", desc:"Salsa de tomate, mozzarella, catupiry, pancho, papitas, aceitunas.", price:60000 },
  { id:"mexicana", name:"Mexicana", desc:"Salsa de tomate, mozzarella, cebolla, locote picante, calabresa, pepperoni, aceituna.", price:65000 },
  { id:"tomatealbahaca", name:"Tómate albahaca", desc:"Salsa de tomate, mozzarella, tomate en rodajas, albahaca, aceituna.", price:45000 },
  { id:"napolitana", name:"Napolitana", desc:"Salsa de tomate, mozzarella, tomate en rodajas, jamón, aceituna.", price:50000 },
  { id:"jamon", name:"Jamón", desc:"Salsa de tomate, mozzarella, jamón, aceituna.", price:40000 },
  { id:"choclo", name:"Choclo", desc:"Salsa de tomate, mozzarella, choclo, aceituna.", price:40000 },
  { id:"jamoncheddar", name:"Jamón cheddar", desc:"Salsa de tomate, mozzarella, cheddar, jamón, aceituna.", price:50000 },
  { id:"choclocatupiry", name:"Choclo catupiry", desc:"Salsa de tomate, mozzarella, choclo, aceituna, catupiry.", price:50000 },
  { id:"4quesos", name:"4 Quesos", desc:"Salsa de tomate, mozzarella, roquefort, catupiry, cheddar, aceituna.", price:60000 },
  { id:"cheddar", name:"Cheddar", desc:"Salsa de tomate, mozzarella, cheddar, aceituna.", price:50000 },
  { id:"pollocatupiry", name:"Pollo Catupiry", desc:"Salsa de tomate, mozzarella, pollo, catupiry, aceituna.", price:60000 },
  { id:"bacon", name:"Bacón", desc:"Salsa de tomate, mozzarella, panceta, aceituna.", price:55000 },
  { id:"rockefeller", name:"Rockefeller", desc:"Salsa de tomate, mozzarella, panceta, cebolla, aceituna.", price:55000 },
  { id:"palmito", name:"Palmito", desc:"Salsa de tomate, mozzarella, palmito, aceituna.", price:50000 },
  { id:"pepperoni", name:"Pepperoni", desc:"Salsa de tomate, mozzarella, pepperoni, aceituna.", price:50000 },
  { id:"morronesrojos", name:"Morrones Rojos", desc:"Salsa de tomate, mozzarella, morrones, albahaca, aceituna.", price:50000 },
  { id:"vegetariana", name:"Vegetariana", desc:"Salsa de tomate, mozzarella, cebolla morada, albahaca, locote verde, tomate, aceituna.", price:55000 },
];

const CALZONE_PRICE = 50000;

const PAPAS = [
  { id:"chico", label:"Chico", price:12000 },
  { id:"grande", label:"Grande", price:20000 },
];

const CATEGORIES = [
  { id:"pizzas", label:"Pizzas" },
  { id:"calzones", label:"Calzones" },
  { id:"papas", label:"Papas fritas" },
];

/* ================= ESTADO DEL CARRITO ================= */
let cart = []; // { key, name, variant, note, price, qty }

function money(n){
  return "₲ " + Math.round(n).toLocaleString("es-PY");
}

function cartCount(){
  return cart.reduce((sum,l)=>sum+l.qty,0);
}
function cartTotal(){
  return cart.reduce((sum,l)=>sum+l.price*l.qty,0);
}

function addToCart(line){
  // agrupa líneas idénticas (mismo nombre + variante + nota)
  const existing = cart.find(l => l.key === line.key && l.note === line.note);
  if (existing){
    existing.qty += line.qty;
  } else {
    cart.push(line);
  }
  renderCartBadge();
  renderCartDrawer();
}

function renderCartBadge(){
  document.getElementById('cartBadge').textContent = cartCount();
}

/* ================= RENDER NAV + SECCIONES ================= */
function renderNav(){
  const nav = document.getElementById('catNav');
  nav.innerHTML = CATEGORIES.map((c,i)=>
    `<button data-cat="${c.id}" class="${i===0?'active':''}">${c.label}</button>`
  ).join('');
  nav.querySelectorAll('button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      nav.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('section.category').forEach(s=>s.classList.remove('active'));
      document.getElementById('cat-'+btn.dataset.cat).classList.add('active');
    });
  });
}

function pizzaCardHTML(p){
  return `
  <div class="item-card" data-search="${p.name.toLowerCase()} ${p.desc.toLowerCase()}">
    <div class="item-top">
      <p class="item-name">${p.name}</p>
      <span class="item-price-single">${money(p.price)}</span>
    </div>
    <p class="item-desc">${p.desc}</p>
    <button class="note-toggle" data-action="toggle-note">+ Agregar nota</button>
    <textarea class="note-input" placeholder="Ej: sin aceituna, bien cocida..."></textarea>
    <div class="item-actions">
      <div class="qty-stepper">
        <button data-action="dec">-</button>
        <span data-role="qty">1</span>
        <button data-action="inc">+</button>
      </div>
      <button class="add-btn" data-action="add">Agregar</button>
    </div>
  </div>`;
}

function papaCardHTML(p){
  const variantsHTML = PAPAS.map(v=>
    `<button class="variant-pill" data-price="${v.price}" data-label="${v.label}">${v.label}<small>${money(v.price)}</small></button>`
  ).join('');
  return `
  <div class="item-card" data-search="papas fritas">
    <div class="item-top">
      <p class="item-name">Papas fritas</p>
    </div>
    <p class="item-desc">Elegí el tamaño.</p>
    <div class="variant-grid" data-role="variants">${variantsHTML}</div>
    <button class="note-toggle" data-action="toggle-note">+ Agregar nota</button>
    <textarea class="note-input" placeholder="Ej: bien saladas, con cheddar..."></textarea>
    <div class="item-actions">
      <div class="qty-stepper">
        <button data-action="dec">-</button>
        <span data-role="qty">1</span>
        <button data-action="inc">+</button>
      </div>
      <button class="add-btn" data-action="add" disabled>Elegí un tamaño</button>
    </div>
  </div>`;
}

function calzoneCardHTML(){
  const flavorsHTML = PIZZAS.map(p=>
    `<button class="flavor-pill" data-flavor="${p.name}">${p.name}</button>`
  ).join('');
  return `
  <div class="item-card" data-search="calzon calzones">
    <div class="item-top">
      <p class="item-name">Calzone</p>
      <span class="item-price-single">${money(CALZONE_PRICE)}</span>
    </div>
    <p class="item-desc">Todos los sabores de pizza. Elegí 1 o 2 sabores para tu calzone.</p>
    <p class="flavor-note" data-role="flavor-count">0 de 2 sabores elegidos</p>
    <div class="flavor-grid" data-role="flavors">${flavorsHTML}</div>
    <button class="note-toggle" data-action="toggle-note">+ Agregar nota</button>
    <textarea class="note-input" placeholder="Ej: bien cerrado, sin aceituna..."></textarea>
    <div class="item-actions">
      <div class="qty-stepper">
        <button data-action="dec">-</button>
        <span data-role="qty">1</span>
        <button data-action="inc">+</button>
      </div>
      <button class="add-btn" data-action="add" disabled>Elegí un sabor</button>
    </div>
  </div>`;
}

function renderSections(){
  const main = document.getElementById('mainContent');
  main.innerHTML = `
    <section class="category active" id="cat-pizzas">
      <h2 class="cat-heading">Pizzas</h2>
      <p class="cat-note">Sabores clásicos de la casa.</p>
      ${PIZZAS.map(pizzaCardHTML).join('')}
    </section>
    <section class="category" id="cat-calzones">
      <h2 class="cat-heading">Calzones</h2>
      <p class="cat-note">Todos los sabores de pizza, pueden ser 2 sabores.</p>
      ${calzoneCardHTML()}
    </section>
    <section class="category" id="cat-papas">
      <h2 class="cat-heading">Papas fritas</h2>
      <p class="cat-note">Chico o grande, como más te guste.</p>
      ${papaCardHTML()}
    </section>
  `;
  wireCardEvents();
}

/* ================= EVENTOS DE TARJETAS ================= */
function wireCardEvents(){
  document.querySelectorAll('.item-card').forEach(card=>{
    const qtyEl = card.querySelector('[data-role="qty"]');
    let qty = 1;

    const noteToggle = card.querySelector('[data-action="toggle-note"]');
    const noteInput = card.querySelector('.note-input');
    if (noteToggle){
      noteToggle.addEventListener('click', ()=>{
        noteInput.classList.toggle('show');
        noteToggle.textContent = noteInput.classList.contains('show') ? "- Ocultar nota" : "+ Agregar nota";
      });
    }

    const decBtn = card.querySelector('[data-action="dec"]');
    const incBtn = card.querySelector('[data-action="inc"]');
    if (decBtn) decBtn.addEventListener('click', ()=>{
      qty = Math.max(1, qty-1);
      qtyEl.textContent = qty;
    });
    if (incBtn) incBtn.addEventListener('click', ()=>{
      qty = qty+1;
      qtyEl.textContent = qty;
    });

    const addBtn = card.querySelector('[data-action="add"]');

    // --- Papas: selección de tamaño ---
    const variantWrap = card.querySelector('[data-role="variants"]');
    let selectedVariant = null;
    if (variantWrap){
      variantWrap.querySelectorAll('.variant-pill').forEach(pill=>{
        pill.addEventListener('click', ()=>{
          variantWrap.querySelectorAll('.variant-pill').forEach(p=>p.classList.remove('selected'));
          pill.classList.add('selected');
          selectedVariant = { label: pill.dataset.label, price: Number(pill.dataset.price) };
          addBtn.disabled = false;
          addBtn.textContent = "Agregar";
        });
      });
    }

    // --- Calzones: selección de hasta 2 sabores ---
    const flavorWrap = card.querySelector('[data-role="flavors"]');
    let selectedFlavors = [];
    const flavorCountEl = card.querySelector('[data-role="flavor-count"]');
    if (flavorWrap){
      flavorWrap.querySelectorAll('.flavor-pill').forEach(pill=>{
        pill.addEventListener('click', ()=>{
          const flavor = pill.dataset.flavor;
          if (pill.classList.contains('selected')){
            selectedFlavors = selectedFlavors.filter(f=>f!==flavor);
            pill.classList.remove('selected');
          } else {
            if (selectedFlavors.length >= 2) return;
            selectedFlavors.push(flavor);
            pill.classList.add('selected');
          }
          if (flavorCountEl) flavorCountEl.textContent = `${selectedFlavors.length} de 2 sabores elegidos`;
          flavorWrap.querySelectorAll('.flavor-pill').forEach(p=>{
            if (!p.classList.contains('selected') && selectedFlavors.length>=2){
              p.classList.add('disabled');
            } else {
              p.classList.remove('disabled');
            }
          });
          if (selectedFlavors.length > 0){
            addBtn.disabled = false;
            addBtn.textContent = "Agregar";
          } else {
            addBtn.disabled = true;
            addBtn.textContent = "Elegí un sabor";
          }
        });
      });
    }

    addBtn.addEventListener('click', ()=>{
      const note = noteInput ? noteInput.value.trim() : "";
      let line;

      if (variantWrap){
        // papas fritas
        line = {
          key: "papas-"+selectedVariant.label,
          name: "Papas fritas",
          variant: selectedVariant.label,
          note,
          price: selectedVariant.price,
          qty
        };
      } else if (flavorWrap){
        // calzone
        const variantLabel = selectedFlavors.join(" + ");
        line = {
          key: "calzone-"+selectedFlavors.slice().sort().join("-"),
          name: "Calzone",
          variant: variantLabel,
          note,
          price: CALZONE_PRICE,
          qty
        };
      } else {
        // pizza
        const name = card.querySelector('.item-name').textContent;
        const price = Number(card.querySelector('.item-price-single').textContent.replace(/[^\d]/g,''));
        line = {
          key: "pizza-"+name,
          name,
          variant: "",
          note,
          price,
          qty
        };
      }

      addToCart(line);

      addBtn.classList.add('added');
      const originalText = addBtn.textContent;
      addBtn.textContent = "¡Agregado!";
      setTimeout(()=>{
        addBtn.classList.remove('added');
        addBtn.textContent = originalText === "¡Agregado!" ? "Agregar" : originalText;
      }, 900);

      // reset qty
      qty = 1;
      if (qtyEl) qtyEl.textContent = 1;
    });
  });
}

/* ================= BUSQUEDA ================= */
document.getElementById('searchInput').addEventListener('input', (e)=>{
  const q = e.target.value.trim().toLowerCase();
  const cards = document.querySelectorAll('.item-card');

  if (q === ""){
    cards.forEach(c=>c.style.display = "");
    document.querySelectorAll('.no-results').forEach(n=>n.remove());
    document.querySelectorAll('section.category').forEach((s,i)=>{
      s.classList.toggle('active', i===getActiveCatIndex());
    });
    return;
  }

  // al buscar, se muestran resultados de todas las categorías
  document.querySelectorAll('section.category').forEach(s=>s.classList.add('active'));
  let anyVisible = {};
  document.querySelectorAll('section.category').forEach(s=>{ anyVisible[s.id]=false; });

  cards.forEach(c=>{
    const match = (c.dataset.search||"").includes(q);
    c.style.display = match ? "" : "none";
    if (match){
      const parent = c.closest('section.category');
      anyVisible[parent.id] = true;
    }
  });

  document.querySelectorAll('.no-results').forEach(n=>n.remove());
  Object.keys(anyVisible).forEach(id=>{
    if (!anyVisible[id]){
      const section = document.getElementById(id);
      section.classList.remove('active');
    }
  });
});

function getActiveCatIndex(){
  const nav = document.getElementById('catNav');
  const active = nav.querySelector('button.active');
  return CATEGORIES.findIndex(c=>c.id === active.dataset.cat);
}

/* ================= CARRITO: DRAWER ================= */
const overlay = document.getElementById('overlay');
const drawer = document.getElementById('drawer');
const cartFab = document.getElementById('cartFab');
const closeDrawerBtn = document.getElementById('closeDrawer');

function openDrawer(){
  overlay.classList.add('show');
  drawer.classList.add('show');
}
function closeDrawer(){
  overlay.classList.remove('show');
  drawer.classList.remove('show');
}
cartFab.addEventListener('click', openDrawer);
closeDrawerBtn.addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);

function renderCartDrawer(){
  const linesWrap = document.getElementById('cartLines');
  if (cart.length === 0){
    linesWrap.innerHTML = `<div class="empty-cart">Todavía no agregaste nada. ¡Elegí tu pizza favorita!</div>`;
  } else {
    linesWrap.innerHTML = cart.map((line, idx)=>`
      <div class="cart-line">
        <div class="cart-line-info">
          <div class="cart-line-name">${line.name}${line.variant ? ' — '+line.variant : ''}</div>
          ${line.note ? `<div class="cart-line-note">"${line.note}"</div>` : ''}
        </div>
        <div class="cart-line-right">
          <span class="cart-line-price">${money(line.price*line.qty)}</span>
          <div class="mini-stepper">
            <button data-idx="${idx}" data-action="line-dec">-</button>
            <span>${line.qty}</span>
            <button data-idx="${idx}" data-action="line-inc">+</button>
          </div>
          <button class="remove-line" data-idx="${idx}" data-action="line-remove">Quitar</button>
        </div>
      </div>
    `).join('');

    linesWrap.querySelectorAll('[data-action="line-inc"]').forEach(b=>{
      b.addEventListener('click', ()=>{
        cart[Number(b.dataset.idx)].qty++;
        renderCartBadge(); renderCartDrawer();
      });
    });
    linesWrap.querySelectorAll('[data-action="line-dec"]').forEach(b=>{
      b.addEventListener('click', ()=>{
        const i = Number(b.dataset.idx);
        cart[i].qty = Math.max(1, cart[i].qty-1);
        renderCartBadge(); renderCartDrawer();
      });
    });
    linesWrap.querySelectorAll('[data-action="line-remove"]').forEach(b=>{
      b.addEventListener('click', ()=>{
        cart.splice(Number(b.dataset.idx),1);
        renderCartBadge(); renderCartDrawer();
      });
    });
  }

  document.getElementById('cartTotal').textContent = money(cartTotal());
  updateWaButtonState();
}

/* ================= TIPO DE PEDIDO ================= */
let orderType = "delivery";
const orderTypeToggle = document.getElementById('orderTypeToggle');
const addressField = document.getElementById('addressField');
const tableField = document.getElementById('tableField');

orderTypeToggle.querySelectorAll('button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    orderTypeToggle.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    orderType = btn.dataset.type;
    addressField.style.display = orderType === 'delivery' ? '' : 'none';
    tableField.style.display = orderType === 'local' ? '' : 'none';
    updateWaButtonState();
  });
});

/* ================= UBICACIÓN ================= */
const locationBtn = document.getElementById('locationBtn');
const locationStatus = document.getElementById('locationStatus');
let sharedLocationLink = "";

locationBtn.addEventListener('click', ()=>{
  if (!navigator.geolocation){
    locationStatus.textContent = "Tu navegador no permite compartir ubicación. Escribí la dirección manualmente.";
    locationStatus.classList.add('error');
    return;
  }
  locationStatus.textContent = "Obteniendo tu ubicación...";
  locationStatus.classList.remove('error');
  navigator.geolocation.getCurrentPosition(
    (pos)=>{
      const { latitude, longitude } = pos.coords;
      sharedLocationLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      locationBtn.classList.add('captured');
      locationBtn.textContent = "📍 Ubicación compartida";
      locationStatus.innerHTML = `Listo, tu ubicación se va a incluir en el pedido.`;
      updateWaButtonState();
    },
    ()=>{
      locationStatus.textContent = "No pudimos obtener tu ubicación. Escribí la dirección manualmente.";
      locationStatus.classList.add('error');
    }
  );
});

/* ================= WHATSAPP ================= */
const waBtn = document.getElementById('waBtn');

function updateWaButtonState(){
  const name = document.getElementById('custName').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  let ok = cart.length > 0 && name !== "";
  if (orderType === 'delivery' && address === "" && !sharedLocationLink){
    ok = false;
  }
  waBtn.disabled = !ok;
}
document.getElementById('custName').addEventListener('input', updateWaButtonState);
document.getElementById('custAddress').addEventListener('input', updateWaButtonState);

waBtn.addEventListener('click', ()=>{
  const name = document.getElementById('custName').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const table = document.getElementById('custTable').value.trim();
  const notes = document.getElementById('custNotes').value.trim();

  const orderTypeLabel = { delivery:"Delivery", retiro:"Retiro / Para llevar", local:"Comer en el local" }[orderType];

  let msg = `¡Hola ${BUSINESS_NAME}! 🇮🇹 Quiero hacer este pedido:\n\n`;
  cart.forEach(line=>{
    msg += `• ${line.qty}x ${line.name}${line.variant ? ' — '+line.variant : ''} (${money(line.price*line.qty)})`;
    if (line.note) msg += ` — Nota: ${line.note}`;
    msg += `\n`;
  });
  msg += `\nTotal: ${money(cartTotal())}\n\n`;
  msg += `Tipo de pedido: ${orderTypeLabel}\n`;
  msg += `Nombre: ${name}\n`;
  if (orderType === 'delivery'){
    if (address) msg += `Dirección: ${address}\n`;
    if (sharedLocationLink) msg += `Ubicación: ${sharedLocationLink}\n`;
  }
  if (orderType === 'local' && table){
    msg += `Mesa / personas: ${table}\n`;
  }
  if (notes) msg += `Notas: ${notes}\n`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
});

/* ================= INIT ================= */
renderHoursStatus();
setInterval(renderHoursStatus, 60000);
renderNav();
renderSections();
renderCartBadge();
renderCartDrawer();