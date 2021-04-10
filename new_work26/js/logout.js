function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.addEventListener('load', async function(){
    await timeout(3000);
    const body = document.querySelector('body')
    const button = document.createElement('button');
    button.classList.add('logout');
    button.textContent = 'Log out';
    button.addEventListener('click',function(){
        localStorage.clear();
        location.href="login.html";
    },false);
    body.insertBefore(button, body.firstChild)
},false);
