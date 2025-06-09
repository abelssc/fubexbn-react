<?php
require('./Global.php');
$val_CAPTCHA=$_POST['val_CAPTCHA'];
$val_DNI=$_POST['val_DNI'];


//YA REGISTRADO
$legend1=<<<HTML
    <script language='JavaScript'>
        document.getElementById('NOMBRE_CLIENTE').value = '';
        document.getElementById('CORREO').value = '';
        document.getElementById('TELEFONO1').value = '';
        document.getElementById('TELEFONO2').value = '';
        document.getElementById('MONTO').value = '';
    </script>
    <b>
        <p class='text-danger'>Info del sumarizado: Estimad@ FERNANDA CUZQUEN CALLE , Observamos que este cliente (40139859) que esta buscando ya está registrado el 2025-06-06 17:54:24, pero según nuestros registros en el sumarizado de _2025_06, no estás designado como el ejecutivo de venta asociado a este cliente. Si consideras que ha habido un error o que debes tener el registro de este cliente, te recomendamos que te dirijas a la sección de reclamos de clientes y proporciones la evidencia que respalde tu reclamo. </p>
    </b>
HTML;
//DISPONIBLE
$legend2=<<<HTML
    <script language='JavaScript'>
        document.getElementById('NOMBRE_CLIENTE').value = '';
        document.getElementById('CORREO').value = '';
        document.getElementById('TELEFONO1').value = '';
        document.getElementById('TELEFONO2').value = '';
        document.getElementById('MONTO').value = '';
    </script>
    <strong>Info del sumarizado: Cliente (07220416) no registrado en sumarizado (_2025_06), SI PUEDES REGISTRARLO</strong>
    <br>
    Info base del banco: Cliente (07220416) no registrado en base brindada por el Banco (_2025_05) <script language='JavaScript'>
        document.getElementById('NOMBRE_CLIENTE').value = '';
        document.getElementById('CORREO').value = '';
        document.getElementById('TELEFONO1').value = '';
        document.getElementById('TELEFONO2').value = '';
        document.getElementById('MONTO').value = '';
    </script>
    <br>
HTML;


if(!$val_CAPTCHA){
    echo $captcha_incorrecto;
    exit;
}
if($val_DNI==='12345678'){
    echo $legend1;
    exit;
}

if($val_DNI){
    echo $legend2;
    exit;
}