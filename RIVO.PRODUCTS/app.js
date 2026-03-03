const products = [
  {
    id: "p1",
    name: "Helix Wool Coat",
    brand: "RIVO Atelier",
    category: "Outerwear",
    price: 420,
    badge: "Tailored",
    description: "Double-face wool coat with architectural shoulders and a clean concealed placket."
  },
  {
    id: "p2",
    name: "Vector Field Jacket",
    brand: "Northline Studio",
    category: "Outerwear",
    price: 340,
    badge: "Technical",
    description: "Structured utility shell with matte hardware, storm collar, and minimalist seam lines."
  },
  {
    id: "p3",
    name: "Contour Knit Set",
    brand: "Monarch Division",
    category: "Knitwear",
    price: 240,
    badge: "Soft Form",
    description: "Dense-gauge knit pairing designed for polished layering and daily luxury wear."
  },
  {
    id: "p4",
    name: "Noir Precision Shirt",
    brand: "Aether Form",
    category: "Shirting",
    price: 180,
    badge: "Core",
    description: "Crisp cotton shirt with elongated cuffs, hidden button line, and refined drape."
  },
  {
    id: "p5",
    name: "Frame Pleated Trouser",
    brand: "RIVO Atelier",
    category: "Tailoring",
    price: 230,
    badge: "Signature",
    description: "Relaxed pleated trouser cut in premium suiting cloth with a clean tapered finish."
  },
  {
    id: "p6",
    name: "Signal Cashmere Hoodie",
    brand: "Northline Studio",
    category: "Knitwear",
    price: 290,
    badge: "Elevated",
    description: "Cashmere blend hoodie with pared-back detailing and a calibrated oversized shape."
  },
  {
    id: "p7",
    name: "Axis Leather Weekender",
    brand: "Monarch Division",
    category: "Accessories",
    price: 510,
    badge: "Travel",
    description: "Full-grain leather carryall with reinforced handles and a precision-lined interior."
  },
  {
    id: "p8",
    name: "Circuit Jersey Tee",
    brand: "Aether Form",
    category: "Essentials",
    price: 95,
    badge: "Daily",
    description: "Premium-weight jersey tee with dropped shoulder balance and a smooth compact hand."
  }
];

const brands = [
  {
    type: "In-house line",
    name: "RIVO Atelier",
    description: "The flagship label for tailored silhouettes, premium materials, and strict minimalism."
  },
  {
    type: "Partner label",
    name: "Monarch Division",
    description: "Polished essentials with quiet luxury proportions and travel-ready finishing details."
  },
  {
    type: "Partner label",
    name: "Northline Studio",
    description: "Technical outerwear and engineered knitwear positioned for colder-season layering."
  },
  {
    type: "Capsule label",
    name: "Aether Form",
    description: "Modular shirting, jersey, and wardrobe foundations built around clean geometry."
  }
];

const state = {
  activeFilter: "All",
  search: "",
  cart: loadCart()
};

const filterGroup = document.querySelector("#filterGroup");
const productGrid = document.querySelector("#productGrid");
const brandGrid = document.querySelector("#brandGrid");
const cartItems = document.querySelector("#cartItems");
const cartSubtotal = document.querySelector("#cartSubtotal");
const cartCount = document.querySelector("#cartCount");
const cartDrawer = document.querySelector("#cartDrawer");
const cartToggle = document.querySelector("#cartToggle");
const cartClose = document.querySelector("#cartClose");
const overlay = document.querySelector("#overlay");
const checkoutButton = document.querySelector("#checkoutButton");
const checkoutModal = document.querySelector("#checkoutModal");
const checkoutClose = document.querySelector("#checkoutClose");
const checkoutItems = document.querySelector("#checkoutItems");
const checkoutTotal = document.querySelector("#checkoutTotal");
const checkoutForm = document.querySelector("#checkoutForm");
const searchInput = document.querySelector("#searchInput");
const productCardTemplate = document.querySelector("#productCardTemplate");
const brandCardTemplate = document.querySelector("#brandCardTemplate");

const categories = ["All", ...new Set(products.map((product) => product.category))];

renderFilters();
renderProducts();
renderBrands();
renderCart();

cartToggle.addEventListener("click", () => toggleCart(true));
cartClose.addEventListener("click", closeCart);
overlay.addEventListener("click", () => {
  closeCart();
  closeCheckout();
});
checkoutButton.addEventListener("click", openCheckout);
checkoutClose.addEventListener("click", closeCheckout);
checkoutModal.addEventListener("close", () => {
  overlay.hidden = !cartDrawer.classList.contains("is-open");
});
checkoutModal.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeCheckout();
});
searchInput.addEventListener("input", (event) => {
  state.search = event.target.value.trim().toLowerCase();
  renderProducts();
});
checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!state.cart.length) {
    closeCheckout();
    return;
  }

  const orderId = `RA-${Math.floor(100000 + Math.random() * 900000)}`;
  state.cart = [];
  saveCart();
  renderCart();
  renderProducts();
  closeCheckout();
  closeCart();
  checkoutForm.reset();
  alert(`Order ${orderId} placed. This demo store does not process real payments.`);
});

function renderFilters() {
  filterGroup.innerHTML = "";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-chip${category === state.activeFilter ? " is-active" : ""}`;
    button.textContent = category;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(category === state.activeFilter));
    button.addEventListener("click", () => {
      state.activeFilter = category;
      renderFilters();
      renderProducts();
    });
    filterGroup.appendChild(button);
  });
}

function renderProducts() {
  const matchingProducts = products.filter((product) => {
    const matchesFilter = state.activeFilter === "All" || product.category === state.activeFilter;
    const haystack = `${product.name} ${product.brand} ${product.category} ${product.description}`.toLowerCase();
    const matchesSearch = !state.search || haystack.includes(state.search);
    return matchesFilter && matchesSearch;
  });

  productGrid.innerHTML = "";

  if (!matchingProducts.length) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-products";
    emptyState.textContent = "No products match this filter.";
    productGrid.appendChild(emptyState);
    return;
  }

  matchingProducts.forEach((product) => {
    const fragment = productCardTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".product-card");
    const badge = fragment.querySelector(".product-badge");
    const label = fragment.querySelector(".product-label");
    const title = fragment.querySelector("h3");
    const description = fragment.querySelector(".product-description");
    const price = fragment.querySelector(".product-price");
    const button = fragment.querySelector(".add-to-cart");

    card.dataset.category = product.category;
    badge.textContent = product.badge;
    label.textContent = `${product.brand} / ${product.category}`;
    title.textContent = product.name;
    description.textContent = product.description;
    price.textContent = formatCurrency(product.price);
    button.addEventListener("click", () => addToCart(product.id));

    productGrid.appendChild(fragment);
  });
}

function renderBrands() {
  brandGrid.innerHTML = "";

  brands.forEach((brand) => {
    const fragment = brandCardTemplate.content.cloneNode(true);
    fragment.querySelector(".brand-type").textContent = brand.type;
    fragment.querySelector(".brand-name").textContent = brand.name;
    fragment.querySelector(".brand-text").textContent = brand.description;
    brandGrid.appendChild(fragment);
  });
}

function renderCart() {
  cartItems.innerHTML = "";

  if (!state.cart.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Your cart is empty. Add products from the collection.";
    cartItems.appendChild(empty);
  } else {
    state.cart.forEach((item) => {
      const product = getProduct(item.id);
      if (!product) {
        return;
      }

      const cartItem = document.createElement("article");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <div>
          <strong>${product.name}</strong>
          <p>${product.brand} / Qty ${item.quantity}</p>
        </div>
        <div class="cart-item-controls">
          <button type="button" aria-label="Decrease quantity">−</button>
          <span>${formatCurrency(product.price * item.quantity)}</span>
          <button type="button" aria-label="Increase quantity">+</button>
        </div>
      `;

      const [decreaseButton, increaseButton] = cartItem.querySelectorAll("button");
      decreaseButton.addEventListener("click", () => updateQuantity(item.id, item.quantity - 1));
      increaseButton.addEventListener("click", () => updateQuantity(item.id, item.quantity + 1));
      cartItems.appendChild(cartItem);
    });
  }

  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.cart.reduce((sum, item) => {
    const product = getProduct(item.id);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);

  cartCount.textContent = String(totalItems);
  cartSubtotal.textContent = formatCurrency(subtotal);
  checkoutButton.disabled = !state.cart.length;
  renderCheckoutSummary(subtotal);
}

function renderCheckoutSummary(subtotal) {
  checkoutItems.innerHTML = "";

  state.cart.forEach((item) => {
    const product = getProduct(item.id);
    if (!product) {
      return;
    }

    const line = document.createElement("div");
    line.className = "checkout-item";
    line.innerHTML = `
      <div>
        <strong>${product.name}</strong>
        <p>${item.quantity} × ${formatCurrency(product.price)}</p>
      </div>
      <strong>${formatCurrency(product.price * item.quantity)}</strong>
    `;
    checkoutItems.appendChild(line);
  });

  if (!state.cart.length) {
    const empty = document.createElement("p");
    empty.textContent = "Add items to begin checkout.";
    checkoutItems.appendChild(empty);
  }

  checkoutTotal.textContent = formatCurrency(subtotal);
}

function addToCart(productId) {
  const item = state.cart.find((entry) => entry.id === productId);

  if (item) {
    item.quantity += 1;
  } else {
    state.cart.push({ id: productId, quantity: 1 });
  }

  saveCart();
  renderCart();
  toggleCart(true);
}

function updateQuantity(productId, quantity) {
  state.cart = state.cart
    .map((item) => (item.id === productId ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);

  saveCart();
  renderCart();
}

function toggleCart(shouldOpen) {
  cartDrawer.classList.toggle("is-open", shouldOpen);
  cartDrawer.setAttribute("aria-hidden", String(!shouldOpen));
  cartToggle.setAttribute("aria-expanded", String(shouldOpen));
  overlay.hidden = !shouldOpen && !checkoutModal.open;
}

function closeCart() {
  toggleCart(false);
}

function openCheckout() {
  if (!state.cart.length) {
    return;
  }

  overlay.hidden = false;
  checkoutModal.showModal();
}

function closeCheckout() {
  if (checkoutModal.open) {
    checkoutModal.close();
  }

  overlay.hidden = !cartDrawer.classList.contains("is-open");
}

function getProduct(productId) {
  return products.find((product) => product.id === productId);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function loadCart() {
  try {
    const stored = localStorage.getItem("rivo-cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem("rivo-cart", JSON.stringify(state.cart));
  } catch {
    // Ignore storage write failures and keep the session functional.
  }
}
