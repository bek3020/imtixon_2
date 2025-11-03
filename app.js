const cordBox = document.getElementById("cord_box");
const cartBox = document.getElementById("cart_box");

let data = [];

async function fetchData() {
  try {
    const res = await fetch(
      "https://68fb6f6994ec9606602607d5.mockapi.io/cards"
    );
    data = await res.json();

    const likedProducts =
      JSON.parse(localStorage.getItem("likedProducts")) || [];

    data.forEach((item) => {
      const card = document.createElement("div");
      card.className =
        "card w-[220px] bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition flex flex-col";

      const isLiked = likedProducts.some((liked) => liked.id === item.id);
      const title = item.title || item.name || "Noma'lum mahsulot";

      card.innerHTML = `
        <div class="relative">
          <img class="w-full h-[220px] object-cover rounded-md mb-1" src="${
            item.img
          }" alt="${title}" />
          <i class="fa${
            isLiked ? "-solid" : "-regular"
          } fa-heart absolute top-2 right-2 text-xl cursor-pointer like-btn" style="color: ${
        isLiked ? "#ff0000" : "#000"
      }"></i>
        </div>
        <a href="maxsulot.html?id=${item.id}">
          <h3 class="relative text-sm font-semibold mb-2 line-clamp-2 text-gray-800">${title}</h3>
          <div class="icons_box flex items-center gap-1 mb-2 text-yellow-400">
            ${'<i class="fa-solid fa-star"></i>'.repeat(Math.round(item.star))}
            <span class="text-gray-400 ml-1">${item.star || 0}</span>
          </div>
          <p class="text-blue-600 font-bold text-lg mt-auto">${
            item.total ? item.total.toLocaleString() : "N/A"
          } сум</p>
        </a>
        <button class="add-to-cart-btn mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition" data-id="${
          item.id
        }">
          Savatchaga <i class="fa-solid fa-cart-shopping"></i>
        </button>
      `;

      const likeBtn = card.querySelector(".like-btn");
      likeBtn.addEventListener("click", () => {
        let updatedLikes =
          JSON.parse(localStorage.getItem("likedProducts")) || [];

        const alreadyLiked = updatedLikes.find((p) => p.id === item.id);
        if (alreadyLiked) {
          updatedLikes = updatedLikes.filter((p) => p.id !== item.id);
          likeBtn.classList.replace("fa-solid", "fa-regular");
          likeBtn.style.color = "#000";
        } else {
          updatedLikes.push(item);
          likeBtn.classList.replace("fa-regular", "fa-solid");
          likeBtn.style.color = "#ff0000";
        }

        localStorage.setItem("likedProducts", JSON.stringify(updatedLikes));
      });

      cordBox.appendChild(card);
    });

    cordBox.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const productId = btn.getAttribute("data-id");
        addToCart(productId);
      });
    });
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

function addToCart(productId) {
  if (!productId) return;
  productId = productId.toString();

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingProductIndex = cart.findIndex(
    (item) => item.id.toString() === productId
  );

  if (existingProductIndex !== -1) {
    cart[existingProductIndex].quantity =
      (cart[existingProductIndex].quantity || 1) + 1;
  } else {
    const product = data.find((item) => item.id.toString() === productId);
    if (!product) {
      console.error("Mahsulot topilmadi, id:", productId);
      return;
    }
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  alert("Mahsulot savatchaga qo'shildi!");
}

function renderCart() {
  if (!cartBox) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartBox.innerHTML = `
      <h2 class="text-2xl font-bold text-gray-700">🛒 Savatchangiz bo'sh</h2>
      <p class="text-gray-500 mt-2">Xarid qilishni boshlang!</p>
    `;
    return;
  }

  let cartItemsHTML = cart
    .map((item) => {
      const title = item.title || item.name || "Noma'lum mahsulot";
      const price = Number(item.total) * (item.quantity || 1);
      const formattedPrice = isNaN(price)
        ? "Narx yo'q"
        : price.toLocaleString() + " сум";

      return `
        <div class="flex items-center border-b py-3">
          <img src="${
            item.img
          }" alt="${title}" class="w-16 h-16 object-cover rounded mr-4"/>
          <div class="flex-grow">
            <h4 class="font-semibold text-gray-800">${title}</h4>
            <p class="text-sm text-gray-500">Soni: ${item.quantity || 1}</p>
          </div>
          <p class="font-bold text-blue-600">${formattedPrice}</p>
        </div>
      `;
    })
    .join("");

  const totalAmount = cart.reduce(
    (sum, item) => sum + Number(item.total || 0) * (item.quantity || 1),
    0
  );
  const formattedTotal = totalAmount.toLocaleString() + " сум";

  cartBox.innerHTML = `
    <h2 class="text-3xl font-bold mb-6 text-gray-800">🛒 Savatcha (Jami ${cart.length} tur)</h2>
    <div class="space-y-4">
      ${cartItemsHTML}
    </div>
    <div class="mt-6 pt-4 border-t-2 border-blue-100 flex justify-between items-center">
      <p class="text-xl font-bold">Umumiy narx:</p>
      <p class="text-2xl font-extrabold text-blue-700">${formattedTotal}</p>
    </div>
  `;
}

fetchData().then(() => {
  renderCart();
});
