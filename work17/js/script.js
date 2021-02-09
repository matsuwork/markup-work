const object = {
    news: {
        jp: "ニュース",
        data: [
            {title: "ニュースの記事タイトル１", new: true, comment:0, url:"news1.html"},
            {title: "ニュースの記事タイトル２", new: true, comment:1, url:"news2.html"},
            {title: "ニュースの記事タイトル３", new: false, comment:3, url:"news3.html"},
            {title: "ニュースの記事タイトル４", new: false, comment:10, url:"news4.html"},
        ],
        img: "img/news.png"
    },
    economy: {
        jp: "経済",
        data: [
            {title: "経済の記事タイトル１", new: true, comment:0, url:"economy1.html"},
            {title: "経済の記事タイトル２", new: false, comment:9, url:"economy1.html"},
            {title: "経済の記事タイトル３", new: false, comment:33, url:"economy1.html"},
            {title: "経済の記事タイトル４", new: true, comment:4, url:"economy1.html"},
        ],
        img: "img/economy.png"
    }
};

function getObject() {
    return new Promise((resolve, reject) => {
        resolve(object);
    });
};

let cat;
if(sessionStorage.getItem('selectedCategory')){
    cat = sessionStorage.getItem('selectedCategory');
} else {
    cat = sessionStorage.setItem('selectedCategory','news');
}

const maxNum = 4;
const container = document.querySelector('.container');

const ul = document.querySelector('ul');
ul.classList.add('contents');
const img = document.createElement('img');
const menuUl = document.createElement('ul');
menuUl.classList.add('menu');

function writeMenu(obj) {
    Object.keys(obj).forEach(function (key) {
        let menuLi = document.createElement('li');
        menuLi.classList.add('menu__list');
        menuLi.textContent = obj[key].jp;
        menuLi.addEventListener('click', function(){
            sessionStorage.selectedCategory = key
            for (let i = 0 ; i < menuUl.children.length ; i++){
                menuUl.children.item(i).classList.remove('is-active');
            }
            menuLi.classList.add('is-active');
            writeLists(obj[key])
        }, false);
        menuUl.appendChild(menuLi);
    });

    container.before(menuUl)
}

function writeLists(obj) {
    let array = obj.data;
    ul.innerHTML = '';
    let fragment = document.createDocumentFragment();

    for (var i = 0 ; i < array.length ; i++) {

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
        writeMenu(resObject);
        let i = Object.keys(resObject).findIndex( value => value == cat );
        menuUl.children.item(i).classList.add('is-active');
        writeLists(resObject[cat])
    } catch (err) {
        console.error(err);
        ul.innerHTML = 'エラーが発生しました';
    } finally {
        console.log("処理を終了しました");
    }
};

tryOnLoad();