function redireccionar() {
	window.location.href = "../../html/Existencia.html";
}

document.addEventListener("DOMContentLoaded", function() {
    // Obtener el formulario
    var form = document.getElementById("registrarForm");

    // Agregar un event listener para el evento submit del formulario
    form.addEventListener("submit", function(event) {
        // Evitar el envío del formulario por defecto
        event.preventDefault();

        // Obtener los valores de los campos del formulario
        var idExistencia = document.getElementById("idExistencia").value;
        var nombre = document.getElementById("nombre").value;
        var cantidad = document.getElementById("cantidad").value;
        var tipo = document.getElementById("tipo_existencia").value;
        var elegir = encodeURIComponent("registrar_existencia");

        // Crear un objeto FormData para enviar los datos del formulario al servidor
        var formData = new FormData();
        formData.append('idExistencia', idExistencia);
        formData.append('nombre', nombre);
        formData.append('cantidad', cantidad);
        formData.append('tipo', tipo);
        formData.append('elegir', elegir);

        // Crear una instancia de XMLHttpRequest
        var xhr = new XMLHttpRequest();
        var url = "../../php/Existencia.php?";

        // Configurar la solicitud POST al servidor
        xhr.open("POST", url, true);

        // Configurar el callback para manejar la respuesta del servidor
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                var response = JSON.parse(xhr.responseText);
                alert(response.message);

                // Limpiar el contenido de los campos de entrada
                document.getElementById("idExistencia").value = "";
                document.getElementById("nombre").value = "";
                document.getElementById("cantidad").value = "";
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

document.addEventListener("DOMContentLoaded", function() {
    var select = document.getElementById("tipo_existencia");

    // Realizar una solicitud AJAX para obtener los datos de la tabla MySQL
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "../../php/Existencia.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);

                // Actualizar el elemento select con los datos obtenidos
                data.forEach(function(cliente) {
                    var option = document.createElement("option");
                    option.value = cliente.idTipoExistencia;
                    option.textContent = cliente.nombre;
                    select.appendChild(option);
                });
            } else {
                console.error("Error al obtener los datos: " + xhr.statusText);
            }
        }
    };

    // Enviar la solicitud POST con los datos vacíos
    xhr.send("elegir=" + encodeURIComponent("agregar_nombreTipo"));
});