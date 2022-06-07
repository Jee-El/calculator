const display = document.querySelector(`.display`);
const numpad = document.querySelectorAll(`.numpad`);
const backspaceBtn = document.querySelector(`.delete`);
const lastOperation = document.querySelector(`.last-operation`);
const operatorsBtns = [...document.querySelectorAll('.operators')];
const clearBtn = operatorsBtns.shift(); // Remove AC button & store it
const equalBtn = operatorsBtns.pop(); // Remove equal button & store it

let firstOperand = ``;
let secondOperand = ``;
let operator = ``;
let result = 0;
let isSquareRoot = false;
let isGCD = false;
let hasToResetDisplay = false;

// AC Button
clearBtn.addEventListener(`click`, clearData);
function clearData() {
	display.textContent = `0`
	lastOperation.textContent = ``
	firstOperand = ``;
	secondOperand = ``;
	operator = ``;
	isSquareRoot = false;
	hasToResetDisplay = false;
}

// Numbers keys
numpad.forEach((number) => number.addEventListener(`click`, displayInput));
function displayInput(e) {
	if (display.textContent === `0` || hasToResetDisplay) {
		display.textContent = ``;
		hasToResetDisplay = false;
	}
	if (allowOneDot(e)) return;
	display.textContent += e.target.textContent;
}
function allowOneDot(e) {
	if (display.textContent.includes(`.`) && e.target.textContent === `.`) return true;
}

// Backspace Button/icon
backspaceBtn.addEventListener(`click`, goBackOneStep);
function goBackOneStep() {
	if (display.textContent.length === 1) return display.textContent = `0`;
	display.textContent = display.textContent.slice(0, -1);
}

// Operators Buttons
operatorsBtns.forEach((operatorBtn) => operatorBtn.addEventListener(`click`, getInput));

// Equal Button
equalBtn.addEventListener(`click`, evaluate);

function getInput(e) {
	if (operator) evaluate();
	firstOperand = +display.textContent;
	operator = e.target.textContent;
	if (operator === `√`) {
		hasToResetDisplay = false;
		isSquareRoot = true;
		lastOperation.textContent = `${operator}${firstOperand} =`;
		evaluate();
		isSquareRoot = false;
		return;
	}
	if (operator === `GCD`) {
		isGCD = true;
		lastOperation.textContent = `GCD( ${firstOperand} , )`;
	} else {
		lastOperation.textContent = `${firstOperand} ${operator}`;
	}
	hasToResetDisplay = true;
}

function evaluate() {
	if (!operator || hasToResetDisplay) return;
	if (isSquareRoot) {		
		result = operate(firstOperand, secondOperand, operator);
	} else {
		secondOperand = +display.textContent;
		if (isGCD) {
			lastOperation.textContent = `GCD ( ${firstOperand} , ${secondOperand} )`;
			isGCD = false;
		} else {
			lastOperation.textContent = `${firstOperand} ${operator} ${secondOperand} =`;
		}
		result = operate(firstOperand, secondOperand, operator);
	}
	if (typeof result === `number`) {
		display.textContent = Math.round(result * (10**7)) / 10**7;
	} else {
		display.textContent = result;
	}
	operator = ``;
}

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
	if (b === 0) return `Error`;
	return a / b;
}

function getPercentage(a, b) {
	return multiply(a / 100, b);
}

function getSquareRoot(a) {
	if (a < 0) return `Error`;
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
		return `Integers only`;
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
			return checkForValidInput(a, b);
	}
}