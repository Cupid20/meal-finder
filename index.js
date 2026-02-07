const favoritesList = document.querySelector('.favorites');


async function searchMeal(e) {

    e.preventDefault();

    const input = document.querySelector('input');
    const value = input.value.trim();

    if (value === '') {
        alert('please type meal name');
        return;
    }

    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`);
    const data = await res.json();

    if (!data.meals) {
        alert('meal not found');
        return;
    }

    const meal = data.meals[0];

    
    localStorage.setItem('lastMeal', JSON.stringify(meal));

    showMealInfo(meal);

    input.value = '';
}


function showMealInfo(meal) {

    const title = document.querySelector('.title');
    const info = document.querySelector('.info');
    const img = document.querySelector('.img');
    const ingredientsOutput = document.querySelector('.ingredients');

    title.textContent = meal.strMeal;
    info.textContent = meal.strInstructions;
    img.style.backgroundImage = `url(${meal.strMealThumb})`;

    const favBtn = document.querySelector('.fav-btn');

    favBtn.onclick = function () {
        addToFavorites(meal);
    };

    let ingredients = [];

    for (let i = 1; i <= 25; i++) {

        let ing = meal['strIngredient' + i];
        let measure = meal['strMeasure' + i];

        if (ing && ing.trim() !== '') {
            ingredients.push(ing + ' - ' + measure);
        }
    }

    ingredientsOutput.innerHTML =
        `<ul>` +
        ingredients.map(item => `<li class="ing">${item}</li>`).join('') +
        `</ul>`;
}


function addToFavorites(meal) {

    let favorites = JSON.parse(localStorage.getItem('favorites'));

    if (!favorites) {
        favorites = [];
    }

    let exist = favorites.find(fav => fav.idMeal === meal.idMeal);

    if (exist) return;

    favorites.push({
        idMeal: meal.idMeal,
        strMeal: meal.strMeal
    });

    localStorage.setItem('favorites', JSON.stringify(favorites));

    loadFavorites();
}


function loadFavorites() {

    if (!favoritesList) return;

    favoritesList.innerHTML = '';

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    favorites.forEach(function (meal) {

        let li = document.createElement('li');

        li.textContent = meal.strMeal;
        li.setAttribute('data-id', meal.idMeal);

        favoritesList.appendChild(li);
    });
}


function loadLastMeal() {

    let meal = JSON.parse(localStorage.getItem('lastMeal'));

    if (meal) {
        showMealInfo(meal);
    }
}


const form = document.getElementById('form');

if (form) {
    form.addEventListener('submit', searchMeal);
}

const magnifier = document.querySelector('.magnifier');

if (magnifier) {
    magnifier.addEventListener('click', searchMeal);
}


loadFavorites();
loadLastMeal();