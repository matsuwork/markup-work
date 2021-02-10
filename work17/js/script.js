const object = {
    news: {
        jp: "ニュース",
        data: [
            {title: "ニュースの記事タイトル１", new: true, comment:0, url:"news1.html"},
            {title: "ニュースの記事タイトル２", new: true, comment:1, url:"news2.html"},
            {title: "ニュースの記事タイトル３", new: false, comment:3, url:"news3.html"},
            //{title: "ニュースの記事タイトル４", new: false, comment:10, url:"news4.html"}
            //3つしかなければ3つまで表示するtest
        ],
        img: "img/news.png"
    },
    economy: {
        jp: "経済",
        data: [
            {title: "経済の記事タイトル１", new: true, comment:0, url:"economy1.html"},
            {title: "経済の記事タイトル２", new: false, comment:9, url:"economy2.html"},
            {title: "経済の記事タイトル３", new: false, comment:33, url:"economy3.html"},
            {title: "経済の記事タイトル４", new: true, comment:4, url:"economy4.html"},
            {title: "経済の記事タイトル５", new: true, comment:0, url:"economy5.html"},
        ],
        img: "img/economy.png"
    }
};

function getObject() {
    return new Promise((resolve, reject) => {
        resolve(object);
    });
};

function getCategory() {
    return new Promise((resolve, reject) => {
        //選択されているカテゴリーの読み込み（なければ初期設定）
        if(sessionStorage.getItem('selectedCategory') == null){
            sessionStorage.selectedCategory = 'news';
        }
        resolve(sessionStorage.getItem('selectedCategory'));
    });
};

const maxNum = 4;

const div = document.querySelector('div');
div.classList.add('container');
const ul = document.querySelector('ul');
ul.classList.add('contents');
const menuUl = document.createElement('ul');
menuUl.classList.add('menu');
const img = document.createElement('img');

function writeMenu(obj) {
    Object.keys(obj).forEach(function (key) {
        let menuLi = document.createElement('li');
        menuLi.classList.add('menu__list');
        menuLi.textContent = obj[key].jp;
        menuLi.addEventListener('click', function(){//タブの切り替え
            sessionStorage.selectedCategory = key
            document.querySelector('.is-active').classList.remove('is-active');
            menuLi.classList.add('is-active');
            writeLists(obj[key])
        }, false);
        menuUl.appendChild(menuLi);
    });

    div.before(menuUl);
}

function writeLists(obj) {
    let array = obj.data;
    ul.innerHTML = '';
    let fragment = document.createDocumentFragment();

    //何回繰り返すか
    let maxI;
    if(array.length > maxNum){
        maxI = maxNum;
    } else {
        maxI = array.length;
    }

    for (var i = 0 ; i < maxI ; i++) {

        let li = document.createElement('li');
        li.classList.add('contents__list');
        let a = document.createElement('a');
        a.innerHTML = array[i].title;
        a.href = array[i].url;
        li.appendChild(a);
        let newSpan = document.createElement('span');
        newSpan.classList.add('new');
        newSpan.textContent = 'NEW'

        if(array[i].new){
            li.appendChild(newSpan);
        }

        if(array[i].comment > 0){
            let comSpan = document.createElement('span');
            comSpan.textContent = array[i].comment;
            comSpan.classList.add('comment');
            li.appendChild(comSpan);
        }

        fragment.appendChild(li);
    }

    ul.appendChild(fragment)

    img.src = obj.img;
    img.alt = `${obj.jp}の画像`
    ul.after(img)
};

async function tryOnLoad() {
    try {
        let resObject = await getObject();
        let resCategory = await getCategory();
        writeMenu(resObject);
        //選択されているカテゴリーをアクティブにする
        var i = Object.keys(resObject).indexOf(resCategory);
        console.log(i + resCategory)
        menuUl.children.item(i).classList.add('is-active');

        writeLists(resObject[resCategory]);
    } catch (err) {
        console.error(err);
        ul.innerHTML = 'エラーが発生しました';
    } finally {
        console.log("処理を終了しました");
    }
};

window.onload = tryOnLoad;