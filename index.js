const keys = document.querySelectorAll('.keys > button');
const calculationDisplay = document.querySelector(`.calculation-display`);

keys.forEach((key) => {
    if (key.classList.item(1) === `AC` || key.classList.item(1) === `=`) {
        return;
    }
    key.addEventListener(`click`, (e) => {
        calculationDisplay.textContent += `${e.target.classList.item(1)}`;
    });
})

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function getPercentage(a, b) {
    return multiply((parseInt(a)/100), b);
}

function getSquareRoot(a) {
    return Math.sqrt(a);
}

function operate(a, operator, b) {
    switch (operator) {
        case `+`:
            add(a,b);
            break;
        case `-`:
            subtract(a,b);
            break;
        case `x`:
            multiply(a,b);
            break;
        case `÷`:
            divide(a,b);
            break;
        case `%`:
            getPercentage(a,b);
            break;
        case `√`:
            getSquareRoot(a);
    }
}