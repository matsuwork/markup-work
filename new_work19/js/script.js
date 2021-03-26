/*json
//slider 'https://jsondata.okiba.me/v1/json/pzi02210324121534'
{ "images": [
    {"src" : "img/img1.jpg", "alt" : "画像１"},
    {"src" : "img/img2.jpg", "alt" : "画像２"},
    {"src" : "img/img3.jpg", "alt" : "画像３"},
    {"src" : "img/img4.jpg", "alt" : "画像４"},
    {"src" : "img/img5.jpg", "alt" : "画像５"}
]}
//news 'https://jsondata.okiba.me/v1/json/7iHN0210223065620'
{"data" : [
    {
        "id": "news",
        "category_jp": "ニュース",
        "articles": [
            {"title": "ニュースの記事タイトル１", "isNew": true, "commentCount":0, "url":"news1.html"},
            {"title": "ニュースの記事タイトル２", "isNew": true, "commentCount":1, "url":"news2.html"},
            {"title": "ニュースの記事タイトル３", "isNew": false, "commentCount":3, "url":"news3.html"}
        ],
        "image": "img/news.png"
    },
    {   "id": "economy",
        "category_jp": "経済",
        "articles": [
            {"title": "経済の記事タイトル１", "isNew": true, "commentCount":0, "url":"economy1.html"},
            {"title": "経済の記事タイトル２", "isNew": false, "commentCount":9, "url":"economy2.html"},
            {"title": "経済の記事タイトル３", "isNew": false, "commentCount":33, "url":"economy3.html"},
            {"title": "経済の記事タイトル４", "isNew": true, "commentCount":4, "url":"economy4.html"},
            {"title": "経済の記事タイトル５", "isNew": true, "commentCount":0, "url":"economy5.html"}
        ],
        "image": "img/economy.png"
    },
    {   "id": "entame",
        "category_jp": "エンタメ",
        "articles": [
            {"title": "エンタメの記事タイトル１", "isNew": false, "commentCount":0, "url":"entame1.html"},
            {"title": "エンタメの記事タイトル２", "isNew": false, "commentCount":10, "url":"entame2.html"},
            {"title": "エンタメの記事タイトル３", "isNew": true, "commentCount":30, "url":"entame3.html"},
            {"title": "エンタメの記事タイトル４", "isNew": false, "commentCount":40, "url":"entame4.html"},
        ],
        "image": "img/entame.png"
    }
]}
*/

//共通
const urls = [
    'https://jsondata.okiba.me/v1/json/pzi02210324121534', //slider
    'https://jsondata.okiba.me/v1/json/7iHN0210223065620'  //news
]

const body = document.querySelector('body');

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getJson(url) {
    try {
        await timeout(3000);
        const response = await fetch(url);
        const resJson = await response.json();
        return resJson;
    } catch (err) {
        body.textContent = 'ただいまサーバー側で通信がぶっ壊れています';
        throw err;
    }
};

window.onload = async function(){
    const loading = document.createElement('img');
    loading.src = "img/loading-circle.gif";
    body.insertBefore(loading, body.firstChild)

    const response = await Promise.all(urls.map(url => getJson(url)))

    loading.remove();

    initSlider(response[0].images);
    initNews(response[1].data);
}

//slider
const sliderDiv = document.getElementById('js-slider');
sliderDiv.classList.add('slider');
let slideLists; //初期表示時に設定 imagesUlの中にあるliすべて
let setTimeoutId;

function getActive() {
    const activeLi = sliderDiv.querySelector( '.is-active' ) ;
    return slideLists.indexOf( activeLi );
}

const isFirst = () => {
    return getActive() === 0;
}

const isLast = () => {
    return getActive() === slideLists.length - 1;
}

function createImages(images) {
    const displayDiv = document.createElement('div');
    displayDiv.classList.add('display');
    const imagesUl = document.createElement('ul');
    imagesUl.classList.add('images');
    const fragment = document.createDocumentFragment();
    for (let i = 0 ; i < images.length ; i++) {
        const li = document.createElement('li');
        li.classList.add('image');
        const img = document.createElement('img');
        img.src = images[i].src;
        img.alt = images[i].alt;
        img.width = 400;

        img.addEventListener('click', function(){
            nextImage();
        }, false);

        li.appendChild(img);
        fragment.appendChild(li);
    }

    sliderDiv.appendChild(displayDiv).appendChild(imagesUl).appendChild(fragment);
}

function createArrowButtons() {
    const displayDiv = sliderDiv.querySelector('.display');

    const prevButton = document.createElement('button');
    prevButton.type = 'button';
    prevButton.textContent = '◀';
    prevButton.id = 'prev-button';
    prevButton.addEventListener('click', function(){
        showImage(getActive() - 1);
    }, false);

    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.textContent = '▶';
    nextButton.id = 'next-button';
    nextButton.addEventListener('click', function(){
        showImage(getActive() + 1);
    }, false);

    displayDiv.insertBefore(prevButton, displayDiv.firstChild)
    displayDiv.appendChild(nextButton);
}

function createDotButtons(images) {
    const dotDiv = document.createElement('div');
    dotDiv.classList.add('dot')
    for (let i = 0 ; i < images.length ; i++) {
        const dotButton = document.createElement('button');
        dotButton.type = 'button';
        dotButton.textContent = '●';
        dotButton.addEventListener('click', function(){
            showImage(i);
        }, false);
        dotDiv.appendChild(dotButton)
    }
    sliderDiv.appendChild(dotDiv);
}

function createCurrent() {
    const currentDiv = document.createElement('div');
    currentDiv.classList.add('current')
    sliderDiv.appendChild(currentDiv);
}

function initSlider(images) {
    createImages(images);
    createDotButtons(images);
    createArrowButtons();
    createCurrent();
    slideLists = [...document.querySelectorAll( '.image' )];
    showImage(0);
}

function updateControl() {
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    isFirst() ? prevButton.disabled = true : prevButton.disabled = false;
    isLast() ? nextButton.disabled = true : nextButton.disabled = false;

    const currentDiv = document.querySelector('.current');
    currentDiv.textContent = `${getActive() + 1}/${slideLists.length}`;

    const dotDiv = document.querySelector('.dot');
    [...dotDiv.children].forEach(item => item.disabled = false);
    dotDiv.children[getActive()].disabled = true;
}

function setTimer() {
    clearTimeout(setTimeoutId);
    setTimeoutId = setTimeout(nextImage, 3000);
}

function showImage(value) {
    const activeLi = sliderDiv.querySelector('.is-active');
    if(activeLi) {
        activeLi.classList.remove('is-active');
    }
    slideLists[value].classList.add('is-active');
    updateControl();
    setTimer();
}

function nextImage() {
    isLast() ? showImage(0) : showImage(getActive() + 1);
}

//news
const maxNum = 4;//記事を何件まで表示させるか
const newsDiv = document.getElementById('js-news');
newsDiv.classList.add('news');

function loadSession() {
    //選択されているカテゴリーの取得（なければ初期設定）
    if(sessionStorage.getItem('selectedCategory') == null){
            sessionStorage.selectedCategory = 0;
    }
    return Number(sessionStorage.getItem('selectedCategory'));
};

function saveSession(index) {
    sessionStorage.selectedCategory = index;
}

function activeMenu(index) {
    const menuUl = newsDiv.querySelector('.news__menu')
    //選択されているカテゴリーをアクティブにする
    if(menuUl.querySelector('.is-active') !== null){
        menuUl.querySelector('.is-active').classList.remove('is-active');
    }
    menuUl.children.item(index).classList.add('is-active');
}

function createMenu(data) {
    const menuUl = document.createElement('ul');
    menuUl.classList.add('news__menu');

    for(let i = 0 ; i < data.length ; i++){
        const menuLi = document.createElement('li');
        menuLi.classList.add('menu__list');
        menuLi.textContent = data[i].category_jp;
        menuLi.addEventListener('click', function(){
            saveSession(i);
            activeMenu(i);
            writeContent(data[i]);
        }, false);
        menuUl.appendChild(menuLi);
    };

    newsDiv.insertBefore(menuUl,newsDiv.firstChild);

    activeMenu(loadSession());
}

function createContent(data) {
    const contentsDiv = document.createElement('div');
    contentsDiv.classList.add('news__contents')
    const articlesUl = document.createElement('ul');
    articlesUl.classList.add('articles');

    newsDiv.appendChild(contentsDiv).appendChild(articlesUl);

    const img = document.createElement('img');
    img.classList.add('category-img');
    articlesUl.after(img);
    const index = loadSession();
    writeContent(data[index]);
};

function writeContent(data) {
    const articlesUl = newsDiv.querySelector('.articles')
    articlesUl.textContent = '';

    const articles = data.articles;
    const fragment = document.createDocumentFragment();

    let max;
    if(articles.length > maxNum){
        max = maxNum;
    } else {
        max = articles.length;
    }

    for (var i = 0 ; i < max ; i++) {

        const li = document.createElement('li');
        li.classList.add('article');
        const a = document.createElement('a');
        a.innerHTML = articles[i].title;
        a.href = articles[i].url;
        li.appendChild(a);

        //new
        if(articles[i].isNew){
            const span = document.createElement('span');
            span.classList.add('new');
            span.textContent = 'NEW';
            li.appendChild(span);
        }

        //comment
        if(articles[i].commentCount > 0){
            const span = document.createElement('span');
            span.textContent = articles[i].commentCount;
            span.classList.add('comment');
            li.appendChild(span);
        }

        fragment.appendChild(li);
    }

    articlesUl.appendChild(fragment)

    const categoryImg = document.querySelector('.category-img');
    categoryImg.src = data.image;
    categoryImg.alt = `${data.jp}の画像`
};

function initNews(data) {
    createMenu(data);
    createContent(data);
}
