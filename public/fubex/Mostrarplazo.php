<?php
require('./Global.php');

$val_plazo=$_POST['val_plazo'];
$val_mes=$_POST['val_mes'];

if(!$val_plazo){
    echo '';
    exit;
}
if(!$val_mes){
    echo 
    <<<HTML
        <script language='JavaScript'>
            $('#TASA').empty();
        </script>
        <script language='JavaScript'>
            nuevaOpcion = new Option('Seleccione','');
            document.frm_seguimiento.TASA.options[0] = nuevaOpcion;
        </script>
    HTML;
    exit;
}
?>
<script language='JavaScript'>
    $('#TASA').empty();
</script>
<script language='JavaScript'>
    nuevaOpcion = new Option('Seleccione','');
    document.frm_seguimiento.TASA.options[0] = nuevaOpcion;
</script>
<script language='JavaScript'>
    nuevaOpcion = new Option('10','10');
    document.frm_seguimiento.TASA.options[1] = nuevaOpcion;
</script>
<script language='JavaScript'>
    nuevaOpcion = new Option('12.99','12.99');
    document.frm_seguimiento.TASA.options[2] = nuevaOpcion;
</script>