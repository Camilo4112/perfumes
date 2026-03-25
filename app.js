const phone = "573013614704";
const itemsPerPage = 12;

let perfumes = [];
let currentPage = 1;

/*
Ahora el carrito guarda objetos:
{ name: "Perfume X", qty: 1 }
*/
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const container = document.getElementById("products");
const pagination = document.getElementById("pagination");

/* ================= FETCH ================= */
fetch("perfumes.json")
  .then(res => res.json())
  .then(data => {
    perfumes = data;
    loadBrands();
    render();
    updateCartCount();
  });

/* ================= FILTROS ================= */
function loadBrands() {
  const brands = [...new Set(perfumes.map(p => p.brand))];
  const select = document.getElementById("brand");

  brands.forEach(b => {
    const option = document.createElement("option");
    option.value = b;
    option.textContent = b;
    select.appendChild(option);
  });
}

function getFiltered() {
  const text = document.getElementById("search").value.toLowerCase();
  const category = document.getElementById("category").value;
  const brand = document.getElementById("brand").value;

  return perfumes.filter(p =>
    p.name.toLowerCase().includes(text) &&
    (category === "" || p.category === category) &&
    (brand === "" || p.brand === brand)
  );
}

/* ================= RENDER ================= */
function render() {
  const filtered = getFiltered();
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);

  container.innerHTML = "";

  paginated.forEach(p => {
    const msg = encodeURIComponent(`Hola, quiero info sobre ${p.name}`);
    const link = `https://wa.me/${phone}?text=${msg}`;
    const imageUrl = p.image || "https://via.placeholder.com/300";

    container.innerHTML += `
      <div class="card">
        <div class="img-container">
          <img src="${imageUrl}">
        </div>

        <div class="info">
          <div class="name">${p.name}</div>
          <div class="brand">${p.brand}</div>
          <div class="category">${p.category}</div>
        </div>

        <div class="actions">
          <a class="btn" href="${link}" target="_blank">Comprar</a>
          <button class="add-cart" onclick="addToCart('${p.name}')">Agregar</button>
        </div>
      </div>
    `;
  });

  renderPagination(filtered.length);
}

/* ================= CARRITO ================= */

// AGREGAR
function addToCart(name) {
  const existing = cart.find(p => p.name === name);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, qty: 1 });
  }

  saveCart();
  showToast("✅ Agregado al carrito");
}

// ELIMINAR
function removeFromCart(name) {
  cart = cart.filter(p => p.name !== name);
  saveCart();
}

// GUARDAR
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// CONTADOR
function updateCartCount() {
  const total = cart.reduce((sum, p) => sum + p.qty, 0);
  document.getElementById("cart-count").textContent = total;
}

/* ================= WHATSAPP ================= */

function sendCart() {
  if (cart.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  let message = "🧾 *PEDIDO DE PERFUMES* 🧾\n\n";

  cart.forEach(p => {
    message += `• ${p.name} x${p.qty}\n`;
  });

  message += "\nGracias, quedo atento 🙌";

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

/* ================= PAGINACIÓN ================= */

function renderPagination(total) {
  pagination.innerHTML = "";
  const pages = Math.ceil(total / itemsPerPage);

  for (let i = 1; i <= pages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;

    if (i === currentPage) btn.classList.add("active");

    btn.onclick = () => {
      currentPage = i;
      render();
    };

    pagination.appendChild(btn);
  }
}

/* ================= EVENTOS ================= */

document.getElementById("search").addEventListener("input", () => {
  currentPage = 1;
  render();
});

document.getElementById("category").addEventListener("change", () => {
  currentPage = 1;
  render();
});

document.getElementById("brand").addEventListener("change", () => {
  currentPage = 1;
  render();
});

/* ================= TOAST ================= */

function showToast(text) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = text;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}