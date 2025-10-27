# ☕ Macchiatto ☕ - CLIENTE WEB (FRONTEND)

Bienvenido al repositorio del cliente web (Frontend) para Macchiatto, una plataforma de comercio electrónico enfocada en la experiencia del usuario y la seguridad.

El cliente está construido con tecnologías web vanilla para máxima ligereza y rendimiento.

## 🌟 Características Principales

* **Autenticación Segura (JWT):** Implementación completa de login/registro utilizando **JSON Web Tokens (JWT)**.
* **Seguridad de Sesión:** Los datos del carrito de compras se almacenan en **`sessionStorage`** en lugar de `localStorage` para mitigar riesgos de **XSS persistente**.
* **Gestión del Carrito:** Lógica de carrito de compras implementada en el lado del cliente, con revalidación de precios y puntos en el Backend al momento del checkout.
* **Puntos de Lealtad:** Muestra puntos del usuario en tiempo real, los cuales se actualizan con el nuevo JWT tras cada compra exitosa.
* **Navegación Dinámica:** Filtrado de productos por categoría y funcionalidad de búsqueda instantánea.

## 🛠️ Tecnologías Utilizadas

| Categoría | Tecnología | Nota |
| :--- | :--- | :--- |
| **Núcleo** | HTML5, CSS3, JavaScript (ES6+) | Vanilla JS para rendimiento optimizado. |
| **Estilos** | Tailwind CSS | Framework de CSS para un desarrollo rápido y diseño responsivo. |
| **APIs** | Fetch API | Conexión asíncrona con el Backend (macchiatto-backend). |
| **Seguridad** | sessionStorage | Almacenamiento volátil para la sesión del carrito y del usuario. |

## 🚀 Instalación y Ejecución

Dado que este proyecto utiliza **JavaScript vanilla** y se conecta a una API externa, no requiere pasos de compilación complejos.

1.  **Clonar el Repositorio:**
    ```bash
    git clone [https://github.com/juanpablomd/macchiatto-frontend.git](https://github.com/juanpablomd/macchiatto-frontend.git)
    cd macchiatto-frontend
    ```
2.  **Ejecutar:**
    Abre el archivo `pages/private/home.html` (o `index.html`) directamente en tu navegador o usa una extensión como *Live Server* de VS Code.
3.  **Conexión:**
    Asegúrate de que el **Backend (`macchiatto-backend`) esté corriendo** y la URL de la API en tus archivos `*.api.js` apunten a la dirección correcta (ej: `http://localhost:3000`).

---

## 📄 README.md para el Backend (macchiatto-backend)

Este `README` se enfoca en la arquitectura del servidor, la persistencia de datos, las rutas y la gestión segura de secretos.

```markdown
# ⚙️ Macchiatto ⚙️ - API DEL SERVIDOR (BACKEND)

API RESTful construida en Node.js para gestionar la lógica de negocio, autenticación, datos de productos y transacciones de la plataforma Macchiatto.

Esta API está diseñada bajo el principio de **separación de intereses** para facilitar el mantenimiento y el escalado.

## 🔒 Seguridad y Estructura

* **Manejo de Secretos:** Todas las claves sensibles (claves JWT, credenciales de Google OAuth, URL de MongoDB) se gestionan a través de variables de entorno en el archivo **`.env`**, el cual está **excluido de Git** para máxima seguridad.
* **Arquitectura:** Diseño basado en *Módulos*, con separación clara de:
    * **Rutas** (`routes/`)
    * **Controladores/Lógica de Negocio** (Implícita en las rutas y acciones de la DB)
    * **Acciones de Base de Datos** (`db/actions/`)
    * **Esquemas de Modelado** (`db/schemas/`)
* **Autenticación:** Uso de **JWT** para proteger rutas privadas y **Google OAuth** para inicio de sesión de terceros.

## 🛠️ Tecnologías Clave

| Categoría | Tecnología | Rol |
| :--- | :--- | :--- |
| **Servidor** | Node.js / Express | Framework principal para el servidor web. |
| **Base de Datos** | MongoDB (a través de Mongoose) | Base de datos NoSQL para persistencia de datos. |
| **Autenticación** | JWT, google-auth-library | Seguridad de sesión y verificación de tokens. |
| **Variables de Entorno**| `dotenv` | Gestión segura de claves de entorno. |

## 🚀 Instalación y Ejecución

Para correr la API localmente, sigue estos pasos:

1.  **Clonar el Repositorio:**
    ```bash
    git clone https://github.com/juanpablomd/macchiatto-backend.git
    cd macchiatto-backend
    ```
2.  **Instalar Dependencias:**
    ```bash
    npm install
    ```
3.  **Configurar Variables de Entorno:**
    Crea un archivo llamado **`.env`** en la raíz del proyecto y añade tus claves.
    ```
    # .env
    MONGODB_URI = mongodb://localhost:27017/MacchiattoDB
    JWT_SECRET="TU_SECRETO_PARA_TOKENS_JWT"
    GOOGLE_CLIENT_ID='TU_CLIENT_ID_DE_GOOGLE'
    GOOGLE_CLIENT_SECRET='TU_CLIENT_SECRET_DE_GOOGLE'
    ```
4.  **Iniciar el Servidor:**
    ```bash
    npm start # O el comando que uses para iniciar tu API
    ```

La API estará disponible en la URL configurada (ej: `http://localhost:3000`).
