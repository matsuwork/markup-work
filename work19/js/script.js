/*
**json
{ "data": [
    {"ID" : 1, "名前" : "やまだ", "性別" : "男", "年齢" : 32},
    {"ID" : 5, "名前" : "えのもと", "性別" : "女", "年齢" : 36},
    {"ID" : 3, "名前" : "たなか", "性別" : "男", "年齢" : 25},
    {"ID" : 4, "名前" : "あんどう", "性別" : "女", "年齢" : 48},
    {"ID" : 2, "名前" : "さとう", "性別" : "女", "年齢" : 18}
]}
https://jsondata.okiba.me/v1/json/E9j1L210228051708
*/

function getJson() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const response = fetch('https://jsondata.okiba.me/v1/json/E9j1L210228051708');
            resolve(response);
        }, 3000);
    });
};

//global
const div = document.querySelector('div');
const table = document.createElement('table');

function initTable(data) {
    //table header
    const tr = document.createElement('tr');
    Object.keys(data[0]).forEach(function (key) {
        const th = document.createElement('th');
        th.textContent = key;
        tr.appendChild(th);

        //button
        if(key === "ID") {
            const ascendingButton = document.createElement('button');
            ascendingButton.type = 'button';
            ascendingButton.textContent = '▲';
            ascendingButton.addEventListener('click', function(){
                ascendingSort(data,key);
            }, false);

            const descendingButton = document.createElement('button');
            descendingButton.type = 'button';
            descendingButton.textContent = '▼';
            descendingButton.addEventListener('click', function(){
                descendingSort(data,key);
            }, false);

            th.appendChild(ascendingButton);
            th.appendChild(descendingButton);
        }
    });
    table.appendChild(tr);

    //table content
    for (let i = 0 ; i < data.length ; i++) {
        const tr = document.createElement('tr');

        Object.keys(data[i]).forEach((key) => {
            const td = document.createElement('td');
            td.textContent = data[i][key];
            tr.appendChild(td);
        });
        table.appendChild(tr);
    }

    div.appendChild(table);
}

//昇順
function ascendingSort(data, key) {
    data.sort((a, b) => {return a[key] - b[key]});
    writeContent(data);
}

//降順
function descendingSort(data, key) {
    data.sort((a, b) => {return b[key] - a[key]});
    writeContent(data);
}

function writeContent(data){
    while( table.rows[ 1 ] ) table.deleteRow( 1 );

    for (let i = 0 ; i < data.length ; i++) {
        const tr = document.createElement('tr');

        Object.keys(data[i]).forEach((key) => {
        const td = document.createElement('td');
            td.textContent = data[i][key];
            tr.appendChild(td);
        });

        table.appendChild(tr);
    }
}


async function getJsondata() {
    const loading = document.createElement('img');
    loading.src = "img/loading-circle.gif";
    div.appendChild(loading);

    try {
        const response = await getJson();
        const resJson = await response.json();
        return resJson.data;
    } catch (err) {
        div.innerHTML = 'ただいまサーバー側で通信がぶっ壊れています';
        throw err;
    } finally {
        loading.remove();
    }
};

window.onload = async function(){
    const resData = await getJsondata()
    initTable(resData);
}