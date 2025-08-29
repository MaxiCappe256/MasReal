// MENU HAMBURGUESA
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.querySelector('.navbar__links');

const productsContainer = document.querySelector('.products-container');

const formulario = document.querySelector('#form');

const buscador = document.querySelector('.input__search');
buscador.addEventListener('input', filtrarProductos);

const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const listaProductos = document.querySelector('#lista-productos');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');

const iconoCarrito = document.querySelector('#icono-carrito');
obtenerProductos();

cargarEventListeners();


iconoCarrito.addEventListener('click', () => {
    carrito.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (carrito.classList.contains('active') && !carrito.contains(e.target) && e.target !== iconoCarrito) {
        carrito.classList.remove('active');
    }
});

const datos = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    mensaje: ''
}

const nombre = document.querySelector('#nombre');
const apellido = document.querySelector('#apellido');
const email = document.querySelector('#email');
const telefono = document.querySelector('#telefono');
const mensaje = document.querySelector('#mensaje');

let productosOriginales = [];
let articulosCarrito = [];



menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// FORMULARIO
nombre.addEventListener('input', leerTexto);
apellido.addEventListener('input', leerTexto);
email.addEventListener('input', leerTexto);
telefono.addEventListener('input', leerTexto);
texto.addEventListener('input', leerTexto);

formulario.addEventListener('submit', function (evento) {
    const { nombre, apellido, email, telefono } = datos;
    evento.preventDefault(); //no se actualiza la pagina al hacer click en enviar form

    if (nombre === '' || apellido === '' || email === '' || telefono === '' || texto === '') {
        mostrarError('Todos los campos son obligatorios');

        return;
    }

    mostrarMensaje('Mensaje enviado correctamente');

    console.log('Enviando formulario');
});

async function obtenerProductos() {
    try {
        const archivo = '../json/productos.json';
        const resultado = await fetch(archivo);

        if (!resultado.ok) {
            throw new Error("No se pudo cargar el archivo JSON");
        }

        const datos = await resultado.json();

        productosOriginales = datos;
        mostrarProductos(datos);
    } catch (error) {
        console.error("Error al obtener productos", error);
        productsContainer.innerHTML = '<p>Error al cargar los productos.</p>';
    }
}

function mostrarProductos(datos) {

    productsContainer.innerHTML = '';

    if (datos.length === 0) {
        productsContainer.innerHTML = '<p>No se encontraron productos.</p>';
        return;
    }

    datos.forEach(producto => {
        const productElement = document.createElement('div');

        productElement.classList.add('products-container__product');

        productElement.innerHTML = `
            <div class="product__container-img">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="product__img">
            </div>
            <div class="product__description">
                <h3 class="product__title">${producto.nombre}</h3>
                <p class="product__price">$${producto.precio}</p>
                <a href="../pages/productos.html?id=${producto.id}" class="product__link">Ver más</a>
                <a href="#" class="btn-add-carrito" data-id="${producto.id}">Agregar al Carrito</a>
            </div>
        `;
        productsContainer.appendChild(productElement);

    });
}

function mostrarMensaje(mensaje) {
    const alerta = document.createElement('p');

    alerta.textContent = mensaje;
    alerta.classList.add('correcto');

    formulario.appendChild(alerta);

    setTimeout(() => {
        alerta.remove();
    }, 5000);
}

function mostrarError(mensaje) {
    const error = document.createElement('p');

    error.textContent = mensaje;
    error.classList.add('error');

    formulario.appendChild(error);

    setTimeout(() => {
        error.remove();
    }, 5000);
}


function leerTexto(e) {

    datos[e.target.id] = e.target.value;

    console.log(datos);
}

function filtrarProductos() {
    const buscador = document.querySelector('.input__search');

    const texto = buscador.value.toLowerCase();

    const productosFiltrados = productosOriginales.filter(producto =>
        producto.nombre.toLowerCase().includes(texto)
    );

    mostrarProductos(productosFiltrados);
}

// CARRITO

// 
function cargarEventListeners() {
    // Agregar un producto al apretar Agregar al carrito
    listaProductos.addEventListener('click', agregarProducto);

    // Elimina cusros del carrito
    carrito.addEventListener('click', eliminarProducto);

    // Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        articulosCarrito = [];
    
        limpiarHtml();

        
    })
}


function agregarProducto(e) {

    // Asegura que el usuario haya apretado click en el boton Agregar al carrito
    if (e.target.classList.contains('btn-add-carrito')) {
        e.preventDefault();
        
        // Accedemos al div que tiene el contenido del producto
        const productoSeleccionado = e.target.parentElement.parentElement;
        console.log(productoSeleccionado);

        leerDatosProducto(productoSeleccionado);

    };
}

// Elimina un curso del carrito
function eliminarProducto(e) {
    console.log(e.target.classList);

    if(e.target.classList.contains('borrar-curso')) {
        e.preventDefault();
        e.stopPropagation();

        const productoId = e.target.getAttribute('data-id');

        // Elimina del arreglo articulosCarrito x el dataId
        articulosCarrito = articulosCarrito.filter(producto => producto.id !== productoId);

        carritoHtml();
    }
    
}

// Leemos los datos del producto
function leerDatosProducto(producto) {
    console.log(producto);

    // Creamos un objeto con la informacion que necesitamos
    const infoProducto = {
        imagen: producto.querySelector('img').src,
        titulo: producto.querySelector('h3').textContent,
        precio: producto.querySelector('.product__price').textContent,
        id: producto.querySelector('.btn-add-carrito').getAttribute('data-id'),
        cantidad: 1,
    }

    // Revisar si el elemento ya existe en el carrito 

    const existe = articulosCarrito.some(producto => producto.id === infoProducto.id);
    if (existe) {
        // Actualizamos la cantidad ++
        const productos = articulosCarrito.map(producto => {
            if (producto.id === infoProducto.id) {
                producto.cantidad++;
                return producto;
            } else {
                return producto;
            }
        })

        articulosCarrito = [...productos];
    } else {
        // Agregamos el curso al carrito
        articulosCarrito = [...articulosCarrito, infoProducto];
    }




    console.log(articulosCarrito);

    // Imprimimos el HTML
    carritoHtml();
}

function carritoHtml() {

    // Limpia el html para que no se repitan
    limpiarHtml();

    articulosCarrito.forEach(producto => {
        const { imagen, titulo, precio, cantidad, id } = producto;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${imagen}" width="500" height="auto"></td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td><a href="#" class="borrar-curso" data-id="${id}"> X </a></td>
        `;

        contenedorCarrito.appendChild(row);


    })
}

function limpiarHtml() {
    // Forma lenta
    // contenedorCarrito.innerHTML = '';

    // Mientras haya un hijo esta cond se cumple, x lo tanto el elemento padre va a eliminar a un hijo x el primero
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }

}









