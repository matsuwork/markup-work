const tableDiv = document.querySelector('#js-table');

let current = 1;  // 現在のページ
const maxNum = 5; // 1ページに表示する項目数

function totalPage(data) {
    if(data.length % maxNum === 0) {
        return data.length / maxNum;
    }
    else {
        return Math.floor(data.length / maxNum) + 1;
    }
}

function updatePagenation(data) {
    const p = document.querySelector('.current');

    function updateCurrent(data) {
        p.textContent = current + "/" + totalPage(data);
    }

    function updateButton(data) {
        const prevButton = p.previousElementSibling;
        const nextButton = p.nextElementSibling;

        if(current === 1){
            prevButton.disabled = true;
        } else {
            prevButton.disabled = false;
        }

        if(current === totalPage(data)){
            nextButton.disabled = true;
        } else {
            nextButton.disabled = false;
        }
    }

    updateCurrent(data);
    updateButton(data);
}

function writeContent(data,keys){
    const table = document.querySelector('table');
    const slicedData = data.slice((current-1)*maxNum,current*maxNum);
    for (let i = 0 ; i < maxNum ; i++) {
        for(let j = 0 ; j < keys.length ; j++) {
            const targetTd = table.rows[i + 1].cells[j];

            if(i < slicedData.length) {
                targetTd.innerHTML = slicedData[i][keys[j]];
            } else {
                targetTd.innerHTML = '';
            }
        }
    }
}

function initTable(data) {
    const table = document.createElement('table');
    //table header
    const keys = Object.keys(data[0]);
    const tr = document.createElement('tr');
    keys.forEach((key) => {
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
                current = 1;
                updatePagenation(data);
                const sortedData = ascendingSort(data,key);
                writeContent(sortedData,keys);
                const buttons = document.querySelectorAll('.sort-button');
                buttons.forEach(button => button.disabled = false);
                ascendingButton.disabled = true;
            }, false);

            const descendingButton = document.createElement('button');
            descendingButton.type = 'button';
            descendingButton.textContent = '▼';
            descendingButton.classList.add('sort-button');
            descendingButton.addEventListener('click', function(){
                current = 1;
                updatePagenation(data);
                const sortedData = descendingSort(data,key);
                writeContent(sortedData,keys);
                const buttons = document.querySelectorAll('.sort-button');
                buttons.forEach(button => button.disabled = false);
                descendingButton.disabled = true;
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
    for (let i = 0 ; i < maxNum ; i++) {
        const tr = document.createElement('tr');
        for(let j = 0 ; j < keys.length ; j++) {
            const td = document.createElement('td');
            tr.appendChild(td);
        }
        fragment.appendChild(tr);
    }
    table.appendChild(fragment);
    writeContent(data,keys)

    //pagenation
    //back
    const prevButton = document.createElement('button');
    prevButton.type = 'button';
    prevButton.textContent = '◀';
    prevButton.disabled = true;
    prevButton.addEventListener('click', function(){
        current = current - 1;
        writeContent(data, keys);
        updatePagenation(data);
    }, false);
    //next
    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.textContent = '▶';
    nextButton.addEventListener('click', function(){
        current = current + 1;
        writeContent(data, keys);
        updatePagenation(data);
        if(current >= totalPage(data)) {
            nextButton.disabled = true;
        } else {
            nextButton.disabled = false;
        };
    }, false);
    //current
    const p = document.createElement('p');
    p.classList.add('current');

    const div = document.createElement('div');
    table.after(div);
    div.appendChild(prevButton);
    div.appendChild(p);
    div.appendChild(nextButton);

    updatePagenation(data);
}

//昇順
function ascendingSort(data, key) {
    const sortedData = [...data].sort((a, b) => {return a[key] - b[key]});
    return sortedData;
}

//降順
function descendingSort(data, key) {
    const sortedData = [...data].sort((a, b) => {return b[key] - a[key]});
    return sortedData;
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
    const resData = await getJsondata()
    initTable(resData);
}