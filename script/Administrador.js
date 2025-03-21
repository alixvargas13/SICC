var lastScrollTop = 0;
var url = "php/Administrador.php";

// Llamar a la función para cargar los datos al cargar la página
window.onload = ListarTabla;

// Array para almacenar las matrículas seleccionadas
var listaMatriculas = [];
// Array para almacenar las id de la tabla
var listaIds = [];

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


//+++-----------------------------------------Lista los datos en la tabla-----------------------------------------+++
//Se activa cuando se escribe algo en el cuadro de texto txtBuscador
function detectarTeclado(event) {
	ListarTabla();
}
function ListarTabla() {
    var xhr = new XMLHttpRequest();
    listaIds = [];
    var box = document.getElementById("seleccion");
    box.checked = false;

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // Establecer el tipo de contenido
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var response = JSON.parse(xhr.responseText);
            var tablaSolicitante = document.getElementById("datosLaboratorista");
            tablaSolicitante.innerHTML = ""; // Limpiar la tabla antes de añadir datos

            // Suponiendo que el servidor devuelve un objeto JSON con una propiedad "message"
            if (response.message) {
                alert(response.message);
            } else {

                // Recorrer los datos y añadirlos a la tabla
	            response.forEach(function(laboratorista) {
	                var fila = "<tr>";
	                fila += "<td> <input type='checkbox' name="+laboratorista.idLaboratorista+" id="+laboratorista.idLaboratorista+"> </td>";
	                fila += "<td>" + laboratorista.idLaboratorista + "</td>";
	                fila += "<td>" + laboratorista.nombre + "</td>";
	                fila += "<td>" + laboratorista.apellidoP + "</td>";
	                fila += "<td>" + laboratorista.apellidoM + "</td>";
	                fila += "<td>" + laboratorista.correo + "</td>";
	                fila += "<td>" + laboratorista.contraseña + "</td>";
	                fila += "</tr>";
	                listaIds.push(laboratorista.idLaboratorista);
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
    xhr.send("elegir=" + encodeURIComponent("mostrar_datos")); // Enviar datos del formulario en el cuerpo de la solicitud
}

//Limpia los campos
function limpiar(nomFrom) {
    switch (nomFrom){
        case 'agregar':
            document.getElementById("idLaboratoristaA").value = "";
            document.getElementById("nombreA").value = "";
            document.getElementById("apellido1A").value = "";
            document.getElementById("apellido2A").value = "";
            document.getElementById("correoA").value = "";
            document.getElementById("contraseñaA").value = "";
            break;
        case 'modificar':
            document.getElementById("nombreM").value = "";
            document.getElementById("apellido1M").value = "";
            document.getElementById("apellido2M").value = "";
            document.getElementById("correoM").value = "";
            document.getElementById("contraseñaM").value = "";
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
                document.getElementById("idLaboratoristaM").value = valorCampoTexto.toString();
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

//---------------------------------------------------------Modificar solicitante---------------------------------------------------------
function BuscarClaveModificar() {
    var xhr = new XMLHttpRequest();
    var idLaboratorista = document.getElementById("idLaboratoristaM").value;

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var response = JSON.parse(xhr.responseText);
            if (response.length > 0) {
                // Mostrar los datos en los cuadros de texto
                document.getElementById("nombreM").value = response[0].nombre;
                document.getElementById("apellido1M").value = response[0].apellidoP;
                document.getElementById("apellido2M").value = response[0].apellidoM;
                document.getElementById("correoM").value = response[0].correo;
                document.getElementById("contraseñaM").value = response[0].contraseña;
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

    xhr.send("idLaboratorista=" + encodeURIComponent(idLaboratorista)+"&elegir=" + encodeURIComponent("buscar_idLaboratorista"));
}
    
document.getElementById("FormModificar").addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    var xhr = new XMLHttpRequest();

    // Obtener los valores de los campos del formulario
    var idLaboratorista = document.getElementById("idLaboratoristaM").value;
    var nombre = document.getElementById("nombreM").value;
    var apellido1 = document.getElementById("apellido1M").value;
    var apellido2 = document.getElementById("apellido2M").value;
    var correo = document.getElementById("correoM").value;
    var contraseña = document.getElementById("contraseñaM").value;
    var elegir = encodeURIComponent("modificar_Laboratorista");

    // Crear un objeto FormData para enviar los datos del formulario al servidor
    var formData = new FormData();
    formData.append('idLaboratorista', idLaboratorista);
    formData.append('nombre', nombre);
    formData.append('apellido1', apellido1);
    formData.append('apellido2', apellido2);
    formData.append('correo', correo);
    formData.append('contraseña', contraseña);
    formData.append('elegir', elegir);

    xhr.open("POST", url, true);
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var response = JSON.parse(xhr.responseText);
            alert(response.message);
            
            ListarTabla();
            // Limpiar el contenido de los campos de entrada
            document.getElementById("idLaboratoristaM").value = "";
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