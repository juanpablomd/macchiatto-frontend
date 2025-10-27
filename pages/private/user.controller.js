import { decodeToken, updateUser, uploadProfileImageFetch, purchaseHistory } from '../../api/user.api.js';
import { API } from '../../api/api.js';


document.addEventListener('DOMContentLoaded', async function () {
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const addressInput = document.getElementById('address');
    const phoneInput = document.getElementById('phone');
    const saveButton = document.getElementById('save-button');
    const pencilIcons = document.querySelectorAll('.pencil-edit');
    const emailInput = document.getElementById('email');
    const pointsInput = document.getElementById('points');
    const profileImageInput = document.getElementById('profileImageInput');
    const profileImagePreview = document.getElementById('profileImagePreview');
    const uploadImageButton = document.getElementById('upload-image-button');

    let currentUserData = {};
    let userId = null;
    let userDataLoaded = false;

    function toggleEdit(input, icon) {
        const isReadOnly = input.readOnly;
        input.readOnly = !isReadOnly;
        if (isReadOnly) {
            input.classList.remove('bg-gray-700', 'text-gray-300');
            input.classList.add('bg-orange-700', 'text-white');
            icon.classList.add('text-blue-400');
            icon.classList.remove('text-gray-300');
            saveButton.disabled = false;
        } else {
            input.classList.add('bg-gray-700', 'text-gray-300');
            input.classList.remove('bg-orange-700', 'text-white');
            icon.classList.remove('text-blue-400');
            icon.classList.add('text-gray-300');
            saveButton.disabled = true;
        }
    }

    firstNameInput.readOnly = true;
    lastNameInput.readOnly = true;
    addressInput.readOnly = true;
    phoneInput.readOnly = true;
    saveButton.disabled = true;

    pencilIcons.forEach(icon => {
        icon.addEventListener('click', function () {
            const inputId = this.previousElementSibling.id;
            const input = document.getElementById(inputId);
            toggleEdit(input, this);
        });
    });

    async function loadUserDataAndImage() {
        const storedToken = sessionStorage.getItem('token');
        if (storedToken) {
            try {
                const data = await decodeToken(storedToken);
                if (data && data.email) {
                    currentUserData = { ...data };
                    firstNameInput.value = currentUserData.firstName;
                    lastNameInput.value = currentUserData.lastName;
                    
                    // Manejo de valores undefined para una mejor visualización
                    addressInput.value = currentUserData.address ? currentUserData.address : 'Aún no agregado';
                    phoneInput.value = currentUserData.phone ? currentUserData.phone : 'Aún no agregado';
                    pointsInput.value = currentUserData.points !== undefined ? currentUserData.points : 0;
                    
                    emailInput.value = currentUserData.email;
                    
                    const imagePath = currentUserData.profileImage.replace(/\\/g, '/');
                    const imageUrl = `${API}/${imagePath}`;
                    console.log('URL de la imagen construida:', imageUrl);
                    profileImagePreview.src = imageUrl;

                    userId = currentUserData.id;
                    userDataLoaded = true
                
                    console.log('Datos cargados desde token y/o sessionStorage:', currentUserData);
                } else {
                    console.error('Token inválido o falta el email en sessionStorage.');
                }
            } catch (error) {
                console.error('Error al decodificar el token desde sessionStorage:', error);
            }
        } else {
            console.error('Token no encontrado en sessionStorage.');
        }
    }

    profileImageInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profileImagePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    uploadImageButton.addEventListener('click', async function () {
        if (!userId) {
            // Reemplazando alert() por un mensaje en consola
            console.error('Error: No se ha podido identificar el usuario. Por favor, recargue la página.');
            return;
        }

        if (profileImageInput.files.length > 0) {
            const imageFile = profileImageInput.files[0];
            const formData = new FormData();
            formData.append('profileImage', imageFile);

            try {
                const uploadResult = await uploadProfileImageFetch(userId, formData);
                console.log('Resultado de la subida:', uploadResult);
                if (uploadResult && uploadResult.usuario && uploadResult.usuario.profileImage) {
                    const imagePath = uploadResult.usuario.profileImage.replace(/\\/g, '/');
                    const imageUrl = `${API}/${imagePath}`;
                    console.log('URL de la imagen actualizada:', imageUrl);
                    profileImagePreview.src = imageUrl;

                    // Actualizar currentUserData y sessionStorage
                    currentUserData.profileImage = uploadResult.usuario.profileImage;
                    sessionStorage.setItem('profileImage', currentUserData.profileImage);

                    console.log('Imagen de perfil actualizada exitosamente.');
                } else if (uploadResult && uploadResult.error) {
                    console.error('Error al subir la imagen:', uploadResult.error);
                } else {
                    console.error('Respuesta inesperada al subir la imagen:', uploadResult);
                }
            } catch (error) {
                console.error('Error al subir la imagen:', error);
            }
        } else {
            // Reemplazando alert() por un mensaje en consola
            console.log('Por favor, selecciona una imagen para subir.');
        }
    });

    saveButton.addEventListener('click', async function () {
    if (!userDataLoaded || !userId) {
        console.error('Los datos del usuario no se han cargado correctamente. No se puede guardar.');
        return;
    }

    const updatedFields = {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        address: addressInput.value,
        phone: phoneInput.value,
        // (Si el campo de contraseña está habilitado para edición, añádelo aquí)
        // password: passwordInput.value, 
    };

    try {
        // Llama a tu función de API
        const result = await updateUser(userId, updatedFields);
        
        console.log('Resultado de la actualización:', result);

        if (result && result.token) { 
            // 🔑 1. REEMPLAZAR EL TOKEN VIEJO POR EL NUEVO
            sessionStorage.setItem('token', result.token); 
            console.log('Token de sesión actualizado tras edición.');
            
            // 🔄 2. RECARGAR LOS DATOS DE LA UI
            await loadUserDataAndImage(); // Esta función recargará todos los campos, incluidos los points.
            
            // 3. (Opcional) Mostrar mensaje de éxito
            console.log('Usuario actualizado exitosamente y UI recargada.');

            // Si tienes una función para desactivar la edición, llámala aquí.
        } else if (result && result.message) {
             console.error('Error del servidor:', result.message);
        } else {
             console.error('Respuesta inesperada del servidor.');
        }

    } catch (error) {
        console.error('Error al intentar actualizar el usuario:', error);
    }
});

    loadUserDataAndImage();


    let allPurchases = []; // acá guardamos todas las compras para poder filtrar
    async function loadPurchaseHistory() {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        try {
            const data = await purchaseHistory(token);

            const historyContainer = document.getElementById('purchase-history-list');
            historyContainer.innerHTML = '';

            if (data.success && data.purchases.length > 0) {
                allPurchases = data.purchases; // guardamos todas las compras
                renderPurchases(allPurchases);
            } else {
                historyContainer.innerHTML = `<p class="text-yellow-200">No tienes compras aún.</p>`;
            }
        } catch (error) {
            console.error('Error al cargar el historial de compras:', error);
        }
    }

    // función para renderizar compras (reutilizable)
    function renderPurchases(purchases) {
        const historyContainer = document.getElementById('purchase-history-list');
        historyContainer.innerHTML = '';

        purchases.forEach(sale => {
            const saleDiv = document.createElement('div');
            saleDiv.classList.add('bg-orange-800', 'p-5', 'rounded-2xl', 'shadow-lg', 'space-y-3', 'hover:bg-orange-700', 'transition-all');

            const date = new Date(sale.date + 'T00:00:00').toLocaleDateString();

            let productsHTML = `
                <div class="grid grid-cols-3 gap-4 text-yellow-100 text-sm font-medium border-t border-orange-700 pt-2">
                    <div class="font-semibold">Producto</div>
                    <div class="font-semibold text-center">Cantidad</div>
                    <div class="font-semibold text-right">Precio</div>
                </div>
            `;

            sale.products.forEach(p => {
                productsHTML += `
                    <div class="grid grid-cols-3 gap-4 text-yellow-100 text-sm pt-1">
                        <div>${p.name}</div>
                        <div class="text-center">${p.quantity}</div>
                        <div class="text-right">$${p.price.toFixed(2)}</div>
                    </div>
                `;
            });

            saleDiv.innerHTML = `
                <div class="text-yellow-200 font-semibold">Fecha: ${date}</div>
                <div class="text-yellow-200 font-semibold">Total: $${sale.total.toFixed(2)}</div>
                <div class="mt-2">${productsHTML}</div>
            `;

            historyContainer.appendChild(saleDiv);
        });
    }

    // filtro por fechas
    document.getElementById('filter-button').addEventListener('click', () => {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        if (!startDate || !endDate) {
            // Reemplazando alert() por un mensaje en consola
            console.log("Selecciona ambas fechas para filtrar.");
            return;
        }

        const filtered = allPurchases.filter(sale => {
            // la fecha en tu backend está como string tipo "2025-09-03"
            const saleDate = sale.date;

            return saleDate >= startDate && saleDate <= endDate;
        });

        if (filtered.length > 0) {
            renderPurchases(filtered);
        } else {
            document.getElementById('purchase-history-list').innerHTML = `<p class="text-yellow-200">No se encontraron compras en ese rango.</p>`;
        }
    });
    
    loadPurchaseHistory();
});
