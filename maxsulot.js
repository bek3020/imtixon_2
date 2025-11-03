const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

async function fetchProduct() {
  try {
    const res = await fetch(
      "https://68fb6f6994ec9606602607d5.mockapi.io/cards"
    );
    const data = await res.json();

    const product = data.find((item) => item.id === productId);

    const container = document.getElementById("product_container");

    if (!product) {
      container.innerHTML =
        "<p class='text-center mt-10 text-red-600'>Mahsulot topilmadi</p>";
      return;
    }

    container.innerHTML = `
      <h1 class="text-3xl font-bold mb-4">${
        product.title || product.name || "Noma'lum mahsulot"
      }</h1>
      <img src="${product.img}" alt="${
      product.title
    }" class="w-full max-w-md mb-6 rounded-md shadow" />
      <p class="text-xl font-semibold text-blue-600 mb-2">${
        product.total ? product.total.toLocaleString() + " сум" : "Narx yo'q"
      }</p>
      <p class="mb-4">${
        product.description || "Mahsulot haqida ma'lumot mavjud emas."
      }</p>
      <a href="/" class="text-blue-600 underline">
      <button class="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">
      Orqaga qaytish
      </button>
      </a>
    `;
  } catch (error) {
    const container = document.getElementById("product_container");
    container.innerHTML =
      "<p class='text-center mt-10 text-red-600'>Xatolik yuz berdi, qayta urinib ko‘ring.</p>";
    console.error("Fetch error:", error);
  }
}

fetchProduct();
