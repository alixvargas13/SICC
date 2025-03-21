var lastScrollTop = 0;
var url = "php/Existencia.php";

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

// Array para almacenar las matrículas seleccionadas
var listaMatriculas = [];
// Array para almacenar las id de la tabla
var listaIds = [];

// Llamar a la función para cargar los datos al cargar la página
window.onload = ListarTabla;

//Se activa cuando se escribe algo en el cuadro de texto txtBuscador
function detectarTeclado(event) {
  ListarTabla();
}

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
            var tablaSolicitante = document.getElementById("datosExistencia");
            tablaSolicitante.innerHTML = ""; // Limpiar la tabla antes de añadir datos

            // Suponiendo que el servidor devuelve un objeto JSON con una propiedad "message"
            if (response.message) {
                alert(response.message);
            } else {

                // Recorrer los datos y añadirlos a la tabla
	            response.forEach(function(existencia) {
	                var fila = "<tr>";
	                fila += "<td> <input type='checkbox' name="+existencia.idExistencia+" id="+existencia.idExistencia+"> </td>";
	                fila += "<td>" + existencia.idExistencia + "</td>";
	                fila += "<td>" + existencia.nombreTipo + "</td>";
	                fila += "<td>" + existencia.nombre + "</td>";
	                fila += "<td>" + existencia.cantidad + "</td>";
	                fila += "</tr>";
	                listaIds.push(existencia.idExistencia);
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
    xhr.send("txtBuscador=" + encodeURIComponent(contenido) + "&elegir=" + encodeURIComponent("mostrar_datos"));
}

function Eliminar() {
	if(listaMatriculas.length>=1){
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
    xhr.send("idExistencia=" + encodeURIComponent(id) + "&elegir=" + encodeURIComponent("eliminar_datos"));
}

function limpiar(nomFrom) {
    switch (nomFrom){
        case 'agregar':
        	document.getElementById("idExistenciaA").value = "";
            document.getElementById("nombreA").value = "";
            document.getElementById("cantidadA").value = "";
            break;
        case 'modificar':
            document.getElementById("nombreM").value = "";
            document.getElementById("cantidadM").value = "";
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

//solo permite que se ingresen letras
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

//solo permite que se ingresen numeros
function soloNumeros(event) {
  // Obtener el valor del cuadro de texto
  var texto = event.target.value;
  // Eliminar caracteres no permitidos (dejar solo letras, números y guiones)
  var textoFiltrado = texto.replace(/[^0-9]/g, '');
  // Convertir letras a mayúsculas
  textoFiltrado = textoFiltrado.toUpperCase();
  // Actualizar el valor del cuadro de texto
  event.target.value = textoFiltrado;
}

//Abrir y cerrar los formularios 
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
                document.getElementById("idExistenciaM").value = valorCampoTexto.toString();
                BuscarIdExistencia();
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

//---------------------------------------------------------Registrar existencia---------------------------------------------------------
document.addEventListener("DOMContentLoaded", function() {
    // Obtener el formulario
    var form = document.getElementById("FormAgregar");

    // Agregar un event listener para el evento submit del formulario
    form.addEventListener("submit", function(event) {
        // Evitar el envío del formulario por defecto
        event.preventDefault();

        // Obtener los valores de los campos del formulario
        var idExistencia = document.getElementById("idExistenciaA").value;
        var nombre = document.getElementById("nombreA").value;
        var cantidad = document.getElementById("cantidadA").value;
        var tipo = document.getElementById("tipo_existenciaA").value;
        var elegir = encodeURIComponent("registrar_existencia");

        // Crear un objeto FormData para enviar los datos del formulario al servidor
        var formData = new FormData();
        formData.append('idExistencia', idExistencia);
        formData.append('nombre', nombre);
        formData.append('cantidad', cantidad);
        formData.append('tipo_existencia', tipo);
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

                ListarTabla();
                // Limpiar el contenido de los campos de entrada
                limpiar('agregar')
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
    var select = document.getElementById("tipo_existenciaA");

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

//---------------------------------------------------------Modificar solicitante---------------------------------------------------------

function BuscarIdExistencia() {
    var xhr = new XMLHttpRequest();
    
    var idExistencia = document.getElementById("idExistenciaM").value;

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var response = JSON.parse(xhr.responseText);
            if (response.length > 0) {
                // Mostrar los datos en los cuadros de texto
                document.getElementById("nombreM").value = response[0].nombre;
                document.getElementById("cantidadM").value = response[0].cantidad;
                document.getElementById("tipo_existenciaM").value = response[0].idTipoExistencia;
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

    xhr.send("idExistencia=" + encodeURIComponent(idExistencia)+"&elegir=" + encodeURIComponent("buscar_idExistencia"));
}
    
document.getElementById("FormModificar").addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    var xhr = new XMLHttpRequest();

    // Obtener los valores de los campos del formulario
    var idExistencia = document.getElementById("idExistenciaM").value;
    var nombre = document.getElementById("nombreM").value;
    var cantidad = document.getElementById("cantidadM").value;
    var tipo = document.getElementById("tipo_existenciaM").value;
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
            ListarTabla();
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

function filtrarIdExistencia(event) {
  soloLetrasNumeros(event)
  BuscarIdExistencia();
}

document.addEventListener("DOMContentLoaded", function() {
    var select = document.getElementById("tipo_existenciaM");

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