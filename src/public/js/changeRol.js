const modifyUserButtons = document.querySelectorAll('#modificar-rol-usuario');

modifyUserButtons.forEach(button => {
    button.addEventListener('click', e => {
        e.preventDefault();

        // Accede al formulario padre del botón
        const form = button.closest('form');
        if (!form) {
            console.error('No se encontró un formulario asociado al botón.');
            return;
        }

        // Obtén el ID del usuario que deseas eliminar
        const userId = form.getAttribute('user-id');

        // Realiza una solicitud de eliminación al servidor
        fetch(`/api/sessions/premium/${userId}`, {
            method: 'POST',
        }).then(result => {
            console.log(result.status);
            if (result.status === 200) {
                window.location.href = '/users';
            }
        }).catch(error => {
            console.error('Error al realizar la solicitud:', error);
        });
    });
});