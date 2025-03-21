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

    if(isset($_GET['claveLA']) && !empty($_GET['claveLA'])) {
        $clave = $_GET['claveLA'];
        
        $sql = "DELETE FROM LaboratoristaAdministrador WHERE claveLA='$clave'";
        
        if ($conexion->query($sql) === TRUE) {
            $response['message'] = "Laboratorista con ID: $clave eliminado correctamente";
        } else {
            $response['error'] = "Error al eliminar solicitante: " . $conexion->error;
        }
    } else {
        $response['error'] = "ID no proporcionado";
    }

    echo json_encode($response);
    $conexion->close();

?>