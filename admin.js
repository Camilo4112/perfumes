const firebaseConfig = {
  apiKey: "AIzaSyC9vSfCznURrSOObdyDsuOxd_vENdM-oqQ",
  authDomain: "perfumes-app-8aaeb.firebaseapp.com",
  projectId: "perfumes-app-8aaeb"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

/* LOGIN */
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));
}

/* SESIÓN */
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("userInfo").innerText =
      "Bienvenido: " + user.email;

    document.querySelector(".login-container").style.display = "none";
    document.getElementById("panel").style.display = "flex";

    loadProducts();
  }
});

/* LOGOUT */
function logout() {
  auth.signOut();
  location.reload();
}

/* FORMATEO AUTOMÁTICO PRECIO */
const priceInput = document.getElementById("price");

priceInput.addEventListener("input", function () {
  let value = this.value.replace(/\D/g, "");
  this.value = new Intl.NumberFormat("es-CO").format(value);
});

/* AGREGAR PRODUCTO */
async function addProduct() {
  try {

    const rawPrice = document.getElementById("price").value;
    const cleanPrice = rawPrice.replace(/\./g, "");

    const product = {
      name: document.getElementById("name").value,
      brand: document.getElementById("brand").value,
      category: document.getElementById("category").value,
      price: Number(cleanPrice),
      image: document.getElementById("image").value || "https://via.placeholder.com/300"
    };

    await db.collection("perfumes").add(product);

    clearForm();
    loadProducts();

  } catch (error) {
    alert("Error: " + error.message);
  }
}

/* LISTAR */
async function loadProducts() {
  const snapshot = await db.collection("perfumes").get();
  const list = document.getElementById("list");

  list.innerHTML = "";

  snapshot.forEach(doc => {
    const p = doc.data();

    list.innerHTML += `
      <div class="card">
        <div class="img-container">
          <img src="${p.image}">
        </div>

        <div class="info">
          <div class="name">${p.name}</div>
          <div class="brand">${p.brand}</div>
          <div class="category">${p.category}</div>
          <div class="price">
            ${new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP'
            }).format(p.price)}
          </div>
        </div>

        <button onclick="deleteProduct('${doc.id}')">
          Eliminar
        </button>
      </div>
    `;
  });
}

/* ELIMINAR */
async function deleteProduct(id) {
  await db.collection("perfumes").doc(id).delete();
  loadProducts();
}

/* LIMPIAR */
function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("brand").value = "";
  document.getElementById("price").value = "";
  document.getElementById("image").value = "";
}