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

							const columna0 = document.createElement('th');
							//columna1.scope = "row";
							columna0.innerHTML = "-";

							const columna1 = document.createElement('th');
							//columna1.scope = "row";
							columna1.innerHTML = "-";

							const columna2 = document.createElement('td');
							columna2.innerHTML = prod.nomprod;

							const columna3 = document.createElement('td');
							columna3.innerHTML = prod.preccompra.toFixed(2);
							const columna4 = document.createElement('td');
							columna4.innerHTML = prod.precventa.toFixed(2);
							const columna5 = document.createElement('td');
							columna5.innerHTML = prod.ganancia.toFixed(2);
							const columna6 = document.createElement('td');
							columna6.innerHTML = "-";
							const columna7 = document.createElement('td');
							columna7.innerHTML = prod.stockminimo;
							const columna8 = document.createElement('td');
							columna8.innerHTML = "-";
							const columna9 = document.createElement('td');
							columna9.innerHTML = prod.stockactual;
							const columna10 = document.createElement('td');
							columna10.innerHTML = prod.nomcateg;
							const columna11 = document.createElement('td');
							columna11.innerHTML = "-";
							const columna12 = document.createElement('td');
							const botonEliminar = document.createElement('a');
							botonEliminar.className = "btn btn-danger fa-solid fa-delete-left ms-3";
							botonEliminar.href = `/mantenimiento/producto/eliminarFisico/${prod.nomprod}`;
							columna12.appendChild(botonEliminar);

							fila.appendChild(columna0);
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

					const columna0 = document.createElement('th');
					//columna0.scope = "row";
					const enlaceEditarCod = document.createElement('a');
					enlaceEditarCod.className = "btn btn-light fa-solid fa-pen-to-square";
					enlaceEditarCod.onclick = () => actualizarCodigo(prod.codpro, prod.nomprod);

					// Crear un contenedor flex
					const contenedor = document.createElement('div');
					contenedor.style.display = "flex";
					contenedor.style.justifyContent = "space-between";
					contenedor.style.alignItems = "center";

					// Añadir el código y el enlace al contenedor
					const textoCodpro = document.createElement('span');
					textoCodpro.textContent = prod.codpro + "  ";
					contenedor.appendChild(textoCodpro);
					contenedor.appendChild(enlaceEditarCod);

					// Insertar el contenedor en la celda
					columna0.innerHTML = ""; // Limpiar cualquier contenido anterior
					columna0.appendChild(contenedor);



					const columna1 = document.createElement('td');
					const enlaceEditarNom = document.createElement('a');
					enlaceEditarNom.className = "btn btn-light fa-solid fa-pen-to-square";
					enlaceEditarNom.onclick = () => actualizarNombre(prod.nomprod);
					// Crear un contenedor flex
					const contenedorNom = document.createElement('div');
					contenedorNom.style.display = "flex";
					contenedorNom.style.justifyContent = "space-between";
					contenedorNom.style.alignItems = "center";

					// Añadir el código y el enlace al contenedor
					const textoNompro = document.createElement('span');
					textoNompro.textContent = prod.nomprod + "  ";
					contenedorNom.appendChild(textoNompro);
					contenedorNom.appendChild(enlaceEditarNom);

					columna1.innerHTML = ""; // Limpiar cualquier contenido anterior
					columna1.appendChild(contenedorNom);


					const columna2 = document.createElement('td');
					columna2.innerHTML = prod.detalleproducto.precventa.toFixed(2);

					const columna3 = document.createElement('td');
					columna3.innerHTML = prod.fecvenc;

					const columna4 = document.createElement('td');
					columna4.innerHTML = prod.stockcodigo;

					const columna5 = document.createElement('td');
					columna5.innerHTML = prod.nomprov;

					const columna6 = document.createElement('td');
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
					const enlaceEditar = document.createElement('a');
					enlaceEditar.className = "btn btn-primary fa-solid fa-pen-to-square";
					enlaceEditar.href = `/mantenimiento/producto/editar/${prod.codpro}`;

					columna6.appendChild(enlaceEditar);
					columna6.appendChild(botonEliminar);


					fila.appendChild(columna0);
					fila.appendChild(columna1);
					fila.appendChild(columna2);
					fila.appendChild(columna3);
					fila.appendChild(columna4);
					fila.appendChild(columna5);
					fila.appendChild(columna6);
					sugerencias.appendChild(fila);

				});
			} catch (error) {
				console.error("Error al buscar Productos...", error);
			}
		}

	}, 500); // Tiempo de espera en milisegundos (300ms en este caso)
}



//DETECCION DE FILTRO POR SELECT CATEGORÍAS
// Detectar el cambio en el valor del select

const selectCategoria = document.getElementById('nomcateg');
if (selectCategoria) {
	selectCategoria.addEventListener('change', async function() {
		const selectedValue = this.value; // Obtiene el valor seleccionado
		const sugerencias = document.getElementById("registrosFiltrados");
		sugerencias.innerHTML = '';
		//console.log('Opción seleccionada:', selectedValue);

		if (selectedValue) {
			//alert('Has seleccionado: ' + selectedValue);

			try {
				const response = await fetch(`/mantenimiento/producto/prodporcategoria?nomcateg=${encodeURIComponent(selectedValue)}`);
				if (!response.ok) {
					throw new Error(`Error en la respuesta del servidor Producto: ${response.statusText}`);
				}
				const productos = await response.json();
				//console.log('Lista de productos:', productos);

				// Puedes iterar sobre la lista de productos si es necesario
				productos.forEach(prod => {

					const fila = document.createElement('tr');

					const columna0 = document.createElement('th');
					//columna0.scope = "row";
					const enlaceEditarCod = document.createElement('a');
					enlaceEditarCod.className = "btn btn-light fa-solid fa-pen-to-square";
					enlaceEditarCod.onclick = () => actualizarCodigo(prod.codpro, prod.nomprod);

					// Crear un contenedor flex
					const contenedor = document.createElement('div');
					contenedor.style.display = "flex";
					contenedor.style.justifyContent = "space-between";
					contenedor.style.alignItems = "center";

					// Añadir el código y el enlace al contenedor
					const textoCodpro = document.createElement('span');
					textoCodpro.textContent = prod.codpro + "  ";
					contenedor.appendChild(textoCodpro);
					contenedor.appendChild(enlaceEditarCod);

					// Insertar el contenedor en la celda
					columna0.innerHTML = ""; // Limpiar cualquier contenido anterior
					columna0.appendChild(contenedor);



					const columna1 = document.createElement('td');
					const enlaceEditarNom = document.createElement('a');
					enlaceEditarNom.className = "btn btn-light fa-solid fa-pen-to-square";
					enlaceEditarNom.onclick = () => actualizarNombre(prod.nomprod);
					// Crear un contenedor flex
					const contenedorNom = document.createElement('div');
					contenedorNom.style.display = "flex";
					contenedorNom.style.justifyContent = "space-between";
					contenedorNom.style.alignItems = "center";

					// Añadir el código y el enlace al contenedor
					const textoNompro = document.createElement('span');
					textoNompro.textContent = prod.nomprod + "  ";
					contenedorNom.appendChild(textoNompro);
					contenedorNom.appendChild(enlaceEditarNom);

					columna1.innerHTML = ""; // Limpiar cualquier contenido anterior
					columna1.appendChild(contenedorNom);


					const columna2 = document.createElement('td');
					columna2.innerHTML = prod.detalleproducto.precventa.toFixed(2);

					const columna3 = document.createElement('td');
					columna3.innerHTML = prod.fecvenc;

					const columna4 = document.createElement('td');
					columna4.innerHTML = prod.stockcodigo;

					const columna5 = document.createElement('td');
					columna5.innerHTML = prod.nomprov;

					const columna6 = document.createElement('td');
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
					const enlaceEditar = document.createElement('a');
					enlaceEditar.className = "btn btn-primary fa-solid fa-pen-to-square";
					enlaceEditar.href = `/mantenimiento/producto/editar/${prod.codpro}`;

					columna6.appendChild(enlaceEditar);
					columna6.appendChild(botonEliminar);


					fila.appendChild(columna0);
					fila.appendChild(columna1);
					fila.appendChild(columna2);
					fila.appendChild(columna3);
					fila.appendChild(columna4);
					fila.appendChild(columna5);
					fila.appendChild(columna6);
					sugerencias.appendChild(fila);

				});
			} catch (error) {
				console.error("Error al buscar productos:", error);
			}
		} else {
			//alert('No se ha seleccionado ninguna categoría.');
		}
	});

}

async function actualizarCodigo(codigoActual, nombre) {
	// Convertir valores a números

	const { value: formValues } = await Swal.fire({
		position: "top",
		title: nombre, // Mostrar el nombre del producto
		html: `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
			
                <label style="font-weight: bold; margin-top: 15px; margin-bottom: 5px;">CÓDIGO</label>
                <input id="nuevoCodigo" type="text" class="swal2-input" 
                       style="width: auto;"
                       value="${codigoActual}">
            </div>
        `,
		focusConfirm: false,
		confirmButtonText: "Actualizar", // Botón de confirmar
		showCancelButton: true, // Mostrar botón de cancelar
		cancelButtonText: "Cancelar",
		preConfirm: () => {
			const codigoN = parseInt(document.getElementById('nuevoCodigo').value, 10);
			if (isNaN(codigoN) || codigoN <= 0) {
				Swal.showValidationMessage("El código debe ser positivo.");
				return null;
			}
			return { codigoN };
		}
	});

	if (formValues) {
		const { codigoN } = formValues;

		try {
			const response = await fetch(`/mantenimiento/producto/actualizarCodigo?` + new URLSearchParams({ codactual: codigoActual, nuevocodigo: codigoN }));
			if (!response.ok) {
				Swal.fire({
					icon: "error",
					title: "Código no actualizado!",
					timer: 2000
				});
				throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);

			} else {

				if (selectCategoria) {
					selectCategoria.dispatchEvent(new Event('change'));
				}

				await Swal.fire({
					title: "Código Actualizado",
					icon: "success",
					timer: 1000,
					showConfirmButton: false
				});
			}
		} catch (error) {
			console.error("Error al actualizar Productos...", error);
		}
	}
}

async function actualizarNombre(nombre) {

	const { value: formValues } = await Swal.fire({
		position: "top",
		title: "NUEVO NOMBRE", // Mostrar el nombre del producto
		html: `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
			
                <input id="nuevoNombre" type="text" class="swal2-input" 
                       style="width: auto;"
                       value="${nombre}">
            </div>
        `,
		focusConfirm: false,
		confirmButtonText: "Actualizar", // Botón de confirmar
		showCancelButton: true, // Mostrar botón de cancelar
		cancelButtonText: "Cancelar",
		preConfirm: () => {
			const nuevoNombre = document.getElementById('nuevoNombre').value;
			// Validación de caracteres prohibidos y longitud
			const caracteresProhibidos = /[<>@|$#]/;
			if (caracteresProhibidos.test(nuevoNombre)) {
				Swal.showValidationMessage("El nombre no debe incluir los caracteres < > @ | $ #.");
				return null;
			}

			if (nuevoNombre.length > 20) {
				Swal.showValidationMessage("El nombre no debe superar los 20 caracteres.");
				return null;
			}

			if (nuevoNombre.trim() === "") {
				Swal.showValidationMessage("El nombre no puede estar vacío.");
				return null;
			}

			// Si pasa todas las validaciones, retorna el nombre
			return { nuevoNombre };
		}
	});

	if (formValues) {
		const { nuevoNombre } = formValues;

		try {
			const response = await fetch(`/mantenimiento/producto/actualizarNomProducto?` + new URLSearchParams({ antiguonomprod: nombre, nuevonomprod: nuevoNombre }));
			if (!response.ok) {
				Swal.fire({
					icon: "error",
					title: "Nombre no actualizado!",
					timer: 2000
				});
				throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);

			} else {

				if (selectCategoria) {
					selectCategoria.dispatchEvent(new Event('change'));
				}

				//Verifica si el campo input tiene valor
				const buscador = document.getElementById('buscadorProducto');
				if (buscador && buscador.value.trim() !== '') {
					// Lanza un evento `input` automáticamente si tiene un valor
					buscador.dispatchEvent(new Event('input'));
				}

				await Swal.fire({
					title: "Nombre Actualizado",
					icon: "success",
					timer: 1000,
					showConfirmButton: false
				});
			}
		} catch (error) {
			console.error("Error al actualizar Productos...", error);
		}
	}
}























// FUNCIONES PARA FORMULARIO DE PRECIOS


const selectCategoriaPrecios = document.getElementById('nomcategPrecios');  //Se ejecuta solo y cuando exista en el documento
let debounTimer; // Variable para rastrear el temporizador
async function buscarPrecios(inputElement, suggestionsId) {
	const query = inputElement.value.trim();
	const sugerencias = document.getElementById(suggestionsId);
	sugerencias.innerHTML = '';

	// Cancelar el temporizador anterior si el usuario sigue escribiendo
	clearTimeout(debounTimer);

	// Iniciar un nuevo temporizador
	debounTimer = setTimeout(async () => {

		if (query.length < 1) return;

		if (/^\d+$/.test(query)) {
			return;
		} else {


			// SI EL VALOR INGRESADO ES TEXTO
			try {

				//await delay(1000);

				const response = await fetch(`/mantenimiento/producto/busquedaPrecios?param=${encodeURIComponent(query)}`);
				if (!response.ok) {
					throw new Error(`Error en la respuesta del servidor Producto: ${response.statusText}`);
				}
				const productos = await response.json();
				if (productos.length === 0) {
					console.warn("No se encontraron productos.");
					return;
				}
				//console.log(productos);
				//Enviar sugerencias al UL
				productos.slice(0, 10).forEach(prod => {

					const fila = document.createElement('tr');

					const columna0 = document.createElement('th');
					const enlaceEditar = document.createElement('a');
					enlaceEditar.className = "btn btn-primary fa-solid fa-pen-to-square";
					enlaceEditar.onclick = () => actualizarPrecio(prod.nomprod, prod.preccompra, prod.precventa);


					const columna1 = document.createElement('td');
					columna1.innerHTML = prod.nomprod;

					const columna2 = document.createElement('td');
					columna2.innerHTML = prod.precventa.toFixed(2);

					const columna3 = document.createElement('td');
					columna3.innerHTML = prod.preccompra.toFixed(2);

					const columna4 = document.createElement('td');
					columna4.innerHTML = prod.ganancia.toFixed(2);

					const columna5 = document.createElement('td');
					const botonEliminar = document.createElement('a');
					botonEliminar.className = "btn btn-danger fa-solid fa-delete-left ms-3";
					botonEliminar.onclick = () => {
						Swal.fire({
							title: "Eliminar " + prod.nomprod + "  Definitivamente?",
							text: "",
							icon: "warning",
							showCancelButton: true,
							confirmButtonColor: "#3085d6",
							cancelButtonColor: "#d33",
							confirmButtonText: "Si, eliminar!"
						}).then(async (result) => {
							if (result.isConfirmed) {
								//window.location.href = `/mantenimiento/producto/eliminarAccRap/${encodeURIComponent(prod.nomprod)}`;
								const response = await fetch(`/mantenimiento/producto/eliminarAccRap?` + new URLSearchParams({ nombre: prod.nomprod }));
								if (!response.ok) {
									Swal.fire({
										icon: "error",
										title: "Producto no eliminado!",
										timer: 2000
									});
									throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);

								} else {

									if (selectCategoriaPrecios) {
										selectCategoriaPrecios.dispatchEvent(new Event('change'));
									}

									await Swal.fire({
										title: "Producto Eliminado",
										icon: "success",
										timer: 1000,
										showConfirmButton: false
									});
								}
							}
						});
					};
					columna5.appendChild(botonEliminar);

					columna0.appendChild(enlaceEditar);
					fila.appendChild(columna0);
					fila.appendChild(columna1);
					fila.appendChild(columna2);
					fila.appendChild(columna3);
					fila.appendChild(columna4);
					fila.appendChild(columna5);
					sugerencias.appendChild(fila);

				});
			} catch (error) {
				console.error("Error al buscar Productos...", error);
			}
		}

	}, 500); // Tiempo de espera en milisegundos (300ms en este caso)
}




if (selectCategoriaPrecios) {
	selectCategoriaPrecios.addEventListener('change', async function() {
		const selectedValue = this.value; // Obtiene el valor seleccionado
		const sugerencias = document.getElementById("registrosFiltrados");
		sugerencias.innerHTML = '';
		//console.log('Opción seleccionada:', selectedValue);

		if (selectedValue) {
			//alert('Has seleccionado: ' + selectedValue);

			try {
				const response = await fetch(`/mantenimiento/producto/prodporcategoriaMantePrecio?nomcateg=${encodeURIComponent(selectedValue)}`);
				if (!response.ok) {
					throw new Error(`Error en la respuesta del servidor Producto: ${response.statusText}`);
				}
				const productos = await response.json();
				//console.log('Lista de productos:', productos);

				// Puedes iterar sobre la lista de productos si es necesario
				productos.forEach(prod => {

					const fila = document.createElement('tr');

					const columna0 = document.createElement('th');
					const enlaceEditar = document.createElement('a');
					enlaceEditar.className = "btn btn-primary fa-solid fa-pen-to-square";
					enlaceEditar.onclick = () => actualizarPrecio(prod.nomprod, prod.preccompra, prod.precventa);


					const columna1 = document.createElement('td');
					columna1.innerHTML = prod.nomprod;

					const columna2 = document.createElement('td');
					columna2.innerHTML = prod.precventa.toFixed(2);

					const columna3 = document.createElement('td');
					columna3.innerHTML = prod.preccompra.toFixed(2);

					const columna4 = document.createElement('td');
					columna4.innerHTML = prod.ganancia.toFixed(2);

					const columna5 = document.createElement('td');
					const botonEliminar = document.createElement('a');
					botonEliminar.className = "btn btn-danger fa-solid fa-delete-left ms-3";
					botonEliminar.onclick = () => {
						Swal.fire({
							title: "Eliminar " + prod.nomprod + "  Definitivamente?",
							text: "",
							icon: "warning",
							showCancelButton: true,
							confirmButtonColor: "#3085d6",
							cancelButtonColor: "#d33",
							confirmButtonText: "Si, eliminar!"
						}).then(async (result) => {
							if (result.isConfirmed) {
								//window.location.href = `/mantenimiento/producto/eliminarAccRap/${encodeURIComponent(prod.nomprod)}`;
								const response = await fetch(`/mantenimiento/producto/eliminarAccRap?` + new URLSearchParams({ nombre: prod.nomprod }));
								if (!response.ok) {
									Swal.fire({
										icon: "error",
										title: "Producto no eliminado!",
										timer: 2000
									});
									throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);

								} else {

									if (selectCategoriaPrecios) {
										selectCategoriaPrecios.dispatchEvent(new Event('change'));
									}

									await Swal.fire({
										title: "Producto Eliminado",
										icon: "success",
										timer: 1000,
										showConfirmButton: false
									});
								}
							}
						});

					};
					columna5.appendChild(botonEliminar);

					columna0.appendChild(enlaceEditar);
					fila.appendChild(columna0);
					fila.appendChild(columna1);
					fila.appendChild(columna2);
					fila.appendChild(columna3);
					fila.appendChild(columna4);
					fila.appendChild(columna5);
					sugerencias.appendChild(fila);

				});
			} catch (error) {
				console.error("Error al buscar productos:", error);
			}
		} else {
			//alert('No se ha seleccionado ninguna categoría.');
		}
	});

}




async function actualizarPrecio(nombre, preciocompra, precioventa) {
	// Convertir valores a números
	const compra = parseFloat(preciocompra) || 0; // Si no es válido, se convierte en 0
	const venta = parseFloat(precioventa) || 0;

	const { value: formValues } = await Swal.fire({
		position: "top",
		title: nombre, // Mostrar el nombre del producto
		html: `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">

                <label style="font-weight: bold; margin-top: 15px; margin-bottom: 5px;">PRECIO VENTA</label>
                <input id="precioVenta" type="number" class="swal2-input" 
                       style="width: auto;" step="0.001" min="0" 
                       value="${venta.toFixed(2)}">
					   
				<label style="font-weight: bold; margin-bottom: 5px;">PRECIO COMPRA</label>
				<input id="precioCompra" type="number" class="swal2-input" 
					   style="width: auto;" step="0.001" min="0" 
					   value="${compra.toFixed(2)}">
            </div>
        `,
		focusConfirm: false,
		confirmButtonText: "Actualizar", // Botón de confirmar
		showCancelButton: true, // Mostrar botón de cancelar
		cancelButtonText: "Cancelar",
		preConfirm: () => {
			const compra = parseFloat(document.getElementById('precioCompra').value);
			const venta = parseFloat(document.getElementById('precioVenta').value);
			if (isNaN(compra) || compra <= 0 || isNaN(venta) || venta <= 0) {
				Swal.showValidationMessage("Ambos precios deben ser números positivos.");
				return null;
			}
			return { compra, venta };
		}
	});

	if (formValues) {
		const { compra, venta } = formValues;

		//Si el precio de compra es mayor al de venta
		let precCompra = 0.00;
		if (compra >= venta) {
			precCompra = venta - 0.10;
		} else {
			precCompra = compra;
		}

		try {
			const response = await fetch(`/mantenimiento/producto/actualizarPrecios?` + new URLSearchParams({ nomprod: nombre, preccompra: precCompra, precventa: venta }));
			if (!response.ok) {
				Swal.fire({
					icon: "error",
					title: "Producto no actualizado!",
					timer: 2000
				});
				throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);

			} else {

				if (selectCategoriaPrecios) {
					selectCategoriaPrecios.dispatchEvent(new Event('change'));
				}				
				//Verifica si el campo input tiene valor
				const buscador = document.getElementById('buscadorProducto');
				if (buscador && buscador.value.trim() !== '') {
					// Lanza un evento `input` automáticamente si tiene un valor
					buscador.dispatchEvent(new Event('input'));
				}

				await Swal.fire({
					title: "Precio Actualizado",
					text: `Nuevo precio de venta: ${venta.toFixed(2)}, compra: ${precCompra.toFixed(2)}`,
					icon: "success",
					timer: 1000,
					showConfirmButton: false
				});
			}
		} catch (error) {
			console.error("Error al buscar Productos...", error);
		}
	}
}






