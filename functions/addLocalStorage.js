// /functions/addLocalStorage.js

export const addToCart = (id, name, price, quantity, image, points, key) => {
    // ⚠️ CRÍTICO: Cambia localStorage por sessionStorage
    const cart = JSON.parse(sessionStorage.getItem(key)) || {}; 

    if (cart[id]) {
        cart[id].quantity += quantity;
    } else {
        // Mejorar la seguridad: solo almacena datos esenciales en el frontend
        // Los datos de precio/puntos DEBEN ser revalidados por el backend en el checkout.
        cart[id] = { id, name, price, quantity, image, points }; // <-- Por ahora, mantenemos la estructura
    }
    // ⚠️ CRÍTICO: Cambia localStorage por sessionStorage
    sessionStorage.setItem(key, JSON.stringify(cart));
};