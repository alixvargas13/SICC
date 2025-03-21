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
        $sql = "SELECT Existencia.idExistencia, TipoExistencia.nombre as nombreTipoExistencia, Existencia.nombre, Existencia.cantidad 
                from Existencia left join TipoExistencia on Existencia.idTipoExistencia=TipoExistencia.idTipoExistencia 
                WHERE idExistencia like '%$buscar%' or nombre like '%$buscar%'";
    }else{
        $sql = "SELECT Existencia.idExistencia, TipoExistencia.nombre as nombreTipoExistencia, Existencia.nombre, Existencia.cantidad 
                from Existencia left join TipoExistencia on Existencia.idTipoExistencia=TipoExistencia.idTipoExistencia";
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
