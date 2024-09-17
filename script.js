class Api {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.themoviedb.org/3';
    }

    async fetchPopularMovies() {
        const response = await fetch(`${this.baseUrl}/movie/popular?api_key=${this.apiKey}`);
        const data = await response.json();
        return data.results;
    }
}

async function renderPopularMovies() {
    const apiKey = 'f65971ab77f7a6fc38ce576030135d9d'; // Замініть на ваш API ключ
    const api = new Api(apiKey);
    const movies = await api.fetchPopularMovies();

    const moviesList = document.getElementById('movies-list');
    const loading = document.getElementById('loading');

    loading.remove(); // Видалити елемент з повідомленням "Loading"

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');

        const poster = document.createElement('img');
        poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        poster.alt = movie.original_title;

        const title = document.createElement('h2');
        title.textContent = movie.original_title;

        movieElement.appendChild(poster);
        movieElement.appendChild(title);

        moviesList.appendChild(movieElement);
    });
}

renderPopularMovies();
