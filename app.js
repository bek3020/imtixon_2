const cordBox = document.getElementById("cord_box");
const likeBox = document.getElementById("liked_box");

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

      const isLiked = likedProducts.some(
        (liked) => liked.id.toString() === item.id.toString()
      );
      const title = item.title || item.name || "Noma'lum mahsulot";

      card.innerHTML = `
      <div class="relative">
        <img class="w-full h-[220px] object-cover rounded-md mb-1"
             src="${item.img}"
             alt="${title}" />
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
        <i class="fa-solid fa-cart-shopping"></i>
      </button>
    `;

      const likeBtn = card.querySelector(".like-btn");
      likeBtn.addEventListener("click", () => {
        let updatedLikes =
          JSON.parse(localStorage.getItem("likedProducts")) || [];

        const alreadyLikedIndex = updatedLikes.findIndex(
          (p) => p.id.toString() === item.id.toString()
        );
        if (alreadyLikedIndex !== -1) {
          updatedLikes.splice(alreadyLikedIndex, 1);
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

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = data.find(
    (item) => item.id.toString() === productId.toString()
  );

  if (!product) {
    alert("Mahsulot topilmadi");
    return;
  }

  const existingIndex = cart.findIndex(
    (item) => item.id.toString() === productId.toString()
  );

  if (existingIndex !== -1) {
    cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    alert("Mahsulot savatchada allaqachon bor, soni oshirildi");
  } else {
    cart.push({ ...product, quantity: 1 });
    alert("Mahsulot savatchaga qo'shildi");
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

fetchData();
