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
let hasMinusSign = false;
let resultIsAnError = false;
let hasToResetDisplay = false;

// AC Button
clearBtn.addEventListener(`click`, clearData);

function clearData() {
	display.textContent = `0`;
	lastOperation.textContent = ``;
	firstOperand = ``;
	secondOperand = ``;
	operator = ``;
	result = 0;
	isSquareRoot = false;
	hasMinusSign = false;
	resultIsAnError = false;
	hasToResetDisplay = false;
}

// Numbers keys
numpad.forEach((number) => {
	number.addEventListener(`click`, (e) => {
		displayInput(e.target.getAttribute(`data-key`));
	});
});

function displayInput(input) {
	if (display.textContent === `0` || hasToResetDisplay) {
		display.textContent = ``;
		hasMinusSign = false;
		hasToResetDisplay = false;
	}
	if (resultIsAnError) handleError();
	if (input === '±') return handleSignBtn();
	if (handleDecimalDot(input)) return;
	display.textContent += input;
}

function handleError() {
	display.textContent = ``;
	lastOperation.textContent = ``;
	resultIsAnError = false;
}

function handleSignBtn() {
	if (display.textContent.includes('-')) {
		hasMinusSign = false;
		display.textContent = display.textContent.replace(`-`, ``);
	}
	hasMinusSign = true;
	display.textContent = `-` + display.textContent;
}

function handleDecimalDot(input) {
	if (display.textContent.includes(`.`) && input === `.`) return true;
	if (input === `.` && display.textContent === '') display.textContent = '0';
}

// Backspace Button/icon
backspaceBtn.addEventListener(`click`, goBackOneStep);

function goBackOneStep() {
	if (display.textContent.length === 1) return (display.textContent = `0`);
	display.textContent = display.textContent.slice(0, -1);
}

// Operators Buttons
operatorsBtns.forEach((operatorBtn) =>
	operatorBtn.addEventListener(`click`, (e) => {
		saveInput(e.target.getAttribute(`data-key`));
	})
);

// Equal Button
equalBtn.addEventListener(`click`, evaluate);

function saveInput(input) {
	if (operator) evaluate();
	if (resultIsAnError) return;
	// +"-" returns NaN
	if (hasMinusSign && display.textContent.length === 1) {
		firstOperand = -1;
	} else {
		firstOperand = +display.textContent;
	}
	operator = input;
	if (operator === `√`) {
		hasToResetDisplay = false;
		isSquareRoot = true;
		lastOperation.textContent = `${operator}${firstOperand} =`;
		evaluate();
		isSquareRoot = false;
		return;
	}
	lastOperation.textContent = `${firstOperand} ${operator}`;
	hasToResetDisplay = true;
}

function evaluate() {
	if (!operator || hasToResetDisplay) return;
	if (isSquareRoot) {
		result = operate(firstOperand, secondOperand, operator);
	} else {
		// +"-" => NaN
		if (hasMinusSign && display.textContent.length === 1) {
			secondOperand = -1;
		} else {
			secondOperand = +display.textContent;
		}
		lastOperation.textContent = `${firstOperand} ${operator} ${secondOperand} =`;
		result = operate(firstOperand, secondOperand, operator);
	}
	if (typeof result === `number`) {
		display.textContent = Math.round(result * 10 ** 7) / 10 ** 7;
	} else {
		resultIsAnError = true;
		display.textContent = result;
	}
	operator = ``;
	hasToResetDisplay = true;
}

window.addEventListener(`keydown`, interpretKeyboardNumpad);
window.addEventListener(`keydown`, saveKeyboardInput);
// Get result if enter or equal sign is clicked
window.addEventListener(
	`keydown`,
	(e) => (e.keyCode === 13 || e.keyCode === 187) && evaluate()
);
window.addEventListener(`keydown`, (e) => e.keyCode === 8 && goBackOneStep());
let keyCodesToInput = {
	48: 0,
	49: 1,
	50: 2,
	51: 3,
	52: 4,
	53: 5,
	54: 6,
	55: 7,
	56: 8,
	57: 9,
	190: `.`,
};

function interpretKeyboardNumpad(e) {
	if (e.keyCode in keyCodesToInput) {
		displayInput(keyCodesToInput[e.keyCode]);
	}
}

function saveKeyboardInput(e) {
	if (interpretKeyboardOperators(e)) {
		saveInput(interpretKeyboardOperators(e));
	}
}
// % / * - + in this order
// some require shiftKey to be held
let operatorsKeys = [53, 191, 56, 189, 187];

function interpretKeyboardOperators(e) {
	if (e.keyCode === 53 && e.shiftKey) return `%`;
	if (e.keyCode === 191) return `÷`;
	if (e.keyCode === 56 && e.shiftKey) return `x`;
	if (e.keyCode === 189) return `-`;
	if (e.keyCode === 187 && e.shiftKey) return `+`;
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

function operate(a, b, operator) {
	switch (operator) {
		case `+`:
			return add(a, b);
		case `-`:
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
	}
}
