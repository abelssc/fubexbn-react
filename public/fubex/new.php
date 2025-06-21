<!DOCTYPE html>

<html lang="en">

<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<title>Login</title>
	<meta content='width=device-width, initial-scale=1.0, shrink-to-fit=no' name='viewport' />
	<link rel="icon" href="../img/icon.ico" type="image/x-icon"/>

	<!-- Fonts and icons -->
	<script src="../assets/js/plugin/webfont/webfont.min.js"></script>
	<script>
		WebFont.load({
			google: {"families":["Lato:300,400,700,900"]},
			custom: {"families":["Flaticon", "Font Awesome 5 Solid", "Font Awesome 5 Regular", "Font Awesome 5 Brands", "simple-line-icons"], urls: ['../assets/css/fonts.min.css']},
			active: function() {
				sessionStorage.fonts = true;
			}
		});
	</script>
	
	<!-- CSS Files -->
	<link rel="stylesheet" href="../assets/css/bootstrap.min.css">
	<link rel="stylesheet" href="../assets/css/atlantis.css">
</head>
    
    
    
    
    
    
<body class="login">
	<div class="wrapper wrapper-login wrapper-login-full p-0">
		
		
		
		<div class="login-aside w-100 d-flex align-items-center justify-content-center bg-white">
            
			<form name="login"  id="login" action="general/control_ingreso.php" method="post">
			<div class="container container-login container-transparent animated fadeIn">
                <center>
                <h1>FUVEX</h1>  
<!--					<img src="../img/LOGO.png" alt="navbar brand"  width="180px" class="navbar-brand">-->
                    <br>
                    <img src="../img/a355.png" alt="navbar brand"  width="60px" class="navbar-brand">
            </center>
<!--				<h3 class="text-center">Enter your credentials</h3>-->
                <br>
				<div class="login-form">
					<div class="form-group">
						<label for="username" class="placeholder"><b>Username</b></label>
						<input id="USUARIO" name="USUARIO" type="text" class="form-control" required>
					</div>
					<div class="form-group">
						<label for="password" class="placeholder"><b>Password</b></label>
<!--						<a href="#" class="link float-right">Forget Password ?</a>-->
						<div class="position-relative">
							<input id="password" name="password" type="password" class="form-control" required>
							<div class="show-password">
								<i class="icon-eye"></i>
							</div>
						</div>
					</div>
					<div class="form-group form-action-d-flex mb-3">
<!--
						<div class="custom-control custom-checkbox">
							<input type="checkbox" class="custom-control-input" id="rememberme">
							<label class="custom-control-label m-0" for="rememberme">Remember Me</label>
						</div>
-->
				<button type="submit" class="btn btn-primary col-md-5 float-right mt-3 mt-sm-0 fw-bold text-white" onclick="f_Cmb1();">
											<span class="btn-label">
												<i class="fa fa-bookmark"></i>
											</span>
											Sign In
										</button>
<!--						<a  class="btn btn-primary col-md-5 float-right mt-3 mt-sm-0 fw-bold text-white" onclick="f_Cmb1();">Sign In</a>-->
					</div>
<!--
					<div class="login-account">
						<span class="msg">Don't have an account yet ?</span>
						<a href="#" id="show-signup" class="link">Sign Up</a>
					</div>
-->
				</div>
			</div>

			 </form>	
		</div>
		
		
		
<!--		-->
			
	</div>
	<script src="../assets/js/core/jquery.3.2.1.min.js"></script>
	<script src="../assets/js/plugin/jquery-ui-1.12.1.custom/jquery-ui.min.js"></script>
	<script src="../assets/js/core/popper.min.js"></script>
	<script src="../assets/js/core/bootstrap.min.js"></script>
	<script src="../assets/js/atlantis.min.js"></script>
	
		<script></script>
	<script >
	

    document.onkeydown = function(e){
            var ev = document.all ? window.event : e;
            if(ev.keyCode==13) {
                alert("asdasd");
            }
        

</script>
	
	
	
	<script>
function copyToClipboard(elemento) {
  var $temp = $("<input>")
  $("body").append($temp);
  $temp.val($(elemento).text()).select();
  document.execCommand("copy");
  $temp.remove();
}	
	
		
		
function f_Cmb(){		
		document.login.action="general/control_ingreso.php";
		document.login.submit();
}

function f_Cmb1(){		
			document.login.action="general/control_ingreso.php";
		document.login.submit();
}
</script> 
</body>

<!-- Mirrored from themekita.com/demo-atlantis-bootstrap/livepreview/examples/demo1/login3.html by HTTrack Website Copier/3.x [XR&CO'2014], Thu, 03 Oct 2019 00:20:03 GMT -->
</html>