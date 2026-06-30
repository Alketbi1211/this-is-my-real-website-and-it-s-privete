
let allProducts = [];
let allCategories = [];
let selectedProduct = null;
let selectedOptions = {};
let selectedQuantity = 1;

const grid = document.querySelector("#product-grid");
const categoryPanel = document.querySelector("#category-panel");
const filterButtons = document.querySelectorAll(".filter-btn");
const vehicleId = document.body.dataset.vehicle;

Promise.all([
  fetch("../data/products.json").then(res => res.json()),
  fetch("../data/categories.json").then(res => res.json())
]).then(([products, categories]) => {
  allCategories = categories;
  allProducts = products.filter(product => product.vehicle === vehicleId);
  renderCategoryCards();
  renderProducts(allProducts);
  createProductModal();
});

function renderCategoryCards() {
  if (!categoryPanel) return;
  categoryPanel.innerHTML = allCategories.map(category => {
    const count = allProducts.filter(product => product.category === category.id).length;
    return `<button class="category-card-small" data-category="${category.id}">
      <div class="category-icon">${category.icon}</div><h3>${category.id}</h3><p>${category.description}</p>
      <div style="margin-top:14px;"><span class="counter-pill">${count} products</span></div></button>`;
  }).join("");

  document.querySelectorAll(".category-card-small").forEach(card => {
    card.addEventListener("click", () => {
      const category = card.dataset.category;
      document.querySelectorAll(".category-card-small").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      setActiveFilter(category);
      renderProducts(allProducts.filter(product => product.category === category));
      document.querySelector("#products").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function getInitialImage(product) {
  const firstOption = product.options?.[0]?.choices?.[0];
  const firstImage = resolveChoiceImage(firstOption, product, {}, product.options?.[0]);
  return `../${firstImage || product.images?.[0] || "images/products/placeholder-product.svg"}`;
}

function renderProducts(products) {
  if (!grid) return;
  if (products.length === 0) {
    grid.innerHTML = `<div class="empty-state">Products for this category will be added next.</div>`;
    return;
  }

  grid.innerHTML = products.map(product => `
    <article class="product-card">
      <img src="${getInitialImage(product)}" alt="${product.name}">
      <div class="product-body">
        <span class="tag">${product.category}</span>
        <h3>${product.name}</h3>
        <p>${product.shortDescription || product.description}</p>
        <div class="product-meta">
          <span>${product.vehicleName}</span>
          <span>${product.status === "in-stock" ? "In Stock" : "Coming Soon"}</span>
        </div>
        <div class="price">${formatPrice(product)}</div>
        <div class="product-actions">
          <button class="cart-btn" onclick="openProductModal('${product.id}')">Choose Options</button>
          <button class="whatsapp" onclick="quickWhatsApp('${product.id}')">Quick WhatsApp</button>
        </div>
      </div>
    </article>`).join("");
}

function formatPrice(product) {
  if (product.status === "coming-soon" || product.price === null) return "Coming Soon";
  return `${product.currency} ${product.basePrice || product.price}`;
}

function setActiveFilter(category) {
  filterButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.category === category));
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const category = button.dataset.category;
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    document.querySelectorAll(".category-card-small").forEach(card => {
      card.classList.toggle("active", card.dataset.category === category);
    });
    if (category === "All") {
      document.querySelectorAll(".category-card-small").forEach(card => card.classList.remove("active"));
      renderProducts(allProducts);
    } else {
      renderProducts(allProducts.filter(product => product.category === category));
    }
  });
});

function findProduct(productId) {
  return allProducts.find(product => product.id === productId);
}

function createProductModal() {
  if (document.querySelector("#product-modal")) return;
  const modal = document.createElement("div");
  modal.id = "product-modal";
  modal.className = "product-modal hidden";
  modal.innerHTML = `
    <div class="modal-backdrop" onclick="closeProductModal()"></div>
    <div class="modal-card">
      <button class="modal-close" onclick="closeProductModal()">×</button>
      <div class="modal-layout">
        <div class="modal-gallery">
          <img id="modal-main-image" src="" alt="">
        </div>
        <div class="modal-details">
          <span id="modal-category" class="tag"></span>
          <h2 id="modal-title"></h2>
          <p id="modal-description"></p>
          <div id="modal-features" class="feature-list"></div>
          <div id="dynamic-options"></div>
          <div class="quantity-row">
            <h3>Quantity</h3>
            <div class="quantity-control">
              <button onclick="changeQuantity(-1)">−</button>
              <span id="quantity-value">1</span>
              <button onclick="changeQuantity(1)">+</button>
            </div>
          </div>
          <div class="modal-price-row">
            <span>Total</span>
            <strong id="modal-price">AED 0</strong>
          </div>
          <div class="modal-actions">
            <button class="cart-btn" onclick="addConfiguredToCart()">Add to Cart</button>
            <button class="whatsapp" onclick="orderConfiguredWhatsApp()">Order on WhatsApp</button>
          </div>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

function openProductModal(productId) {
  const product = findProduct(productId);
  if (!product) return;
  selectedProduct = product;
  selectedOptions = {};
  selectedQuantity = 1;

  (product.options || []).forEach(option => {
    if (option.choices && option.choices.length) {
      selectedOptions[option.id] = option.choices[0].value;
    }
  });

  document.querySelector("#modal-category").textContent = product.category;
  document.querySelector("#modal-title").textContent = product.name;
  document.querySelector("#modal-description").textContent = product.description || product.shortDescription || "";
  document.querySelector("#quantity-value").textContent = selectedQuantity;

  renderFeatures(product);
  renderDynamicOptions();
  updateModalPreview();

  document.querySelector("#product-modal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeProductModal() {
  document.querySelector("#product-modal")?.classList.add("hidden");
  document.body.style.overflow = "";
}

function renderFeatures(product) {
  const el = document.querySelector("#modal-features");
  el.innerHTML = (product.features || []).map(feature => `<span>✓ ${feature}</span>`).join("");
}

function getOptionById(id) {
  return selectedProduct?.options?.find(option => option.id === id);
}

function getChoice(optionId) {
  const option = getOptionById(optionId);
  return option?.choices?.find(choice => choice.value === selectedOptions[optionId]);
}

function resolveChoiceImage(choice, product, currentSelections = selectedOptions, option = null) {
  if (!choice) return null;
  if (choice.image) return choice.image;

  if (choice.images) {
    const dependencyId = option?.dependsOn || choice.dependsOn;
    if (dependencyId && currentSelections[dependencyId] && choice.images[currentSelections[dependencyId]]) {
      return choice.images[currentSelections[dependencyId]];
    }

    const firstKey = Object.keys(choice.images)[0];
    return choice.images[firstKey];
  }

  return null;
}

function getVisibleChoices(option) {
  if (!option.dependsOn) return option.choices || [];
  const parentValue = selectedOptions[option.dependsOn];
  return (option.choices || []).filter(choice => {
    if (!choice.images) return true;
    return Boolean(choice.images[parentValue]);
  });
}

function renderDynamicOptions() {
  const container = document.querySelector("#dynamic-options");
  if (!selectedProduct.options || selectedProduct.options.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = selectedProduct.options.map((option, index) => {
    const choices = getVisibleChoices(option);
    return `
      <div class="option-section">
        <h3>${index + 1}. ${option.label}</h3>
        <div class="visual-grid">
          ${choices.map(choice => {
            const image = resolveChoiceImage(choice, selectedProduct, selectedOptions, option);
            const active = selectedOptions[option.id] === choice.value;
            const add = choice.priceAdd ? `<small>+ AED ${choice.priceAdd}</small>` : `<small>Included</small>`;
            const swatch = choice.hex ? `<i class="swatch" style="background:${choice.hex}"></i>` : "";
            return `
              <button class="visual-choice ${active ? "active" : ""}" onclick="selectOption('${option.id}', '${choice.value}')">
                ${image ? `<img src="../${image}" alt="${choice.label}">` : ""}
                <span>${swatch}${choice.label}</span>
                ${add}
              </button>`;
          }).join("")}
        </div>
      </div>`;
  }).join("");
}

function selectOption(optionId, value) {
  selectedOptions[optionId] = value;

  // Reset dependent options to first available choice when parent changes
  (selectedProduct.options || []).forEach(option => {
    if (option.dependsOn === optionId) {
      const choices = getVisibleChoices(option);
      if (choices.length) selectedOptions[option.id] = choices[0].value;
    }
  });

  renderDynamicOptions();
  updateModalPreview();
}

function changeQuantity(amount) {
  selectedQuantity = Math.max(1, selectedQuantity + amount);
  document.querySelector("#quantity-value").textContent = selectedQuantity;
  updateModalPreview();
}

function getCurrentPreviewImage() {
  if (!selectedProduct) return "images/products/placeholder-product.svg";

  // Prefer the last selected option with an image because it is usually most specific.
  const options = selectedProduct.options || [];
  for (let i = options.length - 1; i >= 0; i--) {
    const choice = getChoice(options[i].id);
    const image = resolveChoiceImage(choice, selectedProduct, selectedOptions, options[i]);
    if (image) return image;
  }

  return selectedProduct.images?.[0] || "images/products/placeholder-product.svg";
}

function getTotalPrice() {
  if (!selectedProduct || selectedProduct.price === null) return null;
  const base = selectedProduct.basePrice ?? selectedProduct.price ?? 0;
  const add = (selectedProduct.options || []).reduce((sum, option) => {
    const choice = getChoice(option.id);
    return sum + (choice?.priceAdd || 0);
  }, 0);
  return (base + add) * selectedQuantity;
}

function updateModalPreview() {
  if (!selectedProduct) return;
  const image = getCurrentPreviewImage();
  document.querySelector("#modal-main-image").src = `../${image}`;
  document.querySelector("#modal-main-image").alt = selectedProduct.name;

  const total = getTotalPrice();
  document.querySelector("#modal-price").textContent = total === null ? "Coming Soon" : `${selectedProduct.currency} ${total}`;
}

function getSummaryLines() {
  const lines = [];
  (selectedProduct.options || []).forEach(option => {
    const choice = getChoice(option.id);
    if (!choice) return;
    lines.push(`${option.label.replace("Choose ", "")}: ${choice.label}`);

    const parent = option.dependsOn ? selectedOptions[option.dependsOn] : null;
    const supplierName = parent && choice.supplierNames ? choice.supplierNames[parent] : choice.supplierName;
    if (supplierName) lines.push(`Supplier Option: ${supplierName}`);
  });
  return lines;
}

function addConfiguredToCart() {
  const summary = getSummaryLines().join("\n");
  alert(`${selectedProduct.name} added to cart.\n${summary}\nQuantity: ${selectedQuantity}`);
}

function orderConfiguredWhatsApp() {
  const summary = getSummaryLines().join("\n");
  const total = getTotalPrice();
  const totalText = total === null ? "Coming Soon" : `${selectedProduct.currency} ${total}`;

  const message = encodeURIComponent(
`Hello,

I would like to order:

Vehicle: ${selectedProduct.vehicleName}
Product: ${selectedProduct.name}
${summary}
Quantity: ${selectedQuantity}
Price: ${totalText}`
  );

  window.open(`https://wa.me/?text=${message}`, "_blank");
}

function quickWhatsApp(productId) {
  const product = findProduct(productId);
  if (!product) return;
  if (product.options && product.options.length) {
    openProductModal(productId);
    return;
  }
  const message = encodeURIComponent(product.whatsappText || `Hello, I want to order: ${product.name}`);
  window.open(`https://wa.me/?text=${message}`, "_blank");
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeProductModal();
});
