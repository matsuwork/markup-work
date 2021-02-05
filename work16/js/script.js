const ul = document.querySelector('ul');

const loading = document.createElement('img');
loading.src = "img/loading-circle.gif"

const modal = document.querySelector('.modal');
const body = document.querySelector('body');

const p = document.createElement('p');
const formNumber = document.form.number;
const formName = document.form.text;

const openBtn = document.getElementById("open-btn")
const reqBtn = document.getElementById("req-form");

function openModal() {
    formNumber.value = '';
    formName.value = '';
    modal.classList.add("is-show");
    body.classList.add("no-scroll");
}

function closeModal() {
    modal.classList.remove("is-show");
    body.classList.remove("no-scroll");
}

function check(formPart) {
    if(formPart.value == '') {
        return false;
    } else {
        return true;
    }
}

//フォームの値をPromiseで取得
function getName() {
    return new Promise((resolve, reject) => {
        resolve(formName.value);
    });
}

function getNumber() {
    return new Promise((resolve, reject) => {
        resolve(formNumber.value);
    });
}

function writeLists(array) {
    let fragment = document.createDocumentFragment();
    for (var i = 0 ; i < array.length ; i++) {
        let li = document.createElement('li');
        let a = document.createElement('a');
        let img = document.createElement('img');

        let to = array[i].a;
        let src = array[i].img;
        let alt = array[i].alt;
        let text = array[i].text;

        a.href = to;
        img.src = src;
        img.alt = alt;
        img.align = "left";

        a.innerHTML = text;
        a.appendChild(img);
        li.appendChild(a);

        fragment.appendChild(li)
    }
    ul.appendChild(fragment)
}

async function submitTry() {
    closeModal();
    ul.innerHTML = '';
    ul.appendChild(loading);

    try {
        let resNum = await getNumber();
        let resName = await getName();
        console.log(`番号:${resNum}`)
        console.log(`名前：${resName}`)
        let response = await fetch('https://jsondata.okiba.me/v1/json/do9gM210114032953');
        let resJson = await response.json();
        writeLists(resJson.data);
    } catch (err) {
        console.error(err);
        ul.innerHTML = 'エラーが発生しました';
    } finally {
        loading.remove();
    }
}

openBtn.addEventListener('click', openModal);

reqBtn.addEventListener('submit',  function(e) {
    e.preventDefault();
    if(check(formNumber)&&check(formName)) {
        submitTry();
    } else if(check(formNumber) == false){
        alert('番号を入力してください')
    } else if(check(formName) == false){
        alert('名前を入力してください')
    }
});

window.addEventListener('click', function(e) {
    if (e.target == modal) {
        closeModal();
    }
});