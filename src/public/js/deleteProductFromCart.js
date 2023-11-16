const removeFromCartButtons = document.querySelectorAll('.remove-from-cart-button');

removeFromCartButtons.forEach(button => {
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

        console.log('Entro al deleteProductFromCart.js');

        fetch(`/api/carts/${cid}/products/${pid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(result => {
            console.log(result.status);
            if (result.status === 200) {
                // Puedes recargar la página o realizar alguna otra acción después de eliminar el producto
                window.location.reload();
            }
        }).catch(error => {
            console.error('Error al realizar la solicitud:', error);
        });
    });
});
