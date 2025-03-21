<?php
// Verificar si se recibieron los datos del formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Variables para la conexión a la base de datos
    $servidor = "localhost";
    $usuario = "root"; // Por defecto, en WampServer el usuario root no tiene contraseña
    $contraseña = "1234";
    $basedatos = "PrestamoSentroComputo";

    // Crear conexión
    $conexion = new mysqli($servidor, $usuario, $contraseña, $basedatos);

    // Verificar si la conexión fue exitosa
    if ($conexion->connect_error) {
        die("Conexión fallida: " . $conexion->connect_error);
    }

    // Obtener los datos del formulario
    $idPrestarSala = $_POST["idPrestarSala"];
    $idSala = $_POST["idSala"];
    $fecha = $_POST["fecha"];
    $hora = $_POST["hora"];
    $idTiempo_Dia = $_POST["idTiempo_Dia"];
    $idUsuario = $_POST["idUsuario"];

    // Consulta SQL para actualizar los datos de la sala
    $sql = "UPDATE prestarsala SET idSala=?, fecha=?, hora=?, idTiempo_Dia=?, idUsuario=? WHERE idPrestarSala=?";

    // Preparar la consulta SQL
    $stmt = $conexion->prepare($sql);
    if ($stmt === false) {
        die("Prepare failed: " . htmlspecialchars($conexion->error));
    }

    // Vincular los parámetros con los valores obtenidos del formulario
    $stmt->bind_param("issiii", $idSala, $fecha, $hora, $idTiempo_Dia, $idUsuario, $idPrestarSala);

    // Ejecutar la consulta SQL
    if ($stmt->execute()) {
        $response['message'] = "Sala actualizada correctamente";
    } else {
        $response['error'] = "Error al actualizar sala: " . $stmt->error;
    }

    // Cerrar la declaración y la conexión
    $stmt->close();
    $conexion->close();

    // Enviar respuesta como JSON
    header('Content-Type: application/json');
    echo json_encode($response);
} else {
    echo "No se recibieron datos del formulario";
}
?>
