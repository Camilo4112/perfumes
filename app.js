const phone = "573013614704";
const itemsPerPage = 12;

let perfumes = [];
let currentPage = 1;

const container = document.getElementById("products");
const pagination = document.getElementById("pagination");

fetch("perfumes.json")
  .then(res => res.json())
  .then(data => {
    perfumes = data;
    loadBrands();
    render();
  });

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
          <img src="${imageUrl}" alt="${p.name}">
        </div>

        <div class="info">
          <div class="name">${p.name}</div>
          <div class="brand">${p.brand}</div>
          <div class="category">${p.category}</div>
        </div>

        <a class="btn" href="${link}" target="_blank">Comprar</a>
      </div>
    `;
  });

  renderPagination(filtered.length);
}

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