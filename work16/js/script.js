const ul = document.querySelector('ul');

const loading = document.createElement('img');
loading.src = "img/loading-circle.gif"

const modal = document.querySelector('.modal');
const body = document.querySelector('body');

const p = document.createElement('p');
const formNumber = document.form.number;
const formName = document.form.text;

const openBtn = document.getElementById("js-open-btn")
const reqBtn = document.getElementById("js-req-form");

function openModal() {
    modal.classList.add("is-show");
    body.classList.add("no-scroll");
}

function closeModal() {
    modal.classList.remove("is-show");
    body.classList.remove("no-scroll");
}

function checkForm(formPart) {
    return formPart.value !== ''
}

function formatForm() {
    formNumber.value = '';
    formName.value = '';
}

function writeLists(data) {
    const fragment = document.createDocumentFragment();
    for (let i = 0 ; i < data.length ; i++) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        const img = document.createElement('img');

        a.href = data[i].a;
        img.src = data[i].img;
        img.alt = data[i].alt;
        img.align = "left";

        a.innerHTML = data[i].text;
        a.appendChild(img);
        li.appendChild(a);

        fragment.appendChild(li)
    }
    ul.appendChild(fragment)
}

async function getJsondata() {
    try {
        const response = await fetch('https://jsondata.okiba.me/v1/json/do9gM210114032953');
        const resJson = await response.json();
        return resJson.data;
    } catch (err) {
        ul.innerHTML = 'ただいまサーバー側で通信がぶっ壊れています';
        throw err;
    } finally {
        loading.remove();
    }
}

openBtn.addEventListener('click', function(){
    formatForm();
    openModal();
}, false);


reqBtn.addEventListener('submit',  async function(e) {
    e.preventDefault();
    if(checkForm(formNumber)&&checkForm(formName)) {
        closeModal();
        ul.innerHTML = '';
        ul.appendChild(loading);

        const resNum = formNumber.value;
        const resName = formName.value;
        console.log(`番号:${resNum}`)
        console.log(`名前：${resName}`)

        const resData = await getJsondata();
        writeLists(resData);
    } else if(checkForm(formNumber) == false){
        alert('番号を入力してください')
    } else if(checkForm(formName) == false){
        alert('名前を入力してください')
    }
});

window.addEventListener('click', function(e) {
    if (e.target == modal) {
        closeModal();
    }
});