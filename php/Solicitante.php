<?php
    include_once 'conexion.php';
    $elegir = $_POST['elegir'];
    
    switch ($elegir) {
        case 'mostrar_datos':
            $buscar = $_POST['txtBuscador'];
            
            if($buscar!=""){
                $sql = "SELECT idUsuario, idTipoUsuario, nombre, apellido1, apellido2, correo
                        from Usuario 
                        WHERE idUsuario like '%$buscar%' or nombre like '%$buscar%' or apellido1 like '%$buscar%' or apellido2 like '%$buscar%'";
            }else{
                $sql = "SELECT idUsuario, idTipoUsuario, nombre, apellido1, apellido2, correo
                        from Usuario";
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
            break;
        case 'agregar_TipoUsuario':
            $query = "SELECT idTipoUsuario, nombre FROM TipoUsuario";
            $resultado = mysqli_query($conexion, $query);

            // Verificar si la consulta fue exitosa
            if (!$resultado) {
                echo json_encode(array("error" => "Error al obtener datos de la tabla"));
                exit();
            }

            // Obtener los datos de la tabla y almacenarlos en un array
            $clientes = array();
            while ($fila = mysqli_fetch_assoc($resultado)) {
                $clientes[] = $fila;
            }

            // Devolver los datos como JSON
            echo json_encode($clientes);
            break;
        case 'eliminar_datos':
            $response = array();

            if ($_SERVER["REQUEST_METHOD"] == "POST") {
                $idUsuario = $_POST['idUsuario'];
                $sql = "DELETE FROM Usuario WHERE idUsuario = ?";
                $stmt = $conexion->prepare($sql);
                $stmt->bind_param("s", $idUsuario);
                if ($stmt->execute()) {
                    $response['message'] = "Existencia con ID: $idUsuario eliminada correctamente";
                } else {
                    $response['error'] = "Error al eliminar existencia: " . $conexion->error;
                }
            } else {
                $response['error'] = "Método de solicitud no válido";
            }
            echo json_encode($response);
            
            break;
        case 'registrar_Solicitante':
            // Obtener los valores del formulario
            $idUsuario = $_POST['idUsuario'];
            $idTipoUsuario = $_POST['idTipoUsuario'];
            $nombre = $_POST['nombre'];
            $apellido1 = $_POST['apellido1'];
            $apellido2 = $_POST['apellido2'];
            $correo = $_POST['correo'];
            // Preparar la consulta SQL para insertar los datos
            $sql = "INSERT INTO Usuario
             (idUsuario, idTipoUsuario, nombre, apellido1, apellido2, correo) 
                    VALUES (?, ?, ?, ?, ?, ?)";
            
            // Preparar la declaración SQL
            $stmt = $conexion->prepare($sql);

            // Vincular los parámetros con los valores obtenidos del formulario
            $stmt->bind_param("ssssss", $idUsuario, $idTipoUsuario, $nombre, $apellido1, $apellido2, $correo);

            // Ejecutar la consulta
            if ($stmt->execute()) {
                // Si la consulta se ejecuta con éxito, enviar un mensaje de éxito
                $response['message'] = "Solicitante registrado exitosamente";
            } else {
                // Si hay algún error, enviar un mensaje de error
                $response['error'] = "Error al registrar solicitante: " . $conexion->error;
            }
            $response['message'] = "Solicitante registrado exitosamente";
            // Devolver la respuesta como JSON
            echo json_encode($response);
            break;
        case 'buscar_claveSolicitante':
            $idUsuario = $_POST['idUsuario'];
            $sql = "SELECT * FROM Usuario WHERE idUsuario = ?";

            // Preparar la consulta
            $stmt = $conexion->prepare($sql);

            // Asociar parámetros
            $stmt->bind_param("s", $idUsuario);

            // Ejecutar la consulta
            $stmt->execute();

            // Obtener resultados
            $resultado = $stmt->get_result();

            // Crear un array para almacenar los datos
            $Solicitante = array();

            // Recorrer los resultados y almacenarlos en el array
            while ($fila = $resultado->fetch_assoc()) {
                $Solicitante[] = $fila;
            }

            // Enviar los datos como JSON
            echo json_encode($Solicitante);

            // Cerrar la conexión
            $stmt->close();
            break;
        case 'modificar_solicitante':
            // Obtener los datos del formulario
            $idUsuario = $_POST['idUsuario'];
            $idTipoUsuario = $_POST['idTipoUsuario'];
            $nombre = $_POST['nombre'];
            $apellido1 = $_POST['apellido1'];
            $apellido2 = $_POST['apellido2'];
            $correo = $_POST['correo'];

            // Consulta SQL para actualizar los datos del solicitante
            $sql = "UPDATE Usuario SET idTipoUsuario='$idTipoUsuario', nombre='$nombre', apellido1='$apellido1', apellido2='$apellido2', correo='$correo' WHERE idUsuario='$idUsuario'";

            // Ejecutar la consulta SQL
            if ($conexion->query($sql) === TRUE) {
                $response['message'] = "Solicitante actualizada correctamente";
            } else {
                $response['error'] = "Error al actualizar solicitante: " . $conexion->error;
            }
            // Enviar respuesta como JSON
            header('Content-Type: application/json');
            echo json_encode($response);
            break;
    }
    $conexion->close();  
?>

