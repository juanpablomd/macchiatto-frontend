export const cardProduct = (id, name, description, price, image, available, stock, points, quantity) => {
  return `
    <div id="product-${id}" class="bg-orange-900/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-2 transition-all duration-300">
      
      <!-- Imagen -->
      <div class="h-40 sm:h-48 md:h-56 overflow-hidden">
        <img class="w-full h-full object-cover" src="${image}" alt="${name}">
      </div>

      <!-- Contenido -->
      <div class="p-4 flex flex-col flex-grow">
        <h3 class="product-name text-lg font-bold text-yellow-300 mb-2">${name}</h3>
        <p class="text-orange-100 text-sm mb-3 flex-grow">${description}</p>

        <!-- Puntos -->
        <div class="bg-orange-800 p-2 rounded-lg mb-3 text-xs">
          <div class="flex items-center space-x-1">
            <i class="fas fa-star text-yellow-300"></i>
            <p class="text-white">Gana <span class="product-points font-bold">${points}</span> puntos.</p>
          </div>
        </div>

        <!-- Precio y cantidad -->
        <div class="flex items-center justify-between mb-3">
          <p class="product-price text-xl font-semibold text-yellow-300">$${price}</p>

          <div class="flex items-center space-x-1">
            <button data-id="${id}" class="decrement-btn bg-orange-950 text-white px-2 py-1 rounded-full hover:bg-orange-800 transition-colors">
              <i class="fas fa-minus"></i>
            </button>
            <input type="text" id="quantity-${id}" value="1" 
              class="text-white text-sm w-10 text-center mx-1 rounded-full" 
              readonly style="background: transparent; border: none;">
            <button data-id="${id}" class="increment-btn bg-orange-950 text-white px-2 py-1 rounded-full hover:bg-orange-800 transition-colors">
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>

        <!-- Botón carrito -->
        <button data-id="${id}" class="w-full bg-yellow-300 text-orange-950 font-bold py-2 px-3 rounded-full hover:bg-yellow-400 transition-colors text-sm add-to-cart-btn">
          <i class="fas fa-shopping-cart mr-1"></i> Añadir al carrito
        </button>

        <!-- Toast oculto -->
        <div class="toast hidden mt-2 bg-green-600 text-white px-3 py-1 rounded-lg text-sm shadow-md">
          Producto agregado al carrito ✅
        </div>
      </div>
    </div>`;
};
