/*
**json
{ "image": [
    {"src" : "img/img1.jpg", "alt" : "画像１"},
    {"src" : "img/img2.jpg", "alt" : "画像２"},
    {"src" : "img/img3.jpg", "alt" : "画像３"},
    {"src" : "img/img4.jpg", "alt" : "画像４"},
    {"src" : "img/img5.jpg", "alt" : "画像５"}
]}
*/

function getJson() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const response = fetch('https://jsondata.okiba.me/v1/json/grhYz210215052753');
            resolve(response);
        }, 3000);
    });
};

//global
const slideUl = document.querySelector('ul');
slideUl.classList.add('slide');

let slideLists;//.slide_listの配列　ロード時に設定

function getActive() {
    const activeLi = document.querySelector( '.is-active' ) ;
    return slideLists.indexOf( activeLi );
}

function updateButton() {
    const prevButton = slideUl.previousElementSibling;
    const nextButton = slideUl.nextElementSibling;

    if(getActive() == 0){
        prevButton.disabled = true;
    } else {
        prevButton.disabled = false;
    }

    if(getActive() == slideLists.length - 1){
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }
}

function updateCurrent() {
    const currentDiv = document.querySelector('.current');
    currentDiv.textContent = `${getActive() + 1}/${slideLists.length}`;
}

function initSlider(resImage) {
    //image
    const fragment = document.createDocumentFragment();

    for (let i = 0 ; i < resImage.length ; i++) {
        const li = document.createElement('li');
        li.classList.add('slide__list');
        const img = document.createElement('img');
        img.src = resImage[i].src;
        img.alt = resImage[i].alt;
        img.width = 400;

        if(i == 0) {
            li.classList.add('is-active');
        };

        if(i < resImage.length - 1 ) {
            img.addEventListener('click', function(){
                nextImage();
            }, false);
        }

        li.appendChild(img);
        fragment.appendChild(li);
    }

    slideUl.appendChild(fragment);
    //slideLists設定
    slideLists = [...document.querySelectorAll( '.slide__list' )]

    //button
    const prevButton = document.createElement('button');
    prevButton.type = 'button';
    prevButton.textContent = '◀';
    prevButton.addEventListener('click', function(){
        prevImage();
    }, false);

    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.textContent = '▶';
    nextButton.addEventListener('click', function(){
        nextImage();
    }, false);

    slideUl.before(prevButton);
    slideUl.after(nextButton);
    updateButton();

    //current
    const displayDiv = document.querySelector('div');
    displayDiv.classList.add('display')
    const currentDiv = document.createElement('div');
    currentDiv.classList.add('current')
    displayDiv.after(currentDiv);
    updateCurrent();
}

function prevImage() {
    const activeLi = document.querySelector('.is-active');
    activeLi.classList.remove('is-active');
    activeLi.previousElementSibling.classList.add('is-active');
    updateButton();
    updateCurrent();
}

function nextImage() {
    const activeLi = document.querySelector('.is-active');
    activeLi.classList.remove('is-active');
    activeLi.nextElementSibling.classList.add('is-active');
    updateButton();
    updateCurrent();
}

async function getJsonimage() {
    const loading = document.createElement('img');
    loading.src = "img/loading-circle.gif";
    slideUl.appendChild(loading);

    try {
        const response = await getJson();
        const resJson = await response.json();
        return resJson.image;
    } catch (err) {
        slideUl.innerHTML = 'ただいまサーバー側で通信がぶっ壊れています';
        throw err;
    } finally {
        loading.remove();
    }
};

window.onload = async function(){
    const resImage = await getJsonimage()
    initSlider(resImage);
}
