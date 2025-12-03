const CART_STORAGE_KEY = "menufood_cart";

// ===== UTILIDADES DE CARRINHO =====
function getCart() {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error("Erro ao ler carrinho:", e);
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const badge = document.getElementById("cart-count");
    if (badge) {
        badge.textContent = total;
    }
}

function formatCurrency(value) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function addToCart(id, name, price) {
    const cart = getCart();

    const existing = cart.find((item) => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id,
            name,
            price,
            quantity: 1,
        });
    }

    saveCart(cart);
    updateCartCount();
    alert(`${name} foi adicionado ao carrinho!`);
}

function changeCartQuantity(id, delta) {
    const cart = getCart();
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    item.quantity = (item.quantity || 1) + delta;

    if (item.quantity <= 0) {
        const idx = cart.findIndex((i) => i.id === id);
        if (idx !== -1) cart.splice(idx, 1);
    }

    saveCart(cart);
    updateCartCount();
    renderCart();
}

function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter((item) => item.id !== id);
    saveCart(cart);
    updateCartCount();
    renderCart();
}

function clearCart() {
    saveCart([]);
    updateCartCount();
    renderCart();
}

function openCart() {
    window.location.href = "/pages/cart.html";
}

// ===== RENDERIZAÇÃO DA PÁGINA DE CARRINHO =====
function renderCart() {
    const listEl = document.getElementById("cart-items");
    const emptyEl = document.getElementById("cart-empty");
    const subtotalEl = document.getElementById("cart-subtotal");
    const feeEl = document.getElementById("cart-fee");
    const totalEl = document.getElementById("cart-total");

    if (!listEl) return; // não está na página do carrinho

    const cart = getCart();
    listEl.innerHTML = "";

    if (!cart.length) {
        if (emptyEl) emptyEl.style.display = "flex";
        if (subtotalEl) subtotalEl.textContent = formatCurrency(0);
        if (feeEl) feeEl.textContent = formatCurrency(0);
        if (totalEl) totalEl.textContent = formatCurrency(0);
        return;
    }

    if (emptyEl) emptyEl.style.display = "none";

    let subtotal = 0;

    cart.forEach((item) => {
        const quantity = item.quantity || 1;
        const subtotalItem = item.price * quantity;
        subtotal += subtotalItem;

        const row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = `
      <div class="cart-item__info">
        <h3 class="cart-item__name">${item.name}</h3>
        <span class="cart-item__price-unit">${formatCurrency(
            item.price
        )} / un.</span>
      </div>
      <div class="cart-item__actions">
        <div class="cart-qty">
          <button type="button" onclick="changeCartQuantity('${item.id
            }', -1)">−</button>
          <span class="cart-qty__value">${quantity}</span>
          <button type="button" onclick="changeCartQuantity('${item.id
            }', 1)">+</button>
        </div>
        <div class="cart-item__subtotal">
          ${formatCurrency(subtotalItem)}
        </div>
        <button type="button" class="cart-item__remove" onclick="removeFromCart('${item.id
            }')">
          Remover
        </button>
      </div>
    `;

        listEl.appendChild(row);
    });

    const serviceFee = subtotal > 0 ? Math.round(subtotal * 0.05 * 100) / 100 : 0; // 5%
    const total = subtotal + serviceFee;

    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
    if (feeEl) feeEl.textContent = formatCurrency(serviceFee);
    if (totalEl) totalEl.textContent = formatCurrency(total);
}

// ===== CARROSSEL DA HOME =====
document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".carousel__track");
    const prevBtn = document.querySelector(".carousel__control--prev");
    const nextBtn = document.querySelector(".carousel__control--next");

    if (track && prevBtn && nextBtn) {
        const scrollAmount = 260;

        prevBtn.addEventListener("click", () => {
            track.parentElement.scrollBy({
                left: -scrollAmount,
                behavior: "smooth",
            });
        });

        nextBtn.addEventListener("click", () => {
            track.parentElement.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
            });
        });
    }

    updateCartCount();

    // se estiver na página do carrinho, renderiza os itens
    const cartPage = document.getElementById("cart-page");
    if (cartPage) {
        renderCart();
    }
});

// ===== LOGIN =====
function login(event) {
    event.preventDefault();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const rememberInput = document.getElementById("remember");

    if (!emailInput || !passwordInput) {
        console.warn("Campos de login não encontrados na página.");
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const remember = rememberInput ? rememberInput.checked : false;

    if (!email || !password) {
        alert("Preencha e-mail e senha para continuar.");
        return;
    }

    const userData = {
        email,
        loggedAt: new Date().toISOString(),
        remember,
    };

    localStorage.setItem("menufood_user", JSON.stringify(userData));

    alert("Login realizado com sucesso!");
    window.location.href = "/pages/index.html";
}

// ===== CADASTRO =====
function registerUser(event) {
    event.preventDefault();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmInput = document.getElementById("confirmPassword");
    const termsInput = document.getElementById("terms");

    if (!nameInput || !emailInput || !passwordInput || !confirmInput) {
        console.warn("Campos de cadastro não encontrados na página.");
        return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmInput.value.trim();

    if (!name || !email || !password || !confirmPassword) {
        alert("Preencha todos os campos para continuar.");
        return;
    }

    if (password !== confirmPassword) {
        alert("A confirmação de senha não confere.");
        return;
    }

    if (!termsInput.checked) {
        alert("Você precisa aceitar os termos para continuar.");
        return;
    }

    const userData = {
        name,
        email,
        registeredAt: new Date().toISOString(),
    };

    localStorage.setItem("menufood_user", JSON.stringify(userData));

    alert("Cadastro realizado com sucesso!");
    window.location.href = "/pages/index.html";
}
