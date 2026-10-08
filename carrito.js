// Productos agregados al carrito
let carrito = [];

// Elementos del carrito
const listaCarrito = document.getElementById('lista-carrito');
const contadorCarrito = document.getElementById('contador-carrito');
const totalCarrito = document.getElementById('total-carrito');
const carritoVacio = document.getElementById('carrito-vacio');
const mensajeCarrito = document.getElementById('mensaje-carrito');
const vaciarCarrito = document.getElementById('vaciar-carrito');
const botonesAgregar = document.querySelectorAll('.agregar-carrito');

// Elementos del formulario
const continuarCompra = document.getElementById('continuar-compra');
const compra = document.getElementById('compra');
const formularioCompra = document.getElementById('formulario-compra');
const revisionPedido = document.getElementById('revision-pedido');
const pedidoCompletado = document.getElementById('pedido-completado');
const nombreCliente = document.getElementById('nombre-cliente');
const telefonoCliente = document.getElementById('telefono-cliente');
const editarDatos = document.getElementById('editar-datos');
const cancelarCompra = document.getElementById('cancelar-compra');
const confirmarPedido = document.getElementById('confirmar-pedido');

// Funciones del carrito
// Botones de cantidad y quitar
function crearBoton(texto, accion, producto) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = texto;
    boton.id = accion + '-' + producto.id;
    boton.setAttribute('aria-label', accion + ' ' + producto.nombre);
    boton.addEventListener('click', function () {
        cambiarCantidad(producto.id, accion);
    });
    return boton;
}

function cambiarCantidad(id, accion) {
    carrito.forEach(function (producto, indice) {
        if (producto.id === id) {
            if (accion === 'Aumentar') {
                producto.cantidad++;
            } else if (accion === 'Disminuir' && producto.cantidad > 1) {
                producto.cantidad--;
            } else {
                carrito.splice(indice, 1);
            }
        }
    });

    mostrarCarrito();
    mensajeCarrito.textContent = 'Carrito actualizado. Total: ' + totalCarrito.textContent;

    // Volver al botón al usar el teclado
    const botonActualizado = document.getElementById(accion + '-' + id);
    if (botonActualizado) {
        botonActualizado.focus();
    } else {
        document.getElementById('titulo-carrito').focus();
    }
}

function mostrarCarrito() {
    listaCarrito.textContent = '';
    let total = 0;
    let cantidadTotal = 0;

    carrito.forEach(function (producto) {
        const fila = document.createElement('li');
        fila.className = 'item-carrito';

        const detalle = document.createElement('div');
        const nombre = document.createElement('strong');
        nombre.textContent = producto.nombre;
        const precio = document.createElement('p');
        const subtotal = producto.precio * producto.cantidad;
        precio.textContent = 'S/ ' + producto.precio.toFixed(2)
            + ' por unidad · Subtotal: S/ ' + subtotal.toFixed(2);
        detalle.append(nombre, precio);

        const controles = document.createElement('div');
        controles.className = 'controles-cantidad';
        const cantidad = document.createElement('span');
        cantidad.textContent = 'Cantidad: ' + producto.cantidad;
        controles.append(
            crearBoton('−', 'Disminuir', producto),
            cantidad,
            crearBoton('+', 'Aumentar', producto),
            crearBoton('Quitar', 'Quitar', producto)
        );
        fila.append(detalle, controles);
        listaCarrito.appendChild(fila);

        total += subtotal;
        cantidadTotal += producto.cantidad;
    });

    totalCarrito.textContent = 'S/ ' + total.toFixed(2);
    contadorCarrito.textContent = cantidadTotal;
    carritoVacio.hidden = carrito.length > 0;
    vaciarCarrito.disabled = carrito.length === 0;
    continuarCompra.disabled = carrito.length === 0;
    // Ocultar la compra si cambian los productos
    compra.hidden = true;
}

// Agregar y vaciar
// Leer los datos del producto
botonesAgregar.forEach(function (boton) {
    boton.addEventListener('click', function () {
        const id = boton.dataset.id;
        const nombre = boton.dataset.nombre;
        const precio = Number(boton.dataset.precio);
        let productoEncontrado = false;

        carrito.forEach(function (producto) {
            if (producto.id === id) {
                producto.cantidad++;
                productoEncontrado = true;
            }
        });

        if (!productoEncontrado) {
            carrito.push({
                id: id,
                nombre: nombre,
                precio: precio,
                cantidad: 1
            });
        }

        mostrarCarrito();
        mensajeCarrito.textContent = 'Agregaste ' + nombre
            + '. Artículos en tu carrito: ' + contadorCarrito.textContent + '.';
    });
});

vaciarCarrito.addEventListener('click', function () {
    carrito = [];
    mostrarCarrito();
    mensajeCarrito.textContent = 'Vaciaste el carrito.';
    document.getElementById('titulo-carrito').focus();
});

// Compra de prueba
// Abrir el formulario
continuarCompra.addEventListener('click', function () {
    if (carrito.length === 0) {
        return;
    }

    compra.hidden = false;
    formularioCompra.hidden = false;
    revisionPedido.hidden = true;
    pedidoCompletado.hidden = true;
    nombreCliente.focus();
});

// Quitar el error al escribir
[nombreCliente, telefonoCliente].forEach(function (campo) {
    campo.addEventListener('input', function () {
        campo.setCustomValidity('');
    });
});

// Validar datos y mostrar el resumen
formularioCompra.addEventListener('submit', function (evento) {
    evento.preventDefault();
    if (carrito.length === 0) {
        return;
    }

    const nombre = nombreCliente.value.trim();
    const telefono = telefonoCliente.value.trim();
    // Contar los números del teléfono
    const numerosTelefono = telefono.replace(/\D/g, '');

    nombreCliente.setCustomValidity('');
    telefonoCliente.setCustomValidity('');

    if (nombre.length < 2) {
        nombreCliente.setCustomValidity('Escribe tu nombre.');
    }
    if (numerosTelefono.length < 7) {
        telefonoCliente.setCustomValidity('Escribe un teléfono con al menos 7 números.');
    }
    if (!formularioCompra.reportValidity()) {
        return;
    }

    document.getElementById('resumen-cliente').textContent = 'Nombre: ' + nombre + ' · Teléfono: ' + telefono;
    document.getElementById('resumen-entrega').textContent = 'Entrega: RECOJO EN TIENDA.';

    const resumenProductos = document.getElementById('resumen-productos');
    resumenProductos.textContent = '';
    let total = 0;
    carrito.forEach(function (producto) {
        const subtotal = producto.precio * producto.cantidad;
        const item = document.createElement('li');
        item.textContent = producto.nombre + ' × ' + producto.cantidad + ' — S/ ' + subtotal.toFixed(2);
        resumenProductos.appendChild(item);
        total += subtotal;
    });
    document.getElementById('resumen-total').textContent = 'S/ ' + total.toFixed(2);
    document.getElementById('resumen-envio').textContent = 'Recojo en tienda: sin cargo de envío.';

    formularioCompra.hidden = true;
    revisionPedido.hidden = false;
    document.getElementById('titulo-revision').focus();
});

editarDatos.addEventListener('click', function () {
    revisionPedido.hidden = true;
    formularioCompra.hidden = false;
    nombreCliente.focus();
});

cancelarCompra.addEventListener('click', function () {
    compra.hidden = true;
    continuarCompra.focus();
});

// Confirmar y vaciar el carrito
confirmarPedido.addEventListener('click', function () {
    if (carrito.length === 0 || revisionPedido.hidden) {
        return;
    }

    carrito = [];
    mostrarCarrito();
    formularioCompra.reset();
    compra.hidden = false;
    formularioCompra.hidden = true;
    revisionPedido.hidden = true;
    pedidoCompletado.hidden = false;
    mensajeCarrito.textContent = 'Pedido de prueba completado. El carrito está vacío.';
    document.getElementById('titulo-confirmacion').focus();
});

// Mostrar el carrito al iniciar
mostrarCarrito();
