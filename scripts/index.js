// Объявили константы
const CURRENCY = ' руб.';
const STATUS_IN_LIMIT = 'Все хорошо';
const STATUS_OUT_OF_LIMIT = 'Все плохо';
const STATUS_OUT_OF_LIMIT_CLASSNAME = 'status_red';
const STORAGE_LABEL_LIMIT = 'limit';
const STORAGE_LABEL_EXPENSES = 'expenses';

// Объявление переменных - ссылок на объекты в DOM 
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

// Получает лимит из памяти браузера (проверка значения в функциях)
const LIMIT = parseInt(localStorage.getItem(STORAGE_LABEL_LIMIT));
let expenses = [
	//Массив, который хранит в себе список всех трат
	// Формат:
	// {
	// amount: 0,
	// category: "Продукты",
	// },
];
const expensesFormStorageString = localStorage.getItem(STORAGE_LABEL_EXPENSES);
const expensesFormStorage = JSON.parse(expensesFormStorageString);
console.log(expensesFormStorage);
if(Array.isArray(expensesFormStorage)) {
	expenses = expensesFormStorage;
}
// Инициализируем приложение
init(expenses);

// _____ ОТРАБОТЧИКИ КНОПОК____________________________
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
	//очищаем пасять браузера
	localStorage.removeItem(STORAGE_LABEL_EXPENSES)
	render(expenses);

	statusNode.classList.remove(STATUS_OUT_OF_LIMIT_CLASSNAME);
});

// Для кнопки "Изменить лимит"
popupChangeLimitButtonNode.addEventListener('click', function () {
	const LIMIT = getNewLimitFromUser();
	let totalCost = calculateExpenses(expenses);
	// Обновление для пользователя
	renderLimit(LIMIT);
	renderStatus(totalCost, LIMIT);
	clearPopUpInput();
});


// _____ ФУНКЦИИ _________________________________________
// Инициализация приложения
function init(expenses) {
	let totalCost = 0;
	totalCostOutputNode.innerText = calculateExpenses(expenses) + CURRENCY;
	renderLimit(LIMIT);
	// statusNode.innerText = STATUS_IN_LIMIT;
	render(expenses);
}

// записываем траты в память браузера
function trackExpensee(expense) {
	expenses.push(expense);
	saveExpensesLocal(expenses);
}
// Проверка значений в поле ввода
function checkInput(input) {
	if (input.value == "" || input.value <= 0) {
		return true;
	}
}
// загружаем траты в помять браузера через LocalStorage
function saveExpensesLocal(expenses) {
	const expensesString = JSON.stringify(expenses);
	localStorage.setItem(STORAGE_LABEL_EXPENSES, expensesString);
}
// берем значение траты из поля ввода трат 
function getExpenseFromUser() {
	// проверяем значение поля ввода 
	if (checkInput(inputNode)) {
		alert("Проверьте значение")
		return null;
	}
	// 2.1 Сохраняем трату с список
	const expense = {amount: parseInt(inputNode.value), category: categoryNode.value};
	// 2.2 Обновляем поле
	clearInput()

	return expense;
}
// Очистка поля ввода трат
function clearInput() {
	inputNode.value = "";
}
// очищаем поле ввода нового лимита
function clearPopUpInput() {
	changeLimitInputNode.value = "";
}
// считаем общую сумму трат
function calculateExpenses(expenses) {
	let totalCost = 0;

	expenses.forEach(element => {
		totalCost += element["amount"];
	});

	return totalCost;
}

// функция отрисовки интерфейса
function render(expenses) {
	const totalCost = calculateExpenses(expenses);
	const LIMIT = localStorage.getItem(STORAGE_LABEL_LIMIT);

	renderHistory(expenses);
	renderSum(totalCost);
	renderStatus(totalCost, LIMIT);
}
// отрисовка лимита в интерфейсе
function renderLimit(limit) {
	if(checkLimitInStorage(limit)) {
		localStorage.setItem(STORAGE_LABEL_LIMIT, 1000);
		limit = localStorage.getItem(STORAGE_LABEL_LIMIT)
		limitNode.innerText = limit + CURRENCY;
	}
	limitNode.innerText = limit + CURRENCY;
}
// Проверка наличия лимита в памяти устройства. Если нет, лимит = 1000
function checkLimitInStorage(limit) {
	if(!limit) {
		return true;
	}
}
// отрисовка истории трат в интерфейсе
function renderHistory(expenses) {
	let expensesListHTML = '';
	expenses.forEach(element => {
		expensesListHTML += `<li>${element["amount"]} ${CURRENCY} - ${element["category"]}</li>`;
	});
	
	historyNode.innerHTML = `<ol>${expensesListHTML}</ol>`;
}
// отрисовка суммы трат в интерфейсе
function renderSum(totalCost) {
	totalCostOutputNode.innerText = totalCost + CURRENCY;
}
// отрисовка статуса в интерфейсе
function renderStatus(totalCost, limit) {
	const availableMoney = limit - totalCost;
	if (totalCost <= limit) {
		statusNode.innerText = STATUS_IN_LIMIT + ", есть " + availableMoney;
		statusNode.classList.remove(STATUS_OUT_OF_LIMIT_CLASSNAME);
	} else {
		statusNode.innerText = STATUS_OUT_OF_LIMIT + " на " + availableMoney;
		statusNode.classList.add(STATUS_OUT_OF_LIMIT_CLASSNAME);
	}
}
//Ссчитывание нового лимита из поля ввода лимита
function getNewLimitFromUser() {
	// Смысл проверки: если введене "не такое" значение, то лимит отстается тем же
	if (checkInput(changeLimitInputNode)) {
		alert("Не введен лимит");
		return localStorage.getItem(STORAGE_LABEL_LIMIT);
	} else {
		// 2.1 Берем данные из инпута
		const newLimit = parseInt(changeLimitInputNode.value);
		localStorage.setItem(STORAGE_LABEL_LIMIT, newLimit);
		// 2.2 Обновляем поле
		togglePopup()

		return newLimit;
	}
}