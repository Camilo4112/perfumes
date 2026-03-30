const firebaseConfig = {
  apiKey: "AIzaSyC9vSfCznURrSOObdyDsuOxd_vENdM-oqQ",
  authDomain: "perfumes-app-8aaeb.firebaseapp.com",
  projectId: "perfumes-app-8aaeb",
  storageBucket: "perfumes-app-8aaeb.firebasestorage.app",
  messagingSenderId: "744434930442",
  appId: "1:744434930442:web:63aad61a86788bc8b360f3"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const phone = "573013614704";
const itemsPerPage = 12;

let perfumes = [];
let currentPage = 1;

const container = document.getElementById("products");
const pagination = document.getElementById("pagination");

// 🔥 CARGAR DESDE FIREBASE
async function loadData() {
  const snapshot = await db.collection("perfumes").get();

  perfumes = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  loadBrands();
  render();
}

loadData();

/* FILTROS */
function loadBrands() {
  const brands = [...new Set(perfumes.map(p => p.brand))];
  const select = document.getElementById("brand");

  select.innerHTML = '<option value="">Todas las marcas</option>';

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
  const sort = document.getElementById("sort").value;

  let filtered = perfumes.filter(p =>
    p.name.toLowerCase().includes(text) &&
    (category === "" || p.category === category) &&
    (brand === "" || p.brand === brand)
  );

  if (sort === "az") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  return filtered;
}

/* RENDER */
function render() {
  const filtered = getFiltered();

  if (filtered.length === 0) {
    container.innerHTML = "<p>No se encontraron perfumes</p>";
    pagination.innerHTML = "";
    return;
  }

  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);

  container.innerHTML = "";

  paginated.forEach(p => {
    const msg = encodeURIComponent(
      `Hola, estoy interesado en el perfume ${p.name}. ¿Me puedes dar más información?`
    );

    const link = `https://wa.me/${phone}?text=${msg}`;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="img-container">
        <img src="${p.image}" onerror="this.src='https://via.placeholder.com/300'">
      </div>

      <div class="info">
        <div class="name">${p.name}</div>
        <div class="brand">${p.brand}</div>
        <div class="category">${p.category}</div>
        ${p.price ? `<div class="price">$${p.price}</div>` : ""}
      </div>

      <div class="actions">
        <a class="btn" href="${link}" target="_blank">
          Comprar por WhatsApp
        </a>
      </div>
    `;

    container.appendChild(card);
  });

  renderPagination(filtered.length);
}

/* PAGINACIÓN */
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

/* EVENTOS */
["search", "category", "brand", "sort"].forEach(id => {
  document.getElementById(id).addEventListener("input", () => {
    currentPage = 1;
    render();
  });
});