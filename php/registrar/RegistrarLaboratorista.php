<?php
$servidor = "localhost";
$usuario = "root"; // Por defecto, en WampServer el usuario root no tiene contraseña
$contraseña = "1234";
$basedatos = "PrestamoSentroComputo";

$conexion = new mysqli($servidor, $usuario, $contraseña, $basedatos);

if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

$claveLA = $_POST['claveLA'];
$nombre = $_POST['nombre'];
$apellido1 = $_POST['apellido1'];
$apellido2 = $_POST['apellido2'];
$correo = $_POST['correo'];
$contraseña = $_POST['contraseña'];

$sql = "INSERT INTO LaboratoristaAdministrador (claveLA, nombre, apellido1, apellido2, correo, contraseña, esLaboratorista) VALUES ('$claveLA', '$nombre', '$apellido1', '$apellido2', '$correo', '$contraseña', '1')";

if ($conexion->query($sql) === TRUE) {
    $response['message'] =  "Administrador registrado exitosamente";
} else {
    $response['error'] =  "Error al registrar administrador: " . $conexion->error;
}

$conexion->close();
echo json_encode($response);