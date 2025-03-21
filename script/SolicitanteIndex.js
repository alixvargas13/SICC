var lastScrollTop = 0;
var url = "php/Solicitante.php";

//Comprueva que si se inicio secion
document.addEventListener('DOMContentLoaded', function() {
    fetch('php/check_session.php')
        .then(response => response.json())
        .then(data => {
            if (!data.loggedIn) {
                window.location.href = 'index.html'; // Redirigir al inicio de sesión si no está autenticado
            } else {
                //document.getElementById('welcomeMessage').textContent = `Bienvenido, ${data.nombre}`;
                //alert(`Bienvenido, ${data.nombre}`);
            }
        })
        .catch(error => {
            console.error('Error al verificar la sesión:', error);
        });
});

/*var mensaje = "Este es un mensaje de alerta que desaparecerá después de 3 segundos.";
var tiempo = 100000; // 3 segundos (tiempo en milisegundos)
function mostrarMensajeDeAlerta(mensaje, tiempo) {
    var alerta = document.getElementById("alerta");
    alerta.innerHTML = "<strong>¡Advertencia!</strong> " + mensaje;
    alerta.style.display = "block"; // Mostrar el mensaje

    setTimeout(function() {
        alerta.style.display = "none"; // Ocultar el mensaje después de cierto tiempo
    }, tiempo);
}*/
window.addEventListener("scroll", function() {
    var currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > lastScrollTop) {
        // Desplazamiento hacia abajo
        document.getElementById("mainNav").classList.add("hidden");
    } else {
        // Desplazamiento hacia arriba
        document.getElementById("mainNav").classList.remove("hidden");
    }
    lastScrollTop = currentScroll;
}, false);

// Llamar a la función para cargar los datos al cargar la página
window.onload = ListarTabla;

// Array para almacenar las matrículas seleccionadas
var listaMatriculas = [];
// Array para almacenar las id de la tabla
var listaIds = [];

//+++-----------------------------------------Lista los datos en la tabla-----------------------------------------+++
function ListarTabla() {
    var xhr = new XMLHttpRequest();
    
    var contenido = document.getElementById("txtBuscador").value;
    listaIds = [];
    var box = document.getElementById("seleccion");
    box.checked = false;

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // Establecer el tipo de contenido
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var response = JSON.parse(xhr.responseText);
            var tablaSolicitante = document.getElementById("datosSolicitante");
            tablaSolicitante.innerHTML = ""; // Limpiar la tabla antes de añadir datos

            // Suponiendo que el servidor devuelve un objeto JSON con una propiedad "message"
            if (response.message) {
                alert(response.message);
            } else {

                // Recorrer los datos y añadirlos a la tabla
	            response.forEach(function(solicitante) {
	                var fila = "<tr>";
	                fila += "<td> <input type='checkbox' name="+solicitante.idUsuario+" id="+solicitante.idUsuario+"> </td>";
	                fila += "<td>" + solicitante.idUsuario + "</td>";
	                fila += "<td>" + solicitante.idTipoUsuario + "</td>";
	                fila += "<td>" + solicitante.nombre + "</td>";
	                fila += "<td>" + solicitante.apellido1 + "</td>";
	                fila += "<td>" + solicitante.apellido2 + "</td>";
	                fila += "<td>" + solicitante.correo + "</td>";
	                fila += "</tr>";
	                listaIds.push(solicitante.idUsuario);
	                tablaSolicitante.innerHTML += fila;
	            });
	            // Obtener todos los checkboxes
	            var checkboxes = document.querySelectorAll('input[type="checkbox"]');
	            // Adjuntar un manejador de eventos a cada checkbox
	            checkboxes.forEach(function(checkbox) {
	                checkbox.addEventListener('change', function() {
	                    if (this.checked) {
	                        //console.log("Checkbox seleccionado: " + this.name);

	                        //identifica el chekbox con el nombre 'seleccion' y marca los faltantes 
	                        if(this.name=="seleccion"){
								listaMatriculas = [];
		                        listaIds.forEach(function(id){
		                        	// Obtener el checkbox por su ID
								    var checkbox = document.getElementById(id);
								    
								    // Activar el checkbox cambiando su propiedad checked a true
								    checkbox.checked = true;
		                        	listaMatriculas.push(id);
		                        });
	                        }else{
		                        // Agregar la matrícula al array
		                        listaMatriculas.push(this.name);
	                        }
	                    } else {
	                        
	                        //console.log("Checkbox deseleccionado: " + this.name);
	                        if(this.name=="seleccion"){
								listaMatriculas = [];
		                        listaIds.forEach(function(id){
		                        	// Obtener el checkbox por su ID
								    var checkbox = document.getElementById(id);
								    
								    // Activar el checkbox cambiando su propiedad checked a true
								    checkbox.checked = false;
	                        		var index = listaMatriculas.indexOf(id);
			                        if (index !== -1) {
			                            listaMatriculas.splice(index, 1);
			                        }
		                        });
	                        }else{
                        		// Remover la matrícula del array
		                        var index = listaMatriculas.indexOf(this.name);
		                        if (index !== -1) {
		                            listaMatriculas.splice(index, 1);
		                        }
	                        }
	                    }
	                });
	            });
				listaMatriculas = [];
            }
        } else {
            console.error('Error al realizar la solicitud');
        }
    };
    xhr.onerror = function() {
        console.error('Error de red al realizar la solicitud');
    };
    xhr.send("txtBuscador=" + encodeURIComponent(contenido) + "&elegir=" + encodeURIComponent("mostrar_datos")); // Enviar datos del formulario en el cuerpo de la solicitud
}

////+++-----------------------------------------Eliminar datos-----------------------------------------+++
function eliminarSolicitante(id, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var response = JSON.parse(xhr.responseText);
            //alert(response.message);
            if (callback) callback(); // Ejecuta el callback si se proporciona
        } else {
            console.error('Error al realizar la solicitud');
        }
    };
    xhr.onerror = function() {
        console.error('Error de red al realizar la solicitud');
    };
    xhr.send("idUsuario=" + encodeURIComponent(id) + "&elegir=" + encodeURIComponent("eliminar_datos"));
}

function Eliminar() {
    if (listaMatriculas.length >= 1) {
        // Mostrar un mensaje de confirmación
        var confirmacion = confirm("¿Desea continuar?");
        // Verificar la respuesta del usuario
        if (confirmacion) {
            var pendientes = listaMatriculas.length;
            listaMatriculas.forEach(function(claveSolicitante) {
                eliminarSolicitante(claveSolicitante, function() {
                    pendientes--;
                    if (pendientes === 0) {
                        // Solo se llama a ListarTabla cuando se han procesado todos los eliminados
                        listaMatriculas = [];
                        ListarTabla();
                    }
                });
            });
        }
    }
}

// Se activa cuando se escribe algo en el cuadro de texto txtBuscador
function detectarTeclado(event) {
    ListarTabla();
}

//Limpia los campos
function limpiar(nomFrom) {
    switch (nomFrom){
        case 'agregar':
            document.getElementById("idUsuarioA").value = "";
            document.getElementById("nombreA").value = "";
            document.getElementById("apellido1A").value = "";
            document.getElementById("apellido2A").value = "";
            document.getElementById("correoA").value = "";
            break;
        case 'modificar':
            document.getElementById("nombreM").value = "";
            document.getElementById("apellido1M").value = "";
            document.getElementById("apellido2M").value = "";
            document.getElementById("correoM").value = "";
            break;
    }
    
}

//Cambia las letras a maysculas y solo permite que se ingresen letras y numeros
function soloLetrasNumeros(event) {
  // Obtener el valor del cuadro de texto
  var texto = event.target.value;
  // Eliminar caracteres no permitidos (dejar solo letras, números y guiones)
  var textoFiltrado = texto.replace(/[^a-zA-Z0-9\-]/g, '');
  // Convertir letras a mayúsculas
  textoFiltrado = textoFiltrado.toUpperCase();
  // Actualizar el valor del cuadro de texto
  event.target.value = textoFiltrado;
}

//Cambia las letras a maysculas y solo permite que se ingresen letras y numeros
function soloLetras(event) {
  // Obtener el valor del cuadro de texto
  var texto = event.target.value;
  // Eliminar caracteres no permitidos (dejar solo letras, números y guiones)
  var textoFiltrado = texto.replace(/[^a-zA-Z ]/g, '');
  // Convertir letras a mayúsculas
  textoFiltrado = textoFiltrado.toUpperCase();
  // Actualizar el valor del cuadro de texto
  event.target.value = textoFiltrado;
}

//Abrir los formularios 
function Mostrar(nomFrom) {
    var obj;
    switch (nomFrom) {
        case 'agregar':
            obj = document.getElementById("formularioAgregar");
            break;
        case 'modificar':
            obj = document.getElementById("formularioModificar");
            if(listaMatriculas.length>=1){
                var valorCampoTexto = listaMatriculas[0];
                document.getElementById("idUsuarioM").value = valorCampoTexto.toString();
                BuscarClaveModificar();
            }
            break;
    }
    if (obj) {
        obj.style.display = "block";
        document.getElementById("overlay").style.display = "block";
        setTimeout(function () {
            obj.classList.add('show');
            obj.classList.remove('hide');
        }, 10); // pequeño retraso para asegurarse de que la transición funcione
    }
}

//Cerrar los formularios 
function Cerrar(nomFrom) {
    var obj;
    switch (nomFrom) {
        case 'agregar':
            obj = document.getElementById("formularioAgregar");
            break;
        case 'modificar':
            obj = document.getElementById("formularioModificar");
            break;
    }
    if (obj) {
        obj.classList.add('hide');
        obj.classList.remove('show');
        setTimeout(function () {
            obj.style.display = "none";
            document.getElementById("overlay").style.display = "none";
        }, 300); // El tiempo aquí debe coincidir con el tiempo de transición en CSS
    }
}

//---------------------------------------------------------Agragar nombre tipo al select---------------------------------------------------------
document.addEventListener("DOMContentLoaded", function() {
    var select = document.getElementById("idTipoUsuarioA");
    // Realizar una solicitud AJAX para obtener los datos de la tabla MySQL
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);

                // Actualizar el elemento select con los datos obtenidos
                data.forEach(function(cliente) {
                    var option = document.createElement("option");
                    option.value = cliente.idTipoUsuario;
                    option.textContent = cliente.nombre;
                    select.appendChild(option);
                });
            } else {
                console.error("Error al obtener los datos: " + xhr.statusText);
            }
        }
    };

    // Enviar la solicitud POST con los datos vacíos
    xhr.send("elegir=" + encodeURIComponent("agregar_TipoUsuario"));
});

document.addEventListener("DOMContentLoaded", function() {
    var select = document.getElementById("idTipoUsuarioM");
    // Realizar una solicitud AJAX para obtener los datos de la tabla MySQL
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);

                // Actualizar el elemento select con los datos obtenidos
                data.forEach(function(cliente) {
                    var option = document.createElement("option");
                    option.value = cliente.idTipoUsuario;
                    option.textContent = cliente.nombre;
                    select.appendChild(option);
                });
            } else {
                console.error("Error al obtener los datos: " + xhr.statusText);
            }
        }
    };

    // Enviar la solicitud POST con los datos vacíos
    xhr.send("elegir=" + encodeURIComponent("agregar_TipoUsuario"));
});
//---------------------------------------------------------Registrar solicitante---------------------------------------------------------
document.getElementById("FormAgregar").addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto
    
    // Obtener los valores de los campos del formulario
    var idUsuario = document.getElementById("idUsuarioA").value;
    var idTipoUsuario = document.getElementById("idTipoUsuarioA").value;
    var nombre = document.getElementById("nombreA").value;
    var apellido1 = document.getElementById("apellido1A").value;
    var apellido2 = document.getElementById("apellido2A").value;
    var correo = document.getElementById("correoA").value;
    var elegir = encodeURIComponent("registrar_Solicitante");

    // Crear un objeto FormData para enviar los datos del formulario al servidor
    var formData = new FormData();
    formData.append('idUsuario', idUsuario);
    formData.append('idTipoUsuario', idTipoUsuario);
    formData.append('nombre', nombre);
    formData.append('apellido1', apellido1);
    formData.append('apellido2', apellido2);
    formData.append('correo', correo);
    formData.append('elegir', elegir);

    var xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.onload = function() {
        //console.error('Peoep');
        if (xhr.status >= 200 && xhr.status < 300) {
            var response = JSON.parse(xhr.responseText);

            alert(response.message);
            ListarTabla();
            // Limpiar el contenido de los campos de entrada
            limpiar('agregar');

        } else {
            console.error('Error al realizar la solicitud');
        }
    };
    xhr.onerror = function() {
        console.error('Error de red al realizar la solicitud');
    };
    xhr.send(formData);
});

	
function detectarPatron() {
    var contenido = document.getElementById("idUsuarioA").value;
	var expresionRegular = /^((ISC|II|IB|LG|IEM|IM)\d{6})$/;
	var esValido = expresionRegular.test(contenido);
	if(esValido)
        document.getElementById("correoA").value = contenido.toString()+"@ITSATLIXCO.EDU.MX";
    else
        document.getElementById("correoA").value = "";
}

function filtrarClaveAgregar(event) {
  soloLetrasNumeros(event)
  detectarPatron();
}


//---------------------------------------------------------Modificar solicitante---------------------------------------------------------

function BuscarClaveModificar() {
    var xhr = new XMLHttpRequest();
    var idUsuario = document.getElementById("idUsuarioM").value;

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var response = JSON.parse(xhr.responseText);
            if (response.length > 0) {
                // Mostrar los datos en los cuadros de texto
                document.getElementById("idTipoUsuarioM").value = response[0].idTipoUsuario;
                document.getElementById("nombreM").value = response[0].nombre;
                document.getElementById("apellido1M").value = response[0].apellido1;
                document.getElementById("apellido2M").value = response[0].apellido2;
                document.getElementById("correoM").value = response[0].correo;
            } else {
                //alert("No se encontraron resultados para la clave solicitada.");
                // Limpiar los campos de texto si no se encontraron resultados
                limpiar('modificar');
            }
        } else {
            console.error('Error al realizar la solicitud');
        }
    };

    xhr.onerror = function() {
        console.error('Error de red al realizar la solicitud');
    };

    xhr.send("idUsuario=" + encodeURIComponent(idUsuario)+"&elegir=" + encodeURIComponent("buscar_claveSolicitante"));
}
    
document.getElementById("FormModificar").addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    var xhr = new XMLHttpRequest();

    // Obtener los valores de los campos del formulario
    var idUsuario = document.getElementById("idUsuarioM").value;
    var idTipoUsuario = document.getElementById("idTipoUsuarioM").value;
    var nombre = document.getElementById("nombreM").value;
    var apellido1 = document.getElementById("apellido1M").value;
    var apellido2 = document.getElementById("apellido2M").value;
    var correo = document.getElementById("correoM").value;
    var elegir = encodeURIComponent("modificar_solicitante");

    // Crear un objeto FormData para enviar los datos del formulario al servidor
    var formData = new FormData();
    formData.append('idUsuario', idUsuario);
    formData.append('idTipoUsuario', idTipoUsuario);
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
            
            ListarTabla();
            // Limpiar el contenido de los campos de entrada
            document.getElementById("idUsuarioM").value = "";
            limpiar('modificar');
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


function filtrarClaveModificar(event) {
  soloLetrasNumeros(event)
  BuscarClaveModificar();
}


