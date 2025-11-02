const cordBox = document.getElementById("cord_box");
const likeBox = document.getElementById("liked_box");

async function fetchData() {
  const res = await fetch("https://68fb6f6994ec9606602607d5.mockapi.io/cards");
  const data = await res.json();

  const likedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];

  data.forEach((item) => {
    const card = document.createElement("div");

    card.className =
      "card w-[220px] bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition flex flex-col";

    const isLiked = likedProducts.some((liked) => liked.id === item.id);
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
      <button class="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
        <i class="fa-solid fa-cart-shopping"></i>
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
}

fetchData();
