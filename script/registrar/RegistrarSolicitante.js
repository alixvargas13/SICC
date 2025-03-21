function redireccionar() {
    	window.location.href = "../../html/Solicitante.html";
	}

	document.getElementById("registrarForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto
    
    // Obtener los valores de los campos del formulario
    var claveSolicitante = document.getElementById("claveSolicitante").value;
    var nombre = document.getElementById("nombre").value;
    var apellido1 = document.getElementById("apellido1").value;
    var apellido2 = document.getElementById("apellido2").value;
    var correo = document.getElementById("correo").value;
    var elegir = encodeURIComponent("registrar_Solicitante");

    // Crear un objeto FormData para enviar los datos del formulario al servidor
    var formData = new FormData();
    formData.append('claveSolicitante', claveSolicitante);
    formData.append('nombre', nombre);
    formData.append('apellido1', apellido1);
    formData.append('apellido2', apellido2);
    formData.append('correo', correo);
    formData.append('elegir', elegir);

    var xhr = new XMLHttpRequest();
    var url = "../../php/Solicitante.php?";

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

	//Detecta cuando se oprime el ENTER o el TAB cuando se encuentre dentro del cuadro de texto llamado claveSolicitante
function detectarTecla(event) {
  // Verificar si la tecla presionada es "Enter" (código 13)
  if (event.keyCode === 13 || event.keyCode === 9) {//13 es Enter, 9 es Tab
    var contenido = document.getElementById("claveSolicitante").value;
	var expresionRegular = /^((ISC|II|IB|LG|IEM|IM)\d{6})$/;
	var esValido = expresionRegular.test(contenido);
	if(esValido)
        document.getElementById("correo").value = contenido.toString()+"@ITSATLIXCO.EDU.MX";
  }
}

//Cambia las letras a maysculas y solo permite que se ingresen letras y numeros
function filtrarInput(event) {
  // Obtener el valor del cuadro de texto
  var texto = event.target.value;
  // Eliminar caracteres no permitidos (dejar solo letras, números y guiones)
  var textoFiltrado = texto.replace(/[^a-zA-Z0-9\-]/g, '');
  // Convertir letras a mayúsculas
  textoFiltrado = textoFiltrado.toUpperCase();
  // Actualizar el valor del cuadro de texto
  event.target.value = textoFiltrado;
}

