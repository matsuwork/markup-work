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
    closeModal();
}, false);

window.addEventListener('click', function(e) {
    if (e.target == modal) {
        closeModal();
    }
});

submitBtn.addEventListener('click', function(e){
    e.preventDefault();
    if(checkbox.checked){
        location.href="register-done.html";
    } else {
        alert('利用規約を読み、同意する場合はチェックボックスをチェックしてください。')
    }
}, false);

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



