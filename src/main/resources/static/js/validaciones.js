// Validación para permitir solo letras y números
function validateTexto(input, minLength, errorMsgId) {
    const errorElement = document.getElementById(errorMsgId);

    // Expresión regular para permitir solo letras, números y espacios
	input.value = input.value.replace(/[^a-zA-Z0-9 ]/g, '');
	
	// Elimina espacios iniciales
	if (input.value.startsWith(" ")) {
	    input.value = input.value.trimStart();
	}

	// Convierte el primer carácter a mayúscula si es una letra
	if (input.value.length > 0 && /^[a-zA-Z]$/.test(input.value.charAt(0))) {
	    input.value = input.value.charAt(0).toUpperCase() + input.value.slice(1);
	}

	// Valida si tiene un solo caracter
    if (input.value.length < minLength) {
        //input.value = input.value.slice(0, maxLength); // Limita la longitud del texto
		errorElement.textContent = "Ingresar al menos 2 caracteres.";
        errorElement.style.display = "inline"; // Muestra el mensaje de error
    } else {
        errorElement.style.display = "none"; // Oculta el mensaje de error
    }
}


function validateNumber(input, minLength, maxLength, errorMsgId) {
    const errorMsg = document.getElementById(errorMsgId);
	
	// Eliminar caracteres no numéricos y espacios
	input.value = input.value.replace(/[^0-9]/g, '').replace(/\s+/g, '');

    // Verifica si el número tiene más de 9 dígitos
    if (input.value.length < minLength) {
		errorMsg.textContent = "Ingresar al menos 7 dígitos.";
        errorMsg.style.display = "inline"; // Muestra el mensaje de error
    } else {
        errorMsg.style.display = "none"; // Oculta el mensaje de error
    }
}




//VALIDACIÓN PARA FECHA - (Agregar @DateTimeFormat(pattern = "yyyy-MM-dd")    a la entidad)
function setMinDate(inputId, daysToAdd) {
    const today = new Date(); // Obtén la fecha actual
    today.setDate(today.getDate() + daysToAdd); // Agrega los días especificados
    const minDate = today.toISOString().split('T')[0]; // Convierte la fecha al formato yyyy-mm-dd

    if (inputId) {
        inputId.setAttribute("min", minDate); // Asigna la fecha mínima al input
    } else {
		console.log("No realizó el ajuste de calendario");
    }
}

document.addEventListener('DOMContentLoaded', async () => { //cargar al inicio
    const inputFecha = document.getElementById("fecvenc");
	setMinDate(inputFecha, 7);
});





