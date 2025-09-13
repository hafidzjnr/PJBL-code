// --- 1. Seleksi Elemen DOM (Disesuaikan dengan ID HTML-mu) ---
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const recipeGallery = document.getElementById('resepGaleri');

const modalContainer = document.getElementById('resepModal');
const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImg');
const modalIngredients = document.getElementById('modalIngredients');
const modalInstructions = document.getElementById('modalInstruksi');
const closeModalBtn = document.querySelector('.closeBtn');


// --- 2. Fungsi Utama ---

async function searchRecipes() {
    const ingredient = searchInput.value.trim();
    if (ingredient === '') {
        alert('Silakan masukkan nama bahan makanan!');
        return;
    }

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        const data = await response.json();
        displayRecipes(data.meals);
    } catch (error) {
        console.error('Gagal mengambil data resep:', error);
        recipeGallery.innerHTML = '<p>Gagal memuat resep. Coba lagi nanti.</p>';
    }
}

function displayRecipes(meals) {
    recipeGallery.innerHTML = ''; 

    if (!meals) {
        recipeGallery.innerHTML = '<p>Resep tidak ditemukan. Coba bahan lain!</p>';
        return;
    }

    meals.forEach(meal => {
        const recipeCard = document.createElement('div');
        // Disesuaikan dengan class .resepCard dari CSS
        recipeCard.classList.add('resepCard'); 
        recipeCard.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
        `;
        recipeCard.addEventListener('click', () => getRecipeDetails(meal.idMeal));
        recipeGallery.appendChild(recipeCard);
    });
}

async function getRecipeDetails(mealId) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();
        const meal = data.meals[0];

        showRecipeModal(meal);
    } catch (error) {
        console.error('Gagal mengambil detail resep:', error);
    }
}

function showRecipeModal(meal) {
    modalTitle.textContent = meal.strMeal;
    modalImage.src = meal.strMealThumb;
    modalInstructions.textContent = meal.strInstructions;
    
    modalIngredients.innerHTML = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== '') {
            const listItem = document.createElement('li');
            listItem.textContent = `${measure} ${ingredient}`;
            modalIngredients.appendChild(listItem);
        } else {
            break; 
        }
    }
    modalContainer.classList.remove('hidden');
}

function closeModal() {
    modalContainer.classList.add('hidden');
}


// --- 3. Event Listeners ---
searchBtn.addEventListener('click', searchRecipes);

// Pastikan event 'keyup' ada di elemen input
searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searchRecipes();
    }
});

closeModalBtn.addEventListener('click', closeModal);

modalContainer.addEventListener('click', (event) => {
    if (event.target === modalContainer) {
        closeModal();
    }
});