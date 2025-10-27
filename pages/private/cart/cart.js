// cart.js

import { decodeToken } from '/api/user.api.js';
import { productRow } from '../../../components/cartComponents/productCart.js';
import { totalRow } from '../../../components/cartComponents/totalCart.js';
import { saleProduct } from '/api/sale.api.js';
// import { updateUserPoints } from '../../../api/user.api.js'; // Función no utilizada, se deja comentada

document.addEventListener('DOMContentLoaded', async function() {
    // Obtener el token del sessionStorage
    const token = sessionStorage.getItem('token');

    if (token) {
        try {
            // Decodificar el token para obtener el nombre del usuario
            const decoded = await decodeToken(token);

            if (decoded && decoded.firstName && decoded.lastName) {
                // Actualizar el título del carrito con el nombre del usuario
                const titleElement = document.getElementById('title');
                titleElement.textContent = `Your cart, ${decoded.firstName} ${decoded.lastName}`;
            } else {
                console.error('Token inválido o falta el nombre.');
            }
        } catch (error) {
            console.error('Error al decodificar el token:', error);
        }
    } else {
        console.error('Token no encontrado. Redirigiendo al login...');
        // Opcional: Redirigir al usuario si no hay token
        // window.location.href = '/pages/public/sesion/sesion.html';
    }
});


// CART
document.addEventListener('DOMContentLoaded', () => { 
    const cartItemsContainer = document.getElementById('cart-items');
    
    // 🔑 CORREGIDO 1: Inicialización del carrito usa sessionStorage
    let cart = JSON.parse(sessionStorage.getItem('shoppingCart')) || {};
    
    let suma = 0;
    let totalPuntos = 0;
    let productos = [];
    
    const updateQuantity = (id, increment) => {
        if (cart[id]) {
            if (increment) {
                cart[id].quantity++;
            } else if (cart[id].quantity > 1) {
                cart[id].quantity--;
            }
            // 🔑 CORREGIDO 2: Guardado de cantidad usa sessionStorage
            sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
            renderCartItems();
        }
    };

    const renderCartItems = () => {
        cartItemsContainer.innerHTML = '';
        suma = 0;
        totalPuntos = 0;
        productos = [];

        for (const id in cart) {
            const product = cart[id];
            let precioTotalProducto = parseFloat(product.price) * product.quantity;
            suma += precioTotalProducto;

            totalPuntos += product.points * product.quantity; // Suma los puntos del producto actual

            productos.push({productId: product.id, quantity: product.quantity});
            
            const productC = productRow(id, product.image, product.name, product.quantity, precioTotalProducto, product.points);
            
            cartItemsContainer.insertAdjacentHTML('beforeend', productC);
        }

        const total = totalRow(suma, totalPuntos);
        cartItemsContainer.insertAdjacentHTML('beforeend', total);

        document.querySelectorAll('.increment-btn').forEach(button => {
            button.addEventListener('click', () => updateQuantity(button.getAttribute('data-id'), true));
        });
        document.querySelectorAll('.decrement-btn').forEach(button => {
            button.addEventListener('click', () => updateQuantity(button.getAttribute('data-id'), false));
        });
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.getAttribute('data-id');
                delete cart[productId];
                
                // 🔑 CORREGIDO 3: Eliminación de producto usa sessionStorage
                sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
                renderCartItems();
                console.log('Producto eliminado:', productId);
            });
        });
    }
    renderCartItems()


    document.getElementById('checkout-btn').addEventListener('click', async () => {
        const date = new Date().toISOString().slice(0, 10); // Formato YYYY-MM-DD
        const token = sessionStorage.getItem('token');
        
        try {
            const decodedTokenData = await decodeToken(token);
            const userId = decodedTokenData.id; 
            const userEmail = decodedTokenData.email; // ✅ OBTENEMOS EL EMAIL DESDE EL TOKEN
            
            if (!userId) {
                alert('No se pudo identificar al usuario. Por favor, inicia sesión nuevamente.');
                return;
            }

            if (productos.length > 0) {
                
                // 🔑 CORREGIDO 5: Usar userEmail del token decodificado
                const saleResult = await saleProduct(userId, date, suma, userEmail, productos, totalPuntos, token);
                console.log("Resultado de la venta:", saleResult);

                if (saleResult && saleResult.success) {
                    
                    // 🔑 PASO CLAVE 1: CAPTURAR Y GUARDAR EL NUEVO TOKEN
                    if (saleResult.token) {
                        sessionStorage.setItem('token', saleResult.token);
                        console.log('Token de sesión actualizado con los nuevos puntos.');
                    } else {
                        console.warn('¡Advertencia! El backend no devolvió el nuevo token en la venta.');
                    }
                    
                    // 🔑 CORREGIDO 4: Limpieza de carrito usa sessionStorage
                    sessionStorage.removeItem('shoppingCart');
                    cart = {};
                    renderCartItems();

                    // 🔑 PASO CLAVE 2: Obtener y mostrar puntos nuevos
                    let newPoints = totalPuntos; 
                    if (saleResult.token) {
                        const newDecoded = await decodeToken(saleResult.token);
                        newPoints = newDecoded.points;
                    }
                    
                    alert(`Compra realizada con éxito. ¡Puntos actualizados a ${newPoints}!`);

                    // 🔑 PASO CLAVE 3: Redirigir para recargar la UI
                    window.location.href = '/pages/private/user.html'; 
                    
                } else {
                    alert('Hubo un error al realizar la compra. Por favor, intenta nuevamente.');
                    if (saleResult && saleResult.message) {
                        console.error("Error en la venta:", saleResult.message);
                    }
                }
            } else {
                alert('No hay productos en el carrito');
            }
        } catch (error) {
            console.error("Error al procesar la compra:", error);
            alert('Ocurrió un error al procesar la compra. Por favor, intenta nuevamente.');
        }
    });
});