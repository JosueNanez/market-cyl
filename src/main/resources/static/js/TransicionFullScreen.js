
//SLIDES DE PANTALLAS 

const slides = document.querySelectorAll('.carrusel-articulo');
const totalSlides = slides.length;
let currentIndex = 1; // Inicializar en 2 slide, si quiero el primero colocar 0 y quitar focus del input buscador

let startX = 0, startY = 0; // Posición inicial del arrastre
let endX = 0, endY = 0;     // Posición final del arrastre

document.addEventListener('DOMContentLoaded', () => {
	const carouselSlide = document.getElementById('DeslizaCarrusel');
	
	
	// Mostrar el segundo slide inmediatamente
	const offset = -currentIndex * 100;
	carouselSlide.style.transform = `translateX(${offset}%)`;
	//carouselSlide.style.transition = 'none'; // Sin transición para aplicar directamente

	//Autofocus para el input buscador luego de la transición
	const inputbuscador = document.getElementById('buscadorProducto');
	inputbuscador.focus();
	
	// Habilitar la transición suave después de un breve tiempo
	setTimeout(() => {
		carouselSlide.style.transition = 'transform 0.5s ease';
	}, 50); // Esperar un pequeño retraso
	
	// Función para cambiar slide
	window.cambiarSlide = (direction) => {
		// Calcular el índice del siguiente slide
		currentIndex = (currentIndex + direction + totalSlides) % totalSlides;

		// Cambiar posición usando transform
		const offset = -currentIndex * 100;
		carouselSlide.style.transform = `translateX(${offset}%)`;
		carouselSlide.style.transition = 'transform 0.5s ease'; // Transición suave
	};



	// -------------------------
	// Swipe en dispositivos táctiles
	// -------------------------
	carouselSlide.addEventListener('touchstart', (e) => {
		startX = e.touches[0].clientX; // Posición inicial X
		startY = e.touches[0].clientY; // Posición inicial Y
	});

	carouselSlide.addEventListener('touchend', (e) => {
		endX = e.changedTouches[0].clientX; // Posición final X
		endY = e.changedTouches[0].clientY; // Posición final Y
		handleSwipe(); // Verificar la dirección del swipe
	});

	// -------------------------
	// Drag con Mouse en PC
	// -------------------------
	let isDragging = false;

	carouselSlide.addEventListener('mousedown', (e) => {
		isDragging = true;
		startX = e.clientX; // Posición inicial del mouse
		startY = e.clientY;
		carouselSlide.style.cursor = 'grabbing';
	});

	carouselSlide.addEventListener('mouseup', (e) => {
		if (isDragging) {
			endX = e.clientX; // Posición final del mouse
			endY = e.clientY;
			handleSwipe(); // Verificar la dirección del arrastre
			isDragging = false;
			carouselSlide.style.cursor = 'grab';
		}
	});

	// Función para manejar el swipe/drag
	function handleSwipe() {
		const deltaX = startX - endX; // Diferencia horizontal
		const deltaY = startY - endY; // Diferencia vertical

		// Verificar si el swipe es principalmente horizontal
		if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 130) {
			if (deltaX > 0) {
				// Swipe hacia la izquierda
				cambiarSlide(1);
			} else {
				// Swipe hacia la derecha
				cambiarSlide(-1);
			}
		}
		// Si no se cumple la condición, no se hace nada (es scroll vertical)
	}
});


//Altura de categoria <div>
document.addEventListener('DOMContentLoaded', () => {
	// Obtener elementos del DOM
	const navbar = document.getElementById('nav');
	const fixedDiv = document.getElementById('headerCategoria');
	const dynamicDiv = document.getElementById('conteneCategoria');

	// Obtener altura total de fixedDiv incluyendo márgenes
	const fixedDivStyles = window.getComputedStyle(fixedDiv);
	const fixedDivMarginTop = parseFloat(fixedDivStyles.marginTop); // Margen superior
	const fixedDivMarginBottom = parseFloat(fixedDivStyles.marginBottom); // Margen inferior
	const fixedDivHeight = fixedDiv.offsetHeight + fixedDivMarginTop + fixedDivMarginBottom;

	// Obtener altura de navbar
	const navbarHeight = navbar.offsetHeight;

	// Sumar las alturas
	const sumaAltura = navbarHeight + fixedDivHeight;

	// Calcular la altura restante
	const alturaPantalla = window.innerHeight;
	const alturaRestante = alturaPantalla - sumaAltura;

	// Asignar la altura restante al div dinámico
	dynamicDiv.style.height = `${alturaRestante}px`;

	// Ajustar altura al cambiar el tamaño de la ventana
	window.addEventListener('resize', () => {
		const alturaPantalla = window.innerHeight;
		const alturaRestante = alturaPantalla - sumaAltura;
		dynamicDiv.style.height = `${alturaRestante}px`;
	});
});



//ALTURA DE TABLA VENTA
document.addEventListener('DOMContentLoaded', () => {
	// Obtener elementos del DOM
	const navbar = document.getElementById('nav');
	const fixedDiv = document.getElementById('cabezaColumna');
	const pieDiv = document.getElementById('pieColumna');
	
	const dynamicDiv = document.getElementById('contenedorTablaVenta');
	
	// Obtener altura total de fixedDiv incluyendo márgenes
	const fixedDivStyles = window.getComputedStyle(fixedDiv);
	const fixedDivMarginTop = parseFloat(fixedDivStyles.marginTop); // Margen superior
	const fixedDivMarginBottom = parseFloat(fixedDivStyles.marginBottom); // Margen inferior
	const fixedDivHeight = fixedDiv.offsetHeight + fixedDivMarginTop + fixedDivMarginBottom;
	
	// Obtener altura total de columnDiv incluyendo márgenes
	const pieDivStyles = window.getComputedStyle(pieDiv);
	const pieDivMarginTop = parseFloat(pieDivStyles.marginTop); // Margen superior
	const pieDivMarginBottom = parseFloat(pieDivStyles.marginBottom); // Margen inferior
	const pieDivHeight = pieDiv.offsetHeight + pieDivMarginTop + pieDivMarginBottom;

	// Obtener altura de navbar
	const navbarHeight = navbar.offsetHeight;

	// Sumar las alturas
	const sumaAltura = navbarHeight + fixedDivHeight + pieDivHeight;

	// Calcular la altura restante
	const alturaPantalla = window.innerHeight;
	const alturaRestante = alturaPantalla - sumaAltura;

	// Asignar la altura restante al div dinámico
	dynamicDiv.style.height = `${alturaRestante}px`;

	// Ajustar altura al cambiar el tamaño de la ventana
	window.addEventListener('resize', () => {
		const alturaPantalla = window.innerHeight;
		const alturaRestante = alturaPantalla - sumaAltura;
		dynamicDiv.style.height = `${alturaRestante}px`;
	});
});



//ALTURA CONTENEDOR ACCCESOS DIRECTOS
document.addEventListener('DOMContentLoaded', () => {
	// Obtener elementos del DOM
	const fixedDiv = document.getElementById('freezeventas');
	const pieDiv = document.getElementById('pieAccesoDirecto');
	
	const dynamicDiv = document.getElementById('contenedorAccesoRapido');
	
	// Obtener altura total de fixedDiv incluyendo márgenes
	const fixedDivStyles = window.getComputedStyle(fixedDiv);
	const fixedDivMarginTop = parseFloat(fixedDivStyles.marginTop); // Margen superior
	const fixedDivMarginBottom = parseFloat(fixedDivStyles.marginBottom); // Margen inferior
	const fixedDivHeight = fixedDiv.offsetHeight + fixedDivMarginTop + fixedDivMarginBottom;
	
	// Obtener altura total de columnDiv incluyendo márgenes
	const pieDivStyles = window.getComputedStyle(pieDiv);
	const pieDivMarginTop = parseFloat(pieDivStyles.marginTop); // Margen superior
	const pieDivMarginBottom = parseFloat(pieDivStyles.marginBottom); // Margen inferior
	const pieDivHeight = pieDiv.offsetHeight + pieDivMarginTop + pieDivMarginBottom;

	// Obtener altura de navbar
	const navbar = document.getElementById('nav');
	const navbarHeight = navbar.offsetHeight;
	
	let sumaAltura = 0;
	
	const anchoVentana = window.innerWidth;
	//Anchos: 115 grande, 60 celular
	if (anchoVentana >= 800) {
		// Sumar las alturas en pantalla grande
		sumaAltura = navbarHeight + fixedDivHeight + pieDivHeight;
	} else {
		//Sumar alturas en pantalla chica
		sumaAltura = fixedDivHeight + pieDivHeight;
	}
	
	// Calcular la altura restante
	const alturaPantalla = window.innerHeight;
	const alturaRestante = alturaPantalla - sumaAltura;

	// Asignar la altura restante al div dinámico
	dynamicDiv.style.height = `${alturaRestante}px`;

	// Ajustar altura al cambiar el tamaño de la ventana
	window.addEventListener('resize', () => {
		const alturaPantalla = window.innerHeight;
		const alturaRestante = alturaPantalla - sumaAltura;
		dynamicDiv.style.height = `${alturaRestante}px`;
	});
});




// SCROLL INVISIBLE DIV - CATEGORIAS
document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('.custom-scroll-container'); // Seleccionar todos los contenedores

    containers.forEach((container) => {
        let isTouching = false; // Bandera para saber si hay un toque activo
        let startY = 0; // Coordenada inicial del toque
        let scrollTopStart = 0; // Posición inicial del scroll

        // Función para verificar si el evento ocurre en un botón o enlace
        const isInteractiveElement = (target) => {
            return target.tagName === 'BUTTON' || target.tagName === 'A';
        };

        // Desplazamiento con el scroll del mouse
        container.addEventListener('wheel', (event) => {
            if (isInteractiveElement(event.target)) return; // No bloquear eventos en botones o enlaces
            event.preventDefault(); // Evitar scroll predeterminado del navegador
            const scrollAmount = event.deltaY * 2; // Cantidad de desplazamiento
            container.scrollTop += scrollAmount; // Cambiar posición de scroll
        });

        // Manejo del inicio del toque
        container.addEventListener('touchstart', (event) => {
            if (isInteractiveElement(event.target)) return; // No bloquear eventos en botones o enlaces
            isTouching = true;
            startY = event.touches[0].clientY; // Registrar posición inicial del toque
            scrollTopStart = container.scrollTop; // Registrar posición inicial del scroll
        });

        // Manejo del movimiento táctil
        container.addEventListener('touchmove', (event) => {
            if (!isTouching || isInteractiveElement(event.target)) return; // Solo continuar si hay un toque válido
            const currentY = event.touches[0].clientY; // Posición actual del toque
            const deltaY = startY - currentY; // Diferencia entre posiciones
            container.scrollTop = scrollTopStart + deltaY; // Ajustar scroll directamente
            event.preventDefault(); // Prevenir comportamiento predeterminado solo para scroll
        });

        // Manejo del final del toque
        container.addEventListener('touchend', () => {
            isTouching = false; // Finalizar el toque
        });
    });
});







