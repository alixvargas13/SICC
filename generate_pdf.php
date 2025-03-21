<?php
require 'vendor/autoload.php';

use PhpOffice\PhpWord\TemplateProcessor;
use PhpOffice\PhpWord\IOFactory;
use Dompdf\Dompdf;
use Dompdf\Options;

try {
    // Recolectar datos del formulario
    $name = isset($_POST['name']) ? $_POST['name'] : 'Default Name';
    $date = isset($_POST['date']) ? $_POST['date'] : '2024-01-01';

    // Ruta correcta del archivo template.docx
    $templatePath = 'templates/template.docx'; // Asegúrate de que la ruta sea correcta

    // Cargar la plantilla de Word
    if (!file_exists($templatePath)) {
        throw new Exception("Template file not found: $templatePath");
    }
    $templateProcessor = new TemplateProcessor($templatePath);

    // Reemplazar los marcadores de posición con los datos del formulario
    $templateProcessor->setValue('{name}', htmlspecialchars($name, ENT_QUOTES, 'UTF-8'));
    $templateProcessor->setValue('{date}', htmlspecialchars($date, ENT_QUOTES, 'UTF-8'));

    // Guardar el documento modificado temporalmente como un archivo DOCX
    $tempDocx = 'temp.docx';
    $templateProcessor->saveAs($tempDocx);

    // Convertir el archivo DOCX a HTML
    $phpWord = IOFactory::load($tempDocx);
    $htmlWriter = IOFactory::createWriter($phpWord, 'HTML');
    ob_start();
    $htmlWriter->save('php://output');
    $htmlContent = ob_get_clean();

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

    // Enviar el PDF generado al navegador
    $dompdf->stream('generated_document.pdf', ['Attachment' => 0]);

    // Eliminar el archivo temporal DOCX
    unlink($tempDocx);
} catch (Exception $e) {
    echo 'Caught exception: ',  $e->getMessage(), "\n";
}
?>
