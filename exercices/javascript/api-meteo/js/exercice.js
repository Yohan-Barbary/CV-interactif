// Exemple de données météo pour la démo
const demoWeatherData = {
    city: 'Paris, FR',
    temperature: 22,
    description: 'Ensoleillé',
    humidity: 65,
    windSpeed: 12,
    icon: 'fa-sun'
};

// Sélection des éléments du DOM
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const weatherDisplay = document.querySelector('.weather-display');

// Fonction pour afficher les données météo
function displayWeather(data) {
    const currentWeather = document.querySelector('.current-weather');
    
    // Animation de transition
    currentWeather.style.opacity = '0';
    
    setTimeout(() => {
        currentWeather.innerHTML = `
            <h2>${data.city}</h2>
            <div class="weather-info">
                <i class="fas ${data.icon}"></i>
                <div class="temperature">${data.temperature}°C</div>
                <div class="description">${data.description}</div>
            </div>
            <div class="details">
                <div class="detail-item">
                    <i class="fas fa-tint"></i>
                    <span>Humidité: ${data.humidity}%</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-wind"></i>
                    <span>Vent: ${data.windSpeed} km/h</span>
                </div>
            </div>
        `;
        
        // Animation d'entrée
        currentWeather.style.opacity = '1';
    }, 300);
}

// Simuler une recherche pour la démo
function searchCity(city) {
    // Simuler un chargement
    weatherDisplay.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Chargement...</span>
        </div>
    `;
    
    // Simuler un délai d'API
    setTimeout(() => {
        const randomTemp = Math.floor(Math.random() * 15) + 15; // Température entre 15 et 30
        const data = {
            ...demoWeatherData,
            temperature: randomTemp,
            city: city || demoWeatherData.city
        };
        displayWeather(data);
    }, 1000);
}

// Écouteurs d'événements
searchBtn.addEventListener('click', () => {
    const city = searchInput.value.trim();
    if (city) {
        searchCity(city);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = searchInput.value.trim();
        if (city) {
            searchCity(city);
        }
    }
});

// Afficher les données de démo au chargement
displayWeather(demoWeatherData);

// Ajouter les styles pour le chargement
const style = document.createElement('style');
style.textContent = `
    .loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        color: #fff;
        padding: 2rem;
    }

    .loading i {
        font-size: 2rem;
        color: #4CAF50;
    }

    .current-weather {
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style); 