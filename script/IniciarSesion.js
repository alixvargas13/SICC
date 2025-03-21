document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    fetch('php/login.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const messageDiv = document.getElementById('message');
        if (data.success) {
            messageDiv.textContent = 'Inicio de sesión exitoso. Redirigiendo...';
            messageDiv.className = 'message success';
            messageDiv.style.display = 'block';
            setTimeout(() => {
                window.location.href = 'Solicitante.html';
            }, 2000);
        } else {
            messageDiv.textContent = 'Clave o contraseña incorrecta.';
            messageDiv.className = 'message error';
            messageDiv.style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});