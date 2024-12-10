import './style.css'
import axios from 'axios'


// Створи фільмотеку з популярними фільмами, для цього використай
// https://developer.themoviedb.org/reference/trending-movies

// Щоб отримати постер фільму потрібно підставити url з відповіді від бекенду та url з документації
// https://developer.themoviedb.org/docs/image-basics

// Відмалюй картки з фільмами
// Приклад картки  => https://prnt.sc/Hi_iLLg7Nd1F

// Реалізуй пагінацію
// 1 Кнопка "Load More"
// 2 Infinity scroll (https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

//це константа сайту
const BASE_URL = "https://api.themoviedb.org/3";
// хвістик, що шукаємо
const END_POINT = "/trending/movie/week";
const API_KEY = "345007f9ab440e5b86cef51be6397df1";

// відмальовую сюди картки фільмів
const container = document.querySelector(".js-movie-list");

// кнопка, що відповідає за дозавантаження фільмів
const loadMore = document.querySelector(".js-load-more");

loadMore.addEventListener("click", onLoadMore);

// це номер сторінки яку хочу завантажити
let page = 1;

// фун-ція буде робити запит на сервер, чекати, поки сервер поверне рез-т і буде обробляти рез-т
// т.к. чекаємо, то фун-ція асинхронна 
async function serviceMovie(page = 1) {
// в цій змінній зберігаємо рез-т виклику axios, і рез-т збережу в цю змінну  
// деструктурую, щоб одразу отримати необхідну інфу    
    const { data } = await axios(`${BASE_URL}${END_POINT}`, {
// це є query -параметр, він підставиться в https//api.../..?api_key=(query - параметр)     
        params: {
            api_key: API_KEY,
            page // скористалися коротким синтаксисом
        }
    });

    return data;
}

// оброблюю отриманий проміс
//це є ПЕРШЕ ЗАВАНТАЖЕННЯ СТОРІНКИ!!! тому умову пишемо, що це є не остання сторінка
serviceMovie()
    .then(data => {
// завантажую дані в HTML і в функцію створення карток, де лише (data.results) - бо нам не потрібня вся інфа, що є в карточці
        container.insertAdjacentHTML("beforeend", createMarkup(data.results));
// умова створення кнопки "ЗАВАНТАЖИТИ БІЛЬШЕ" коли page менша і не дорінюю загальній кількості, бо якщо дорівнює, то буде відображатися все одно на останній сторінці
        if(data.page < data.total_pages) {
          loadMore.classList.replace("load-more-hidden", "load-more");
        }        
    })
    .catch(error => alert(error.message))

// відмалюю картки з фільмами
function createMarkup(arr) {
    //деструктурую, щоб розкидати інфу по картці
    return arr.map(({ poster_path, release_date, original_title, vote_average }) => `
        <li class="movie-card">        
// https://image.tmdb.org/t/p/w300 - це інфа з документації; ${poster_path} - це ключ кожної окремої картки
            <img src="https://image.tmdb.org/t/p/w300${poster_path}" alt="${original_title}">
            <div class="movie-info">
                <h2>${original_title}</h2>
                <p>Release Date: ${release_date}</p>
                <p>Vote Average: ${vote_average}</p>
            </div>
        </li>
    `).join("");
}

// ця фун-ція ДЛЯ КНОПКИ і буде збільшувати поточну page і викликати запит на сервер, і домальовувати нашу розмітку
async function onLoadMore() {
    page += 1;
// робимо кнопку НЕАКТИВНОЮ коли користувач її нажав, щоб припинити постійні нетерплячі кліки
    loadMore.disabled = true;
// використовую   try catch на випадок помилки, коли будемо чекати рез-тат
    try {
        const data = await serviceMovie(page);
        container.insertAdjacentHTML("beforeend", createMarkup(data.results))
// знову умова: ПОТРІБНА ОСТАННЯ page для прибрання кнопки! АЛЕ якщо хочимо, можно додати умову ELSE і саме ам прописати умову для першої сторінки, що вказали раніше
        if(data.page >= data.total_pages) {
// змінюю видимість кнопки з видимої на невидиму бо більше нічого не має по запиту
            loadMore.classList.replace("load-more", "load-more-hidden");
        }

        const card = document.querySelector(".movie-card");
        const cardHeight = card.getBoundingClientRect().height;
        
        window.scrollBy({
            left: 0,
            top: cardHeight,
            behavior: "smooth"
        })
    } catch(error) {
        alert(error.message)
    } finally {
// а коли вже отримали сторінку, то можна знову тисниту на кнопку
        loadMore.disabled = false;
    }
}






// --------------------------------------

// const container = document.querySelector(".js-movie-list");
// const guard = document.querySelector(".js-guard");

// const options = {
//     root: null,
//     rootMargin: "300px",
//     threshold: 0,
// };

// const observer = new IntersectionObserver(handlePagination, options);


// let page = 1;

// async function serviceMovie(page = 1) {
//     const { data } = await axios(`${BASE_URL}${END_POINT}`, {
//         params: {
//             api_key: API_KEY,
//             page
//         }
//     });

//     return data;
// }

// function createMarkup(arr) {
//     return arr.map(({ poster_path, release_date, original_title, vote_average }) => `
//         <li class="movie-card">
//             <img src="https://image.tmdb.org/t/p/w300${poster_path}" alt="${original_title}">
//             <div class="movie-info">
//                 <h2>${original_title}</h2>
//                 <p>Release Date: ${release_date}</p>
//                 <p>Vote Average: ${vote_average}</p>
//             </div>
//         </li>
//     `).join("");
// }

// serviceMovie()
//     .then(data => {
//         container.insertAdjacentHTML("beforeend", createMarkup(data.results));

//         if(data.page < data.total_pages) {
//             observer.observe(guard);
//         }

//     })
//     .catch(error => alert(error.message))


// function handlePagination(entries, observer) {
//     entries.forEach(async (entry) => {
//         if(entry.isIntersecting) {
//             page += 1;
            
//             try {
//                 const data = await serviceMovie(page);
//                 container.insertAdjacentHTML("beforeend", createMarkup(data.results));

//                 if(data.page >= data.total_pages) {
//                     observer.unobserve(entry.target);
//                 }

//             } catch(error) {
//                 alert(error.message)
//             }
//         }
//     })
    
// }
/**
*============================================================================
*     Початок лекції, теорія
*/

























