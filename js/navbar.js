$(document).ready(function() {
    $.ajax({
        url:"/user-cp",
        type:"post",
        success:function(resp) {
            var profileLink = document.getElementById("profile_link");
            var logoutLink = document.getElementById("logout_link");
            var loginLink = document.getElementById("login");
            
            if (resp == "customer") {
                profileLink.style.display = "inline";
                logoutLink.style.display = "inline";
            } else if (resp == "ea") {
                logoutLink.style.display = "inline";
                loginLink.style.display = "none";
                profileLink.style.display = "none";
            }
        }
    });
});