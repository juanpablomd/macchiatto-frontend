import { newUser, validateUser } from "../../../api/user.api.js";

document.addEventListener('DOMContentLoaded', () => {
    const registerButton = document.getElementById('register-button');
    const backButton = document.getElementById('back-button');

    registerButton.addEventListener('click', async (event) => {
        event.preventDefault();

        let firstName = document.getElementById('firstName').value;
        let lastName = document.getElementById('lastName').value;
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let address = document.getElementById('address').value;
        let phone = document.getElementById('phone').value;

        const data = {
            firstName,
            lastName,
            email,
            password,
            address,
            phone
        };

        try {
            const result = await newUser(data);

            if (result) {
                // Autenticar al usuario inmediatamente después del registro
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const authResult = await validateUser(email, password);

                if (authResult && authResult.token) {
                    // Guarda los datos en sessionStorage
                    sessionStorage.setItem('name', authResult.decode.firstName + authResult.decode.lastName);
                    sessionStorage.setItem('email', authResult.decode.email);
                    sessionStorage.setItem('loginUrl', window.location.href);
                    sessionStorage.setItem('token', authResult.token);
                    sessionStorage.setItem('address', authResult.decode.address);
                    sessionStorage.setItem('phone', authResult.decode.phone);

                    // Redirige al usuario a la página privada
                    window.location.href = '/pages/private/home.html';
                } else {
                    console.error("Error en la autenticación después del registro.");
                    // Manejar el error de autenticación aquí
                }
            } else {
                console.error("Error al registrar el usuario.");
                // Manejar el error de registro aquí
            }
        } catch (error) {
            console.error("Error durante el registro o autenticación:", error);
            // Manejar errores generales aquí
        }
    });

    backButton.addEventListener('click', () => {
        window.location.href = '../sesion/sesion.html';
    });
});
