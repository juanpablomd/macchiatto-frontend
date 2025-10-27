// home.controller.js

import { allCategory } from '../../api/category.api.js';
import { categoriesCart } from '../../components/homeComponents/categories.js';
import { AllProducts, productsByCategory } from '../../api/product.api.js';
import { cardProduct } from '/components/homeComponents/cards.js';
import { addToCart } from '../../functions/addLocalStorage.js';
import { decodeToken } from '../../api/user.api.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Se obtiene el token, pero no se almacena en una variable global. El token ya es global en sessionStorage.
        // const token = sessionStorage.getItem('token'); 
        
        await updatePointsUI();

        const categories = await allCategory();
        console.log('Categorías:', categories);

        if (categories && categories.status && Array.isArray(categories.data)) {
            categories.data.forEach(cat => {
                const catCarrito = categoriesCart(cat._id, cat.name);
                document.getElementById('category-select').innerHTML += catCarrito;
            });
        } else {
            console.error('No se recibieron categorías válidas.');
        }

        const products = await AllProducts();
        console.log(products);

        if (Array.isArray(products)) {
            displayProducts(products); // Mostrar todos los productos inicialmente
            attachIncrementDecrementListeners();
            attachAddToCartListeners();
        } else {
            console.error('No se recibieron productos válidos.');
        }
    } catch (error) {
        console.error('Error al cargar las categorías:', error);
    }

    updateCartCount(); // Actualizar el contador del carrito al cargar la página
});


// Función para mostrar los productos en la interfaz
function displayProducts(products) {
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = '';

    products.forEach(product => {
        const cardHTML = cardProduct(
            product._id,
            product.name,
            product.description,
            product.price,
            product.image,
            product.available,
            product.stock,
            product.points
        );
        cardContainer.innerHTML += cardHTML;
    });
}

// Función para filtrar productos por categoría
document.getElementById('category-select').addEventListener('change', async (cat) => {
    const selectedCategoryId = cat.target.value;

    try {
        let products
        if (selectedCategoryId === 'all') {
            products = await AllProducts(); 
        }  else {
            products = await productsByCategory(selectedCategoryId);
        }

        if (Array.isArray(products)) {
            displayProducts(products);
            attachIncrementDecrementListeners();
            attachAddToCartListeners();
        } else {
            console.error('No se recibieron productos filtrados válidos.');
        }
    } catch (error) {
        console.error('Error al filtrar productos:', error);
    }
});


//Buscador
const searchInput = document.getElementById('search-input')

searchInput.addEventListener('input', async () => {
    try {
        const query = searchInput.value.trim().toLowerCase();
        if (query.length > 0) {
            try {
                const productos = await AllProducts();
                const queryWords = query.split(' '); 

                const filtrarProducts = productos.filter(producto => {
                    const productName = producto.name.toLowerCase();
                    const productDescription = producto.description.toLowerCase();

                    return queryWords.every(word => productName.includes(word) || productDescription.includes(word));
                });

                displayProducts(filtrarProducts);
                attachIncrementDecrementListeners();
                attachAddToCartListeners();
            } catch (error) {
                console.error('Error al filtrar los productos:', error);
            }
        } else {
            try {
                const productos = await AllProducts();
                displayProducts(productos);
                attachIncrementDecrementListeners();
                // Ojo: deleteToCart no está definida. Es probable que quisieras re-adjuntar los listeners o no hacer nada.
                attachAddToCartListeners(); 
            } catch (error) {
                console.error('Error al filtrar los productos:', error);
            }
        }
    } catch (error) {
        console.error('Error al filtrar los productos:', error);
    }
});


//Re-direccionar a la página del usuario
const userIcon = document.getElementById('user-icon')

userIcon.addEventListener('click', function(event) {
    event.preventDefault()
    window.location.href = '/pages/private/user.html'
})

//Re-direccionar a la página del carrito
const cartIcon = document.getElementById('cart-icon')

cartIcon.addEventListener('click', function(event){
    event.preventDefault()
    window.location.href = '/pages/private/cart/cart.html'
})


//Botones para incrementar y decrementar
const attachIncrementDecrementListeners = () =>{
    document.querySelectorAll('.increment-btn').forEach(btnIncrement =>{
        btnIncrement.addEventListener('click', () => {
            const id = btnIncrement.dataset.id
            const input = document.getElementById(`quantity-${id}`)
            let value = parseInt(input.value, 10);
            value = isNaN(value) ? 0 : value;
            value++;
            input.value = value;
        })
    })

    document.querySelectorAll('.decrement-btn').forEach(btnDecrement =>{
        btnDecrement.addEventListener('click', () =>{
            const id = btnDecrement.dataset.id;
            const input = document.getElementById(`quantity-${id}`);
            let value = parseInt(input.value, 10);
            value = isNaN(value) ? 0 : value;
            value = value > 1 ? value - 1 : 1;
            input.value = value;
        })
    })
}


//Boton para agregar al carrito
const attachAddToCartListeners = () =>{
    document.querySelectorAll('.add-to-cart-btn').forEach(button =>{
        button.addEventListener("click", (event) => {
            const id = button.dataset.id;
            const productDiv = document.getElementById(`product-${id}`);
            const quantity = parseInt(document.getElementById(`quantity-${id}`).value, 10);
            const name = productDiv.querySelector('.product-name').textContent;
            const price = productDiv.querySelector('.product-price').textContent.replace('$', '');
            const image = productDiv.querySelector('img').src;
            const points = parseInt(productDiv.querySelector('.product-points').textContent, 10); 
            
            addToCart(id, name, price, quantity, image, points, 'shoppingCart');
            updateCartCount(); // Llama a la función para actualizar el ícono del carrito
            
            // Mostrar el toast de esa card
            const toast = productDiv.querySelector('.toast');
            toast.classList.remove('hidden');
            toast.classList.add('opacity-100');

            setTimeout(() => {
                toast.classList.add('hidden');
                toast.classList.remove('opacity-100');
            }, 2000);
        });
    });
};


// 🔑 CORREGIDO: Actualiza el contador del carrito usando sessionStorage y la estructura de objeto
function updateCartCount() {
    // 🔑 USAR sessionStorage
    const cart = JSON.parse(sessionStorage.getItem('shoppingCart')) || {}; 
    
    // 🔑 CORREGIDO: Se asume que el carrito es un OBJETO {id: item}
    // Suma las cantidades de todos los ítems en el objeto
    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

    const cartCountElement = document.querySelector('#cart-icon span');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}


// Función para actualizar los puntos del usuario en la UI
async function updatePointsUI() {
    const token = sessionStorage.getItem('token');
    if (token) {
        try {
            const decoded = await decodeToken(token);
            const userPointsElement = document.getElementById('user-points');
            
            if (decoded && userPointsElement && decoded.points !== undefined) {
                userPointsElement.textContent = `${decoded.points} pts`;
                console.log('UI de puntos actualizada a:', decoded.points);
            }
        } catch (error) {
            console.error('Error al decodificar/actualizar puntos:', error);
        }
    }
}

// Botón de cerrar sesión
const logoutIcon = document.getElementById('logout-icon');

logoutIcon.addEventListener('click', (event) => {
    event.preventDefault();

    // Limpiar token y carrito de la sesión
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('shoppingCart');

    // Redirigir a la página de inicio
    window.location.href = '/pages/public/sesion/sesion.html';
});