<?php
$servidor = "localhost";
$usuario = "root";
$contraseña = "1234";
$basedatos = "PrestamoSentroComputo";

$conexion = new mysqli($servidor, $usuario, $contraseña, $basedatos);

if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

$claveSolicitante = $_POST['claveSolicitante'];

$sql = "SELECT * FROM Solicitante WHERE claveSolicitante = ?";

// Preparar la consulta
$stmt = $conexion->prepare($sql);

// Asociar parámetros
$stmt->bind_param("s", $claveSolicitante);

// Ejecutar la consulta
$stmt->execute();

// Obtener resultados
$resultado = $stmt->get_result();

// Crear un array para almacenar los datos
$solicitantes = array();

// Recorrer los resultados y almacenarlos en el array
while ($fila = $resultado->fetch_assoc()) {
    $solicitantes[] = $fila;
}

// Enviar los datos como JSON
echo json_encode($solicitantes);

// Cerrar la conexión
$stmt->close();
$conexion->close();
?>
