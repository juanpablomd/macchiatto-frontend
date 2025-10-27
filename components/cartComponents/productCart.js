export const productRow = (id, image, name, quantity, precioTotalProducto, points) => {
    return `
        <tr class="border-t">
            <td class="px-4 py-2 text-left">
                <div class="flex items-center text-white">
                    <img src="${image}" alt="${name}" class="h-12 w-12 object-cover mr-4">
                    <span>${name}</span>
                </div>
            </td>
            <td class="px-4 py-2 text-center flex items-center justify-center">
                <button class="decrement-btn bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" data-id="${id}">-</button>
                <input type="text" id="quantity-${id}" value="${quantity}" class="w-12 text-center mx-2 border border-gray-300 rounded" readonly>
                <button class="increment-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" data-id="${id}">+</button>
            </td>
            <td class="px-4 py-2 text-center text-white">$${precioTotalProducto.toFixed(2)}</td>
            <td class="px-4 py-2 text-center text-white">${points} pts</td>
            <td class="px-4 py-2 text-right">
                <button class="delete-btn bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" data-id="${id}">Eliminar</button>
            </td>
        </tr>
    `;
};