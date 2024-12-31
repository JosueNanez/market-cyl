const productTableBody = document.getElementById("productTableBody");
const titulobarcode = document.getElementById('barcodeModalLabel');
let productName = "";
let productList = {};
let savedClients = {};



// Función para solicitar acceso a la cámara y luego apagarla
/*
async function requestCameraAccess() {
	let stream;
	try {
		// Solicitamos acceso a la cámara sin hacer nada con el stream
		stream = await navigator.mediaDevices.getUserMedia({ video: true });

		// Si se concede el acceso, mostramos un mensaje
		console.log('Acceso a la cámara concedido.');

		stream.getTracks().forEach(track => track.stop());
		console.log('Cámara apagada después de 2 milisegundos.');

		
		setTimeout(() => {
			// Detener todos los tracks del stream (apaga la cámara)
			stream.getTracks().forEach(track => track.stop());
			console.log('Cámara apagada después de 2 milisegundos.');
		}, 2); // 2 milisegundos
	} catch (err) {
		// Si ocurre un error (como no conceder permisos), mostramos un mensaje
		console.error('Error al acceder a la cámara:', err);
		alert('No se pudo acceder a la cámara. Asegúrate de que el navegador tenga permisos.');
	}
}

// Función que se ejecuta cuando el documento está completamente cargado
document.addEventListener('DOMContentLoaded', () => {
	// Llamamos a la función de acceso a la cámara al cargar la página
	requestCameraAccess();
});*/




// AL INICIAR
document.addEventListener('DOMContentLoaded', async () => {
	const contenedorListado = document.getElementById("listadoAccesos");
	fetchProductos(contenedorListado); // Cargar los accesos directos

});

// PARA AGREGAR PRODUCTOS DESDE CATEGORIAS
async function abrirModal(categoria) {
	// Cambia el contenido del modal con los datos de la categoría seleccionada
	//const modalImage = document.getElementById('modalImage');
	const modalTitle = document.getElementById('categoryModalLabel');
	const filasProductos = document.getElementById('listaPorCategoria');
	filasProductos.innerHTML = '';
	// Cargar imagen y texto dinámicamente (usando Thymeleaf variable `categoria`)
	//modalImage.src = `/images/${categoria}.png`;
	modalTitle.textContent = `${categoria}`;
	console.log(categoria);

	try {
		const response = await fetch(`/venta/lista/apiProdCategoria?categor=${categoria}`);
		if (!response.ok) {
			throw new Error(`Error en la respuesta del servidor`);
		}
		const productosFiltrados = await response.json();
		console.log(productosFiltrados);

		productosFiltrados.forEach(prod => {
			const div = document.createElement('div');
			div.className = 'col-6 col-md-3 mb-3';
			const button = document.createElement('button');
			button.type = 'button';

			//Letra roja si solo hay un producto en stock
			let minimo = prod.stockminimo - 1;
			if (prod.stockfaltanterepo >= minimo) {
				button.className = 'btn btn btn-danger w-100 h-100';
			} else {
				button.className = 'btn btn-outline-success w-100 h-100';
			}
			//button.className = 'btn btn-outline-success w-100 h-100';
			button.setAttribute('data-bs-dismiss', 'modal');
			const span = document.createElement('span');
			span.textContent = prod.nomprod;
			span.className = 'd-block';
			const span2 = document.createElement('span');
			span2.textContent = "S/ " + prod.precventa.toFixed(2);
			span2.className = 'd-block';
			button.appendChild(span);
			button.appendChild(span2);
			button.onclick = async () => {

				let cantidad = 0;
				const { value: cant } = await Swal.fire({
					title: prod.nomprod,
					html: `
				        <div style="display: flex; justify-content: space-between; font-size: 1rem; margin-bottom: 10px;">
				            <span>Precio: S/ ${(prod.precventa).toFixed(2)}</span>
				            <span id="subtotal">Subtotal: S/ ${(prod.precventa).toFixed(2)}</span>
				        </div>
				    `,
					input: "number",
					inputValue: 1, // Número "1" por defecto
					inputPlaceholder: "0.000",
					inputAttributes: {
						step: "0.001", // Permitir 3 decimales
						min: "0" // Evitar valores negativos
					},
					customClass: {
						input: "swal2-input", // Ajustar estilo del input
					},
					confirmButtonText: "Aceptar",
					showCancelButton: true,
					cancelButtonText: "Cancelar",
					didOpen: () => {
						// Obtener elementos para actualizar dinámicamente
						const inputElement = Swal.getInput();
						const subtotalElement = document.getElementById("subtotal");

						// Agregar un evento de input al campo para actualizar el subtotal dinámicamente
						inputElement.addEventListener('input', () => {
							const inputValue = parseFloat(inputElement.value) || 0; // Validar número
							const subtotal = (inputValue * prod.precventa).toFixed(2); // Calcular subtotal
							subtotalElement.textContent = `Subtotal: S/ ${subtotal}`; // Actualizar subtotal
						});
					},
					inputValidator: (value) => {
						if (!value || parseFloat(value) <= 0) {
							return "Por favor, ingrese un número positivo.";
						}
						return null; // Validación exitosa
					}
				});

				if (cant) {
					cantidad = parseFloat(cant); // Convertir el valor a número flotante
				} else {
					return; // Salir si no se ingresa nada o se cancela
				}

				productName = prod.nomprod;
				//REGISTRO EN LISTADO
				if (productList[prod.nomprod]) { //Para actualizar registro en listado
					productList[prod.nomprod].quantity += cantidad;
					productList[prod.nomprod].subtotal = productList[prod.nomprod].quantity * productList[prod.nomprod].price;
				} else { //Para registrar producto en la listado
					productList[prod.nomprod] = {
						name: prod.nomprod,
						price: prod.precventa,
						quantity: cantidad,
						subtotal: cantidad * prod.precventa
					};
				}
				updateTable();

				Swal.fire({
					position: "top-end",
					icon: "success",
					title: "Agregado",
					text: prod.nomprod,
					showConfirmButton: false,
					timer: 1000
				});
			};
			div.appendChild(button);
			filasProductos.appendChild(div);
		});
		//filasProductos.classList('show');


	} catch (error) {
		console.error(" MS JOSUE, Error al buscar productos:", error);
	}

}

async function calculoVuelto(inputEfectivo, totalVenta, totalVuelto) {
	const efectivo = parseFloat(inputEfectivo.value.trim());
	const ventaElement = document.getElementById(totalVenta);
	const vueltoElement = document.getElementById(totalVuelto);

	// Verificar si los elementos existen
	if (!ventaElement || !vueltoElement) {
		console.error("No se encontraron los elementos especificados.");
		return;
	}

	// Validar que el valor no sea negativo
	if (efectivo <= 0) {
		inputEfectivo.value = ""; // Limpiar automáticamente el campo
		vueltoElement.textContent = "0.00"; // Resetear el vuelto
		return;
	}

	// Obtener el valor numérico de la venta
	const venta = parseFloat(ventaElement.textContent.trim());

	if (!isNaN(efectivo) && !isNaN(venta)) {
		const vuelto = efectivo - venta;
		// Mostrar el resultado en el elemento de vuelto
		vueltoElement.textContent = vuelto.toFixed(2); // Mostrar con 2 decimales
	} else {
		vueltoElement.textContent = "0.00";
	}
}


// PARA AGREGAR PRODUCTOS DESDE EL BUSCADOR
let debounceTimer; // Variable para rastrear el temporizador
async function buscar(inputElement, suggestionsId) {
	const query = inputElement.value.trim();
	const sugerencias = document.getElementById(suggestionsId);
	sugerencias.innerHTML = '';
	sugerencias.classList.remove('show');

	if (query.length < 1) return;

	//Ocultar las sugerencias al hacer click 
	document.addEventListener('click', (event) => {
		sugerencias.innerHTML = '';
		sugerencias.classList.remove('show');
		inputElement.value = '';
	});


	// Cancelar el temporizador anterior si el usuario sigue escribiendo
	clearTimeout(debounceTimer);

	// Iniciar un nuevo temporizador
	debounceTimer = setTimeout(async () => {

		if (/^\d+$/.test(query)) {
			if (query.length >= 8) {

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
					productName = producto.nomprod;
					//REGISTRO EN LISTADO
					if (productList[producto.nomprod]) { //Para actualizar registro en listado
						productList[producto.nomprod].quantity += 1;
						productList[producto.nomprod].subtotal = productList[producto.nomprod].quantity * productList[producto.nomprod].price;
					} else { //Para registrar producto en la listado
						productList[producto.nomprod] = {
							name: producto.nomprod,
							price: producto.detalleproducto.precventa,
							quantity: 1,
							subtotal: producto.detalleproducto.precventa
						};
					}

					titulobarcode.textContent = producto.nomprod;
					Swal.fire({
						title: "Agregado !",
						icon: "success",
						draggable: true,
						timer: 1000
					});
					updateTable();

				} catch (error) {
					console.error("Error al buscar Productos...", error);
				}

			}
		} else {


			// SI EL VALOR INGRESADO ES TEXTO
			try {
				const response = await fetch(`/venta/busquedaDinamica?param=${encodeURIComponent(query)}`);
				if (!response.ok) {
					throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
				}
				const productos = await response.json();
				if (productos.length === 0) {
					console.warn("No se encontraron productos.");
					return;
				}

				//Enviar sugerencias al UL
				productos.slice(0, 6).forEach(prod => {
					const li = document.createElement('li');
					const boton = document.createElement('button');
					li.appendChild(boton);
					boton.textContent = prod.nomprod + "   -  S/. " + prod.precventa.toFixed(2);

					//Letra roja si solo hay un producto en stock
					let minimo = prod.stockminimo - 1;
					if (prod.stockfaltanterepo >= minimo) {
						boton.className = 'dropdown-item text-danger';
					} else {
						boton.className = 'dropdown-item';
					}
					//boton.className = 'dropdown-item'; //border-bottom py-2

					boton.type = 'button';
					boton.onclick = async () => {
						let cantidad = 0;
						const { value: cant } = await Swal.fire({
							title: `<a type="button" class="btn btn-outline-dark btn-lg" onclick="actualizaPrecio('${prod.nomprod}', '${prod.preccompra}', '${prod.precventa}')">${(prod.nomprod)}</a>`,

							//title: prod.nomprod,
							html: `
					        <div style="display: flex; justify-content: space-between; font-size: 1rem; margin-bottom: 10px;">
					            <span>Precio: S/ ${(prod.precventa).toFixed(2)}</span>
					            <span id="subtotal">Subtotal: S/ ${(prod.precventa).toFixed(2)}</span>
					        </div>
					    `,
							input: "number",
							inputValue: 1, // Número "1" por defecto
							inputPlaceholder: "0.000",
							inputAttributes: {
								step: "0.001", // Permitir 3 decimales
								min: "0" // Evitar valores negativos
							},
							customClass: {
								input: "swal2-input", // Ajustar estilo del input
							},
							confirmButtonText: "Aceptar",
							showCancelButton: true,
							cancelButtonText: "Cancelar",
							didOpen: () => {
								// Obtener elementos para actualizar dinámicamente
								const inputElement = Swal.getInput();
								const subtotalElement = document.getElementById("subtotal");

								// Agregar un evento de input al campo para actualizar el subtotal dinámicamente
								inputElement.addEventListener('input', () => {
									const inputValue = parseFloat(inputElement.value) || 0; // Validar número
									const subtotal = (inputValue * prod.precventa).toFixed(2); // Calcular subtotal
									subtotalElement.textContent = `Subtotal: S/ ${subtotal}`; // Actualizar subtotal
								});
							},
							inputValidator: (value) => {
								if (!value || parseFloat(value) <= 0) {
									return "Por favor, ingrese un número positivo.";
								}
								return null; // Validación exitosa
							}
						});

						if (cant) {
							cantidad = parseFloat(cant); // Convertir el valor a número flotante
						} else {
							sugerencias.innerHTML = '';
							sugerencias.classList.remove('show');
							inputElement.value = '';
							return; // Salir si no se ingresa nada o se cancela
						}

						productName = prod.nomprod;
						//REGISTRO EN LISTADO
						if (productList[prod.nomprod]) { //Para actualizar registro en listado
							productList[prod.nomprod].quantity += cantidad;
							productList[prod.nomprod].subtotal = productList[prod.nomprod].quantity * productList[prod.nomprod].price;
						} else { //Para registrar producto en la listado
							productList[prod.nomprod] = {
								name: prod.nomprod,
								price: prod.precventa,
								quantity: cantidad,
								subtotal: cantidad * prod.precventa
							};
						}
						updateTable();
					}
					sugerencias.appendChild(li);
				});
				sugerencias.classList.add('show');
			} catch (error) {
				console.error("Error al buscar Productos...", error);
			}
		}





	}, 550); // Tiempo de espera en milisegundos (300ms en este caso)

}


async function actualizaPrecio(nombre, preciocompra, precioventa) {
	// Convertir valores a números
	const compra = parseFloat(preciocompra) || 0; // Si no es válido, se convierte en 0
	const venta = parseFloat(precioventa) || 0;

	const { value: formValues } = await Swal.fire({
		title: nombre, // Mostrar el nombre del producto
		html: `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                <label style="font-weight: bold; margin-bottom: 5px;">COMPRA</label>
                <input id="precioCompra" type="number" class="swal2-input" 
                       style="width: auto;" step="0.001" min="0" 
                       value="${compra.toFixed(2)}">

                <label style="font-weight: bold; margin-top: 15px; margin-bottom: 5px;">VENTA</label>
                <input id="precioVenta" type="number" class="swal2-input" 
                       style="width: auto;" step="0.001" min="0" 
                       value="${venta.toFixed(2)}">
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

		try {
			const response = await fetch(`/mantenimiento/producto/actualizarPrecios?` + new URLSearchParams({ nomprod: nombre, preccompra: compra, precventa: venta }));
			if (!response.ok) {
				Swal.fire({
					icon: "error",
					title: "Producto no actualizado!",
					timer: 2000
				});
				throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);

			} else {

				await Swal.fire({
					title: "Precio Actualizado",
					text: `Nuevo precio de compra: ${compra.toFixed(2)}, venta: ${venta.toFixed(2)}`,
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




function updateTable() {
	console.log(productName);
	productTableBody.innerHTML = "";
	const total = document.getElementById("montoTabla");
	let sumaMonto = 0.00;
	for (const productName in productList) {
		const product = productList[productName];
		const row = document.createElement("div");
		row.className = "row py-2 border-bottom";
		row.innerHTML = `
                    <div class="col-6" style="padding-right: 0;">${product.name}</div>
                    <div class="text-start col-1" style="padding: 0; width: 12%;">${product.price.toFixed(2)}</div>
                    <div class="text-center col-1" style="padding: 0; width: 11%;">${product.quantity.toFixed(2)}</div>
                    <div class="text-end col-2" style="padding: 0; width: 12%;">${product.subtotal.toFixed(2)}</div>
                    <div class="text-end col-2" style="padding: 0; width: 12%;"><button class="btn btn-danger fa-solid fa-delete-left" onclick="removeProduct('${product.name}')" style="font-size: 0.6em;"></button></div>
                `;
		productTableBody.appendChild(row);
		sumaMonto = sumaMonto + product.subtotal;
	}
	//console.log(productList);
	total.innerHTML = sumaMonto.toFixed(2);
}

function limpiarTabla() {
	productList = {};
	updateTable();

	const inputEfectivo = document.getElementById("efectivo");
	//const efectivo = parseFloat(inputEfectivo.value.trim());
	inputEfectivo.value = "";
	inputEfectivo.dispatchEvent(new Event('input'));

	const client = document.getElementById("clientName");
	//const inputCliente = client.value.trim();

	client.value = "";
}

function removeProduct(productName) {
	delete productList[productName];
	updateTable();
}



function freezeList() {
	const inputEfectivo = document.getElementById("efectivo");
	const efectivo = parseFloat(inputEfectivo.value.trim());
	const client = document.getElementById("clientName");
	const inputCliente = client.value.trim();
	if (!inputCliente) {
		alert("Debes ingresar el nombre del cliente.");
		return;
	}

	if (Object.keys(productList).length === 0) {
		alert("No hay productos para guardar.");
		return;
	}

	savedClients[inputCliente] = {
		products: { ...productList },
		cliente: inputCliente,
		efectivo: efectivo || 0 // Si no es válido, guardar 0 como predeterminado
	};


	const listItem = document.createElement("div");
	listItem.innerHTML = `<button class="btn btn btn-success" onclick="retrieveList('${inputCliente}')"
			style="width: max-content;">${inputCliente}<i
				class="fa-solid fa-bag-shopping ms-2"></i></button>`;
	/*listItem.innerHTML = `
				${clientName}
				<button class="btn btn-sm btn-secondary" onclick="retrieveList('${clientName}')">Cargar</button>
			`;*/
	savedLists.appendChild(listItem);

	productList = {};
	inputEfectivo.value = "";
	inputEfectivo.dispatchEvent(new Event('input'));
	client.value = "";
	updateTable();
	Swal.fire({
		title: "Venta Congelada",
		text: inputCliente,
		icon: "success",
		showConfirmButton: false,
		timer: 1500
	});
}


function retrieveList(clientName) {

	Swal.fire({
		title: "¿Recuperar Venta?",
		text: "La lista actual será reemplazada por la de " + clientName,
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: "Si, recuperar!"
	}).then((result) => {
		if (result.isConfirmed) {
			const cliente = document.getElementById("clientName");
			const inputEfectivo = document.getElementById("efectivo");
			if (!savedClients[clientName]) {
				alert("No se encontró la lista para este cliente.");
				return;
			}

			// Restaurar productos y efectivo
			const clientData = savedClients[clientName];
			productList = { ...clientData.products };
			updateTable();

			inputEfectivo.value = clientData.efectivo.toFixed(2);
			inputEfectivo.dispatchEvent(new Event('input'));
			cliente.value = clientData.cliente;

			delete savedClients[clientName];

			const listItem = [...savedLists.children].find(item => item.textContent.includes(clientName));
			if (listItem) {
				savedLists.removeChild(listItem);
			}

			Swal.fire({
				title: "Venta Recuperada",
				text: clientData.cliente,
				icon: "success",
				showConfirmButton: false,
				timer: 1000
			});
		}
	});

}


// FUNCIÓN PARA CARGAR LOS ACCESOS DIRECTOS
async function fetchProductos(contenedorListado) {
	try {
		const response = await fetch(`/venta/accesosDirectos`);
		if (!response.ok) {
			throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
		}
		const productos = await response.json();
		//console.log(productos);
		if (productos.length === 0) {
			console.warn("No se encontraron productos.");
			return;
		}

		productos.forEach(prod => {
			// Crear un div para cada botón dentro de una columna
			const col = document.createElement('div');
			col.className = "col"; // Clase Bootstrap para cada columna

			const boton = document.createElement('button');
			boton.type = "button";
			let minimo = prod.detalleproducto.stockminimo - 1;
			if (prod.detalleproducto.stockfaltanterepo >= minimo) {
				boton.className = 'btn btn-danger w-100'; // Si el stock es bajo, poner el botón rojo
			} else {
				boton.className = 'btn btn-light w-100'; // Si el stock está bien, botón normal
			}

			const span1 = document.createElement('span');
			span1.className = "d-block";
			span1.textContent = prod.nomprod;
			const span2 = document.createElement('span');
			span2.className = "d-block";
			span2.textContent = prod.detalleproducto.precventa.toFixed(2);
			boton.appendChild(span1);
			boton.appendChild(span2);

			boton.onclick = async () => {
				let cantidad = 0;
				const { value: cant } = await Swal.fire({
					title: prod.nomprod,
					html: ` 
                        <div style="display: flex; justify-content: space-between; font-size: 1rem; margin-bottom: 10px;">
                            <span>Precio: S/ ${(prod.detalleproducto.precventa).toFixed(2)}</span>
                            <span id="subtotal">Subtotal: S/ ${(prod.detalleproducto.precventa).toFixed(2)}</span>
                        </div>
                    `,
					input: "number",
					inputValue: 1, // Número "1" por defecto
					inputAttributes: {
						step: "0.001", // Permitir 3 decimales
						min: "0" // Evitar valores negativos
					},
					confirmButtonText: "Aceptar",
					showCancelButton: true,
					didOpen: () => {
						const inputElement = Swal.getInput();
						const subtotalElement = document.getElementById("subtotal");
						inputElement.addEventListener('input', () => {
							const inputValue = parseFloat(inputElement.value) || 0;
							const subtotal = (inputValue * prod.detalleproducto.precventa).toFixed(2);
							subtotalElement.textContent = `Subtotal: S/ ${subtotal}`;
						});
					},
					inputValidator: value => !value || parseFloat(value) <= 0 ? "Por favor, ingrese un número positivo." : null,
				});

				if (!cant) return;

				cantidad = parseFloat(cant);
				const productName = prod.nomprod;

				// Actualiza o agrega el producto a productList
				if (productList[productName]) {
					productList[productName].quantity += cantidad;
					productList[productName].subtotal = productList[productName].quantity * productList[productName].price;
				} else {
					productList[productName] = {
						name: productName,
						price: prod.detalleproducto.precventa,
						quantity: cantidad,
						subtotal: cantidad * prod.detalleproducto.precventa
					};
				}

				updateTable();
			};

			// Asegúrate de agregar el botón dentro del contenedor
			col.appendChild(boton);
			contenedorListado.appendChild(col); // Agregar la columna con el botón al contenedorListado
		});
	} catch (error) {
		console.error("Error al buscar productos...", error);
	}
}


//LISTAR SUGERENCIAS DE ACCESOS DIRECTOS
async function buscadorAccess(inputElement, suggestionsId) {
	const query = inputElement.value.trim();
	const sugerencias = document.getElementById(suggestionsId);
	sugerencias.innerHTML = '';
	sugerencias.classList.remove('show');

	if (query.length < 1) return;

	if (/^\d+$/.test(query)) { //Si son números no hace nada
		inputElement.value = "";
	} else {
		try {
			const response = await fetch(`/venta/busquedaDinamica?param=${encodeURIComponent(query)}`);
			if (!response.ok) {
				throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
			}
			const productos = await response.json();
			if (productos.length === 0) {
				console.warn("No se encontraron productos.");
				return;
			}

			//Enviar sugerencias al UL
			productos.slice(0, 6).forEach(prod => {
				const li = document.createElement('li');
				const boton = document.createElement('button');
				li.appendChild(boton);
				boton.textContent = prod.nomprod + "   -  S/. " + prod.precventa.toFixed(2);

				//Letra roja si solo hay un producto en stock
				let minimo = prod.stockminimo - 1;
				if (prod.stockfaltanterepo >= minimo) {
					boton.className = 'dropdown-item text-danger';
				} else {
					boton.className = 'dropdown-item';
				}

				boton.type = 'button';
				boton.onclick = async () => {

					inputElement.value = prod.nomprod;
					sugerencias.innerHTML = '';
					sugerencias.classList.remove('show');

				}
				sugerencias.appendChild(li);
			});
			sugerencias.classList.add('show');
		} catch (error) {
			console.error("Error al buscar Productos...", error);
		}
	}
}



//PARA ACTUALIZAR ACCESOS DIRECTOS
async function actualizarAccesoDir(valor) {
	const nombre = document.getElementById("productName");
	const nomProd = nombre.value.trim();
	const acceso = parseInt(valor);
	//param=${encodeURIComponent(nomProd)}
	try {
		const response = await fetch(`/venta/updateAcceso?` + new URLSearchParams({ nomProd: nomProd, acceso: acceso }));
		if (!response.ok) {
			Swal.fire({
				icon: "error",
				title: "Producto no registrado!",
				timer: 2000
			});
			throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);

		} else {

			const producto = await response.json()
			nombre.value = "";
			const contenedorListado = document.getElementById("listadoAccesos");
			contenedorListado.innerHTML = '';
			fetchProductos(contenedorListado);

		}
	} catch (error) {
		console.error("Error al buscar Productos...", error);
	}
}





