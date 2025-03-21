<?php
include_once 'conexion.php';
require '../vendor/autoload.php';

use PhpOffice\PhpWord\TemplateProcessor;
use PhpOffice\PhpWord\IOFactory;
use Dompdf\Dompdf;
use Dompdf\Options;

try {
    // Recolectar datos del formulario
    $idPrestar = $_POST['idPrestar'];

    // Obtener datos de la base de datos
    $sql = "SELECT 
                p.fechaHora AS fecha, 
                u.nombre AS nombreS, 
                u.apellido1 AS apellido1U, 
                u.apellido2 AS apellido2U, 
                e.idExistencia, 
                e.nombre AS nombreE 
            FROM Prestar p
            JOIN Usuario u ON p.idUsuario = u.idUsuario
            JOIN Existencia e ON p.idExistencia = e.idExistencia
            WHERE p.idPrestar = ?";
    
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $idPrestar);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $data = $result->fetch_assoc();
    } else {
        throw new Exception("No data found for idPrestar: $idPrestar");
    }

    // Ruta correcta del archivo template.docx
    $templatePath = '../templates/formato.docx'; // Asegúrate de que la ruta sea correcta

    // Cargar la plantilla de Word
    if (!file_exists($templatePath)) {
        throw new Exception("Template file not found: $templatePath");
    }
    $templateProcessor = new TemplateProcessor($templatePath);

    // Reemplazar los marcadores de posición con los datos del formulario
    $templateProcessor->setValue('{fecha}', htmlspecialchars($data['fecha'], ENT_QUOTES, 'UTF-8'));
    $templateProcessor->setValue('{nombreS}', htmlspecialchars($data['nombreS'], ENT_QUOTES, 'UTF-8'));
    $templateProcessor->setValue('{apellido1U}', htmlspecialchars($data['apellido1U'], ENT_QUOTES, 'UTF-8'));
    $templateProcessor->setValue('{apellido2U}', htmlspecialchars($data['apellido2U'], ENT_QUOTES, 'UTF-8'));
    $templateProcessor->setValue('{idExistencia}', htmlspecialchars($data['idExistencia'], ENT_QUOTES, 'UTF-8'));
    $templateProcessor->setValue('{nombreE}', htmlspecialchars($data['nombreE'], ENT_QUOTES, 'UTF-8'));

    // Guardar el documento modificado temporalmente como un archivo DOCX
    $tempDocx = 'temp.docx';
    $templateProcessor->saveAs($tempDocx);

    // Convertir el archivo DOCX a HTML
    $phpWord = IOFactory::load($tempDocx);
    $htmlWriter = IOFactory::createWriter($phpWord, 'HTML');
    ob_start();
    $htmlWriter->save('php://output');
    $htmlContent = ob_get_clean();

    // Guardar el HTML generado en un archivo temporal para depuración
    file_put_contents('temp.html', $htmlContent);

    // Configurar Dompdf
    $options = new Options();
    $options->set('isHtml5ParserEnabled', true);
    $options->set('isRemoteEnabled', true);
    $dompdf = new Dompdf($options);

    // Cargar el contenido HTML en Dompdf
    $dompdf->loadHtml($htmlContent);

    // (Opcional) Configurar el tamaño y la orientación del papel
    $dompdf->setPaper('A4', 'portrait');

    // Renderizar el contenido HTML como PDF
    $dompdf->render();

    // Obtener el contenido del PDF generado
    $pdfContent = $dompdf->output();

    // Enviar el PDF generado como respuesta
    header('Content-Type: application/pdf');
    header('Content-Disposition: inline; filename="generated_document.pdf"');
    echo $pdfContent;

    // Eliminar el archivo temporal DOCX
    unlink($tempDocx);
} catch (Exception $e) {
    echo 'Caught exception: ',  $e->getMessage(), "\n";
}
?>
