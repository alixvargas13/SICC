var url = "../../php/Existencia.php"; // Cambiar el nombre del archivo PHP si es diferente
function redireccionar() {
        window.location.href = "../../html/Existencia.html";
    }

function Buscar() {
    var xhr = new XMLHttpRequest();
    
    var idExistencia = document.getElementById("idExistencia").value;

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var response = JSON.parse(xhr.responseText);
            if (response.length > 0) {
                // Mostrar los datos en los cuadros de texto
                document.getElementById("nombre").value = response[0].nombre;
                document.getElementById("cantidad").value = response[0].cantidad;
                document.getElementById("tipo_existencia").value = response[0].idTipoExistencia;
            } else {
                alert("No se encontraron resultados para la clave solicitada.");
                // Limpiar los campos de texto si no se encontraron resultados
                document.getElementById("nombre").value = "";
                document.getElementById("cantidad").value = "";
            }
        } else {
            console.error('Error al realizar la solicitud');
        }
    };

    xhr.onerror = function() {
        console.error('Error de red al realizar la solicitud');
    };

    xhr.send("idExistencia=" + encodeURIComponent(idExistencia)+"&elegir=" + encodeURIComponent("buscar_idExistencia"));
}
    
document.getElementById("modificarForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    var xhr = new XMLHttpRequest();

    // Obtener los valores de los campos del formulario
    var idExistencia = document.getElementById("idExistencia").value;
    var nombre = document.getElementById("nombre").value;
    var cantidad = document.getElementById("cantidad").value;
    var tipo = document.getElementById("tipo_existencia").value;
    var elegir = encodeURIComponent("modificar_existencia");

    // Crear un objeto FormData para enviar los datos del formulario al servidor
    var formData = new FormData();
    formData.append('idExistencia', idExistencia);
    formData.append('nombre', nombre);
    formData.append('cantidad', cantidad);
    formData.append('tipo', tipo);
    formData.append('elegir', elegir);

    //console.log("tipo: "+tipo+" idExistencia: "+idExistencia+" nombre: "+nombre+" cantidad: "+cantidad+" elegir: "+elegir);
    xhr.open("POST", url, true);
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var response = JSON.parse(xhr.responseText);
            alert(response.message);
            //actualiza los datos del formulario
            Buscar();
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
// Obtener el valor del parámetro "valor" de la URL
var valor = obtenerParametroURL("valor");

// Asignar el valor al campo de texto
document.getElementById("idExistencia").value = valor;
if(valor!=null){
    Buscar();
}