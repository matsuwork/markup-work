/*
**配列
const image = [
    {src: "img/img1.jpg", alt: "画像１"},
    {src: "img/img2.jpg", alt: "画像２"},
    {src: "img/img3.jpg", alt: "画像３"},
    {src: "img/img4.jpg", alt: "画像４"},
    {src: "img/img5.jpg", alt: "画像５"}
];

**json
{ "image": [
    {"src" : "img/img1.jpg", "alt" : "画像１"},
    {"src" : "img/img2.jpg", "alt" : "画像２"},
    {"src" : "img/img3.jpg", "alt" : "画像３"},
    {"src" : "img/img4.jpg", "alt" : "画像４"},
    {"src" : "img/img5.jpg", "alt" : "画像５"}
]}
*/

function getPromiseObject() {
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
const controlDiv = document.createElement('div');
controlDiv.classList.add('control')

function initDisplay(resImage) {
    const fragment = document.createDocumentFragment();

    for (var i = 0 ; i < resImage.length ; i++) {
        let li = document.createElement('li');
        li.classList.add('slide__list');
        let img = document.createElement('img');
        img.src = resImage[i].src;
        img.alt = resImage[i].alt;
        img.width = 400;

        if(i == 0) {
            li.classList.add('is-active');
        };

        if(i < resImage.length - 1 ) {
            img.addEventListener('click', function(){
                next();
            }, false);
        }

        li.appendChild(img);
        fragment.appendChild(li);
    }

    slideUl.appendChild(fragment);
}

function initControl() {
    const displayDiv = document.querySelector('div');
    displayDiv.classList.add('display')

    const prevButton = document.createElement('button');
    prevButton.type = 'button';
    prevButton.textContent = '◀';
    prevButton.addEventListener('click', function(){
        prev();
    }, false);

    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.textContent = '▶';
    nextButton.addEventListener('click', function(){
        next();
    }, false);

    slideUl.before(prevButton);
    slideUl.after(nextButton);

    displayDiv.after(controlDiv)
}

function updateControl() {
    let lists = document.querySelectorAll( '.slide__list' ) ;
    let activeLi = document.querySelector( '.is-active' ) ;
    lists = [].slice.call( lists ) ;
    let index = lists.indexOf( activeLi ) ;
    controlDiv.textContent = `${index + 1}/${lists.length}`;

    const prevButton = slideUl.previousElementSibling;
    const nextButton = slideUl.nextElementSibling;

    if(index == 0){
        prevButton.disabled = true;
    } else {
        prevButton.disabled = false;
    }

    if(index == lists.length - 1){
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }
}

function prev() {
    let activeLi = document.querySelector('.is-active');
    activeLi.classList.remove('is-active');
    activeLi.previousElementSibling.classList.add('is-active');
    updateControl();
}

function next() {
    let activeLi = document.querySelector('.is-active');
    activeLi.classList.remove('is-active');
    activeLi.nextElementSibling.classList.add('is-active');
    updateControl();
}

async function tryOnLoad() {
    const loading = document.createElement('img');
    loading.src = "img/loading-circle.gif";
    slideUl.appendChild(loading);

    try {
        const response = await getPromiseObject();
        const resJson = await response.json();
        const resImage = resJson.image;
        initDisplay(resImage);
        initControl();
        updateControl();
    } catch (err) {
        console.error(err);
        slideUl.innerHTML = 'エラーが発生しました';
    } finally {
        loading.remove();
        console.log("処理を終了しました");
    }
};

window.onload = tryOnLoad;