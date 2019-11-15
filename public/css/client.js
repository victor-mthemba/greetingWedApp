document.addEventListener('DOMContentLoaded', function () {
    let errorMessageElem = document.querySelector('.error');
    setTimeout(function () {
        if (errorMessageElem.innerHTML !== '') {
            errorMessageElem.innerHTML = ''
        }
    }, 2000);
});