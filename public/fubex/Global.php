<?php
// Establecer cabecera JSON
// Permitir solicitudes desde tu frontend en localhost
header("Access-Control-Allow-Origin: http://localhost:5173"); // Cambia esto en producción
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
// header('Content-Type: application/json');

$captcha_incorrecto='Captcha incorrecto. Vuelve a intentarlo.';