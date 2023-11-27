const comprarCartButtons = document.querySelectorAll('.comprar-carrito-button');

comprarCartButtons.forEach(button => {
    button.addEventListener('click', e => {
        e.preventDefault();

        // Accede al formulario padre del botón
        const form = button.closest('form');
        if (!form) {
            console.error('No se encontró un formulario asociado al botón.');
            return;
        }

        const cid = form.getAttribute('data-cid');

        fetch(`/api/carts/${cid}/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async result => {
            if (result.status === 200) {

                const response = await result.json();

                const ticket = response.ticket;
                Swal.fire({
                    toast: true,
                    position: "top-right",
                    text: `Ticket: ${ticket}`,
                    title: `GRACIAS POR TU COMPRA!!`,
                    didClose: () => {
                        window.location.href = `/carts/${cid}`;
                    }
                })
            }
        }).catch(error => {
            console.error('Error al realizar la solicitud:', error);
        });
    });
});
