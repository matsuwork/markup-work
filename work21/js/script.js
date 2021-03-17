const tableDiv = document.querySelector('#js-table');
const MAX_ROW = 5;  //1ページに表示する項目数

class Common {
    constructor(data) {
        this.data = data;
        this.currentPage = 1;
        this.sortType = 0;
        this.sortKey = '';
    }

    get data() {return this._data;}
    set data(value) {this._data = value;}

    get currentPage() {return this._currentPage;}
    set currentPage(value) {this._currentPage = value;}

    get sortType() {return this._sortType;}
    set sortType(value) {this._sortType = value;}

    get sortKey() {return this._sortKey;}
    set sortKey(value) {this._sortKey = value;}

    get keys() {return Object.keys(this.data[0]);}

    get totalPage() {return this.data.length % MAX_ROW === 0 ? this.data.length / MAX_ROW : Math.floor(this.data.length / MAX_ROW) + 1;}

    incrementCurrent() {this.currentPage++;}
    decrementCurrent() {this.currentPage--;}

    getContent() {
        const sortedData = [...this.data].sort((a, b) => {return (a[this.sortKey] - b[this.sortKey]) * this.sortType});
        const slicedData = sortedData.slice((this.currentPage - 1) * MAX_ROW, this.currentPage * MAX_ROW);
        return slicedData;
    }
}

function writeContent(){
    const contentData = common.getContent();
    const table = document.querySelector('table');

    for (let i = 0 ; i < MAX_ROW ; i++) {
        for(let j = 0 ; j < common.keys.length ; j++) {
            const targetTd = table.rows[i + 1].cells[j];

            if(i < contentData.length) {
                targetTd.innerHTML = contentData[i][common.keys[j]];
            } else {
                targetTd.innerHTML = '';
            }
        }
    }
}

function updatePagenation() {
    const p = document.querySelector('.current');
    p.textContent = `${common.currentPage}/${common.totalPage}`;

    const prevButton = p.previousElementSibling;
    const nextButton = p.nextElementSibling;

    if(common.currentPage === 1){
        prevButton.disabled = true;
    } else {
        prevButton.disabled = false;
    }

    if(common.currentPage === common.totalPage){
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
    common.keys.forEach((key) => {
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
                common.currentPage = 1;
                common.sortType = 1;
                common.sortKey = key;
                writeContent();
                updatePagenation();
                updateSortButton(this);
            }, false);

            const descendingButton = document.createElement('button');
            descendingButton.type = 'button';
            descendingButton.textContent = '▼';
            descendingButton.classList.add('sort-button');
            descendingButton.addEventListener('click', function(){
                common.currentPage = 1;
                common.sortType = -1;
                common.sortKey = key;
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
        for(let j = 0 ; j < common.keys.length ; j++) {
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
        common.decrementCurrent();
        writeContent();
        updatePagenation();
    }, false);
    //next
    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.textContent = '▶';
    nextButton.addEventListener('click', function(){
        common.incrementCurrent();
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
    common = new Common(resData);
    initTable();
}