const PRODUCTS_JSON_URL = '../json/products.json';

const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get('id'));

const productContainer = document.querySelector('.productos');

fetch(PRODUCTS_JSON_URL)
    .then(response => {
        if (!response.ok) {
            productContainer.innerHTML = '<p>No se pudo encontrar el producto</p>';
            throw new Error('No se pudo cargar el archivo JSON');
        }
        return response.json();
    })

    .then(products => {
        const product = products.find(p => p.id === productId);

        if (!product) {
            productContainer.innerHTML = '<p>No se encontro el producto</p>';
            return;
        }

        productContainer.innerHTML = `
            <div class="producto__img">
                <img class="producto__imagen" src="${product.imagen}" alt="${product.nombre}">
            </div>
            <div class="producto__info">
                <h2 class="producto__title">${product.nombre}</h2>
                <p class="producto__desc">${product.descripcion}</p>
                <p class="producto__price">$${product.precio}</p>
            </div>
        `;
    })

// Tu código existente del menú hamburguesa
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.querySelector('.navbar__links');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});