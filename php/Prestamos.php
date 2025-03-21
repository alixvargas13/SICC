<?php
    include_once 'conexion.php';
    $elegir = $_POST['elegir'];

    switch ($elegir) {
        case 'mostrar_datos':
            $buscar = $_POST['txtBuscador'];
            
            if ($buscar != "") {
                $sql = "SELECT * FROM Prestar 
                        WHERE idPrestar LIKE '%$buscar%' 
                        OR idUsuario LIKE '%$buscar%' 
                        OR idExistencia LIKE '%$buscar%' 
                        OR fechaHora LIKE '%$buscar%' 
                        OR cantidad LIKE '%$buscar%'";
            } else {
                $sql = "SELECT * FROM Prestar";
            }
            $resultado = $conexion->query($sql);

            $prestamos = array();
            if ($resultado->num_rows > 0) {
                while ($fila = $resultado->fetch_assoc()) {
                    $prestamos[] = $fila;
                }
            }

            echo json_encode($prestamos);
            break;

        case 'registrar_Prestamo':
            $idUsuario = $_POST['idUsuario'];
            $idExistencia = $_POST['idExistencia'];
            $fechaHora = $_POST['fechaHora'];
            $cantidad = $_POST['cantidad'];

            $sql = "INSERT INTO Prestar (idUsuario, idExistencia, fechaHora, cantidad) 
                    VALUES (?, ?, ?, ?)";
            
            $stmt = $conexion->prepare($sql);
            $stmt->bind_param("sssi", $idUsuario, $idExistencia, $fechaHora, $cantidad);

            if ($stmt->execute()) {
                $response['message'] = "Prestamo registrado exitosamente";
            } else {
                $response['error'] = "Error al registrar prestamo: " . $conexion->error;
            }
            echo json_encode($response);
            break;
        case 'listar_solicitantes':
            $sql = "SELECT idUsuario, nombre FROM Usuario";
            $resultado = $conexion->query($sql);

            $solicitantes = array();
            if ($resultado->num_rows > 0) {
                while ($fila = $resultado->fetch_assoc()) {
                    $solicitantes[] = $fila;
                }
            }

            echo json_encode($solicitantes);
            break;
        case 'listar_existencias':
            $sql = "SELECT idExistencia, nombre FROM Existencia";
            $resultado = $conexion->query($sql);

            $existencias = array();
            if ($resultado->num_rows > 0) {
                while ($fila = $resultado->fetch_assoc()) {
                    $existencias[] = $fila;
                }
            }

            echo json_encode($existencias);
            break;
        case 'devolver_equipo':
            try {
                // Recolectar datos del POST
                if (isset($_POST['matricula'])) {
                    $matricula = $_POST['matricula'];
            
                    // Obtener idPrestar correspondiente a la matricula
                    $sql = "SELECT idPrestar FROM Prestar WHERE idUsuario = ?";
                    $stmt = $conexion->prepare($sql);
                    if (!$stmt) {
                        throw new Exception("Error preparando la consulta: " . $conexion->error);
                    }
            
                    $stmt->bind_param("s", $matricula);
                    $stmt->execute();
                    $result = $stmt->get_result();
            
                    if ($result->num_rows > 0) {
                        $row = $result->fetch_assoc();
                        $idPrestar = $row['idPrestar'];
            
                        // Insertar en la tabla Devolver
                        $cantidad = 1; // Ajusta la cantidad según sea necesario
            
                        $sqlInsert = "INSERT INTO Devolver (idPrestar, fechaHora, cantidad) VALUES (?, NOW(), ?)";
                        $stmtInsert = $conexion->prepare($sqlInsert);
                        if (!$stmtInsert) {
                            throw new Exception("Error preparando la consulta de inserción: " . $conexion->error);
                        }
            
                        $stmtInsert->bind_param("ii", $idPrestar, $cantidad);
                        
                        if ($stmtInsert->execute()) {
                            $response['message'] = "Devuelto exitosamente";
                        } else {
                            $response['error'] = "Error al registrar prestamo: " . $conexion->error;
                        }
                        echo json_encode($response);
                    } else {
                        throw new Exception("No se encontró el préstamo para la matrícula proporcionada");
                    }
                } else {
                    throw new Exception("Matrícula no proporcionada");
                }
            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage(), "\n";
            }
            break;
    }

    $conexion->close();
?>
