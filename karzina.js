const cardBox = document.getElementById("cart_box");
const totalSum = document.getElementById("cart_sum");
const totalPrice = document.getElementById("total_price");

function saveCartProducts(cardProducts) {
  localStorage.setItem("cardProducts", JSON.stringify(cardProducts));
}

function removeFromCart(id) {
  let cardProducts = JSON.parse(localStorage.getItem("cardProducts")) || [];
  cardProducts = cardProducts.filter((item) => item.id !== id);
  saveCartProducts(cardProducts);
}

function updateQuantity(id, newQuantity) {
  let cardProducts = JSON.parse(localStorage.getItem("cardProducts")) || [];
  cardProducts = cardProducts.map((item) => {
    if (item.id === id) {
      return { ...item, quantity: newQuantity };
    }
    return item;
  });
  saveCartProducts(cardProducts);
}

function renderCard() {
  const cardProducts = JSON.parse(localStorage.getItem("cardProducts")) || [];

  if (cardProducts.length === 0) {
    cardBox.innerHTML =
      "<p class='text-gray-500 text-lg'>Hozircha savatchada hech narsa yo‘q</p>";
    totalSum.classList.add("hidden");
    return;
  }

  cardBox.innerHTML = "";
  let total = 0;

  cardProducts.forEach((item) => {
    const quantity = item.quantity || 1;
    const itemTotal = Number(item.total) * quantity;

    const div = document.createElement("div");
    div.className =
      "bg-white rounded-lg shadow-md p-4 flex items-center justify-between";

    div.innerHTML = `
      <div class="flex items-center gap-4">
        <img src="${item.img}" alt="${
      item.title
    }" class="w-20 h-20 object-cover rounded-md" />
        <div>
          <h3 class="font-semibold text-gray-800">${item.title}</h3>
          <p class="text-blue-600 font-bold">${itemTotal.toLocaleString()} so‘m</p>
          <div class="quantity-controls mt-2 flex items-center gap-2">
            <button class="decrease-btn bg-gray-200 px-2 rounded">-</button>
            <span>${quantity}</span>
            <button class="increase-btn bg-gray-200 px-2 rounded">+</button>
          </div>
        </div>
      </div>

      <button class="text-red-500 hover:text-red-700 font-semibold text-sm remove-btn">
        <i class="fa-solid fa-trash mr-1"></i> O‘chirish
      </button>
    `;

    total += itemTotal;

    div.querySelector(".remove-btn").addEventListener("click", () => {
      removeFromCart(item.id);
      renderCard();
    });

    div.querySelector(".decrease-btn").addEventListener("click", () => {
      if (quantity > 1) {
        updateQuantity(item.id, quantity - 1);
        renderCard();
      }
    });

    div.querySelector(".increase-btn").addEventListener("click", () => {
      updateQuantity(item.id, quantity + 1);
      renderCard();
    });

    cardBox.appendChild(div);
  });

  totalSum.classList.remove("hidden");
  totalPrice.textContent = total.toLocaleString() + " so‘m";
}

document.addEventListener("DOMContentLoaded", () => {
  renderCard();
});
