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
const categoryNode = document.querySelector('.js-category');
const clearButtonNode = document.querySelector('.js-clear-history-button');
const changeLimitInputNode = document.querySelector('.change-limit-input');
const popupChangeLimitButtonNode = document.querySelector('.js-popup-button');

let LIMIT = 10000;
const expenses = [
	//Массив, который хранит в себе список всех трат
	// Форма:
	// {
	// amount: 0,
	// category: "Продукты",
	// },
];
init(expenses);
// Код для кнопки "Добавить"
buttonNode.addEventListener('click', function () {
	const expense = getExpenseFromUser();
	
	if (!expense) {
		return
	}
	trackExpensee(expense);

	render(expenses)
	
});
// Код для кнопки "Сбросить все расходы"
clearButtonNode.addEventListener('click', function (){
	expenses.length = 0;
	render(expenses);
	statusNode.classList.remove(STATUS_OUT_OF_LIMIT_CLASSNAME);
});

// Для кнопки "Изменить лимит"
popupChangeLimitButtonNode.addEventListener('click', function () {
	LIMIT = getNewLimitFromUser();
	let totalCost = calculateExpenses(expenses);
	// Обновление для пользователя
	renderLimit(LIMIT);
	renderStatus(totalCost);
	clearPopUpInput();
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
	if (inputNode.value == "" || inputNode.value <= 0) {
		return null;
	}
	// 2.1 Сохраняем трату с список
	const expense = {amount: parseInt(inputNode.value), category: categoryNode.value};
	// 2.2 Обновляем поле
	clearInput()

	return expense;
}

function clearInput() {
	inputNode.value = "";
}

function clearPopUpInput() {
	changeLimitInputNode.value = "";
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

function renderLimit(limit) {
	limitNode.innerText = limit;
}

function renderHistory(expenses) {
	let expensesListHTML = '';
	expenses.forEach(element => {
		expensesListHTML += `<li>${element["amount"]} ${CURRENCY} - ${element["category"]}</li>`;
	});
	
	historyNode.innerHTML = `<ol>${expensesListHTML}</ol>`;
}

function renderSum(totalCost) {
	totalCostOutputNode.innerText = totalCost + CURRENCY;
}

function renderStatus(totalCost) {
	const availableMoney = LIMIT - totalCost;
	if (totalCost <= LIMIT) {
		statusNode.innerText = STATUS_IN_LIMIT + ", есть " + availableMoney;
		statusNode.classList.remove(STATUS_OUT_OF_LIMIT_CLASSNAME);
	} else {
		statusNode.innerText = STATUS_OUT_OF_LIMIT + " на " + availableMoney;
		statusNode.classList.add(STATUS_OUT_OF_LIMIT_CLASSNAME);
	}
}

//Функция для считывания нового лимита
function getNewLimitFromUser() {
	if (changeLimitInputNode.value == "" || changeLimitInputNode.value <= 0) {
		return null;
	}
	// 2.1 Берем данные из инпута
	const newLimit = parseInt(changeLimitInputNode.value);
	// 2.2 Обновляем поле
	togglePopup()

	return newLimit;
}