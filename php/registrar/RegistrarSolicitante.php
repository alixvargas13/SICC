<?php
    $servidor = "localhost";
    $usuario = "root"; // Por defecto, en WampServer el usuario root no tiene contraseña
    $contraseña = "1234";
    $basedatos = "PrestamoSentroComputo";

    $conexion = new mysqli($servidor, $usuario, $contraseña, $basedatos);

    if ($conexion->connect_error) {
        die("Conexión fallida: " . $conexion->connect_error);
    }

    $claveSolicitante = $_POST['claveSolicitante'];
    $nombre = $_POST['nombre'];
    $apellido1 = $_POST['apellido1'];
    $apellido2 = $_POST['apellido2'];
    $correo = $_POST['correo'];

    $sql = "INSERT INTO Solicitante (claveSolicitante, nombre, apellido1, apellido2, correo) VALUES ('$claveSolicitante', '$nombre', '$apellido1', '$apellido2', '$correo')";

    if ($conexion->query($sql) === TRUE) {
        $response['message'] =  "Solicitante registrado exitosamente";
    } else {
        $response['error'] =  "Error al registrar solicitante: " . $conexion->error;
    }

    $conexion->close();
    echo json_encode($response);
?>