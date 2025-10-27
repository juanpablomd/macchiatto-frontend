import { API } from "./api.js";

export const newUser = async (datos) => {
    try {
        const response = await fetch(`${API}/user/newUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        const result = await response.json();
        if (!response.ok) {
            console.log("Respuesta del servidor:", result); // Añadido para depuración
            throw new Error(result.message || 'Error de autenticación');
        }
        return result;
    } catch (error) {
        throw error;
    }
}


export const validateUser = async (email, password) => {
    try {
        const response = await fetch(`${API}/user/validation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: email, password: password })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Error en la autenticación');
        }

        return result;
    } catch (error) {
        throw error;
    }
}

export const decodeToken = async (token) => {
    try {
        const response = await fetch(`${API}/user/decode`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: token })
        });

        if (!response.ok) {
            throw new Error('Error al decodificar el token');
        }

        const decoded = await response.json();
        console.log("Respuesta de /api/decode-token:", decoded);
        return decoded;
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        throw error;
    }
};



export const updateUser = async (id, updatedFields) => {
    try {
        const response = await fetch(`${API}/user/updateUser/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedFields)
        });

        const result = await response.json();

        if (!response.ok) {
            console.log("Respuesta del servidor:", result); // Para depuración
            throw new Error(result.error || 'Error al actualizar el usuario');
        }

        return result;
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        throw error;
    }
};

export async function uploadProfileImageFetch(userId, formData) {
    const res = await fetch(`${API}/user/usuarios/${userId}/foto`, {
        method: "POST",
        body: formData
    });

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return await res.json();
    } else {
        const text = await res.text();
        throw new Error(`Respuesta no JSON: ${text}`);
    }
}

export async function updateUserPoints(userId, pointsToAdd, token) {
    try {
        const response = await fetch(`${API}/user/update-points`, { // Utiliza la ruta correcta de tu backend
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ userId, pointsToAdd }),
        });
        if (!response.ok) {
            const error = await response.json();
            console.error('Error al actualizar los puntos del usuario:', error);
            return { success: false, message: error.message || 'Error al actualizar los puntos.' };
        }
        return await response.json();
    } catch (error) {
        console.error('Error al actualizar los puntos del usuario:', error);
        return { success: false, message: error.message };
    }
}

export async function purchaseHistory(token) {
    try {
        const response = await fetch(`${API}/user/purchase-history`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Enviar token en el header
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener el historial de compras');
        }

        const data = await response.json();
        // data.success, data.count, data.purchases
        return data;

    } catch (error) {
        console.error('Error al obtener el historial de compras:', error);
        return { success: false, message: error.message, purchases: [] };
    }
}


// user.api.js
export async function purchaseFilter(token, startDate, endDate) {
    try {
        let url = `${API}/user/purchase-filter`;
        const params = new URLSearchParams();

        if (startDate) {
            params.append('startDate', startDate);
        }
        if (endDate) {
            params.append('endDate', endDate);
        }

        if (startDate || endDate) {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener el historial de compras');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error al obtener el historial de compras:', error);
        return { success: false, message: error.message, purchases: [] };
    }
}

export const googleLogin = async (idToken) => {
    try {
        const response = await fetch(`${API}/user/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idToken: idToken })
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Error en el inicio de sesión con Google');
        }
        return result;
    } catch (error) {
        throw error;
    }
};


export async function getUserProfile(userId) {
    try {
        const response = await fetch(`${API}/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener el perfil del usuario');
        }

        const data = await response.json();
        return data.user;

    } catch (error) {
        console.error('Error al obtener el perfil de usuario:', error);
        throw error;
    }
}