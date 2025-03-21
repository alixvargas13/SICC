var url = "../../php/Solicitante.php"; // Cambiar el nombre del archivo PHP si es diferente
function redireccionar() {
        window.location.href = "../../html/Solicitante.html";
    }

function Buscar() {
    var xhr = new XMLHttpRequest();
    var claveSolicitante = document.getElementById("claveSolicitante").value;

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var response = JSON.parse(xhr.responseText);
            if (response.length > 0) {
                // Mostrar los datos en los cuadros de texto
                document.getElementById("nombre").value = response[0].nombre;
                document.getElementById("apellido1").value = response[0].apellido1;
                document.getElementById("apellido2").value = response[0].apellido2;
                document.getElementById("correo").value = response[0].correo;
            } else {
                alert("No se encontraron resultados para la clave solicitada.");
                // Limpiar los campos de texto si no se encontraron resultados
                document.getElementById("nombre").value = "";
                document.getElementById("apellido1").value = "";
                document.getElementById("apellido2").value = "";
                document.getElementById("correo").value = "";
            }
        } else {
            console.error('Error al realizar la solicitud');
        }
    };

    xhr.onerror = function() {
        console.error('Error de red al realizar la solicitud');
    };

    xhr.send("claveSolicitante=" + encodeURIComponent(claveSolicitante)+"&elegir=" + encodeURIComponent("buscar_claveSolicitante"));
}
    
document.getElementById("modificarForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    var xhr = new XMLHttpRequest();

    // Obtener los valores de los campos del formulario
    var claveSolicitante = document.getElementById("claveSolicitante").value;
    var nombre = document.getElementById("nombre").value;
    var apellido1 = document.getElementById("apellido1").value;
    var apellido2 = document.getElementById("apellido2").value;
    var correo = document.getElementById("correo").value;
    var elegir = encodeURIComponent("modificar_solicitante");

    // Crear un objeto FormData para enviar los datos del formulario al servidor
    var formData = new FormData();
    formData.append('claveSolicitante', claveSolicitante);
    formData.append('nombre', nombre);
    formData.append('apellido1', apellido1);
    formData.append('apellido2', apellido2);
    formData.append('correo', correo);
    formData.append('elegir', elegir);

    xhr.open("POST", url, true);
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var response = JSON.parse(xhr.responseText);
            alert(response.message);

            // Limpiar el contenido de los campos de entrada
            document.getElementById("claveSolicitante").value = "";
            document.getElementById("nombre").value = "";
            document.getElementById("apellido1").value = "";
            document.getElementById("apellido2").value = "";
            document.getElementById("correo").value = "";
        } else {
            console.error('Error al realizar la solicitud');
        }
    };
    xhr.onerror = function() {
        console.error('Error de red al realizar la solicitud');
    };
    xhr.send(formData);
});
// Función para obtener parámetros de la URL
function obtenerParametroURL(nombre) {
    var parametrosURL = new URLSearchParams(window.location.search);
    return parametrosURL.get(nombre);
}

// Obtener el valor del parámetro "valor" de la URL
var valor = obtenerParametroURL("valor");

// Asignar el valor al campo de texto
document.getElementById("claveSolicitante").value = valor;
if(valor!=null){
    Buscar();
}