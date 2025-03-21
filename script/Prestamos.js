var url = "php/Prestamos.php";
var claveLAA = "";
var listaIds = [];

//Checa que se inicio secion
document.addEventListener('DOMContentLoaded', function() {
    fetch('php/check_session.php')
        .then(response => response.json())
        .then(data => {
            if (!data.loggedIn) {
                window.location.href = 'index.html'; // Redirigir al inicio de sesión si no está autenticado
            }
            else{
                claveLAA = `${data.claveL}`;
            }
        })
        .catch(error => {
            console.error('Error al verificar la sesión:', error);
        });

    cargarSolicitantes();
    cargarExistencias();
    llenarFechaHoraActual();
});

////+++-----------------------------------------Listar datos-----------------------------------------+++
window.onload = ListarTabla;

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
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var response = JSON.parse(xhr.responseText);
            var tablaPrestamos = document.getElementById("datosPrestamos");
            tablaPrestamos.innerHTML = ""; // Limpiar la tabla antes de añadir datos

            if (response.message) {
                alert(response.message);
            } else {
                response.forEach(function(prestamo) {
                    var fila = "<tr>";
                    fila += "<td><input type='checkbox' name=" + prestamo.idPrestar + " id=" + prestamo.idPrestar + "></td>";
                    fila += "<td>" + prestamo.idPrestar + "</td>";
                    fila += "<td>" + prestamo.idUsuario + "</td>";
                    fila += "<td>" + prestamo.idExistencia + "</td>";
                    fila += "<td>" + prestamo.fechaHora + "</td>";
                    fila += "<td>" + prestamo.cantidad + "</td>";
                    fila += "</tr>";
                    listaIds.push(prestamo.idPrestar);
                    tablaPrestamos.innerHTML += fila;
                });

                var checkboxes = document.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(function(checkbox) {
                    checkbox.addEventListener('change', function() {
                        if (this.checked) {
                            if (this.name == "seleccion") {
                                listaMatriculas = [];
                                listaIds.forEach(function(id) {
                                    var checkbox = document.getElementById(id);
                                    checkbox.checked = true;
                                    listaMatriculas.push(id);
                                });
                            } else {
                                listaMatriculas.push(this.name);
                            }
                        } else {
                            if (this.name == "seleccion") {
                                listaMatriculas = [];
                                listaIds.forEach(function(id) {
                                    var checkbox = document.getElementById(id);
                                    checkbox.checked = false;
                                    var index = listaMatriculas.indexOf(id);
                                    if (index !== -1) {
                                        listaMatriculas.splice(index, 1);
                                    }
                                });
                            } else {
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

////+++-----------------------------------------Devolver prestamo-----------------------------------------+++
function Eliminar() {
    if (listaMatriculas.length >= 1) {
        var confirmacion = confirm("¿Desea continuar?");
        if (confirmacion) {
            listaMatriculas.forEach(function(idPrestar) {
                agregarADevolver(idPrestar);
            });
            listaMatriculas = [];
            ListarTabla();
        }
    }
}

function agregarADevolver(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var response = JSON.parse(xhr.responseText);
            alert(response.message);
        } else {
            console.error('Error al realizar la solicitud');
        }
    };
    xhr.onerror = function() {
        console.error('Error de red al realizar la solicitud');
    };
    var claveL = claveLAA; // Reemplaza esto con la clave del laboratorista actual
    var fechaHora = new Date().toISOString().slice(0, 19).replace('T', ' ');
    xhr.send("idPrestar=" + encodeURIComponent(id) + "&claveL=" + encodeURIComponent(claveL) + "&fechaHora=" + encodeURIComponent(fechaHora) + "&elegir=" + encodeURIComponent("agregar_a_devolver"));
}

////+++-----------------------------------------Agregar prestamo-----------------------------------------+++
document.getElementById("FormAgregar").addEventListener("submit", function(event) {
    event.preventDefault();

    var idUsuario = document.getElementById("idUsuarioA").value;
    var idExistencia = document.getElementById("idExistenciaA").value;
    var fechaHora = document.getElementById("fechaHoraA").value;
    var cantidad = document.getElementById("cantidadA").value;
    var elegir = encodeURIComponent("registrar_Prestamo");

    var formData = new FormData();
    formData.append('idUsuario', idUsuario);
    formData.append('idExistencia', idExistencia);
    formData.append('fechaHora', fechaHora);
    formData.append('cantidad', cantidad);
    formData.append('elegir', elegir);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var response = JSON.parse(xhr.responseText);
            alert(response.message);
            ListarTabla();
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

//limpia los campos
function limpiar(nomFrom) {
    switch (nomFrom) {
        case 'agregar':
            document.getElementById("idUsuarioA").value = "";
            document.getElementById("idExistenciaA").value = "";
            document.getElementById("fechaHoraA").value = "";
            document.getElementById("cantidadA").value = "";
            llenarFechaHoraActual(); // Llenar la fecha y hora actual
            break;
    }
}

////+++-----------------------------------------Muestra el formulario lo aculta-----------------------------------------+++
function Mostrar(nomFrom) {
    var obj;
    switch (nomFrom) {
        case 'agregar':
            obj = document.getElementById("formularioAgregar");
            break;
    }
    if (obj) {
        obj.style.display = "block";
        document.getElementById("overlay").style.display = "block";
        setTimeout(function() {
            obj.classList.add('show');
            obj.classList.remove('hide');
        }, 10);
    }
}

function Cerrar(nomFrom) {
    var obj;
    switch (nomFrom) {
        case 'agregar':
            obj = document.getElementById("formularioAgregar");
            break;
    }
    if (obj) {
        obj.classList.add('hide');
        obj.classList.remove('show');
        setTimeout(function() {
            obj.style.display = "none";
            document.getElementById("overlay").style.display = "none";
        }, 300);
    }
}


////+++-----------------------------------Carga los datos de las tablas del formulario-----------------------------------+++
function cargarSolicitantes() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var response = JSON.parse(xhr.responseText);
            var tablaSolicitantes = document.getElementById("tablaSolicitantes");
            tablaSolicitantes.innerHTML = ""; // Limpiar la tabla antes de añadir datos

            response.forEach(function(solicitante) {
                var fila = "<tr onclick='seleccionarSolicitante(\"" + solicitante.idUsuario + "\")'>";
                fila += "<td>" + solicitante.idUsuario + "</td>";
                fila += "<td>" + solicitante.nombre + "</td>";
                fila += "</tr>";
                tablaSolicitantes.innerHTML += fila;
            });
        } else {
            console.error('Error al realizar la solicitud');
        }
    };
    xhr.onerror = function() {
        console.error('Error de red al realizar la solicitud');
    };
    xhr.send("elegir=" + encodeURIComponent("listar_solicitantes"));
}

function cargarExistencias() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var response = JSON.parse(xhr.responseText);
            var tablaExistencias = document.getElementById("tablaExistencias");
            tablaExistencias.innerHTML = ""; // Limpiar la tabla antes de añadir datos

            response.forEach(function(existencia) {
                var fila = "<tr onclick='seleccionarExistencia(\"" + existencia.idExistencia + "\")'>";
                fila += "<td>" + existencia.idExistencia + "</td>";
                fila += "<td>" + existencia.nombre + "</td>";
                fila += "</tr>";
                tablaExistencias.innerHTML += fila;
            });
        } else {
            console.error('Error al realizar la solicitud');
        }
    };
    xhr.onerror = function() {
        console.error('Error de red al realizar la solicitud');
    };
    xhr.send("elegir=" + encodeURIComponent("listar_existencias"));
}

//cuando se oprime una fila de las tablas del formulario se encarga de agregarlo en su respectivo txt
function seleccionarSolicitante(claveSolicitante) {
    document.getElementById("idUsuarioA").value = claveSolicitante;
}

function seleccionarExistencia(idExistencia) {
    document.getElementById("idExistenciaA").value = idExistencia;
}

//Se encarga de llenar la feha y hora del datetime-local
function llenarFechaHoraActual() {
    var ahora = new Date();
    var fechaHoraLocal = ahora.toISOString().slice(0, 16);
    document.getElementById("fechaHoraA").value = fechaHoraLocal;
}

////+++-----------------------------------Generar reporte-----------------------------------+++
function generarReporte() {
    if (listaMatriculas.length >= 1) {
        var valorCampoTexto = listaMatriculas[0];

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'php/generate_pdf.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.responseType = 'blob';
        xhr.onload = function() {
            if (xhr.status === 200) {
                var blob = new Blob([xhr.response], { type: 'application/pdf' });
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'generated_document.pdf';
                link.click();
            }
        };

        xhr.send('idPrestar=' + encodeURIComponent(valorCampoTexto));
    }
}

////+++-----------------------------------Generar reporte-----------------------------------+++
function devolverEquipo() {
    if (listaMatriculas.length >= 1) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onload = function() {
            if (xhr.status === 200) {
                alert('Equipo devuelto con éxito');
            } else {
                alert('Error al devolver el equipo');
            }
        };

        // Enviar una solicitud POST con el primer elemento de la lista de matrículas
        xhr.send("idPrestar=" + encodeURIComponent(listaMatriculas[0])+"&elegir=" + encodeURIComponent("devolver_equipo"));
    } else {
        alert('No hay matrículas disponibles');
    }
}