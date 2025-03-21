<?php
// Establecer la conexión con la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$database = "SICC";
$puerto = 3307;

$conexion = new mysqli($servername, $username, $password, $database, $puerto);

// Verificar la conexión
if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}
?>