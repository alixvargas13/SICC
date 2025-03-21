var url = "../../php/Laboratorista.php?";
function redireccionar() {
	window.location.href = "../../html/Laboratorista.html";
}

document.addEventListener("DOMContentLoaded", function() {
    // Obtener el formulario
    var form = document.getElementById("registrarForm");

    // Agregar un event listener para el evento submit del formulario
    form.addEventListener("submit", function(event) {
        // Evitar el envío del formulario por defecto
        event.preventDefault();
        // Obtener los valores de los campos del formulario
        var claveLA = document.getElementById("claveLA").value;
        var nombre = document.getElementById("nombre").value;
        var apellido1 = document.getElementById("apellido1").value;
        var apellido2 = document.getElementById("apellido2").value;
        var correo = document.getElementById("correo").value;
        var contraseña = document.getElementById("contraseña").value;
        var elegir = encodeURIComponent("registrar_laboratorista");

        // Crear un objeto FormData para enviar los datos del formulario al servidor
        var formData = new FormData();
        formData.append('claveLA', claveLA);
        formData.append('nombre', nombre);
        formData.append('apellido1', apellido1);
        formData.append('apellido2', apellido2);
        formData.append('correo', correo);
        formData.append('contraseña', contraseña);
        formData.append('elegir', elegir);

        // Crear una instancia de XMLHttpRequest
        var xhr = new XMLHttpRequest();

        // Configurar la solicitud POST al servidor
        xhr.open("POST", url, true);

        // Configurar el callback para manejar la respuesta del servidor
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                var response = JSON.parse(xhr.responseText);
                alert(response.message);
            } else {
                console.error('Error al realizar la solicitud');
            }
        };

        // Configurar el callback para manejar errores de red
        xhr.onerror = function() {
            console.error('Error de red al realizar la solicitud');
        };

        // Enviar la solicitud al servidor con los datos del formulario
        xhr.send(formData);
    });
});
