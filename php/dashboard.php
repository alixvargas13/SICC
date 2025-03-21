<?php
session_start();

if (!isset($_SESSION['idLaboratorista'])) {
    header("Location: Solicitante.html"); // Redirige al inicio de sesión si no hay sesión iniciada
    exit();
}

// Contenido de la página protegida
echo "Bienvenido al Dashboard, " . $_SESSION['idLaboratorista'];
?>