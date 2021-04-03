const modal = document.querySelector('.modal');
const body = document.querySelector('body');
const openBtn = document.getElementById("js-open-btn");
const cancelBtn = document.getElementById("js-cancel");

const checkCloseBtn = document.getElementById("js-check-close");
checkCloseBtn.disabled = true;

const checkbox = document.getElementById('check');
checkbox.disabled = true;
checkbox.checked = false;

const submitBtn = document.getElementById("submit");
submitBtn.disabled = true;

const form = document.getElementById('form');

const notes = document.querySelectorAll('.note');
notes.forEach(note => note.style.visibility = 'hidden');//ロード時は見えないようにする

function openModal() {
    modal.classList.add("is-show");
    body.classList.add("no-scroll");
}

function closeModal() {
    modal.classList.remove("is-show");
    body.classList.remove("no-scroll");
}

openBtn.addEventListener('click', function(e){
    e.preventDefault();
    openModal();
}, false);

cancelBtn.addEventListener('click', function(){
    closeModal();
}, false);

checkCloseBtn.addEventListener('click', function(){
    checkbox.checked = true;
    updateSubmit();//↑の操作ではchangeイベントが発動しないため
    closeModal();
}, false);

window.addEventListener('click', function(e) {
    if (e.target == modal) {
        closeModal();
    }
});

submitBtn.addEventListener('click', function(e){
    e.preventDefault();
    location.href="register-done.html";
}, false);

form.addEventListener('change', function(e) {
    visibleNote(e.target);
    updateSubmit();
});

function visibleNote(target) {
    target.nextElementSibling.style.visibility = '';
};

function updateSubmit() {
    let isValid;
    isValid = checkbox.disabled ? false : form.checkValidity();
    submitBtn.disabled = !isValid
};

//observer
const terms = document.querySelector(".modal__content")
const end = document.getElementById("end");
const options = {root: terms};
const termsObserver = new IntersectionObserver(enableCheckbox, options);
termsObserver.observe(end);

function enableCheckbox(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
        if(checkCloseBtn.disabled) {
            checkCloseBtn.disabled = false
        };
        if(checkbox.disabled){
            checkbox.disabled = false;
        };
        observer.unobserve(end);
    };
  });
};
