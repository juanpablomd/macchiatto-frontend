// sesion.js

import { validateUser, googleLogin } from "../../../api/user.api.js";

// Lógica para el login tradicional con email y contraseña
document.getElementById('login-button').addEventListener('click', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const result = await validateUser(email, password);
    
        // 🔑 CORRECCIÓN: SOLO guardamos el token.
        // Hemos ELIMINADO: name, email, loginUrl, address, phone.
        sessionStorage.setItem('token', result.token);

        // Redirige al usuario a la página privada
        window.location.href = '/pages/private/home.html';
    } catch (error) {
        console.error("Error en el login tradicional:", error);
        alert(error.message || 'Error en el servidor. Intente nuevamente más tarde.');
    }
});

// Lógica para el login con Google.
const handleCredentialResponse = async (response) => {
    try {
        const idToken = response.credential;
        const result = await googleLogin(idToken);

        if (result.success) {
            // 🔑 CORRECCIÓN: SOLO guardamos el token.
            // Hemos ELIMINADO: firstName, lastName, email, profileImage.
            sessionStorage.setItem('token', result.token);
            
            window.location.href = '/pages/private/home.html';
        } else {
            console.error("Error en el inicio de sesión del backend:", result.message);
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Error al procesar la respuesta de Google:", error);
        alert("Ocurrió un error inesperado. Por favor, inténtalo de nuevo.");
    }
};

// Se ejecuta la inicialización de Google al cargar la página
window.onload = function() {
    google.accounts.id.initialize({
        client_id: '523598240139-c1q8eond8fgfavv75d2vvmhj764dl16h.apps.googleusercontent.com',
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.getElementById("google-login-button"),
        { theme: "filled_blue", size: "large", type: "standard", width: "300" }
    );
};