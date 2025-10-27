# ☕ Macchiatto ☕ - CLIENTE WEB (FRONTEND)

Bienvenido al repositorio del cliente web (Frontend) para Macchiatto, una plataforma de comercio electrónico construida para ofrecer una experiencia de usuario fluida, segura y responsiva. El cliente está desarrollado con **JavaScript vanilla** para garantizar la ligereza y un alto rendimiento.

## 🌟 Funcionalidades Clave de Usuario

Hemos priorizado un conjunto completo de funcionalidades de usuario y gestión de cuenta:

### 👤 Gestión de Cuenta y Autenticación
* **Registro Flexible:** Los usuarios pueden registrarse de forma tradicional (email/contraseña) o a través de **Google OAuth** (Inicio de sesión de terceros).
* **Gestión de Perfil:** El usuario puede **ver y actualizar sus datos personales** (nombre, email, dirección, etc.).
* **Foto de Perfil:** Permite a los usuarios **actualizar su foto de perfil** a través de un *upload* seguro.
* **Historial de Compras:** Acceso directo para **visualizar el historial completo de pedidos**, incluyendo detalles de las transacciones pasadas.


<img width="959" height="415" alt="image" src="https://github.com/user-attachments/assets/da430e4c-b4b0-40ee-83a3-e4cc1fb1163a" />

  

### 🛒 Carrito de Compras y Checkout
* **Experiencia de Carrito Completa:** El usuario puede añadir, incrementar, decrementar y eliminar productos de su carrito.
* **Feedback Instantáneo:** Un **"toast" de notificación** aparece brevemente para confirmar que el producto ha sido añadido al carrito.
* **Proceso de Pedido:** El usuario puede finalizar la compra y generar un pedido, el cual se registra en el Backend.
* **Sistema de Puntos de Lealtad:** Muestra los **puntos acumulados** del usuario. Tras la compra, el token JWT se actualiza automáticamente con los nuevos puntos, reflejándose de inmediato en la UI.

### 🔍 Navegación y Usabilidad
* **Buscador Rápido:** Implementación de una funcionalidad de **búsqueda en tiempo real** para encontrar productos por nombre o descripción.
* **Filtrado por Categorías:** Navegación sencilla gracias al **filtrado dinámico de productos** basado en categorías cargadas desde la API.
* **Diseño Responsivo:** El diseño está optimizado para funcionar y lucir **perfectamente en cualquier dispositivo** (móvil, tablet y escritorio).

## 🔒 Seguridad Implementada (Un Enfoque Crítico)

* **Autenticación JWT Centralizada:** Todos los datos del usuario (nombre, puntos, ID) se obtienen exclusivamente del **JSON Web Token (JWT)** almacenado en `sessionStorage`, eliminando la necesidad de múltiples peticiones al Backend para obtener datos básicos.
* **Uso Estratégico de sessionStorage:** El carrito de compras se guarda en **`sessionStorage`** (almacenamiento volátil por sesión) en lugar de `localStorage`. Esto mitiga el riesgo de **XSS persistente**, ya que el carrito se elimina automáticamente al cerrar la pestaña o la sesión.
* **Separación de Roles:** La navegación a las páginas privadas (Perfil, Carrito, Home) está protegida, requiriendo un token válido.

## 🛠️ Tecnologías Utilizadas

| Categoría | Tecnología | Nota |
| :--- | :--- | :--- |
| **Núcleo** | HTML5, CSS3, JavaScript (ES6+) | Desarrollo puro ("Vanilla JS") para máximo rendimiento. |
| **Estilos** | Tailwind CSS | Framework utilitario para un diseño rápido, limpio y *mobile-first*. |
| **APIs** | Fetch API | Manejo de todas las comunicaciones asíncronas con el Backend. |
| **Módulos** | ES Modules (`import/export`) | Organización modular del código JavaScript. |

## 🚀 Instalación y Ejecución

1.  **Clonar el Repositorio:**
    ```bash
    git clone [https://github.com/juanpablomd/macchiatto-frontend.git](https://github.com/juanpablomd/macchiatto-frontend.git)
    cd macchiatto-frontend
    ```
2.  **Ejecutar:**
    Abre el archivo `pages/private/home.html` (o el punto de entrada) directamente en tu navegador o utiliza un servidor local simple (como *Live Server* de VS Code).
3.  **Conexión:**
    Asegúrate de que el Backend (`macchiatto-backend`) esté corriendo. El Frontend está configurado para consumir los endpoints de tu API.

---
