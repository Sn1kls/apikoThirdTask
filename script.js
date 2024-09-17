// Клас для роботи з API TheMovieDB
class Api {
    constructor(apiKey) {
      this.apiKey = apiKey;
      this.baseUrl = 'https://api.themoviedb.org/3';
    }
  
    // Метод для отримання списку популярних фільмів
    async fetchPopularMovies() {
      const url = `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=en-US&page=1`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch popular movies');
        }
        const data = await response.json();
        return data.results;
      } catch (error) {
        console.error('Error fetching popular movies:', error);
        return [];
      }
    }
  }
  
  // Функція для відображення списку популярних фільмів
  async function renderPopularMovies() {
    const api = new Api('f65971ab77f7a6fc38ce576030135d9d');
    const movieListElement = document.getElementById('movie-list');
    
    try {
      const movies = await api.fetchPopularMovies();
  
      // Якщо фільми не завантажено, показуємо повідомлення
      if (movies.length === 0) {
        movieListElement.innerHTML = '<p>Failed to load popular movies.</p>';
        return;
      }
  
      // Очищаємо текст "Loading popular movies"
      movieListElement.innerHTML = '';
  
      // Відображаємо фільми
      movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
          <div class="movie-title">${movie.original_title}</div>
        `;
        movieListElement.appendChild(movieElement);
      });
    } catch (error) {
      console.error('Error rendering movies:', error);
      movieListElement.innerHTML = '<p>Something went wrong while loading movies.</p>';
    }
  }
  
  // Виклик функції для відображення фільмів після завантаження сторінки
  document.addEventListener('DOMContentLoaded', renderPopularMovies);
