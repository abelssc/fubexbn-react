<?php
require('./Global.php');

$MES_SEL=$_POST['MES_SEL'];
$DNI_CLIENTE=$_POST['DNI_CLIENTE'];
$NOMBRE_CLIENTE=$_POST['NOMBRE_CLIENTE'];
$CORREO=$_POST['CORREO'];
$TELEFONO1=$_POST['TELEFONO1'];
$TELEFONO2=$_POST['TELEFONO2'];
$CANAL=$_POST['CANAL'];
$honeypot=$_POST['honeypot'];
$timestamp=$_POST['timestamp'];
$PRODUCTO=$_POST['PRODUCTO'];
$OFICINA=$_POST['OFICINA'];
$ESTADO_REGISTRO=$_POST['ESTADO_REGISTRO'];
$MONTO=$_POST['MONTO'];
$PLAZO=$_POST['PLAZO'];
$TASA=$_POST['TASA'];
$archivo_nuevo_M=$_POST['archivo_nuevo_M'];
$TITULO_M=$_POST['TITULO_M'];
$OBSERVACION=$_POST['OBSERVACION'];
$captcha_respuesta=$_POST['captcha_respuesta'];


if(!$captcha_respuesta){
    echo $captcha_incorrecto;
    exit;
}
$legend10='No se pueden ingresar registros en días feriados.';
$legend11='No se pueden ingresar registros los domingos.';
$legend12='<strong>Solo se pueden registrar clientes entre las 7am y 8pm</strong>';
//REGISTRADO CON EXITO
//ESTO NO SE IMPRIME DEBEMOS VER COMO HACERLO EN EL FRONTEND
$legend1=<<<HTML
    <script language='JavaScript'>var uno = document.getElementById('bt_grabar_Coti');uno.innerHTML = 'Registrar'; </script><!--<input class="btn btn-info" type="button" value="Finalizar y enviar correo" onclick="javascript:window.open('../general/mail_cotizacion.php?ID_COT=1359449','','width=600,height=400,left=50,top=50,toolbar=yes');" />-->

    <script language='JavaScript'>var inputcot = document.getElementById('id_coti');inputcot.value = '1359449'; </script><script>
        swal('Se registró con éxito!', 'Ahora puedes actualizar su estatus o revisarlo en tu lista de ventas', {
            icon: 'success',
            buttons: {        			
                confirm: {
                    className: 'btn btn-success'
                }
            },
        }).then(() => {
            location.reload(); // Recarga la página
        });
    </script>
HTML;
//YA SE ENCUENTRA REGISTRADO POR LA MISMA PERSONA
$legend2=<<<HTML
    Estimado JUDHY MIXSHILY ROMERO VALDERRAMA , Este cliente (31682893) que esta intentando guardar ya se encuentra registrado el 2025-05-02 19:43:33, y según nuestros registros en el sumarizado de _2025_05, tú eres el ejecutivo de venta asociado a este cliente. 
HTML;
//LO REGISTRO OTRA PERSONA
$legend3=<<<HTML
    Estimado JUDHY MIXSHILY ROMERO VALDERRAMA  , Observamos que este cliente (40603335) que esta intentando registrar ya está registrado el 2025-05-02 08:47:07, pero según nuestros registros en el sumarizado de _2025_05, no estás designado como el ejecutivo de venta asociado a este cliente. Si consideras que ha habido un error o que debes tener el registro de este cliente, te recomendamos que te comuniques con tu supervisor y proporciones la evidencia que respalde tu reclamo. Tu supervisor podrá ayudarte a revisar y corregir cualquier discrepancia en la asignación de clientes. 
HTML;

if($DNI_CLIENTE==='12345678'){
    echo $legend2;
    exit;
}else{
    echo $legend1;
    exit;
}