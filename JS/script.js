// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    // Lógica del menú móvil (copiada de tu HTML)
    const nav = document.querySelector('.main-nav');
    const toggle = document.querySelector('.menu-toggle');
    if (toggle && nav) { // Asegurarse de que existan
        toggle.addEventListener('click', () => {
            nav.classList.toggle('open');
        });
    }

    // Lógica del Modal de imágenes (copiada de tu HTML)
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeModalBtn = document.querySelector('.close-button');

    // Función para abrir el modal (llamada desde onclick en HTML)
    window.openModal = function(imageSrc) {
        if (modal && modalImage) {
            modalImage.src = imageSrc;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    };

    // Función para cerrar el modal (llamada desde onclick en HTML)
    window.closeModal = function() {
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    };

    // Cierre con la tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // Cierre al hacer clic en el fondo del modal
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // --- LÓGICA DEL CARRITO DE COMPRAS (NUEVA) ---

    let cart = []; // Array para almacenar los productos en el carrito

    // Elementos del DOM del carrito
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Abrir el modal del carrito
    if (cartIcon && cartModal) {
        cartIcon.addEventListener('click', () => {
            cartModal.classList.add('show');
            document.body.style.overflow = 'hidden';
            renderCart(); // Renderizar el carrito cada vez que se abre
        });
    }

    // Cerrar el modal del carrito
    if (closeCartBtn && cartModal) {
        closeCartBtn.addEventListener('click', () => {
            cartModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }

    // Cerrar carrito al hacer clic fuera del contenido o con ESC
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && cartModal.classList.contains('show')) {
                cartModal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Función para añadir un producto al carrito
    window.addToCart = function(productId, productName, productPrice) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
        }
        updateCartIconQuantity();
        alert(`"${productName}" añadido al carrito!`);
    };

    // Función para renderizar el carrito en el modal
    function renderCart() {
        if (!cartItemsContainer || !cartTotalElement) return;

        cartItemsContainer.innerHTML = ''; // Limpiar items anteriores
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">El carrito está vacío. ¡Añade algunos diseños!</p>';
        } else {
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <span>${item.name} (x${item.quantity})</span>
                    <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="remove-from-cart-btn" data-id="${item.id}">Remover</button>
                `;
                cartItemsContainer.appendChild(itemElement);
                total += item.price * item.quantity;
            });
        }
        cartTotalElement.textContent = total.toFixed(2);
        
        // Añadir listeners a los botones de remover
        document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const idToRemove = parseInt(e.target.dataset.id);
                removeFromCart(idToRemove);
            });
        });
    }

    // Función para remover un producto del carrito
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartIconQuantity();
        renderCart();
    }

    // Función para actualizar el número en el ícono del carrito
    function updateCartIconQuantity() {
        const cartQuantitySpan = document.getElementById('cart-quantity');
        if (cartQuantitySpan) {
            const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartQuantitySpan.textContent = totalQuantity;
            cartQuantitySpan.style.display = totalQuantity > 0 ? 'inline-flex' : 'none';
        }
    }

    // Lógica del botón de "Realizar Compra"
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Tu carrito está vacío. ¡Añade algunos diseños para comprar!");
                return;
            }
            const confirmPurchase = confirm(`¿Confirmas la compra de ${cart.length} productos por $${cartTotalElement.textContent}?`);
            if (confirmPurchase) {
                alert("¡Gracias por tu compra! Nos pondremos en contacto contigo para los detalles de tu diseño.");
                cart = []; // Vaciar el carrito
                updateCartIconQuantity();
                cartModal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    }

    updateCartIconQuantity(); // Inicializar cantidad del carrito al cargar
});