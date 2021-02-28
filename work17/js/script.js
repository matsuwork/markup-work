/*json
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

//global
const maxNum = 4;//記事を何件まで表示させるか

const contentUl = document.querySelector('ul');
contentUl.classList.add('contents');
const menuUl = document.createElement('ul');
menuUl.classList.add('menu');

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
    //選択されているカテゴリーをアクティブにする
    if(document.querySelector('.is-active') !== null){
        document.querySelector('.is-active').classList.remove('is-active');
    }
    menuUl.children.item(index).classList.add('is-active');
}

function initMenu(data) {
    const containerDiv = document.querySelector('div');
    containerDiv.classList.add('container');

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

    containerDiv.before(menuUl);

    activeMenu(loadSession());
}

function writeContent(data) {
    contentUl.innerHTML = '';//初期化

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
        li.classList.add('contents__list');
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

    contentUl.appendChild(fragment)

    const categoryImg = document.querySelector('img');
    categoryImg.src = data.image;
    categoryImg.alt = `${data.jp}の画像`
};

function initContent(data) {
    const img = document.createElement('img');
    contentUl.after(img);
    const index = loadSession();
    writeContent(data[index]);
};

async function getJsondata() {
    const loading = document.createElement('img');
    loading.src = "img/loading-circle.gif";
    contentUl.appendChild(loading);
    try {
        const response = await fetch('https://jsondata.okiba.me/v1/json/7iHN0210223065620');
        const resJson = await response.json();
        return resJson.data;
    } catch (err) {
        contentUl.innerHTML = 'ただいまサーバー側で通信がぶっ壊れています';
        throw err;
    } finally {
        loading.remove();
    }
};

window.onload = async function(){
    const resData = await getJsondata();
    initMenu(resData);
    initContent(resData);
}