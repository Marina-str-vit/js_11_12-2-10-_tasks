// : вкінці параметру це динамічний параметр
const BASE_URL = "http://localhost:3001/todos"

const form = document.querySelector(".todo-form");
const container = document.querySelector(".list");

form.addEventListener("submit", handleSubmit);
container.addEventListener("click", handleUpdate);
container.addEventListener("click", handleDelete);


function fetchData(url = BASE_URL, options = {}) {
    return fetch(url, options)
        .then(response => {
            if(!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
}

fetchData(BASE_URL)
    .then(data => container.insertAdjacentHTML("beforeend", createMarkup(data)))
    .catch(error => console.log(error))

function createMarkup(arr) {
    return arr.map(({ id, title, completed }) => `
        <li class="list__item" data-id="${id}">
            <input type="checkbox" class="list__checkbox" ${completed && "checked"}>
            <h2 class="list__title">${title}</h2>
            <button class="list__btn">X</button>
        </li>
    `).join("");
}

function handleSubmit(event) {
    event.preventDefault();


    const { todo } = event.target.elements;

    fetchData(BASE_URL, {
// відповідає за створення даних
        method: "POST",
        headers: {
            "Content-Type": "application/json" // це службова інфа  - ми кажемо серверу ми передаємо дані в json форматі, але часто сервери розуміють і цей рядок не просять
        },
//ОБОВ'ЯЗКОВО передаємо дані на сервер у форматі рядка!!. Ключі є в записі окремо
        body: JSON.stringify({ title: todo.value, completed: false })
    })
        .then(response => {
            container.insertAdjacentHTML("beforeend", createMarkup([response]))
        })
        .catch(error => console.log(error))
        .finally(() => event.target.reset())
}

function handleUpdate(event) {
    if(!event.target.classList.contains("list__checkbox")) {
        return;
    }

    event.preventDefault();
    
    const parent = event.target.closest(".list__item");
    const id = parent.dataset.id;
    
//   /${id} - елемент який я хочу змінити  
    fetchData(`${BASE_URL}/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ completed: event.target.checked }) // яке саме значення я хочу змінити!!
    })
        .then(data => event.target.checked = data.completed)
        .catch(error => console.log(error))
}

function handleDelete(event) {
    if(!event.target.classList.contains("list__btn")) {
        return;
    }

    const parent = event.target.closest(".list__item");
    const id = parent.dataset.id;


   
    
//робимо запит на сервер для видалення даних з бази даних по id
    fetchData(`${BASE_URL}/${id}`, {
        method: "DELETE"
    })
        .then(data => parent.remove())
        .catch(error => console.log(error))
}

/**
*===========================
*/
//   /${id} - елемент який я хочу знайти та вставити нові данні, а всі дані що були видаляться!  
//     fetchData(`${BASE_URL}/${id}`, {
//          method: "PUT",
//         body: JSON.stringify({ completed: event.target.checked })
//     })
//         .then(data => event.target.checked = data.completed)
//         .catch(error => console.log(error))
// }

//методи "PUT" або "PATCH" використовуємо згідно документації, але частіше краще брати спред-оператор і властивістю перезаписати

