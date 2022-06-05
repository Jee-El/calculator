const display = document.querySelector(`.display`);
const numpad = document.querySelectorAll(`.numpad`);
const operators = document.querySelectorAll('.operators:not(:first-child)');
const clearBtn = document.querySelector(`.operators:first-child`);
const backspaceBtn = document.querySelector(`.delete`);
const currentOperation = document.querySelector(`.current-operation`);

let para = [];
let op = [];
let calculations = [];

// AC key
clearBtn.addEventListener(`click`, clearData);

// Delete button
backspaceBtn.addEventListener(`click`, backspace);

// Get & show user input
numpad.forEach((num) =>
	num.addEventListener(`click`, (e) => {
		if (display.classList.contains(`result-is-displayed`)) {
			clearData();
			display.textContent = ``;
			display.classList.remove(`result-is-displayed`);
		}
		// Prevent multiple decimal points
		if (display.textContent.includes(`.`) && e.target.textContent === `.`) {
			return;
		}
		display.textContent += e.target.textContent;
	})
);

let keyCodes = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 190];
document.addEventListener(`keydown`, (e) => {
	// Check if the key pressed is supported
	for (let i = 0; i < keyCodes.length; i++) {
		if (e.keyCode !== keyCodes[i]) {
			if (i === 10) return;
			continue;
		}
		break;
	}

	if (display.classList.contains(`result-is-displayed`)) {
		display.textContent = ``;
		display.classList.remove(`result-is-displayed`);
	}

	// Prevent multiple decimal points
	if (display.textContent.includes(`.`) && e.keyCode === 190) {
		return;
	}
	display.textContent += e.key;
});

// Calculate user input
operators.forEach((operator) => {
	operator.addEventListener(`click`, (e) => {
		if (display.textContent.trim() === ``) {
			if (op.length) {
				// To change the operator to the latest clicked one
				// if two or more are pressed one after another
				op.shift();
				calculations.pop();
				op.push(e.target.textContent);
				calculations.push(e.target.textContent);
				currentOperation.textContent = calculations.join(` `);
				return;
			}
			// Otherwise if input is empty and no operator was clicked, leave
			return;
		}
		if (display.classList.contains(`result-is-displayed`)) {
			if (display.textContent === `0`) return;
			display.textContent = ``;
			display.classList.remove(`result-is-displayed`);
		} else {
			para.push(+display.textContent);
			calculations.push(+display.textContent);
		}
		op.push(e.target.textContent);
		calculations.push(e.target.textContent);
		currentOperation.textContent = calculations.join(` `);
		display.textContent = ``;
		// The square root doesn't require two parameters
		if (e.currentTarget.textContent === `√`) {
			// To display √8 instead of 8√
			currentOperation.textContent = calculations.reverse().join(``);

			let result = getSquareRoot(para[0]);
			display.textContent = Math.round(result * 10 ** 7) / 10 ** 7;

			display.classList.add(`result-is-displayed`);
			// Save the result for next operation, clear the rest
			para.splice(0, 2, result);
			calculations = [];
			calculations.push(display.textContent);
			// Update the operator used in operate()
			op.shift();
			return;
		}

		// Need 2 parameters otherwise
		if (para.length === 1) return;
		if (op[0] === `=`) op.shift();
		let result = operate(para[0], para[1], op[0]);

		// Result can be a string in case of an error, so Math.round wouldn't work
		if (typeof result === `number`) {
			display.textContent = Math.round(result * 10 ** 7) / 10 ** 7;
		} else {
			display.textContent = result;
		}
		display.classList.add(`result-is-displayed`);

		// Save the result for next operation, clear the rest
		para.splice(0, 2, result);
		calculations = [];
		calculations.push(display.textContent);
		// Update the operator used in operate()
		op.shift();
	});
});

function backspace() {
	// Prevent the backspace button from removing the default display value
	if (display.textContent.length === 1) return (display.textContent = `0`);
	
	display.textContent = display.textContent.slice(
		0,
		display.textContent.length - 1
	);
}

function clearData(e) {
	display.textContent = `0`;
	currentOperation.textContent = ``;
	para = [];
	op = [];
	calculations = [];
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
