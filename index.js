const operators = document.querySelectorAll('.operators:not(:first-child)');
const clearBtn = document.querySelector(`.operators:first-child`);
const equalBtn = operators[operators.length - 1];
const numpad = document.querySelectorAll(`.numpad`);
const calcDisplay = document.querySelector(`.calc-display`);

// Make x, +, = more noticeable
operators[3].style.fontSize = `1.5rem`;
operators[5].style.fontSize = `1.5rem`;
equalBtn.style.fontSize = `1.8rem`;

// AC key
clearBtn.addEventListener(`click`, () => {
	calcDisplay.textContent = ``;
	calcDisplay.classList.remove(`test`);
	para = [];
	op = [];
});

let nums = [];
// Show user input
numpad.forEach((num) => {
	num.addEventListener(`click`, (e) => {
		if (calcDisplay.classList.contains(`result-is-displayed`)) {
			calcDisplay.textContent = ``;
			calcDisplay.classList.remove(`result-is-displayed`);
		}
		calcDisplay.textContent += e.target.textContent;
	});
});

let para = [];
let op = [];

// Calculate user input
operators.forEach((operator) => {
	operator.addEventListener(`click`, (e) => {
		if (calcDisplay.textContent.trim() === ``) {
			para.push(0);
		} else {
			para.push(+calcDisplay.textContent);
		}
		op.push(e.currentTarget.textContent);
		calcDisplay.textContent = ``;

		if (e.currentTarget.textContent === `√`) {
			calcDisplay.classList.add(`test`);
			let result = getSquareRoot(para[0]);
			calcDisplay.textContent = Math.round(result * 10 ** 7) / 10 ** 7;
			para = [];
			op = [];
			return;
		}

		if (para.length === 1) return;
		if (op[0] === `=`) return op.shift();
		if (op[1] !== `=`) {
			op.shift();
			op.push(`=`);
		}
		let result = operate(para[para.length - 2], para[para.length - 1], op[0]);
		para.splice(0, 2, result);
		op.shift();
		calcDisplay.classList.add(`result-is-displayed`);
		return (calcDisplay.textContent = Math.round(result * 10 ** 7) / 10 ** 7);
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
		return `Enter 12 digits or less.`;
	}
	if (a === 0 && b === 0) {
		return `One integer has to be non-null`;
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
			return findGCD(a, b);
	}
}
