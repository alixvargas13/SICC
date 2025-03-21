<?php
session_start();

$response = array();

if (isset($_SESSION['idLaboratorista'])) {
    $response['loggedIn'] = true;
    $response['idLaboratorista'] = $_SESSION['idLaboratorista'];
} else {
    $response['loggedIn'] = false;
}

echo json_encode($response);
?>

