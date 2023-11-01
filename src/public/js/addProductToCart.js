const addToCartButtons = document.querySelectorAll('.add-to-cart-button');

addToCartButtons.forEach(button => {
    button.addEventListener('click', e => {
        e.preventDefault();

        // Accede al formulario padre del botón
        const form = button.closest('form');
        if (!form) {
            console.error('No se encontró un formulario asociado al botón.');
            return;
        }

        const cid = form.getAttribute('data-cid');
        const pid = form.getAttribute('data-pid');

        console.log('Entro al addptoduct.js');
        const data = new FormData(form);
        const obj = {};

        data.forEach((value, key) => obj[key] = value);

        fetch(`api/carts/${cid}/products/${pid}`, {
            method: 'PUT',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(result => {
            console.log(result.status);
            if (result.status === 200) {
                window.location.href = `/carts/${cid}`;
            }
        }).catch(error => {
            console.error('Error al realizar la solicitud:', error);
        });
    });
});

