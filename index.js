const LIMIT = 10000;
const CURRENCY = ' руб.';
const STATUS_IN_LIMIT = 'Все хорошо';
const STATUS_OUT_OF_LIMIT = 'Все плохо';
const STATUS_OUT_OF_LIMIT_CLASSNAME = 'status_red';

// Получаю элементы из документа
const inputNode = document.querySelector('.js-input');
const buttonNode = document.querySelector('.js-input-button');
const totalCostOutputNode = document.querySelector('.js-total-output');
const historyNode = document.querySelector('.js-history');
const limitNode = document.querySelector('.js-limit');
const statusNode = document.querySelector('.js-status');

const expenses = [
	//Массив, который хранит в себе список всех трат
	// Форма:
	// {
	// category: "Продукты",
	// amount: 0,
	// },
];
init(expenses);

buttonNode.addEventListener('click', function () {
	const expense = getExpenseFromUser();
	
	if (!expense) {
		return
	}
	console.log(expense);
	trackExpensee(expense);

	render(expenses)
	
});


function init(expenses) {
	let totalCost = 0;
	totalCostOutputNode.innerText = calculateExpenses(expenses) + CURRENCY;
	limitNode.innerText  = LIMIT + CURRENCY;
	statusNode.innerText = STATUS_IN_LIMIT;
}
function trackExpensee(expense) {
	expenses.push(expense);
}

function getExpenseFromUser() {
	//1.Получаем значения из поля ввода
	if (inputNode.value == "") {
		return null;
	}
	// 2.1 Сохраняем трату с список
	const expense = {amount: parseInt(inputNode.value)};
	// 2.2 Обновляем поле
	clearInput()

	return expense;
}

function clearInput() {
	inputNode.value = "";
}

function calculateExpenses(expenses) {
	let totalCost = 0;

	expenses.forEach(element => {
		totalCost += element["amount"];
	});

	return totalCost;
}

function render(expenses) {
	const totalCost = calculateExpenses(expenses);
	renderHistory(expenses);
	renderSum(totalCost);
	renderStatus(totalCost);
}

function renderHistory(expenses) {
	let expensesListHTML = '';
	expenses.forEach(element => {
		expensesListHTML += `<li>${element["amount"]} ${CURRENCY}</li>`;
	});
	
	historyNode.innerHTML = `<ol>${expensesListHTML}</ol>`;
}

function renderSum(totalCost) {
	totalCostOutputNode.innerText = totalCost + CURRENCY;
}

function renderStatus(totalCost) {
	if (totalCost <= LIMIT) {
		statusNode.innerText = STATUS_IN_LIMIT;
	} else {
		statusNode.innerText = STATUS_OUT_OF_LIMIT;
		statusNode.classList.add(STATUS_OUT_OF_LIMIT_CLASSNAME);
	}
}