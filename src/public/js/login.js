const form = document.getElementById('loginForm');

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
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


form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch('api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        console.log(data);
        if (response.status === 200) {
            response.json().then(data => {
                if (data.payload.rol === 'usuario' || data.payload.rol === 'premium') {
                    window.location.href = '/products';
                } else {
                    console.log(data);
                    window.location.href = '/users';
                }
            });
        } else if (response.status === 400) {
            const msjErrorLabel = document.getElementById('msjError');
            msjErrorLabel.textContent = "Usuario no existe o la contraseña es incorrecta.";
        } else if (response.status === 401) {
            const msjErrorLabel = document.getElementById('msjError');
            msjErrorLabel.textContent = "Credenciales inválidas";
        }
    }).catch(error => {
        console.error('Error al realizar la solicitud:', error);
    });
});
