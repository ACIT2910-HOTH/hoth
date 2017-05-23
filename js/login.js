$(document).ready(function() {
    var register = document.getElementById("get_register");
    var regDiv = document.getElementById("register");
    var signInDiv = document.getElementById("sign_in");
    var signIn = document.getElementById("get_sign_in");
    
    var loginPass = document.getElementById("lpassword");
    var loginEmail = document.getElementById("lemail");
    var loginSubmit = document.getElementById("lsubmit")
    var firstName = document.getElementById("fname");
    var lastName = document.getElementById("lname");
    var regPass = document.getElementById("rpassword");
    var regEmail = document.getElementById("remail");
    var regSubmit = document.getElementById("rsubmit");
	var loginDiv = document.getElementById("login");
	var logoutDiv = document.getElementById("logout");
	var profileDiv = document.getElementById("profile_link");
    
	//initial
	/*profileDiv.style.display = "none";
	logoutDiv.style.display = "none";
	loginDiv.style.display = "none";*/
    
    /*regSubmit.addEventListener("click", function() {
        $.ajax({
            url:"/register",
            type:"post",
            data:{
                pass:regPass.value,
                email:regEmail.value,
                fname:firstName.value,
                lname:lastName.value
            },
            success:function(resp) {
            }
        });
    });
    
    loginSubmit.addEventListener("click", function() {
        $.ajax({
            url:"/login",
            type:"post",
            data:{
                email:loginEmail.value,
                pass:loginPass.value
            },
            success:function(resp) {
                location.href="/";
            }
        });
    }); */
    
    register.addEventListener("click", function() {
        regDiv.style.display = "inline";
        signInDiv.style.display = "none";
		logoutDiv.style.display = "none";
		profileDiv.style.display = "none";
		loginDiv.style.display = "none";
    });
    
    signIn.addEventListener("click", function() {
        regDiv.style.display = "none";
        signInDiv.style.display = "inline";
		logoutDiv.style.display = "none";
		profileDiv.style.display = "none";
		loginDiv.style.display = "none";
    });
});