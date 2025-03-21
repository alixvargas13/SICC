<?php
// Establecer la conexión con la base de datos
include_once '../conexion/conexion.php';

// Verificar si se recibieron los datos del formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener los datos del formulario
    $idLaboratorista = $_POST["idLaboratorista"];
    $contraseña = $_POST["contraseña"];

    // Consultar la base de datos para verificar las credenciales
    $sql = "SELECT * FROM Laboratorista WHERE idLaboratorista = '$idLaboratorista' AND contraseña = '$contraseña'";
    $result = $conexion->query($sql);

    if ($result->num_rows > 0) {
        // Las credenciales son válidas
        session_start();
        // Guardar información relevante en la sesión, como el nombre de usuario
        $_SESSION["usuario"] = $idLaboratorista;
        // Las credenciales son válidas
        $response = array("autenticado" => true);
        echo json_encode($response);
    } else {
        // Las credenciales son inválidas
        $response = array("autenticado" => false);
        echo json_encode($response);
    }
}

// Cerrar la conexión
$conexion->close();
?>