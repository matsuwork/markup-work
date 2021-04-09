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

function checkRegistered(values) {
    return new Promise((resolve,reject) => {
        const dummyUserData = [
            {
                name: "kenjimorita",
                password: "N302aoe3"
            },
            {
                name: "matsudaakane",
                password: "N302aoe3"
            }
        ];
        const isUser = dummyUserData.some(
            u => u.name === values.name && u.password === values.password
        );

        return resolve(isUser);
    });
};

async function login(userData) {
    let result;
    try {
        result = await checkRegistered(userData);
    } catch (err) {
        result = false;
    };
    if(result){
        localStorage.setItem('token', 'far0fja*ff]afaawfqrlzkfq@aq9283af');
        location.href="index.html";
    } else {
        location.href="failure.html";
    }
};
