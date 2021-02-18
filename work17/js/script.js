const object = {
    news: {
        jp: "ニュース",
        articles: [
            {title: "ニュースの記事タイトル１", isNew: true, commentCount:0, url:"news1.html"},
            {title: "ニュースの記事タイトル２", isNew: true, commentCount:1, url:"news2.html"},
            {title: "ニュースの記事タイトル３", isNew: false, commentCount:3, url:"news3.html"},
            //3つしかなければ3つまで表示するtest
        ],
        image: "img/news.png"
    },
    economy: {
        jp: "経済",
        articles: [
            {title: "経済の記事タイトル１", isNew: true, commentCount:0, url:"economy1.html"},
            {title: "経済の記事タイトル２", isNew: false, commentCount:9, url:"economy2.html"},
            {title: "経済の記事タイトル３", isNew: false, commentCount:33, url:"economy3.html"},
            {title: "経済の記事タイトル４", isNew: true, commentCount:4, url:"economy4.html"},
            {title: "経済の記事タイトル５", isNew: true, commentCount:0, url:"economy5.html"},
        ],
        image: "img/economy.png"
    }
};

//global
const maxNum = 4;//記事を何件まで表示させるか

const contentUl = document.querySelector('ul');
contentUl.classList.add('contents');
const menuUl = document.createElement('ul');
menuUl.classList.add('menu');

function getObject() {
    return new Promise((resolve, reject) => {
        resolve(object);
    });
};

function getCategory(obj) {
    return new Promise((resolve, reject) => {
        //選択されているカテゴリーの読み込み（なければ初期設定）
        if(sessionStorage.getItem('selectedCategory') == null){
            sessionStorage.selectedCategory = Object.keys(obj)[0];
        }
        resolve(sessionStorage.getItem('selectedCategory'));
    });
};

function updateMenu(obj, cat) {
    sessionStorage.selectedCategory = cat;
    if(document.querySelector('.is-active') !== null){
        document.querySelector('.is-active').classList.remove('is-active');
    }
    //選択されているカテゴリーをアクティブにする
    let index = Object.keys(obj).indexOf(cat);
    menuUl.children.item(index).classList.add('is-active');
}

function initMenu(obj) {
    const containerDiv = document.querySelector('div');
    containerDiv.classList.add('container');

    Object.keys(obj).forEach(function (key) {
        let menuLi = document.createElement('li');
        menuLi.classList.add('menu__list');
        menuLi.textContent = obj[key].jp;
        menuLi.addEventListener('click', function(){
            updateMenu(obj, key);
            updateContent(obj[key]);
        }, false);
        menuUl.appendChild(menuLi);
    });

    containerDiv.before(menuUl);
}

function updateContent(obj) {
    contentUl.innerHTML = '';//初期化

    let array = obj.articles;
    let fragment = document.createDocumentFragment();

    let max;
    if(array.length > maxNum){
        max = maxNum;
    } else {
        max = array.length;
    }

    for (var i = 0 ; i < max ; i++) {

        let li = document.createElement('li');
        li.classList.add('contents__list');
        let a = document.createElement('a');
        a.innerHTML = array[i].title;
        a.href = array[i].url;
        li.appendChild(a);

        //new
        let newSpan = document.createElement('span');
        newSpan.classList.add('new');
        newSpan.textContent = 'NEW'

        if(array[i].isNew){
            li.appendChild(newSpan);
        }

        //comment
        if(array[i].commentCount > 0){
            let comSpan = document.createElement('span');
            comSpan.textContent = array[i].commentCount;
            comSpan.classList.add('comment');
            li.appendChild(comSpan);
        }

        fragment.appendChild(li);
    }

    contentUl.appendChild(fragment)

    const categoryImg = document.querySelector('img');
    categoryImg.src = obj.image;
    categoryImg.alt = `${obj.jp}の画像`
};

function initContent() {
    const img = document.createElement('img');
    contentUl.after(img);
};

async function tryOnLoad() {
    try {
        let resObject = await getObject();
        let resCategory = await getCategory(resObject);
        initMenu(resObject);
        updateMenu(resObject,resCategory);
        initContent();
        updateContent(resObject[resCategory]);
    } catch (err) {
        console.error(err);
        contentUl.innerHTML = 'エラーが発生しました';
    } finally {
        console.log("処理を終了しました");
    }
};

window.onload = tryOnLoad;