const form = document.getElementById('mailPassForm');

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('mailPassForm');
    const userField = document.getElementById('email');

    form.addEventListener('submit', function (event) {
        if (!validateEmail(userField.value)) {
            event.preventDefault();
            alert('Por favor, ingrese una dirección de correo electrónico válida.');
        }
    });

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});

form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const data = new FormData(form);

    const obj = {};

    data.forEach((value, key) => obj[key] = value);
    fetch('/api/sessions/mailPassword', {
        method: 'POST', 
        body: JSON.stringify(obj),
        headers: {
            'Content-type':'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            window.location.href = '/';
        } else if (result.status === 400) {
            // Usuario ya registrado
            const msjErrorLabel = document.getElementById('msjErrorReset');
            msjErrorLabel.textContent = "Error al intentar enviar el correo.";
        } else if (result.status === 401) {
            // Expiró el timer
            window.location.href = '/mailPassword';
        }
    }).catch(error => {
        console.error('Error al realizar la solicitud:', error);
    });
});