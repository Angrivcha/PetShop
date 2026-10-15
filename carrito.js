// 1. Datos que uso en el carrito
// Cada producto guarda su id, nombre, precio, imagen y cantidad.
let carrito = [];
const imagenQrPago = 'imagenes/qr-yape.jpeg';

// 2. Elementos que voy a actualizar en la página
// Los busco una sola vez usando los id del HTML.
const botonesAgregar = document.querySelectorAll('.agregar-carrito');
const listaCarrito = document.getElementById('lista-carrito');
const contadorCarrito = document.getElementById('contador-carrito');
const totalCarrito = document.getElementById('total-carrito');
const carritoVacio = document.getElementById('carrito-vacio');
const mensajeCarrito = document.getElementById('mensaje-carrito');
const vaciarCarrito = document.getElementById('vaciar-carrito');
const continuarCompra = document.getElementById('continuar-compra');
const tituloCarrito = document.getElementById('titulo-carrito');

// Elementos de la ventana flotante.
const ventanaCarrito = document.getElementById('carrito-flotante');
const abrirCarritoFlotante = document.getElementById('abrir-carrito-flotante');
const cerrarCarritoFlotante = document.getElementById('cerrar-carrito-flotante');
const seguirComprando = document.getElementById('seguir-comprando');
const comprarDesdeFlotante = document.getElementById('comprar-desde-flotante');
const productosFlotantes = document.getElementById('productos-flotantes');
const listaCarritoFlotante = document.getElementById('lista-carrito-flotante');
const cantidadFlotante = document.getElementById('cantidad-flotante');
const importeFlotante = document.getElementById('importe-flotante');
const totalFlotante = document.getElementById('total-flotante');
const vacioFlotante = document.getElementById('vacio-flotante');
const pieCarritoFlotante = document.getElementById('pie-carrito-flotante');
const tituloCarritoFlotante = document.getElementById('titulo-carrito-flotante');
const pasoCompraFlotante = document.getElementById('paso-compra-flotante');
const contenidoFlotante = document.querySelector('.contenido-carrito-flotante');

// Formulario, resumen y confirmación del pedido.
const compra = document.getElementById('compra');
const formularioCompra = document.getElementById('formulario-compra');
const nombreCliente = document.getElementById('nombre-cliente');
const telefonoCliente = document.getElementById('telefono-cliente');
const metodoPago = document.getElementById('metodo-pago');
const panelPagoQr = document.getElementById('panel-pago-qr');
const imagenPagoQr = document.getElementById('imagen-pago-qr');
const cancelarCompra = document.getElementById('cancelar-compra');
const revisionPedido = document.getElementById('revision-pedido');
const tituloRevision = document.getElementById('titulo-revision');
const resumenCliente = document.getElementById('resumen-cliente');
const resumenEntrega = document.getElementById('resumen-entrega');
const resumenPago = document.getElementById('resumen-pago');
const resumenProductos = document.getElementById('resumen-productos');
const resumenTotal = document.getElementById('resumen-total');
const resumenEnvio = document.getElementById('resumen-envio');
const editarDatos = document.getElementById('editar-datos');
const confirmarPedido = document.getElementById('confirmar-pedido');
const pedidoCompletado = document.getElementById('pedido-completado');
const tituloConfirmacion = document.getElementById('titulo-confirmacion');
const comprobantePedido = document.getElementById('comprobante-pedido');
const enviarComprobante = document.getElementById('enviar-comprobante');
const finalizarCompra = document.getElementById('finalizar-compra');
const contactoWhatsApp = document.querySelector('#contacto .enlace-whatsapp');
const catalogoProductos = document.getElementById('productos');

// 3. Funciones para dibujar los productos
// Uso esta función para escribir todos los precios de la misma forma.
function mostrarPrecio(importe) {
    return 'S/ ' + importe.toFixed(2);
}

function crearBoton(texto, accion, producto, ubicacion) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = texto;
    // La ubicación evita repetir id entre el carrito de la página y la ventana.
    boton.id = ubicacion + '-' + accion + '-' + producto.id;
    boton.setAttribute('aria-label', accion + ' ' + producto.nombre);
    boton.addEventListener('click', function () {
        cambiarCantidad(producto.id, accion, ubicacion);
    });
    return boton;
}

// Los dos carritos usan los mismos botones de cantidad.
function crearControlesCantidad(producto, ubicacion) {
    const controles = document.createElement('div');
    controles.className = 'controles-cantidad';
    const cantidad = document.createElement('span');
    cantidad.textContent = 'Cantidad: ' + producto.cantidad;
    controles.append(
        crearBoton('−', 'Disminuir', producto, ubicacion),
        cantidad,
        crearBoton('+', 'Aumentar', producto, ubicacion),
        crearBoton('Quitar', 'Quitar', producto, ubicacion)
    );
    return controles;
}

function crearFilaProducto(producto, ubicacion) {
    const fila = document.createElement('li');
    const detalle = document.createElement('div');
    const nombre = document.createElement('strong');
    const precio = document.createElement('p');
    const subtotal = producto.precio * producto.cantidad;
    const controles = crearControlesCantidad(producto, ubicacion);
    nombre.textContent = producto.nombre;
    precio.textContent = mostrarPrecio(producto.precio) + ' por unidad';

    // En la ventana también muestro la imagen y el subtotal debajo de los botones.
    if (ubicacion === 'flotante') {
        fila.className = 'producto-flotante';
        const imagen = document.createElement('img');
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;
        imagen.width = 72;
        imagen.height = 72;
        const textoSubtotal = document.createElement('p');
        textoSubtotal.className = 'subtotal-flotante';
        textoSubtotal.textContent = 'Subtotal: ' + mostrarPrecio(subtotal);
        detalle.append(nombre, precio, controles, textoSubtotal);
        fila.append(imagen, detalle);
    } else {
        fila.className = 'item-carrito';
        precio.textContent += ' · Subtotal: ' + mostrarPrecio(subtotal);
        detalle.append(nombre, precio);
        fila.append(detalle, controles);
    }
    return fila;
}

function mostrarCarrito() {
    // Borro las filas anteriores y las vuelvo a crear con las cantidades actuales.
    listaCarrito.textContent = '';
    listaCarritoFlotante.textContent = '';
    let total = 0;
    let cantidadTotal = 0;

    carrito.forEach(function (producto) {
        listaCarrito.appendChild(crearFilaProducto(producto, 'pagina'));
        listaCarritoFlotante.appendChild(crearFilaProducto(producto, 'flotante'));
        total += producto.precio * producto.cantidad;
        cantidadTotal += producto.cantidad;
    });

    totalCarrito.textContent = mostrarPrecio(total);
    totalFlotante.textContent = mostrarPrecio(total);
    importeFlotante.textContent = mostrarPrecio(total);
    contadorCarrito.textContent = cantidadTotal;
    cantidadFlotante.textContent = cantidadTotal;

    const estaVacio = carrito.length === 0;
    carritoVacio.hidden = !estaVacio;
    vacioFlotante.hidden = !estaVacio;
    vaciarCarrito.disabled = estaVacio;
    continuarCompra.disabled = estaVacio;
    comprarDesdeFlotante.disabled = estaVacio;

    // Si cambio los productos, vuelvo al carrito para revisar el pedido otra vez.
    cambiarPasoCompra('carrito');
    actualizarMetodoPago();
}

// 4. Funciones para agregar, cambiar cantidades y vaciar
function agregarProducto(boton) {
    const id = boton.dataset.id;
    let productoEncontrado = false;

    carrito.forEach(function (producto) {
        if (producto.id === id) {
            producto.cantidad++;
            productoEncontrado = true;
        }
    });

    // Si ya estaba agregado, solo aumento la cantidad. Si no, lo guardo en la lista.
    if (!productoEncontrado) {
        const tarjeta = boton.closest('.producto');
        const imagen = tarjeta.querySelector('img');
        carrito.push({
            id: id,
            nombre: boton.dataset.nombre,
            precio: Number(boton.dataset.precio),
            imagen: imagen.getAttribute('src'),
            cantidad: 1
        });
    }

    mostrarCarrito();
    mensajeCarrito.textContent = 'Agregaste ' + boton.dataset.nombre
        + '. Artículos en tu carrito: ' + contadorCarrito.textContent + '.';
}

function cambiarCantidad(id, accion, ubicacion) {
    for (let indice = 0; indice < carrito.length; indice++) {
        const producto = carrito[indice];
        if (producto.id === id) {
            if (accion === 'Aumentar') {
                producto.cantidad++;
            } else if (accion === 'Disminuir' && producto.cantidad > 1) {
                producto.cantidad--;
            } else {
                // Quito el producto al pulsar Quitar o al bajar de una unidad.
                carrito.splice(indice, 1);
            }
            break;
        }
    }

    mostrarCarrito();
    mensajeCarrito.textContent = 'Carrito actualizado. Total: ' + totalCarrito.textContent;

    // Devuelvo el foco al botón para poder seguir usando el teclado.
    const botonActualizado = document.getElementById(ubicacion + '-' + accion + '-' + id);
    if (botonActualizado) {
        botonActualizado.focus();
    } else if (ubicacion === 'flotante') {
        tituloCarritoFlotante.focus();
    } else {
        tituloCarrito.focus();
    }
}

function vaciarProductos() {
    carrito = [];
    mostrarCarrito();
    mensajeCarrito.textContent = 'Vaciaste el carrito.';
    tituloCarrito.focus();
}

// 5. Funciones de la ventana y los pasos de compra
function abrirVentanaCarrito() {
    if (!ventanaCarrito.open) {
        ventanaCarrito.showModal();
    }
}

function cerrarVentanaCarrito() {
    ventanaCarrito.close();
}

function cambiarPasoCompra(paso) {
    // hidden oculta las partes que no pertenecen al paso actual.
    productosFlotantes.hidden = paso !== 'carrito';
    pieCarritoFlotante.hidden = paso !== 'carrito';
    compra.hidden = paso === 'carrito';
    formularioCompra.hidden = paso !== 'datos';
    revisionPedido.hidden = paso !== 'revision';
    pedidoCompletado.hidden = paso !== 'confirmacion';

    const nombresPasos = {
        carrito: 'Paso 1 de 3 · Productos',
        datos: 'Paso 2 de 3 · Datos y pago',
        revision: 'Paso 3 de 3 · Revisa y confirma',
        confirmacion: 'Pedido confirmado'
    };
    pasoCompraFlotante.textContent = nombresPasos[paso];
    contenidoFlotante.scrollTop = 0;
}

function actualizarMetodoPago() {
    panelPagoQr.hidden = metodoPago.value !== 'yape';
    imagenPagoQr.src = imagenQrPago;
}

function iniciarCompra() {
    if (carrito.length === 0) {
        return;
    }
    abrirVentanaCarrito();
    cambiarPasoCompra('datos');
    actualizarMetodoPago();
    nombreCliente.focus();
}

function validarDatosCliente() {
    const nombre = nombreCliente.value.trim();
    // Quito espacios y signos para contar solo los números del teléfono.
    const numerosTelefono = telefonoCliente.value.replace(/\D/g, '');
    nombreCliente.setCustomValidity('');
    telefonoCliente.setCustomValidity('');

    if (nombre.length < 2) {
        nombreCliente.setCustomValidity('Escribe tu nombre.');
    }
    if (numerosTelefono.length < 9) {
        telefonoCliente.setCustomValidity('Escribe un teléfono con al menos 9 números.');
    }
    if (!formularioCompra.reportValidity()) {
        return false;
    }
    if (metodoPago.value !== 'yape') {
        metodoPago.focus();
        return false;
    }
    return true;
}

function revisarPedido(evento) {
    // Evito que el formulario recargue la página al enviarlo.
    evento.preventDefault();
    if (carrito.length === 0 || !validarDatosCliente()) {
        return;
    }

    resumenCliente.textContent = 'Nombre: ' + nombreCliente.value.trim()
        + ' · Teléfono: ' + telefonoCliente.value.trim();
    resumenEntrega.textContent = 'Entrega: RECOJO EN TIENDA.';
    resumenPago.textContent = 'Método de pago: Yape.';
    resumenProductos.textContent = '';
    let total = 0;

    carrito.forEach(function (producto) {
        const subtotal = producto.precio * producto.cantidad;
        const item = document.createElement('li');
        item.textContent = producto.nombre + ' × ' + producto.cantidad + ' — ' + mostrarPrecio(subtotal);
        resumenProductos.appendChild(item);
        total += subtotal;
    });

    resumenTotal.textContent = mostrarPrecio(total);
    resumenEnvio.textContent = 'Recojo en tienda: sin cargo de envío.';
    cambiarPasoCompra('revision');
    tituloRevision.focus();
}

// 6. Confirmación y mensaje para WhatsApp
function crearResumenPedido() {
    let resumen = resumenCliente.textContent + '\n';
    carrito.forEach(function (producto) {
        const subtotal = producto.precio * producto.cantidad;
        resumen += producto.nombre + ' × ' + producto.cantidad + ' — ' + mostrarPrecio(subtotal) + '\n';
    });
    resumen += 'Total: ' + resumenTotal.textContent + '\n';
    resumen += resumenPago.textContent + '\n';
    resumen += 'Recojo en tienda · Sin cargo de envío.';
    return resumen;
}

function prepararMensajeWhatsApp(resumen) {
    const mensaje = 'Hola NaturPet, quiero enviar el comprobante de pago de este pedido.\n\n'
        + resumen + '\n\nAdjuntaré la imagen del comprobante para su revisión.';
    // Uso el mismo número de la sección Contacto. URL prepara el texto del enlace.
    const enlace = new URL(contactoWhatsApp.href);
    enlace.searchParams.set('text', mensaje);
    enviarComprobante.href = enlace.toString();
}

function completarPedido() {
    if (carrito.length === 0 || revisionPedido.hidden) {
        return;
    }

    // Primero guardo el resumen para no perderlo cuando vacíe el carrito.
    const resumen = crearResumenPedido();
    comprobantePedido.textContent = resumen;
    prepararMensajeWhatsApp(resumen);
    carrito = [];
    mostrarCarrito();
    formularioCompra.reset();
    actualizarMetodoPago();
    cambiarPasoCompra('confirmacion');
    mensajeCarrito.textContent = 'Pedido confirmado. El carrito está vacío.';
    tituloConfirmacion.focus();
}

// 7. Acciones que se ejecutan al usar los botones y el formulario
botonesAgregar.forEach(function (boton) {
    boton.addEventListener('click', function () {
        agregarProducto(boton);
    });
});

vaciarCarrito.addEventListener('click', vaciarProductos);
abrirCarritoFlotante.addEventListener('click', abrirVentanaCarrito);
cerrarCarritoFlotante.addEventListener('click', cerrarVentanaCarrito);
seguirComprando.addEventListener('click', cerrarVentanaCarrito);
continuarCompra.addEventListener('click', iniciarCompra);
comprarDesdeFlotante.addEventListener('click', iniciarCompra);
metodoPago.addEventListener('change', actualizarMetodoPago);
formularioCompra.addEventListener('submit', revisarPedido);
confirmarPedido.addEventListener('click', completarPedido);

// También cierro la ventana si se pulsa fuera de ella. Escape lo permite el propio dialog.
ventanaCarrito.addEventListener('click', function (evento) {
    const limites = ventanaCarrito.getBoundingClientRect();
    const fueraDeLaVentana = evento.clientX < limites.left || evento.clientX > limites.right
        || evento.clientY < limites.top || evento.clientY > limites.bottom;
    if (evento.target === ventanaCarrito && fueraDeLaVentana) {
        cerrarVentanaCarrito();
    }
});

// Borro el mensaje de error cuando el cliente vuelve a escribir.
[nombreCliente, telefonoCliente].forEach(function (campo) {
    campo.addEventListener('input', function () {
        campo.setCustomValidity('');
    });
});

editarDatos.addEventListener('click', function () {
    cambiarPasoCompra('datos');
    nombreCliente.focus();
});

cancelarCompra.addEventListener('click', function () {
    cambiarPasoCompra('carrito');
    comprarDesdeFlotante.focus();
});

finalizarCompra.addEventListener('click', function () {
    cerrarVentanaCarrito();
    cambiarPasoCompra('carrito');
    catalogoProductos.scrollIntoView({ block: 'start' });
});

// 8. Estado inicial de la página
abrirCarritoFlotante.hidden = false;
mostrarCarrito();
