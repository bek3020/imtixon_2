const likedBox = document.getElementById("liked_box");

function renderLiked() {
  const likedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];

  if (likedProducts.length === 0) {
    likedBox.innerHTML =
      "<p class='text-gray-500 text-lg'>Hozircha sevimlilarda hech narsa yo‘q</p>";
    return;
  }

  likedBox.innerHTML = "";
  likedProducts.forEach((item) => {
    const div = document.createElement("div");
    div.className =
      "w-[220px] bg-white shadow-md rounded-lg p-3 flex flex-col items-center relative";

    div.innerHTML = `
      <div class="relative">
        <img src="${
          item.img
        }" class="w-full h-[200px] object-cover rounded-md mb-3" alt="${
      item.title
    }" />
        <i class="fa-solid fa-heart absolute top-2 right-2 text-[#ff0000] text-xl"></i>
      </div>
      <h3 class="text-sm font-semibold mb-2 text-center">${item.title}</h3>
      <p class="text-blue-600 font-bold mb-3">${item.total.toLocaleString()} сум</p>
      <div class="flex gap-2">
        <button class="remove-like bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition">
          <i class="fa-solid fa-trash"></i> O‘chirish
        </button>
        <button class="add-to-cart bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition">
          <i class="fa-solid fa-cart-shopping"></i> Savatchaga
        </button>
      </div>
    `;

    // O'chirish tugmasi
    div.querySelector(".remove-like").addEventListener("click", () => {
      removeLike(item.id);
      div.remove();

      if (likedBox.children.length === 0) {
        likedBox.innerHTML =
          "<p class='text-gray-500 text-lg'>Sevimlilarda hech narsa yo‘q</p>";
      }
    });

    // Savatchaga qo'shish tugmasi
    div.querySelector(".add-to-cart").addEventListener("click", () => {
      addToCart(item);
    });

    likedBox.appendChild(div);
  });
}

function addToCart(item) {
  let cardProducts = JSON.parse(localStorage.getItem("cardProducts")) || [];
  const exists = cardProducts.some((p) => p.id === item.id);
  if (exists) {
    alert("Bu mahsulot savatchada allaqachon mavjud");
    return;
  }
  cardProducts.push(item);
  localStorage.setItem("cardProducts", JSON.stringify(cardProducts));
  alert("Mahsulot savatchaga qo'shildi");
}

function removeLike(id) {
  let likedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];
  likedProducts = likedProducts.filter((p) => p.id !== id);
  localStorage.setItem("likedProducts", JSON.stringify(likedProducts));
}

renderLiked();
