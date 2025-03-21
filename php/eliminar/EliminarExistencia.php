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

    if(isset($_GET['idExistencia']) && !empty($_GET['idExistencia'])) {
        $idExistencia = $_GET['idExistencia'];
        
        $sql = "DELETE FROM Existencia WHERE idExistencia='$idExistencia'";
        
        if ($conexion->query($sql) === TRUE) {
            $response['message'] = "Laboratorista con ID: $idExistencia eliminado correctamente";
        } else {
            $response['error'] = "Error al eliminar solicitante: " . $conexion->error;
        }
    } else {
        $response['error'] = "ID no proporcionado";
    }

    echo json_encode($response);
    $conexion->close();

?>