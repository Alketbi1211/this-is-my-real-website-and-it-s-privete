
const vehicles = [
  {
    "id": "avatr12",
    "name": "AVATR 12",
    "type": "Luxury EV Sedan",
    "image": "images/vehicles/avatr12.jpeg",
    "page": "products/avatr12.html"
  },
  {
    "id": "avatr11",
    "name": "AVATR 11",
    "type": "Luxury EV SUV",
    "image": "images/vehicles/avatr11.jpeg",
    "page": "products/avatr11.html"
  },
  {
    "id": "rox01",
    "name": "ROX 01",
    "type": "Hybrid SUV",
    "image": "images/vehicles/rox01.jpeg",
    "page": "products/rox01.html"
  },
  {
    "id": "rox-adamas",
    "name": "ROX ADAMAS",
    "type": "Premium Luxury SUV",
    "image": "images/vehicles/rox-adamas.jpeg",
    "page": "products/rox-adamas.html"
  },
  {
    "id": "leopard5",
    "name": "LEOPARD 5",
    "type": "Off-Road SUV",
    "image": "images/vehicles/leopard5.jpeg",
    "page": "products/leopard5.html"
  },
  {
    "id": "leopard7",
    "name": "LEOPARD 7",
    "type": "Premium SUV",
    "image": "images/vehicles/leopard7.jpeg",
    "page": "products/leopard7.html"
  },
  {
    "id": "leopard8",
    "name": "LEOPARD 8",
    "type": "Luxury Flagship SUV",
    "image": "images/vehicles/leopard8.jpeg",
    "page": "products/leopard8.html"
  }
];

const vehicleGrid = document.querySelector("#vehicle-grid");

if (vehicleGrid) {
  vehicleGrid.innerHTML = vehicles.map(vehicle => `
    <a class="vehicle-card" href="${vehicle.page}">
      <div class="vehicle-image">
        <img src="${vehicle.image}" alt="${vehicle.name}">
      </div>
      <div class="vehicle-info">
        <small>${vehicle.type}</small>
        <h3>${vehicle.name}</h3>
        <p>Shop premium accessories made for ${vehicle.name}.</p>
        <span class="card-link">View Accessories →</span>
      </div>
    </a>
  `).join("");
}
