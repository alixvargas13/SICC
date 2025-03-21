<?php
    include_once 'conexion.php';
    $elegir = $_POST['elegir'];

    switch ($elegir) {
        case 'mostrar_datos':
            $buscar = $_POST['txtBuscador'];
            
            if($buscar!=""){
                $sql = "SELECT Existencia.idExistencia, TipoExistencia.nombre as 'nombreTipo', Existencia.nombre, Existencia.cantidad 
                        from Existencia left join TipoExistencia on Existencia.idTipoExistencia=TipoExistencia.idTipoExistencia
                        WHERE Existencia.idExistencia like '%$buscar%' or TipoExistencia.nombre like '%$buscar%' or Existencia.nombre like '%$buscar%' or Existencia.cantidad like '%$buscar%'";
            }else{
                $sql = "SELECT Existencia.idExistencia, TipoExistencia.nombre as 'nombreTipo', Existencia.nombre, Existencia.cantidad 
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
            break;
        
        case 'eliminar_datos':
            $response = array();

            if ($_SERVER["REQUEST_METHOD"] == "POST") {
                $idExistencia = $_POST['idExistencia'];
                $sql = "DELETE FROM Existencia WHERE idExistencia = ?";
                $stmt = $conexion->prepare($sql);
                $stmt->bind_param("s", $idExistencia);
                if ($stmt->execute()) {
                    $response['message'] = "Existencia con ID: $idExistencia eliminada correctamente";
                } else {
                    $response['error'] = "Error al eliminar existencia: " . $conexion->error;
                }
            } else {
                $response['error'] = "Método de solicitud no válido";
            }
            echo json_encode($response);
            
            break;
        case 'agregar_nombreTipo':
            $query = "SELECT idTipoExistencia, nombre FROM TipoExistencia";
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
        case 'registrar_existencia':
            // Obtener los valores del formulario
            $idExistencia = $_POST['idExistencia'];
            $idTipoExistencia = $_POST['tipo_existencia'];
            $cantidad = $_POST['cantidad'];
            $nombre = $_POST['nombre'];
            // Preparar la consulta SQL para insertar los datos
            $sql = "INSERT INTO Existencia (idExistencia, nombre, cantidad, idTipoExistencia) 
                    VALUES (?, ?, ?, ?)";
            
            // Preparar la declaración SQL
            $stmt = $conexion->prepare($sql);

            // Vincular los parámetros con los valores obtenidos del formulario
            $stmt->bind_param("ssii", $idExistencia, $nombre, $cantidad, $idTipoExistencia);

            // Ejecutar la consulta
            if ($stmt->execute()) {
                // Si la consulta se ejecuta con éxito, enviar un mensaje de éxito
                $response['message'] = "Existencia registrada exitosamente";
            } else {
                // Si hay algún error, enviar un mensaje de error
                $response['error'] = "Error al registrar existencia: " . $conexion->error;
            }
            // Devolver la respuesta como JSON
            echo json_encode($response);
            break;
        case 'buscar_idExistencia':
            $idExistencia = $_POST['idExistencia'];
            $sql = "SELECT * FROM Existencia WHERE idExistencia = ?";

            // Preparar la consulta
            $stmt = $conexion->prepare($sql);

            // Asociar parámetros
            $stmt->bind_param("s", $idExistencia);

            // Ejecutar la consulta
            $stmt->execute();

            // Obtener resultados
            $resultado = $stmt->get_result();

            // Crear un array para almacenar los datos
            $existencias = array();

            // Recorrer los resultados y almacenarlos en el array
            while ($fila = $resultado->fetch_assoc()) {
                $existencias[] = $fila;
            }

            // Enviar los datos como JSON
            echo json_encode($existencias);

            // Cerrar la conexión
            $stmt->close();
            break;
        case 'modificar_existencia':
            // Obtener los datos del formulario
            $idExistencia = $_POST['idExistencia'];
            $tipo = $_POST['tipo'];
            $cantidad = $_POST['cantidad'];
            $nombre = $_POST['nombre'];

            // Consulta SQL para actualizar los datos del solicitante
            $sql = "UPDATE Existencia SET idTipoExistencia='$tipo', nombre='$nombre', cantidad='$cantidad' WHERE idExistencia='$idExistencia'";

            // Ejecutar la consulta SQL
            if ($conexion->query($sql) === TRUE) {
                $response['message'] = "Existencia actualizada correctamente";
            } else {
                $response['error'] = "Error al actualizar existencia: " . $conexion->error;
            }
            // Enviar respuesta como JSON
            header('Content-Type: application/json');
            echo json_encode($response);
            break;
    }
    $conexion->close();  
?>
