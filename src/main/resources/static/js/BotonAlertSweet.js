// Funcion para mostrar alert a través de mensaje model.atribute en <body>
document.addEventListener('DOMContentLoaded', function () {
    const body = document.querySelector('body');
    const mensajeExito = body.getAttribute('data-mensaje-exito');

    // Solo mostrar el alert si hay un mensaje válido
    if (mensajeExito && mensajeExito.trim() !== '') {
        Swal.fire({
            //position: "top-end",
            icon: "success",
            title: mensajeExito,
            showConfirmButton: false,
            timer: 1500
        });
    }
});


// Función para mostrar una alerta de confirmación antes de eliminar el formulario
document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (event) => {
        const target = event.target;

        // Verifica si el elemento tiene la clase 'eliminar-accion'
        if (target.classList.contains('eliminar-accion')) {
            event.preventDefault(); // Prevenir la redirección inmediata

            const deleteUrl = target.getAttribute('data-url'); // URL para la acción
            const actionType = target.getAttribute('data-action'); // Tipo de acción (proveedor, cliente, etc.)

            // SweetAlert de confirmación
            Swal.fire({
                title: `¿Eliminar ${actionType}?`,
                text: 'Esta acción no se puede deshacer.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Realiza la petición al servidor
                    fetch(deleteUrl, { method: 'GET' })
                        .then(response => {
                            if (response.ok) {
                                // Mensaje de éxito
                                Swal.fire(
                                    `¡${actionType.charAt(0).toUpperCase() + actionType.slice(1)} eliminado!`,
                                    `${actionType.charAt(0).toUpperCase() + actionType.slice(1)} eliminado correctamente.`,
                                    'success'
                                ).then(() => {
                                    // Recarga la página
                                    window.location.reload();
                                });
                            } else {
                                Swal.fire(
                                    'Error',
                                    `No se pudo eliminar el ${actionType}. Inténtalo nuevamente.`,
                                    'error'
                                );
                            }
                        })
                        .catch(() => {
                            Swal.fire(
                                'Error',
                                `No se pudo conectar con el servidor para eliminar el ${actionType}.`,
                                'error'
                            );
                        });
                }
            });
        }
    });
});

