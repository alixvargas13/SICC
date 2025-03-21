<?php
$servidor = "localhost";
$usuario = "root";
$contraseña = "1234";
$basedatos = "PrestamoSentroComputo";

$conexion = new mysqli($servidor, $usuario, $contraseña, $basedatos);

if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

$elegir = $_POST['elegir'];
$response = array();

switch ($elegir) {
    case 'mostrar_datos_prestar_sala':
        $sql = "SELECT idPrestarSala, idSala, fecha, hora, idTiempo_Dia, idUsuario FROM prestarsala";
        $resultado = $conexion->query($sql);

        $prestar_salas = array();

        if ($resultado->num_rows > 0) {
            while ($fila = $resultado->fetch_assoc()) {
                $prestar_salas[] = $fila;
            }
        }

        echo json_encode($prestar_salas);
        break;
    
    case 'eliminar_datos_prestar_sala':
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $idPrestarSala = $_POST['idPrestarSala'];
            $sql = "DELETE FROM prestarsala WHERE idPrestarSala = ?";
            $stmt = $conexion->prepare($sql);
            $stmt->bind_param("i", $idPrestarSala);
            if ($stmt->execute()) {
                $response['message'] = "Prestar sala con ID: $idPrestarSala eliminada correctamente";
            } else {
                $response['error'] = "Error al eliminar prestar sala: " . $conexion->error;
            }
        } else {
            $response['error'] = "Método de solicitud no válido";
        }
        echo json_encode($response);
        break;

    case 'registrar_prestar_sala':
        $idSala = isset($_POST['idSala']) ? $_POST['idSala'] : '';
        $fecha = isset($_POST['fecha']) ? $_POST['fecha'] : '';
        $hora = isset($_POST['hora']) ? $_POST['hora'] : '';
        $idTiempo_Dia = isset($_POST['idTiempo_Dia']) ? $_POST['idTiempo_Dia'] : '';
        $idUsuario = isset($_POST['idUsuario']) ? $_POST['idUsuario'] : '';

        $sql = "INSERT INTO prestarsala (idSala, fecha, hora, idTiempo_Dia, idUsuario) VALUES (?, ?, ?, ?, ?)";

        $stmt = $conexion->prepare($sql);

        if ($stmt === false) {
            die('Prepare failed: ' . htmlspecialchars($conexion->error));
        }

        $stmt->bind_param("issii", $idSala, $fecha, $hora, $idTiempo_Dia, $idUsuario);

        if ($stmt->execute()) {
            $response['message'] = "Registro exitoso en la tabla prestarsala";
        } else {
            $response['error'] = "Error al registrar en la tabla prestarsala: " . $stmt->error;
        }

        echo json_encode($response);
        break;

    case 'buscar_idPrestarSala':
        $idPrestarSala = $_POST['idPrestarSala'];

        $sql = "SELECT * FROM prestarsala WHERE idPrestarSala = ?";

        $stmt = $conexion->prepare($sql);

        $stmt->bind_param("i", $idPrestarSala);

        $stmt->execute();

        $resultado = $stmt->get_result();

        $prestar_salas = array();

        while ($fila = $resultado->fetch_assoc()) {
            $prestar_salas[] = $fila;
        }

        echo json_encode($prestar_salas);

        $stmt->close();
        break;

    case 'modificar_PrestarSala':
        $idPrestarSala = $_POST["idPrestarSala"];
        $idSala = $_POST["idSala"];
        $fecha = $_POST["fecha"];
        $hora = $_POST["hora"];
        $idTiempo_Dia = $_POST["idTiempo_Dia"];
        $idUsuario = $_POST["idUsuario"];

        $sql = "UPDATE prestarsala SET idSala=?, fecha=?, hora=?, idTiempo_Dia=?, idUsuario=? WHERE idPrestarSala=?";

        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("issiii", $idSala, $fecha, $hora, $idTiempo_Dia, $idUsuario, $idPrestarSala);

        if ($stmt->execute()) {
            $response['message'] = "Prestar sala actualizado correctamente";
        } else {
            $response['error'] = "Error al actualizar prestar sala: " . $conexion->error;
        }

        echo json_encode($response);
        break;
}

$conexion->close();
?>
