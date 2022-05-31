const operators = document.querySelectorAll('.operators:not(:first-child)');
const clearBtn = document.querySelector(`.operators:first-child`);
const equalBtn = operators[operators.length - 1];
const numpad = document.querySelectorAll(`.numpad`);
const calcDisplay = document.querySelector(`.calc-display`);

// AC key
clearBtn.addEventListener(`click`, () => {
	calcDisplay.textContent = ``;
});

let nums = [];
// Show user input
numpad.forEach((num) => {
	num.addEventListener(`click`, (e) => {
        if (calcDisplay.classList.contains(`test`)) {
            calcDisplay.textContent = ``;
            calcDisplay.classList.remove(`test`);
        }
		calcDisplay.textContent += e.target.textContent;
	});
});

// Calculate user input
let parameters = [];
let pressedOperators = [];
operators.forEach((operator) => {
	operator.addEventListener(`click`, (e) => {
		pressedOperators.push(e.target.textContent);
		parameters.push(+calcDisplay.textContent);
		calcDisplay.textContent = ``;
		if (operator.textContent === `√`) {
            calcDisplay.classList.add(`test`);
			let result = getSquareRoot(...parameters);
            calcDisplay.textContent = Math.round(result * 10 ** 7) / 10 ** 7;
            parameters = [];
		    pressedOperators = [];
            return;
		}
		if (parameters.length === 1) return;
        if (e.target.textContent === `=` && pressedOperators[0] !== `√`) {
            calcDisplay.classList.add(`test`);
			let result = operate(
				...parameters,
				pressedOperators[0]
			);
            calcDisplay.textContent = Math.round(result * (10 ** 7)) / 10 ** 7;
            parameters = [];
		    pressedOperators = [];
            return;
		}
        calcDisplay.classList.add(`test`);
        let result = operate(...parameters, pressedOperators[0])
		calcDisplay.textContent = Math.round(result * 10 ** 7) / 10 ** 7;
		parameters = [];
		pressedOperators = [];
	});
});

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
	return multiply(a / 100, b);
}

function getSquareRoot(a) {
	return Math.sqrt(a);
}

// This one is only for GCD
function checkForValidInput(a, b) {
	if (
		!Number.isInteger(a) ||
		!Number.isInteger(b) ||
		a.toString().split('').length > 12 ||
		b.toString().split('').length > 12
	) {
		return (result.textContent = `Enter 12 digits or less.`);
	}
	if (a === 0 && b === 0) {
		return (result.textContent = `One integer has to be non-null`);
	}
}
function findGCD(a, b) {
	a = Math.abs(a);
	b = Math.abs(b);
	if (a === 0) return b;
	if (b === 0) return findGCD(b, a);
	if (a % b === 0) {
		return a > b ? b : a;
	}
	return findGCD(b, a % b);
}

function operate(a, b, operator) {
	switch (operator) {
		case `+`:
			return add(a, b);
		case `—`:
			return subtract(a, b);
		case `x`:
			return multiply(a, b);
			break;
		case `÷`:
			return divide(a, b);
		case `%`:
			return getPercentage(a, b);
		case `√`:
			return getSquareRoot(a);
        case `GCD`:
            return findGCD(a,b);
	}
}