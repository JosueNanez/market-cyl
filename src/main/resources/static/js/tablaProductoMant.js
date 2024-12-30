//ALTURA CONTENEDOR ACCCESOS DIRECTOS
document.addEventListener('DOMContentLoaded', () => {
	function ajustarAltura() {
		const nav = document.getElementById('nav').offsetHeight;
		const barraFiltros = document.getElementById('barraFiltros').offsetHeight;
		const alturaDisponible = window.innerHeight - nav - barraFiltros;

		const contenedorTabla = document.getElementById('contenedorTablaVenta');
		contenedorTabla.style.height = `${alturaDisponible}px`; // Fijar altura
		contenedorTabla.style.maxHeight = `${alturaDisponible}px`; // Máximo igual a la altura calculada
	}

	window.addEventListener('load', ajustarAltura);
	window.addEventListener('resize', ajustarAltura);
});




/*function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}*/



let debounceTimer; // Variable para rastrear el temporizador
async function buscar(inputElement, suggestionsId) {
	const query = inputElement.value.trim();
	const sugerencias = document.getElementById(suggestionsId);
	sugerencias.innerHTML = '';

	// Cancelar el temporizador anterior si el usuario sigue escribiendo
	clearTimeout(debounceTimer);

	// Iniciar un nuevo temporizador
	debounceTimer = setTimeout(async () => {

		if (query.length < 1) return;

		if (/^\d+$/.test(query)) {
			if (query.length >= 8) {
				return;
				/*
				// SI EL VALOR INGRESADO POR BARCODE ES NÚMERO EAN-8 o EAN-13
				//console.log('El codigo Barra es: ' + query);
				try {
					const response = await fetch(`/venta/ProductoPorCodigo?codigo=${encodeURIComponent(query)}`);
					if (!response.ok) {
						if (response.status === 500) {
							const error = await response.json();
							//labelMensaje.textContent = error.message || "Error interno del servidor.";
							titulobarcode.textContent = "NO REGISTRADO";
							Swal.fire({
								icon: "error",
								title: "Oops...",
								text: "Producto no registrado !",
								timer: 2000
							});
						} else {
							throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
						}
						return; // Detén el flujo si hay un error.
					}


					const producto = await response.json();
					if (producto.length === 0) {
						console.warn("No se encontraron productos.");
						return;
					}

					//console.log(producto.detalleProducto.preVENTA);
					productName = producto.nomPROD;
					//REGISTRO EN LISTADO
					if (productList[producto.nomPROD]) { //Para actualizar registro en listado
						productList[producto.nomPROD].quantity += 1;
						productList[producto.nomPROD].subtotal = productList[producto.nomPROD].quantity * productList[producto.nomPROD].price;
					} else { //Para registrar producto en la listado
						productList[producto.nomPROD] = {
							name: producto.nomPROD,
							price: producto.detalleProducto.preVENTA,
							quantity: 1,
							subtotal: producto.detalleProducto.preVENTA
						};
					}

					titulobarcode.textContent = producto.nomPROD;
					Swal.fire({
						title: "Agregado !",
						icon: "success",
						draggable: true,
						timer: 1000
					});
					updateTable();

				} catch (error) {
					console.error("Error al buscar Productos...", error);
				}*/

			}
		} else {


			// SI EL VALOR INGRESADO ES TEXTO
			try {

				//await delay(1000);

				const response = await fetch(`/mantenimiento/producto/busquedaDinamica?param=${encodeURIComponent(query)}`);
				if (!response.ok) {
					throw new Error(`Error en la respuesta del servidor Producto: ${response.statusText}`);
				}
				const productos = await response.json();
				if (productos.length === 0) {
					//console.warn("No se encontraron productos.");
					//return;
					try {
						const response = await fetch(`/venta/busquedaDinamica?param=${encodeURIComponent(query)}`);
						if (!response.ok) {
							throw new Error(`Error en la respuesta del servidor DetalleProducto: ${response.statusText}`);
						}
						const prodDetalle = await response.json();
						if (prodDetalle.length === 0) {
							console.warn("No se encontró en Datelle de Productos.");
							return;
						}
						prodDetalle.slice(0, 10).forEach(prod => {

							const fila = document.createElement('tr');

							const columna1 = document.createElement('th');
							//columna1.scope = "row";
							columna1.innerHTML = "-";
							const columna2 = document.createElement('td');
							columna2.innerHTML = prod.nomprod;
							const columna3 = document.createElement('td');
							columna3.innerHTML = prod.stockminimo;
							const columna4 = document.createElement('td');
							columna4.innerHTML = "-";
							const columna5 = document.createElement('td');
							columna5.innerHTML = prod.stockactual;
							const columna6 = document.createElement('td');
							columna6.innerHTML = "-";
							const columna7 = document.createElement('td');
							columna7.innerHTML = prod.preccompra.toFixed(2);
							const columna8 = document.createElement('td');
							columna8.innerHTML = prod.precventa.toFixed(2);
							const columna9 = document.createElement('td');
							columna9.innerHTML = prod.ganancia.toFixed(2);
							const columna10 = document.createElement('td');
							columna10.innerHTML = prod.nomcateg;
							const columna11 = document.createElement('td');
							columna11.innerHTML = "-";

							const columna12 = document.createElement('td');
							const botonEliminar = document.createElement('a');
							botonEliminar.className = "btn btn-danger fa-solid fa-delete-left ms-3";
							botonEliminar.href = `/mantenimiento/producto/eliminarFisico/${prod.nomprod}`;
							columna12.appendChild(botonEliminar);

							fila.appendChild(columna1);
							fila.appendChild(columna2);
							fila.appendChild(columna3);
							fila.appendChild(columna4);
							fila.appendChild(columna5);
							fila.appendChild(columna6);
							fila.appendChild(columna7);
							fila.appendChild(columna8);
							fila.appendChild(columna9);
							fila.appendChild(columna10);
							fila.appendChild(columna11);
							fila.appendChild(columna12);
							sugerencias.appendChild(fila);

						});



					} catch (error) {
						console.error("Error al buscar en Detalle Productos", error);
					}


				}
				//console.log(productos);
				//Enviar sugerencias al UL
				productos.slice(0, 10).forEach(prod => {

					const fila = document.createElement('tr');

					const columna1 = document.createElement('th');
					//columna1.scope = "row";
					columna1.innerHTML = prod.codpro;
					const columna2 = document.createElement('td');
					columna2.innerHTML = prod.nomprod;
					const columna3 = document.createElement('td');
					columna3.innerHTML = prod.detalleproducto.stockminimo;
					const columna4 = document.createElement('td');
					columna4.innerHTML = prod.stockcodigo;
					const columna5 = document.createElement('td');
					columna5.innerHTML = prod.detalleproducto.stockactual;
					const columna6 = document.createElement('td');
					columna6.innerHTML = prod.fecvenc;
					const columna7 = document.createElement('td');
					columna7.innerHTML = prod.detalleproducto.preccompra.toFixed(2);
					const columna8 = document.createElement('td');
					columna8.innerHTML = prod.detalleproducto.precventa.toFixed(2);
					const columna9 = document.createElement('td');
					columna9.innerHTML = prod.detalleproducto.ganancia.toFixed(2);
					const columna10 = document.createElement('td');
					columna10.innerHTML = prod.detalleproducto.nomcateg;
					const columna11 = document.createElement('td');
					columna11.innerHTML = prod.nomprov;

					const columna12 = document.createElement('td');
					const enlaceEditar = document.createElement('a');
					enlaceEditar.className = "btn btn-primary fa-solid fa-pen-to-square";
					enlaceEditar.href = `/mantenimiento/producto/editar/${prod.codpro}`;

					const botonEliminar = document.createElement('button');
					botonEliminar.className = "btn btn-danger fa-solid fa-delete-left ms-3";
					//enlaceEditar.href = `/mantenimiento/producto/eliminar/${prod.codPRO}`;
					botonEliminar.onclick = async () => {
						Swal.fire({
							title: "Eliminar Producto por Código?",
							text: prod.codpro,
							icon: "warning",
							showCancelButton: true,
							confirmButtonColor: "#3085d6",
							cancelButtonColor: "#d33",
							confirmButtonText: "Si, eliminar!"
						}).then((result) => {
							if (result.isConfirmed) {

								window.location.href = `/mantenimiento/producto/eliminar/${encodeURIComponent(prod.codpro)}`;
							}
						});


					};
					columna12.appendChild(enlaceEditar);
					columna12.appendChild(botonEliminar);

					fila.appendChild(columna1);
					fila.appendChild(columna2);
					fila.appendChild(columna3);
					fila.appendChild(columna4);
					fila.appendChild(columna5);
					fila.appendChild(columna6);
					fila.appendChild(columna7);
					fila.appendChild(columna8);
					fila.appendChild(columna9);
					fila.appendChild(columna10);
					fila.appendChild(columna11);
					fila.appendChild(columna12);
					sugerencias.appendChild(fila);

				});
			} catch (error) {
				console.error("Error al buscar Productos...", error);
			}
		}

	}, 500); // Tiempo de espera en milisegundos (300ms en este caso)






}



