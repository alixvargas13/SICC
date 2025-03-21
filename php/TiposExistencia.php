<?php
    $elegir = $_POST['elegir'];
    $idExistencia = $_POST['idExistencia'];
    $nombre = $_POST['nombre'];
    $cantidad = $_POST['cantidad'];
    $idTipoExistencia = $_POST['tipo'];
    $response['message'] = "idE: $idExistencia nombre: $nombre cantidad: $cantidad idT: $idTipoExistencia elegir: $elegir";

    echo json_encode($response);
?>