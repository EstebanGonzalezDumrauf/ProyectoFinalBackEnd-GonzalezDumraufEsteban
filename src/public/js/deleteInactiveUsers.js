const deleteUsersButtons = document.querySelectorAll('#eliminar-usuarios');

deleteUsersButtons.forEach(button => {
    button.addEventListener('click', e => {
        e.preventDefault();

        // Accede al formulario padre del botón
        const form = button.closest('form');
        if (!form) {
            console.error('No se encontró un formulario asociado al botón.');
            return;
        }

        // Realiza una solicitud de eliminación al servidor
        fetch('/api/sessions/inactivos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(result => {
            //console.log(result.status);
            if (result.status === 200) {
                window.location.reload();
            }
        }).catch(error => {
            console.error('Error al realizar la solicitud:', error);
        });
    });
});


// const formInactive = document.getElementById('delete-users');

// formInactive.addEventListener('submit', (evt) => {
//     evt.preventDefault();
//     const data = new FormData(form);

//     const obj = {};

//     data.forEach((value, key) => obj[key] = value);
//     fetch('/api/sessions/inactivos', { 
//         method: 'POST', 
//         headers: {
//             'Content-type':'application/json'
//         }
//     }).then(result => {
//         if (result.status === 200) {
//             window.location.reload();
//         } else {
//             console.error('Error al realizar la solicitud:', error);
//         }
//     }).catch(error => {
//         console.error('Error al realizar la solicitud:', error);
//     });
// })
