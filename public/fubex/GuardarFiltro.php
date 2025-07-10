<?php
require('./Global.php');
$dni=$_POST['DNI_CLIENTE'];
$plazo=$_POST['PLAZO'];
$observaciones=$_POST['OBS_VENDEDOR'];
$captcha_respuesta2=$_POST['captcha_respuesta2'];


// cliente ya filtrado
$legend1=<<<HTML
    <b><p class='text-primary'>Estimad@ FERNANDA CUZQUEN CALLE, este cliente (40139859) con el plazo y monto indicado ya se encuentra filtrado el (06/06/2025 09:39:55)   
        </p></b><div class="card" style="background-color: #dff8d8;"><div class="card-body">  
        <table border="1" cellspacing="0" style="font-size: 10px;" cellpadding="5">
    <tr>
        <td><strong>DNI:</strong> 40139859</td>
        <td><strong>FECHA SOLICITUD:</strong> 06/06/2025 09:39:55</td>
    </tr>
    <tr>
        <td><strong>U. SOLICITUD:</strong> JUDHY MIXSHILY ROMERO VALDERRAMA </td>
        <td><strong>PLAZO:</strong> 60</td>
    </tr>
    <tr>
        <td><strong>OBS VENDEDOR:</strong> </td>
        <td><strong>FECHA FILTRO:</strong> 
        06/06/2025 09:50:03</td>
    </tr>
    <tr>
        <td><strong>U. FILTRO:</strong> AYRTON L</td>
        <td><strong>OBS FILTRADOR:</strong> </td>
    </tr>
    <tr>
        <td><strong>VALIDACIÓN:</strong> CORRECTO</td>
        <td><strong>OBS ERROR:</strong> </td>
    </tr>
    </table>
    <img src='../FILTROS_BOT/202506/20250606/20250606_095001_40139859_6017424_60.png'  width='100%'>  </div>    </div>  <strong>OTROS FILTROS ANTERIORES:</strong><br><br><div class="card" style="background-color: #dff8d8;"><div class="card-body">  
        <table border="1" cellspacing="0" style="font-size: 10px;" cellpadding="5">
    <tr>
        <td><strong>DNI:</strong> 40139859</td>
        <td><strong>FECHA SOLICITUD:</strong> 10/05/2025 09:50:57</td>
    </tr>
    <tr>
        <td><strong>U. SOLICITUD:</strong> TERESA JOHANA SANCHEZ JUAREZ</td>
        <td><strong>PLAZO:</strong> 60</td>
    </tr>
    <tr>
        <td><strong>OBS VENDEDOR:</strong> </td>
    <td><strong>FECHA FILTRO:</strong> 
        10/05/2025 09:57:50</td>
    </tr>
    <tr>
        <td><strong>U. FILTRO:</strong> AYRTON L</td>
        <td><strong>OBS FILTRADOR:</strong> </td>
    </tr>
    <tr>
        <td><strong>VALIDACIÓN:</strong> CORRECTO</td>
        <td><strong>OBS ERROR:</strong> </td>
    </tr>
    </table>
HTML;
// SE REGISTRO CON EXITO
$legend2=<<<HTML
    <script>
    swal('Se registró con éxito!', 'Ahora espere un momento', {
        icon: 'success',
        buttons: {        			
            confirm: {
                className: 'btn btn-success'
            }
        },
    }).then(() => {
        location.reload(); // Recarga la página
    });
    </script><strong>OTROS FILTROS ANTERIORES:</strong><br><br><div class="card" style="background-color: #e1d8f8;"><div class="card-body">  
        <table border="1" cellspacing="0" style="font-size: 10px;" cellpadding="5">
    <tr>
        <td><strong>DNI:</strong> 07220416</td>
        <td><strong>FECHA SOLICITUD:</strong> 07/06/2025 18:52:44</td>
    </tr>
    <tr>
        <td><strong>U. SOLICITUD:</strong> FERNANDA CUZQUEN CALLE</td>
        <td><strong>PLAZO:</strong> 60</td>
    </tr>
    <tr>
        <td><strong>OBS VENDEDOR:</strong> </td>
    <td><strong>FECHA FILTRO:</strong> 
        </td>
    </tr>
    <tr>
        <td><strong>U. FILTRO:</strong> </td>
        <td><strong>OBS FILTRADOR:</strong> </td>
    </tr>
    <tr>
        <td><strong>VALIDACIÓN:</strong> </td>
        <td><strong>OBS ERROR:</strong> </td>
    </tr>
    </table>
    <strong>Aun no se filtra</strong>  </div>    </div>
HTML;
//DNI INCORRECTO
$legend3=<<<HTML
    <strong><p class='text-danger'>Error - DNI incorrecto</p></strong>
    HTML;
    //COLA
    $legend4=<<<HTML
    <strong>
        <p class='text-danger'>Como maximo la cola de espera es de 0 clientes. </p>
    </strong>
HTML;


if(!$captcha_respuesta2){
    echo $captcha_incorrecto;
    exit;
}
if(strlen($dni)!=8){
    echo $legend3;
    exit;
}
if($dni==='12345678'){
    echo $legend1;
    exit;
}

if($dni){
    echo $legend2;
    exit;
}

/** new aun no se filtra
 * <div class="row">
    <div class="col-md-12 ">
        <div class="border rounded p-3 shadow-sm" style="background-color: #e1d8f8;">
            <div class="row" id="bloque_0">
                <div class="col-md-6">
                    <strong>DNI:</strong>
                    09305065<br>
                </div>
                <div class="col-md-6">
                    <hr>
                </div>
            </div>
            <strong>Aún no se filtra</strong>
            <div class="mt-2 mb-3">
                <span class="text-muted" style="font-size: 12px; text-decoration: underline; cursor: pointer;" onclick="document.getElementById('info_0').classList.toggle('d-none')">Información de la solicitud</span>
                <div id="info_0" class="card card-body p-2 mt-2 d-none" style="font-size: 13px;">
                    <p style='margin:0'>
                        <strong>DNI:</strong>
                        09305065
                    </p>
                    <p style='margin:0'>
                        <strong>FECHA SOLICITUD:</strong>
                        2025-07-09 18:17:31
                    </p>
                    <p style='margin:0'>
                        <strong>USUARIO SOLICITUD:</strong>
                        VICTOR MARTIN ENRIQUE TUME BERMEO 
                    </p>
                    <p style='margin:0'>
                        <strong>PLAZO:</strong>
                        60 - <strong>MONTO:</strong>
                        99999
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
</div></div>

 */