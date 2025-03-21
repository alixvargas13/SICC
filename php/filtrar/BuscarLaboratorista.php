<?php
    $servidor = "localhost";
    $usuario = "root"; // Por defecto, en WampServer el usuario root no tiene contraseña
    $contraseña = "1234";
    $basedatos = "PrestamoSentroComputo";

    $conexion = new mysqli($servidor, $usuario, $contraseña, $basedatos);

    if ($conexion->connect_error) {
        die("Conexión fallida: " . $conexion->connect_error);
    }

    $buscar = $_POST['txtBuscador'];

    
    if($buscar!=""){
        $sql = "SELECT * FROM LaboratoristaAdministrador
                WHERE claveLA like '%$buscar%' or nombre like '%$buscar%' or apellido1 like '%$buscar%' or apellido2 like '%$buscar%' or correo like '%$buscar%'";
    }else{
        $sql = "SELECT * FROM LaboratoristaAdministrador";
    }
    $resultado = $conexion->query($sql);

    // Crear un array para almacenar los datos
    $solicitantes = array();

    // Recorrer los resultados y almacenarlos en el array
    if ($resultado->num_rows > 0) {
        while($fila = $resultado->fetch_assoc()) {
            $solicitantes[] = $fila;
        }
    }

    // Enviar los datos como JSON
    echo json_encode($solicitantes);

    // Cerrar la conexión
    $conexion->close();
?>
