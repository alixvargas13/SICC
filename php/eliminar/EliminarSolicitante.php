<?php
    $servidor = "localhost";
    $usuario = "root"; // Por defecto, en WampServer el usuario root no tiene contraseña
    $contraseña = "1234";
    $basedatos = "PrestamoSentroComputo";

    $conexion = new mysqli($servidor, $usuario, $contraseña, $basedatos);

    if ($conexion->connect_error) {
        die("Conexión fallida: " . $conexion->connect_error);
    }
    
    $response = array();

    if(isset($_GET['claveSolicitante']) && !empty($_GET['claveSolicitante'])) {
        $clave = $_GET['claveSolicitante'];
        
        $sql = "DELETE FROM Solicitante WHERE claveSolicitante='$clave'";
        
        if ($conexion->query($sql) === TRUE) {
            $response['message'] = "Solicitante con ID: $clave eliminado correctamente";
        } else {
            $response['error'] = "Error al eliminar solicitante: " . $conexion->error;
        }
    } else {
        $response['error'] = "ID no proporcionado";
    }

    echo json_encode($response);
    $conexion->close();

?>
