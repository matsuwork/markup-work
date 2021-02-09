const object = {
    news: {
        jp: "ニュース",
        data: [
            {title: "ニュースの記事タイトル１", new: true, comment:0, url:"news1.html"},
            {title: "ニュースの記事タイトル２", new: false, comment:1, url:"news2.html"},
            {title: "ニュースの記事タイトル３", new: false, comment:3, url:"news3.html"},
            {title: "ニュースの記事タイトル４", new: false, comment:10, url:"news4.html"},
        ],
        img: "img/news.png"
    },
    economy: {
        jp: "経済",
        data: [
            {title: "経済の記事タイトル１", new: true, comment:0, url:"economy1.html"},
            {title: "経済の記事タイトル２", new: false, comment:3, url:"economy1.html"},
            {title: "経済の記事タイトル３", new: false, comment:7, url:"economy1.html"},
            {title: "経済の記事タイトル４", new: true, comment:0, url:"economy1.html"},
        ],
        img: "img/economy.png"
    }
};

function getObject() {
    return new Promise((resolve, reject) => {
        resolve(object);
    });
};

const num = 4;
const ul = document.querySelector('ul');
const img = document.createElement('img');

function writeMenu(array) {
    let menuUl = document.createElement('ul');

    Object.keys(array).forEach(function (key) {
        let menuLi = document.createElement('li');
        menuLi.textContent = array[key].jp;
        menuLi.addEventListener('click', function(){
            writeLists(array[key])
        }, false);
        menuUl.appendChild(menuLi);
    });

    ul.before(menuUl)
}

function writeLists(obj) {
    let array = obj.data;
    ul.innerHTML = '';
    let fragment = document.createDocumentFragment();

    for (var i = 0 ; i < array.length ; i++) {

        let li = document.createElement('li');
        let a = document.createElement('a');
        a.innerHTML = array[i].title;
        a.href = array[i].url;
        li.appendChild(a);
        let newSpan = document.createElement('span');
        newSpan.textContent = 'NEW'

        if(array[i].new){
            li.appendChild(newSpan);
        }

        if(array[i].comment > 0){
            let comSpan = document.createElement('span');
            comSpan.textContent = array[i].comment
            li.appendChild(comSpan);
        }

        fragment.appendChild(li)
    }

    ul.appendChild(fragment)

    img.src= obj.img;
    ul.after(img)
};

async function tryOnLoad() {
    try {
        let resObject = await getObject();
        writeMenu(resObject);
        writeLists(resObject.news)
    } catch (err) {
        console.error(err);
        ul.innerHTML = 'エラーが発生しました';
    } finally {
        console.log("処理を終了しました");
    }
};

tryOnLoad();