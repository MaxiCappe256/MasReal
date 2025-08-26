// La ruta de tu archivo JSON local
const PRODUCTS_JSON_URL = '../../json/products.json';
const productsContainer = document.querySelector('.products-container');
const searchInput = document.getElementById('buscador');

// Función para obtener los productos del archivo JSON
async function fetchProducts() {
    try {
        const response = await fetch(PRODUCTS_JSON_URL);
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo JSON.');
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        return [];
    }
}

// Función para mostrar los productos en el DOM
function displayProducts(products) {
    productsContainer.innerHTML = ''; // Limpiar el contenedor
    if (products.length === 0) {
        productsContainer.innerHTML = '<p>No se encontraron productos.</p>';
        return;
    }

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('products-container__product');

        // Crea el HTML para cada producto
        productElement.innerHTML = `
            <div class="product__container-img">
                <img src="${product.imagen}" alt="${product.nombre}" class="product__img">
            </div>
            <div class="product__description">
                <h3 class="product__title">${product.nombre}</h3>
                <p class="product__price">$${product.precio}</p>
                <a href="../pages/productos.html?id=${product.id}" class="product__link">Ver más</a>
            </div>
        `;
        productsContainer.appendChild(productElement);
    });
}

// Inicializar la carga de productos al cargar la página
async function init() {
    const products = await fetchProducts();
    displayProducts(products);

    // Agrega el evento de búsqueda
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.nombre.toLowerCase().includes(searchTerm)
        );
        displayProducts(filteredProducts);
    });
}

init();

// Tu código existente del menú hamburguesa
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.querySelector('.navbar__links');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});