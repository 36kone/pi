import Navbar from '../components/navbar.js';

document.addEventListener('DOMContentLoaded', () => {
  const navbar = new Navbar();
  navbar.mount('#navbar-container');

  initCarousel();
  updateCartCount();
  const cartPage = document.getElementById("cart-page");
  if (cartPage) {
    renderCart();
  }
});

function initCarousel() {
  const carousels = document.querySelectorAll(".carousel");

  carousels.forEach((carousel) => {
    const viewport = carousel.querySelector(".carousel__viewport");
    const prevBtn = carousel.querySelector(".carousel__control--prev");
    const nextBtn = carousel.querySelector(".carousel__control--next");

    if (!viewport || !prevBtn || !nextBtn) return;

    const scrollAmount = 260;

    prevBtn.addEventListener("click", () => {
      viewport.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    });

    nextBtn.addEventListener("click", () => {
      viewport.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    });
  });
}
1