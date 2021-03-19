const tableDiv = document.querySelector('#js-table');
const MAX_ROW = 5;  //1ページに表示する項目数

class Pagenation {
    constructor(data) {
        this.data = data;
        this.currentPage = 1;
        this.sortType = 0;
        this.sortKey = '';
    }

    getCurrentPage() {return this.currentPage;}
    setCurrentPage(value) {this.currentPage = value;}

    getSortType() {return this.sortType;}
    setSortType(value) {this.sortType = value;}

    getSortKey() {return this.sortKey;}
    setSortKey(value) {this.sortKey = value;}

    getKeys() {return Object.keys(this.data[0]);}

    getTotalPage() {return this.data.length % MAX_ROW === 0 ? this.data.length / MAX_ROW : Math.floor(this.data.length / MAX_ROW) + 1;}

    getContent() {
        const sortedData = [...this.data].sort((a, b) => {return (a[this.sortKey] - b[this.sortKey]) * this.sortType});
        const slicedData = sortedData.slice((this.currentPage - 1) * MAX_ROW, this.currentPage * MAX_ROW);
        return slicedData;
    }
}

function writeContent(){
    const contentData = pagenation.getContent();
    const table = document.querySelector('table');

    for (let i = 0 ; i < MAX_ROW ; i++) {
        for(let j = 0 ; j < pagenation.getKeys().length ; j++) {
            const targetTd = table.rows[i + 1].cells[j];

            if(i < contentData.length) {
                targetTd.innerHTML = contentData[i][pagenation.getKeys()[j]];
            } else {
                targetTd.innerHTML = '';
            }
        }
    }
}

function updatePagenation() {
    const p = document.querySelector('.current');
    p.textContent = `${pagenation.getCurrentPage()}/${pagenation.getTotalPage()}`;

    const prevButton = p.previousElementSibling;
    const nextButton = p.nextElementSibling;

    if(pagenation.getCurrentPage() === 1){
        prevButton.disabled = true;
    } else {
        prevButton.disabled = false;
    }

    if(pagenation.getCurrentPage() === pagenation.getTotalPage()){
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }
}

function updateSortButton(clickedButton) {
    const buttons = document.querySelectorAll('.sort-button');
    buttons.forEach(button => button.disabled = false);
    clickedButton.disabled = true;
}

function initTable() {
    const table = document.createElement('table');
    //table header
    const tr = document.createElement('tr');
    pagenation.getKeys().forEach((key) => {
        const th = document.createElement('th');
        th.textContent = key;
        tr.appendChild(th);

        //sort button
        if(key === "ID" || key === "年齢") {
            const ascendingButton = document.createElement('button');
            ascendingButton.type = 'button';
            ascendingButton.textContent = '▲';
            ascendingButton.classList.add('sort-button');
            ascendingButton.addEventListener('click', function(){
                pagenation.setCurrentPage(1);
                pagenation.setSortType(1);
                pagenation.setSortKey(key);
                writeContent();
                updatePagenation();
                updateSortButton(this);
            }, false);

            const descendingButton = document.createElement('button');
            descendingButton.type = 'button';
            descendingButton.textContent = '▼';
            descendingButton.classList.add('sort-button');
            descendingButton.addEventListener('click', function(){
                pagenation.setCurrentPage(1);
                pagenation.setSortType(-1);
                pagenation.setSortKey(key);
                writeContent();
                updatePagenation();
                updateSortButton(this);
            }, false);

            const span = document.createElement('span');
            span.appendChild(ascendingButton);
            span.appendChild(descendingButton);
            th.appendChild(span);
        }
    });
    tableDiv.appendChild(table).appendChild(tr);

    //table content
    const fragment = document.createDocumentFragment();
    for (let i = 0 ; i < MAX_ROW ; i++) {
        const tr = document.createElement('tr');
        for(let j = 0 ; j < pagenation.getKeys().length ; j++) {
            const td = document.createElement('td');
            tr.appendChild(td);
        }
        fragment.appendChild(tr);
    }
    table.appendChild(fragment);

    //pagenation
    //back
    const prevButton = document.createElement('button');
    prevButton.type = 'button';
    prevButton.textContent = '◀';
    prevButton.disabled = true;
    prevButton.addEventListener('click', function(){
        pagenation.setCurrentPage(pagenation.getCurrentPage() - 1);
        writeContent();
        updatePagenation();
    }, false);
    //next
    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.textContent = '▶';
    nextButton.addEventListener('click', function(){
        pagenation.setCurrentPage(pagenation.getCurrentPage() + 1);
        writeContent();
        updatePagenation();
    }, false);
    //current
    const p = document.createElement('p');
    p.classList.add('current');

    const div = document.createElement('div');
    div.classList.add('pagenation');

    table.after(div);
    div.appendChild(prevButton);
    div.appendChild(p);
    div.appendChild(nextButton);

    writeContent();
    updatePagenation();
}

function getJson() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const response = fetch('https://jsondata.okiba.me/v1/json/WIo9c210306004126');
            resolve(response);
        }, 3000);
    });
};

async function getJsondata() {
    const loading = document.createElement('img');
    loading.src = "img/loading-circle.gif";
    tableDiv.appendChild(loading);

    try {
        const response = await getJson();
        const resJson = await response.json();
        return resJson.data;
    } catch (err) {
        tableDiv.innerHTML = 'ただいまサーバー側で通信がぶっ壊れています';
        throw err;
    } finally {
        loading.remove();
    }
};

window.onload = async function(){
    const resData = await getJsondata();
    pagenation = new Pagenation(resData);
    initTable();
}