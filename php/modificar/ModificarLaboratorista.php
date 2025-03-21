<?php
    // Verificar si se recibieron los datos del formulario
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Variables para la conexión a la base de datos
        $servidor = "localhost";
        $usuario = "root"; // Por defecto, en WampServer el usuario root no tiene contraseña
        $contraseña = "1234";
        $basedatos = "PrestamoSentroComputo";

        // Crear conexión
        $conexion = new mysqli($servidor, $usuario, $contraseña, $basedatos);

        // Verificar si la conexión fue exitosa
        if ($conexion->connect_error) {
            die("Conexión fallida: " . $conexion->connect_error);
        }

        // Obtener los datos del formulario
        $claveLA = $_POST["claveLA"];
        $nombre = $_POST["nombre"];
        $apellido1 = $_POST["apellido1"];
        $apellido2 = $_POST["apellido2"];
        $correo = $_POST["correo"];
        $contraseña = $_POST["contraseña"];

        // Consulta SQL para actualizar los datos del solicitante
        $sql = "UPDATE LaboratoristaAdministrador SET nombre='$nombre', apellido1='$apellido1', apellido2='$apellido2', correo='$correo', contraseña='$contraseña' WHERE claveLA='$claveLA'";

        // Ejecutar la consulta SQL
        if ($conexion->query($sql) === TRUE) {
            $response['message'] = "Solicitante actualizado correctamente";
        } else {
            $response['error'] = "Error al actualizar solicitante: " . $conexion->error;
        }

        // Cerrar conexión
        $conexion->close();

        // Enviar respuesta como JSON
        header('Content-Type: application/json');
        echo json_encode($response);
    } else {
        echo "No se recibieron datos del formulario";
    }
?>