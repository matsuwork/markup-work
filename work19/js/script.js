function getJson() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const response = fetch('https://jsondata.okiba.me/v1/json/E9j1L210228051708');
            resolve(response);
        }, 3000);
    });
};

const tableDiv = document.querySelector('#js-table');

function initTable(data) {
    const table = document.createElement('table');
    //table header
    const tr = document.createElement('tr');
    Object.keys(data[0]).forEach((key) => {
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
                const buttons = document.querySelectorAll('button');
                buttons.forEach(button => button.disabled = false);
                ascendingButton.disabled = true;
            }, false);

            const descendingButton = document.createElement('button');
            descendingButton.type = 'button';
            descendingButton.textContent = '▼';
            descendingButton.addEventListener('click', function(){
                descendingSort(data,key);
                const buttons = document.querySelectorAll('button');
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
    writeContent(data);
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
    const table = document.querySelector('table');
    while( table.rows[ 1 ] ) table.deleteRow( 1 );

    const fragment = document.createDocumentFragment();
    for (let i = 0 ; i < data.length ; i++) {
        const tr = document.createElement('tr');

        Object.keys(data[i]).forEach((key) => {
            const td = document.createElement('td');
            td.textContent = data[i][key];
            tr.appendChild(td);
        });

        fragment.appendChild(tr);
    }
    table.appendChild(fragment);
}


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