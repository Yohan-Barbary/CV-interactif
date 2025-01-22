// Classe pour gérer le cache des données météo
class WeatherCache {
    constructor() {
        this.cache = new Map();
        this.expirationTime = 10 * 60 * 1000; // 10 minutes
    }

    get(key) {
        const data = this.cache.get(key);
        if (!data) return null;
        
        if (Date.now() - data.timestamp > this.expirationTime) {
            this.cache.delete(key);
            return null;
        }
        
        return data.value;
    }

    set(key, value) {
        this.cache.set(key, {
            value,
            timestamp: Date.now()
        });
    }
}

// Classe principale de l'application météo
class WeatherApp {
    constructor() {
        this.API_KEY = 'votre_clé_api';
        this.BASE_URL = 'https://api.openweathermap.org/data/2.5';
        this.cache = new WeatherCache();
        this.initElements();
        this.initEventListeners();
        this.loadLastCity();
    }

    initElements() {
        this.searchInput = document.querySelector('.search-input');
        this.searchBtn = document.querySelector('.search-btn');
        this.weatherDisplay = document.querySelector('.weather-display');
        this.loadingTemplate = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Chargement...</span>
            </div>
        `;
    }

    initEventListeners() {
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });

        // Autocomplétion
        this.searchInput.addEventListener('input', debounce(() => {
            this.handleAutocomplete();
        }, 300));
    }

    async handleSearch() {
        const city = this.searchInput.value.trim();
        if (!city) return;

        try {
            this.showLoading();
            const weatherData = await this.getWeatherData(city);
            this.displayWeather(weatherData);
            this.saveLastCity(city);
        } catch (error) {
            this.showError(error.message);
        }
    }

    async getWeatherData(city) {
        try {
            const cachedData = this.cache.get(city);
            if (cachedData) return cachedData;

            const response = await fetch(
                `${this.BASE_URL}/weather?q=${city}&units=metric&lang=fr&appid=${this.API_KEY}`
            );
            
            if (!response.ok) {
                throw new Error('Ville non trouvée');
            }

            const data = await response.json();
            const weatherData = this.formatWeatherData(data);
            
            this.cache.set(city, weatherData);
            return weatherData;
        } catch (error) {
            throw error;
        }
    }

    formatWeatherData(data) {
        return {
            city: `${data.name}, ${data.sys.country}`,
            temperature: Math.round(data.main.temp),
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 3.6), // Conversion en km/h
            icon: this.getWeatherIcon(data.weather[0].icon)
        };
    }

    getWeatherIcon(iconCode) {
        const iconMap = {
            '01d': 'fa-sun',
            '01n': 'fa-moon',
            '02d': 'fa-cloud-sun',
            '02n': 'fa-cloud-moon',
            '03d': 'fa-cloud',
            '03n': 'fa-cloud',
            '04d': 'fa-cloud',
            '04n': 'fa-cloud',
            '09d': 'fa-cloud-showers-heavy',
            '09n': 'fa-cloud-showers-heavy',
            '10d': 'fa-cloud-rain',
            '10n': 'fa-cloud-rain',
            '11d': 'fa-bolt',
            '11n': 'fa-bolt',
            '13d': 'fa-snowflake',
            '13n': 'fa-snowflake',
            '50d': 'fa-smog',
            '50n': 'fa-smog'
        };
        
        return iconMap[iconCode] || 'fa-question';
    }

    displayWeather(data) {
        const weatherHtml = `
            <div class="current-weather">
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
            </div>
        `;

        this.weatherDisplay.style.opacity = '0';
        setTimeout(() => {
            this.weatherDisplay.innerHTML = weatherHtml;
            this.weatherDisplay.style.opacity = '1';
        }, 300);
    }

    showLoading() {
        this.weatherDisplay.innerHTML = this.loadingTemplate;
    }

    showError(message) {
        this.weatherDisplay.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            </div>
        `;
    }

    saveLastCity(city) {
        localStorage.setItem('lastCity', city);
    }

    loadLastCity() {
        const lastCity = localStorage.getItem('lastCity');
        if (lastCity) {
            this.searchInput.value = lastCity;
            this.handleSearch();
        }
    }

    async handleAutocomplete() {
        const query = this.searchInput.value.trim();
        if (query.length < 3) return;

        try {
            const response = await fetch(
                `${this.BASE_URL}/find?q=${query}&type=like&sort=population&cnt=5&appid=${this.API_KEY}`
            );
            const data = await response.json();
            
            if (data.list) {
                this.showSuggestions(data.list);
            }
        } catch (error) {
            console.error('Erreur d\'autocomplétion:', error);
        }
    }

    showSuggestions(cities) {
        let suggestionsContainer = document.querySelector('.suggestions');
        if (!suggestionsContainer) {
            suggestionsContainer = document.createElement('div');
            suggestionsContainer.className = 'suggestions';
            this.searchInput.parentNode.appendChild(suggestionsContainer);
        }

        suggestionsContainer.innerHTML = cities
            .map(city => `
                <div class="suggestion-item">
                    ${city.name}, ${city.sys.country}
                </div>
            `)
            .join('');

        const items = suggestionsContainer.querySelectorAll('.suggestion-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                this.searchInput.value = item.textContent.trim();
                suggestionsContainer.remove();
                this.handleSearch();
            });
        });
    }
}

// Utilitaire pour débouncer les appels de fonction
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});

// Styles supplémentaires pour les suggestions et les erreurs
const style = document.createElement('style');
style.textContent = `
    .loading, .error {
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

    .error i {
        font-size: 2rem;
        color: #f44336;
    }

    .suggestions {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #1a1a1a;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        margin-top: 0.5rem;
        overflow: hidden;
        z-index: 1000;
    }

    .suggestion-item {
        padding: 0.8rem 1rem;
        cursor: pointer;
        color: #fff;
        transition: all 0.2s ease;
    }

    .suggestion-item:hover {
        background: rgba(76, 175, 80, 0.1);
    }

    .weather-display {
        transition: opacity 0.3s ease;
    }
`;

document.head.appendChild(style); 