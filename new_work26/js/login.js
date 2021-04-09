//validation
const submitBtn = document.getElementById("submit");
submitBtn.disabled = true;

const form = document.getElementById('form');

const notes = document.querySelectorAll('.note');
notes.forEach(note => note.style.visibility = 'hidden');//ロード時は見えないようにする

form.addEventListener('change', function(e) {
    visibleNote(e.target);
    updateSubmit();
});

function visibleNote(target) {
    target.nextElementSibling.style.visibility = '';
};

function updateSubmit() {
    const isValid = form.checkValidity();
    submitBtn.disabled = !isValid
};

//login
document.addEventListener('DOMContentLoaded',function(){
    if(localStorage.getItem('token')){
        location.href="index.html";
    }
},false);

function getFormData() {
    return {
        name: form.elements['name'].value,
        password: form.elements['password'].value
    }
}

form.addEventListener('submit', function(e){
    e.preventDefault();
    login(getFormData());
}, false);

function getUsers() {
    const users = [
        {
            name: "kenjimorita",
            password: "N302aoe3"
        },
        {
            name: "matsudaakane",
            password: "N302aoe3"
        }
    ];
    return new Promise((resolve,reject) => {
        resolve(users);
    });
};

function checkRegistered(users,user) {
    const registered = users.some(
        u => u.name === user.name && u.password === user.password
    );
    return new Promise((resolve,reject) => {
        if (registered) {
            resolve(true);
        } else {
            reject('違います');
        }
    });
};

async function login(userData) {
    try {
        const resUsers = await getUsers();
        const result = await checkRegistered(resUsers,userData);
        if(result){
            localStorage.setItem('token', 'far0fja*ff]afaawfqrlzkfq@aq9283af');
            location.href="index.html";
        } else {
            location.href="failure.html";
        }
    } catch (err) {
        location.href="failure.html";
    }
};
