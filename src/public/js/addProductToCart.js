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

        // Busca el campo de cantidad usando el ID del producto
        let quantityInput = document.getElementById(`${pid}`).value;

        if (!quantityInput) {
            console.error('No se encontró el campo de cantidad asociado al producto.');
            return;
        }

        // Crea un objeto FormData y agrega el campo quantity
        let data = new FormData(form);
        data.append('quantity', quantityInput);

        let obj = {};

        // Itera sobre los pares clave/valor de FormData y agrega al objeto
        data.forEach((value, key) => obj[key] = value);

        console.log(obj);

        fetch(`/api/carts/${cid}/products/${pid}`, {
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


