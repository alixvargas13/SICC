var lastScrollTop = 0;
var url = "php/Sala.php";

window.onload = ListarTabla;

var listaIds = [];
var listaMatriculas = [];

// Comprueba si se inició sesión
document.addEventListener('DOMContentLoaded', function() {
    fetch('php/check_session.php')
        .then(response => response.json())
        .then(data => {
            if (!data.loggedIn) {
                window.location.href = 'index.html';
            }
        })
        .catch(error => {
            console.error('Error al verificar la sesión:', error);
        });
});

window.addEventListener("scroll", function() {
    var currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > lastScrollTop) {
        document.getElementById("mainNav").classList.add("hidden");
    } else {
        document.getElementById("mainNav").classList.remove("hidden");
    }
    lastScrollTop = currentScroll;
}, false);

function ListarTabla() {
    var xhr = new XMLHttpRequest();
    listaIds = [];
    var box = document.getElementById("seleccion");
    box.checked = false;

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var response = JSON.parse(xhr.responseText);
            var tablaPrestarSala = document.getElementById("datosPrestarSala");
            tablaPrestarSala.innerHTML = "";

            if (response.message) {
                alert(response.message);
            } else {
                response.forEach(function(prestarSala) {
                    var fila = "<tr>";
                    fila += "<td> <input type='checkbox' name=" + prestarSala.idPrestarSala + " id=" + prestarSala.idPrestarSala + "> </td>";
                    fila += "<td>" + prestarSala.idPrestarSala + "</td>";
                    fila += "<td>" + prestarSala.idSala + "</td>";
                    fila += "<td>" + prestarSala.fecha + "</td>";
                    fila += "<td>" + prestarSala.hora + "</td>";
                    fila += "<td>" + prestarSala.idTiempo_Dia + "</td>";
                    fila += "<td>" + prestarSala.idUsuario + "</td>";
                    fila += "</tr>";
                    listaIds.push(prestarSala.idPrestarSala);
                    tablaPrestarSala.innerHTML += fila;
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
    xhr.send("elegir=" + encodeURIComponent("mostrar_datos_prestar_sala"));
}

function limpiar(nomFrom) {
    switch (nomFrom) {
        case 'agregar':
            document.getElementById("idPrestarSalaA").value = "";
            document.getElementById("idSalaA").value = "";
            document.getElementById("fechaA").value = "";
            document.getElementById("horaA").value = "";
            document.getElementById("idTiempo_DiaA").value = "";
            document.getElementById("idUsuarioA").value = "";
            break;
        case 'modificar':
            document.getElementById("idSalaM").value = "";
            document.getElementById("fechaM").value = "";
            document.getElementById("horaM").value = "";
            document.getElementById("idTiempo_DiaM").value = "";
            document.getElementById("idUsuarioM").value = "";
            break;
    }
}

function Mostrar(nomFrom) {
    var obj;
    switch (nomFrom) {
        case 'agregar':
            obj = document.getElementById("formularioAgregar");
            break;
        case 'modificar':
            obj = document.getElementById("formularioModificar");
            if (listaMatriculas.length >= 1) {
                var valorCampoTexto = listaMatriculas[0];
                document.getElementById("idPrestarSalaM").value = valorCampoTexto.toString();
                BuscarClaveModificar();
            }
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
        case 'modificar':
            obj = document.getElementById("formularioModificar");
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

function BuscarClaveModificar() {
    var xhr = new XMLHttpRequest();
    var idPrestarSala = document.getElementById("idPrestarSalaM").value;

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var response = JSON.parse(xhr.responseText);
            if (response.length > 0) {
                document.getElementById("idSalaM").value = response[0].idSala;
                document.getElementById("fechaM").value = response[0].fecha;
                document.getElementById("horaM").value = response[0].hora;
                document.getElementById("idTiempo_DiaM").value = response[0].idTiempo_Dia;
                document.getElementById("idUsuarioM").value = response[0].idUsuario;
            } else {
                limpiar('modificar');
            }
        } else {
            console.error('Error al realizar la solicitud');
        }
    };

    xhr.onerror = function() {
        console.error('Error de red al realizar la solicitud');
    };

    xhr.send("idPrestarSala=" + encodeURIComponent(idPrestarSala) + "&elegir=" + encodeURIComponent("buscar_idPrestarSala"));
}

document.getElementById("FormModificar").addEventListener("submit", function(event) {
    event.preventDefault();

    var xhr = new XMLHttpRequest();

    var idPrestarSala = document.getElementById("idPrestarSalaM").value;
    var idSala = document.getElementById("idSalaM").value;
    var fecha = document.getElementById("fechaM").value;
    var hora = document.getElementById("horaM").value;
    var idTiempo_Dia = document.getElementById("idTiempo_DiaM").value;
    var idUsuario = document.getElementById("idUsuarioM").value;
    var elegir = "modificar_PrestarSala";

    var formData = new FormData();
    formData.append('idPrestarSala', idPrestarSala);
    formData.append('idSala', idSala);
    formData.append('fecha', fecha);
    formData.append('hora', hora);
    formData.append('idTiempo_Dia', idTiempo_Dia);
    formData.append('idUsuario', idUsuario);
    formData.append('elegir', elegir);

    xhr.open("POST", url, true);
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var response = JSON.parse(xhr.responseText);
            alert(response.message);
            
            ListarTabla();
            document.getElementById("idPrestarSalaM").value = "";
            limpiar('modificar');
            Cerrar('modificar');
        } else {
            console.error('Error al realizar la solicitud');
        }
    };
    xhr.onerror = function() {
        console.error('Error de red al realizar la solicitud');
    };
    xhr.send(formData);
});

document.getElementById("FormAgregar").addEventListener("submit", function(event) {
    event.preventDefault();

    var xhr = new XMLHttpRequest();

    var idPrestarSala = document.getElementById("idPrestarSalaA").value;
    var idSala = document.getElementById("idSalaA").value;
    var fecha = document.getElementById("fechaA").value;
    var hora = document.getElementById("horaA").value;
    var idTiempo_Dia = document.getElementById("idTiempo_DiaA").value;
    var idUsuario = document.getElementById("idUsuarioA").value;
    var elegir = "registrar_prestar_sala";

    var formData = new FormData();
    formData.append('idPrestarSala', idPrestarSala);
    formData.append('idSala', idSala);
    formData.append('fecha', fecha);
    formData.append('hora', hora);
    formData.append('idTiempo_Dia', idTiempo_Dia);
    formData.append('idUsuario', idUsuario);
    formData.append('elegir', elegir);

    xhr.open("POST", url, true);
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var response = JSON.parse(xhr.responseText);
            alert(response.message);
            
            ListarTabla();
            limpiar('agregar');
            Cerrar('agregar');
        } else {
            console.error('Error al realizar la solicitud');
        }
    };
    xhr.onerror = function() {
        console.error('Error de red al realizar la solicitud');
    };
    xhr.send(formData);
});

function obtenerParametroURL(nombre) {
    var parametrosURL = new URLSearchParams(window.location.search);
    return parametrosURL.get(nombre);
}

function filtrarClaveModificar(event) {
    soloLetrasNumeros(event);
    BuscarClaveModificar();
}
