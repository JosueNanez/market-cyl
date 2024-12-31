
const codeReader = new ZXing.BrowserMultiFormatReader();
const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('debugCanvas');
const detectedCodeLabel = document.getElementById('detectedCode');
const inputReceptor = document.getElementById("buscadorProducto");
let textScaned = "";
let inputVal = "";

// Función para iniciar el lector
async function startBarcodeScanner() {
    let isProcessing = false; // Bloqueo temporal

    try {
        // Solicitar acceso a la cámara
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true // Solicitamos acceso solo a la cámara
        });

        // Si el acceso a la cámara fue concedido, obtenemos los dispositivos de entrada de video
        const videoDevices = await codeReader.listVideoInputDevices();
        const selectedDeviceId = videoDevices.length > 1 ? videoDevices[1]?.deviceId : videoDevices[0]?.deviceId;

        if (!selectedDeviceId) {
            throw new Error("No se detectaron cámaras.");
        }

        // Iniciar escaneo
        codeReader.decodeFromVideoDevice(
            selectedDeviceId,
            videoElement,
            (result, error) => {
                if (result && !isProcessing) {
                    isProcessing = true; // Bloquea nuevas detecciones

                    // Mostrar el código detectado
                    detectedCodeLabel.textContent = `Código detectado: ${result}`;

                    // Enviar datos al input
                    inputVal = result;

                    inputReceptor.value = inputVal;
                    inputReceptor.dispatchEvent(new Event('input')); // Dispara el evento 'input' manualmente.

                    playBeepSound();
                    // Generar vibración suave (200ms)
                    if (navigator.vibrate) {
                        navigator.vibrate(200); // Vibrar por 200ms
                    }

                    // Despues de 2 segundos se podrá hacer otra detección
                    setTimeout(() => {
                        isProcessing = false;
                    }, 2000);

                }
                if (error && !(error instanceof ZXing.NotFoundException)) {
                    console.error(error);
                    if (isProcessing) return;
                }
            }
        );
    } catch (err) {
        console.error("Error al iniciar el escáner:", err);
        alert("No se pudo acceder a la cámara.");
    }
}

// Función para detener el escaneo
function stopBarcodeScanner() {
	codeReader.reset();
	detectedCodeLabel.textContent = "";
	titulobarcode.textContent = "LECTOR DE CÓDIGO";
}

// Función para dibujar imagen de depuración
function drawDebugImage(video, canvas) {
	const context = canvas.getContext('2d');
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;
	context.drawImage(video, 0, 0, canvas.width, canvas.height);
	canvas.style.display = 'block';
	setTimeout(() => {
	  // Limpiar el canvas (elimina la imagen de depuración)
	  context.clearRect(0, 0, canvasElement.width, canvasElement.height);
	}, 2000);  // 1000ms = 1 segundo
}

// Reproducir pitido al detectar
function playBeepSound() {
	const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
	audio.play();
}

// Event Listener para el modal
const barcodeModal = document.getElementById('barcodeModal');
barcodeModal.addEventListener('show.bs.modal', startBarcodeScanner);
barcodeModal.addEventListener('hidden.bs.modal', stopBarcodeScanner);

