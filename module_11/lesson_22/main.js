/**
* вивведемо дані на строрінку та будемо ними маніпулювати
*/
const BASE_URL = "http://localhost:3001/todos"    // : вкінці параметру це динамічний параметр

const form = document.querySelector(".todo-form"); // форма
const container = document.querySelector(".list"); // відмальовуються всі .todo

form.addEventListener("submit", handleSubmit); // створюємо новий запис в СПРАВІ
container.addEventListener("click", handleUpdate); // 
container.addEventListener("click", handleDelete);

// функція робе запит на сервер, перевіряє чи є помлка чи ні, потім повернення результату запиту на сервер
// добавили дані за замовчуванням, на випадок, якщо не буде передані дані. options = {} - це метод котрий будемо використовувати для оброблення даних
function fetchData(url = BASE_URL, options = {}) {
    return fetch(url, options)
        .then(response => {
            if(!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json(); // розпарсювання даних
        })
}
//перевірка чи працює функція і виводимо всі дані на екран
fetchData(BASE_URL)
    .then(data => container.insertAdjacentHTML("beforeend", createMarkup(data)))
    .catch(error => console.log(error))

// відмальовуємо дані на екран, використовую деструктуризацію
function createMarkup(arr) {
    return arr.map(({ id, title, completed }) => `
        <li class="list__item" data-id="${id}">
            <input type="checkbox" class="list__checkbox" ${completed && "checked"}>  //completed це властивість яка відповідає за вибір цієї позиції, а && просить щоб обидва операнда в стані true!!! Властивість HTML "checked" пишемо в лапках
            <h2 class="list__title">${title}</h2>
            <button class="list__btn">X</button>
        </li>
    `).join("");    // .join("") щоб перетворити массив на рядок
}

function handleSubmit(event) {
    event.preventDefault(); // прибираємо можливість при перезагрузки змінювати введені дані

// в HTML name="todo" тому тут я отримую доступ до текстового інпуту
    const { todo } = event.target.elements;
    

    fetchData(BASE_URL, {
        method: "POST", // відповідає за відправлення даних 
        headers: {
            "Content-Type": "application/json" // це службова інфа  - ми кажемо серверу ми передаємо дані в json форматі, але часто сервери розуміють і цей рядок не просять
        },
//ОБОВ'ЯЗКОВО передаємо дані на сервер у форматі рядка!!. Ключі є в записі окремо
        body: JSON.stringify({ title: todo.value, completed: false })   // todo.value це значення мого інпуту, який я відправлює на сервер
    })
//обробляю результат запиту і виводжу новим пунктом на екран        
        .then(response => { // при отриманні об'єкта треба його привести у масив - ставлю літерал масиву [], що отримали з сервера дані одразу у вигляді масиву
            container.insertAdjacentHTML("beforeend", createMarkup([response]))
        })
        .catch(error => console.log(error))
        .finally(() => event.target.reset()) //  очищаю форму!!
}
//делегуємо подію на контейрнер, але вибираємо елемент по класу
function handleUpdate(event) {
    if(!event.target.classList.contains("list__checkbox")) { // клієнт клікнув не почекбоксу, тому функція припинить работу
        return;
    }
// можна клікати, але на екрані нічого не змінеться, не відобразиться галочка, лише в консолі побачу true стан чекбоксу
    event.preventDefault(); // припиняю дефолтну поведінку відміняю фолс, хочу щоб перемикання відображалося не тільки на екрані, мені потрібно прибрати превентдефолт

//отримую батьківську <li> і витягую з нього дані, а саме посилання на <li>  
    const parent = event.target.closest(".list__item"); // знайде найближчий батьківський елемент
    const id = parent.dataset.id; // отримую id з цього батьківського елемента
    
//   /${id} - це елемент на якому змінюю стан чекбокса, і перезаписую його 
    fetchData(`${BASE_URL}/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ completed: event.target.checked }) // змінюю стан чекбокса
    })
        .then(data => event.target.checked = data.completed) // checked - це властивість, тому кажу, щоб вона перезаписала нове значення
        .catch(error => console.log(error.message))
}
//тепер чекбокс відображає на сервері всі дії, що робить клиєнт на екрані

// видаляю записи. Знову отримую id, щоб видалити необхідне
function handleDelete(event) {
    if(!event.target.classList.contains("list__btn")) {
        return;
    }

    const parent = event.target.closest(".list__item");
    const id = parent.dataset.id;
    
//робимо запит на сервер для видалення даних з бази даних по id
    fetchData(`${BASE_URL}/${id}`, {
        method: "DELETE"    // видалили на сервері
    })
        .then(data => parent.remove()) // видалили на екрані в HTML викликали метод .remove()
        .catch(error => console.log(error.message))
}
//дізебл тру одразу коли починає працювати функція, а коли запит на сервер завершивс з будьяким результатом робимо дізебл фолс
/**
*===========================
*/
//   /${id} - елемент який я хочу знайти та видалити властивість, а прописані дані зміняться!
//     fetchData(`${BASE_URL}/${id}`, {
//          method: "PUT",
//         body: JSON.stringify({ completed: event.target.checked })
//     })
//         .then(data => event.target.checked = data.completed)
//         .catch(error => console.log(error))
// }

//методи "PUT" або "PATCH" використовуємо згідно документації, але частіше краще брати спред-оператор і властивістю перезаписати

