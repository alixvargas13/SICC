<?php
session_start();
//include 'conexion.php'; // Incluye tu archivo de conexión a la base de datos
include_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $idLaboratorista = $_POST['idLaboratorista'];
    $contraseña = $_POST['contraseña'];

    // Consulta SQL para verificar la clave y la contraseña
    $sql = "SELECT * FROM Laboratorista WHERE idLaboratorista = ? AND contraseña = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("ss", $idLaboratorista, $contraseña);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Si se encuentra el usuario, iniciar sesión
        $_SESSION['idLaboratorista'] = $idLaboratorista;
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }
}
?>