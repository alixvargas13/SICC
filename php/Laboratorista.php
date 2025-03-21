<?php
    include_once 'conexion.php';
    $elegir = $_POST['elegir'];

    switch ($elegir) {
        case 'mostrar_datos':
            $buscar = $_POST['txtBuscador'];
            
            
            if($buscar!=""){
                $sql = "SELECT idLaboratorista, nombre, apellidoP, apellidoM, correo, contraseña
                        from Laboratorista 
                        WHERE (idLaboratorista like '%$buscar%' or nombre like '%$buscar%' 
                        or apellidoP like '%$buscar%' or apellidoM like '%$buscar%' or correo like '%$buscar%') and esAdmin = 0";
            }else{
                $sql = "SELECT idLaboratorista, nombre, apellidoP, apellidoM, correo, contraseña
                        from Laboratorista WHERE esAdmin = 0" ;
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
                $idLaboratorista = $_POST['idLaboratorista'];
                $sql = "DELETE FROM Laboratorista WHERE idLaboratorista = ?";
                $stmt = $conexion->prepare($sql);
                $stmt->bind_param("s", $idLaboratorista);
                if ($stmt->execute()) {
                    $response['message'] = "Laboratorista con ID: $idLaboratorista eliminada correctamente";
                } else {
                    $response['error'] = "Error al eliminar laboratorista: " . $conexion->error;
                }
            } else {
                $response['error'] = "Método de solicitud no válido";
            }
            echo json_encode($response);
            
            break;
        case 'registrar_Laboratorista':
            // Obtener los valores del formulario
            $idLaboratorista = isset($_POST['idLaboratorista']) ? $_POST['idLaboratorista'] : '';
            $nombre = isset($_POST['nombre']) ? $_POST['nombre'] : '';
            $apellidoP = isset($_POST['apellido1']) ? $_POST['apellido1'] : '';
            $apellidoM = isset($_POST['apellido2']) ? $_POST['apellido2'] : '';
            $correo = isset($_POST['correo']) ? $_POST['correo'] : '';
            $contraseña = isset($_POST['contraseña']) ? $_POST['contraseña'] : '';

            // Si $esAdmin siempre debe ser true (asumo que `esAdmin` representa si es un administrador)
            $esAdmin = 0;

            // Imagen (opcional, solo si la manejas en tu formulario)
            $imagen = NULL;
            if (isset($_FILES['imagen']) && $_FILES['imagen']['size'] > 0) {
                $imagen = file_get_contents($_FILES['imagen']['tmp_name']);
            }

            // Preparar la consulta SQL para insertar los datos
            $sql = "INSERT INTO Laboratorista (idLaboratorista, nombre, apellidoP, apellidoM, correo, contraseña, esAdmin, imagen) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

            // Preparar la declaración SQL
            $stmt = $conexion->prepare($sql);

            if ($stmt === false) {
                die('Prepare failed: ' . htmlspecialchars($conexion->error));
            }

            // Vincular los parámetros con los valores obtenidos del formulario
            if ($imagen !== NULL) {
                $stmt->bind_param("isssssib", $idLaboratorista, $nombre, $apellidoP, $apellidoM, $correo, $contraseña, $esAdmin, $imagen);
            } else {
                $stmt->bind_param("isssssis", $idLaboratorista, $nombre, $apellidoP, $apellidoM, $correo, $contraseña, $esAdmin, $imagen);
            }

            // Ejecutar la consulta
            $response = [];
            if ($stmt->execute()) {
                // Si la consulta se ejecuta con éxito, enviar un mensaje de éxito
                $response['message'] = "Registro exitoso en la tabla Laboratorista";
            } else {
                // Si hay algún error, enviar un mensaje de error
                $response['error'] = "Error al registrar en la tabla Laboratorista: " . $stmt->error;
            }

            // Devolver la respuesta como JSON
            echo json_encode($response);
            break;
        case 'buscar_idLaboratorista':
            $idLaboratorista = $_POST['idLaboratorista'];

            $sql = "SELECT * FROM Laboratorista WHERE idLaboratorista = ?";

            // Preparar la consulta
            $stmt = $conexion->prepare($sql);

            // Asociar parámetros
            $stmt->bind_param("s", $idLaboratorista);

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
            break;
        case 'modificar_Laboratorista':
            // Obtener los datos del formulario
            $idLaboratorista = $_POST["idLaboratorista"];
            $nombre = $_POST["nombre"];
            $apellidoP = $_POST["apellido1"];
            $apellidoM = $_POST["apellido2"];
            $correo = $_POST["correo"];
            $contraseña = $_POST["contraseña"];
            // Consulta SQL para actualizar los datos del solicitante
            $sql = "UPDATE Laboratorista SET nombre='$nombre', apellidoP='$apellidoP', apellidoM='$apellidoM', correo='$correo', contraseña='$contraseña' 
                    WHERE idLaboratorista='$idLaboratorista'";

            // Ejecutar la consulta SQL
            if ($conexion->query($sql) === TRUE) {
                $response['message'] = "Solicitante actualizado correctamente";
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
