/*json
{ "image": [
    {"src" : "img/img1.jpg", "alt" : "画像１"},
    {"src" : "img/img2.jpg", "alt" : "画像２"},
    {"src" : "img/img3.jpg", "alt" : "画像３"},
    {"src" : "img/img4.jpg", "alt" : "画像４"},
    {"src" : "img/img5.jpg", "alt" : "画像５"}
]}
*/

const sliderUl = document.getElementById('slider');
let slideLists; //初期表示時に設定 sliderUlの中にあるliすべて
let timer;      //setTimeoutのID

function getActive() {
    const activeLi = document.querySelector( '.is-active' ) ;
    return slideLists.indexOf( activeLi );
}

function initSlider(resImage) {
    const displayDiv = document.querySelector('div');
    displayDiv.classList.add('display')
    const dotDiv = document.createElement('div');
    dotDiv.classList.add('dot')

    const fragment = document.createDocumentFragment();
    for (let i = 0 ; i < resImage.length ; i++) {
        //image
        const li = document.createElement('li');
        li.classList.add('slider__list');
        const img = document.createElement('img');
        img.src = resImage[i].src;
        img.alt = resImage[i].alt;
        img.width = 400;

        img.addEventListener('click', function(){
            nextImage();
        }, false);

        li.appendChild(img);
        fragment.appendChild(li);

        //dot button
        const dotButton = document.createElement('button');
        dotButton.type = 'button';
        dotButton.textContent = '●';
        dotButton.addEventListener('click', function(){
            showImage(i);
        }, false);
        dotDiv.appendChild(dotButton)
    }

    sliderUl.appendChild(fragment);
    displayDiv.after(dotDiv);

    //prev/next button
    const prevButton = document.createElement('button');
    prevButton.type = 'button';
    prevButton.textContent = '◀';
    prevButton.addEventListener('click', function(){
        showImage(getActive() - 1);
    }, false);

    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.textContent = '▶';
    nextButton.addEventListener('click', function(){
        showImage(getActive() + 1);
    }, false);

    sliderUl.before(prevButton);
    sliderUl.after(nextButton);

    //current
    const currentDiv = document.createElement('div');
    currentDiv.classList.add('current')
    dotDiv.after(currentDiv);

    //slideListsの設定
    slideLists = [...document.querySelectorAll( '.slider__list' )];

    showImage(0);
}

function updateControl() {
    //prev/next button
    const prevButton = sliderUl.previousElementSibling;
    const nextButton = sliderUl.nextElementSibling;
    if(getActive() === 0){
        prevButton.disabled = true;
    } else {
        prevButton.disabled = false;
    }

    if(getActive() === slideLists.length - 1){
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }

    //current
    const currentDiv = document.querySelector('.current');
    currentDiv.textContent = `${getActive() + 1}/${slideLists.length}`;

    //dot button
    const dotDiv = document.querySelector('.dot');
    [...dotDiv.children].forEach(item => item.disabled = false);
    dotDiv.children[getActive()].disabled = true;
}

function setTimer() {
    clearTimeout(timer);
    timer = setTimeout(nextImage, 3000);
}

function showImage(value) {
    const activeLi = document.querySelector('.is-active');
    if(activeLi) {
        activeLi.classList.remove('is-active');
    }
    slideLists[value].classList.add('is-active');
    updateControl();
    setTimer();
}

function nextImage() {
    if(getActive() < slideLists.length - 1 ) {
        showImage(getActive() + 1);
    } else {
        showImage(0);
    }
}

function getJson() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const response = fetch('https://jsondata.okiba.me/v1/json/grhYz210215052753');
            resolve(response);
        }, 3000);
    });
};

async function getJsonimage() {
    const loading = document.createElement('img');
    loading.src = "img/loading-circle.gif";
    sliderUl.appendChild(loading);

    try {
        const response = await getJson();
        const resJson = await response.json();
        return resJson.image;
    } catch (err) {
        sliderUl.innerHTML = 'ただいまサーバー側で通信がぶっ壊れています';
        throw err;
    } finally {
        loading.remove();
    }

};

window.onload = async function(){
    const resImage = await getJsonimage()
    initSlider(resImage);
}
