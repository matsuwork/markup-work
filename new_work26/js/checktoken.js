document.addEventListener('DOMContentLoaded',function(){
    if(!localStorage.getItem('token')){
        location.href="login.html";
    }
},false);
