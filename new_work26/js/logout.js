logoutButton = document.getElementById('js-logout');
logoutButton.addEventListener('click',function(){
    localStorage.clear();
    location.href="login.html";
},false);
