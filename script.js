// Клас для роботи з API TheMovieDB
class Api {
    constructor(apiKey) {
      this.apiKey = apiKey;
      this.baseUrl = 'https://api.themoviedb.org/3';
    }
  
    async fetchMoviesBySearchText(query, page = 1) {
      const url = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&language=en-US&page=${page}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching search results:', error);
        return { results: [], total_results: 0, total_pages: 0 };
      }
    }
  
    async fetchPopularMovies(page = 1) {
      const url = `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=en-US&page=${page}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch popular movies');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching popular movies:', error);
        return { results: [], total_results: 0, total_pages: 0 };
      }
    }
  }
  
  // Функція для збереження/отримання масиву збережених фільмів
  function getSavedMovies() {
    return JSON.parse(localStorage.getItem('savedMovies')) || [];
  }
  
  function saveMovies(movies) {
    localStorage.setItem('savedMovies', JSON.stringify(movies));
  }
  
  // Функція для оновлення стану сердечка
  function updateHeartIcon(movieId, isSaved) {
    const heartIcon = document.querySelector(`.heart[data-id="${movieId}"]`);
    if (heartIcon) {
      heartIcon.classList.toggle('active', isSaved);
    }
  }
  
  // Функція для відображення списку фільмів
  function renderMovies(movies, movieListElement) {
    const savedMovies = getSavedMovies();
  
    movies.forEach(movie => {
      const isSaved = savedMovies.some(savedMovie => savedMovie.id === movie.id);
      const movieElement = document.createElement('div');
      movieElement.classList.add('movie');
      movieElement.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
        <div class="movie-title">${movie.original_title}</div>
        <div class="heart-container">
          <i class="fas fa-heart heart ${isSaved ? 'active' : ''}" data-id="${movie.id}"></i>
        </div>
      `;
      
      // Додаємо обробник для натискання на сердечко
      movieElement.querySelector('.heart').addEventListener('click', function () {
        const savedMovies = getSavedMovies();
        const isSaved = savedMovies.some(savedMovie => savedMovie.id === movie.id);
        
        if (isSaved) {
          // Видаляємо фільм зі збережених
          const updatedMovies = savedMovies.filter(savedMovie => savedMovie.id !== movie.id);
          saveMovies(updatedMovies);
        } else {
          // Додаємо фільм до збережених
          savedMovies.push(movie);
          saveMovies(savedMovies);
        }
        
        updateHeartIcon(movie.id, !isSaved);
      });
  
      movieListElement.appendChild(movieElement);
    });
  }
  
  // Функція для рендеру популярних фільмів
  async function renderPopularMovies() {
    const api = new Api('f65971ab77f7a6fc38ce576030135d9d');
    const movieListElement = document.getElementById('movie-list');
    const resultsHeaderElement = document.getElementById('results-header');
    movieListElement.innerHTML = ''; // Очищуємо список перед завантаженням нових фільмів
    resultsHeaderElement.innerHTML = 'Popular Movies';
  
    try {
      const data = await api.fetchPopularMovies();
      renderMovies(data.results, movieListElement);
    } catch (error) {
      movieListElement.innerHTML = '<p>Something went wrong while loading popular movies.</p>';
    }
  }
  
  // Функція для рендеру збережених фільмів
  function renderBookmarks() {
    const movieListElement = document.getElementById('movie-list');
    const resultsHeaderElement = document.getElementById('results-header');
    const savedMovies = getSavedMovies();
    
    movieListElement.innerHTML = ''; // Очищуємо список перед завантаженням нових фільмів
    resultsHeaderElement.innerHTML = 'Bookmarks';
    
    if (savedMovies.length === 0) {
      movieListElement.innerHTML = '<p>No saved movies.</p>';
      return;
    }
  
    renderMovies(savedMovies, movieListElement);
  }
  
  // Функція для перемикання між вкладками
  function setupNavButtons() {
    const popularMoviesBtn = document.getElementById('popular-movies-btn');
    const bookmarksBtn = document.getElementById('bookmarks-btn');
  
    popularMoviesBtn.addEventListener('click', () => {
      popularMoviesBtn.classList.add('active');
      bookmarksBtn.classList.remove('active');
      renderPopularMovies(); // Завантажуємо популярні фільми
    });
  
    bookmarksBtn.addEventListener('click', () => {
      bookmarksBtn.classList.add('active');
      popularMoviesBtn.classList.remove('active');
      renderBookmarks(); // Завантажуємо збережені фільми
    });
  }
  
  // Ініціалізація при завантаженні сторінки
  document.addEventListener('DOMContentLoaded', () => {
    setupNavButtons();
    renderPopularMovies(); // За замовчуванням завантажуємо популярні фільми
  });
  
  // Змінні для зберігання стану пошуку
  let currentPage = 1;
  let totalPages = 1;
  let currentQuery = '';
  
  // Функція пошуку фільмів
  async function searchMovies(query) {
    const api = new Api('f65971ab77f7a6fc38ce576030135d9d');
    const movieListElement = document.getElementById('movie-list');
    const resultsHeaderElement = document.getElementById('results-header');
  
    try {
      const data = await api.fetchMoviesBySearchText(query, currentPage);
  
      if (data.total_results === 0) {
        movieListElement.innerHTML = `<p>No results for "${query}"</p>`;
        resultsHeaderElement.innerHTML = '';
      } else {
        if (currentPage === 1) {
          movieListElement.innerHTML = '';
          resultsHeaderElement.innerHTML = `Results (${data.total_results})`;
        }
  
        renderMovies(data.results, movieListElement);
  
        totalPages = data.total_pages;
        const loadMoreButton = document.getElementById('load-more-button');
        if (currentPage < totalPages) {
          loadMoreButton.style.display = 'block';
        } else {
          loadMoreButton.style.display = 'none';
        }
      }
    } catch (error) {
      movieListElement.innerHTML = '<p>Something went wrong while loading search results.</p>';
      resultsHeaderElement.innerHTML = '';
    }
  }
  
  // Обробник для пошуку при натисканні Enter
  document.getElementById('search-input').addEventListener('keydown', async function (event) {
    if (event.key === 'Enter') {
      const query = event.target.value.trim();
      if (!query) return;
  
      currentQuery = query;
      currentPage = 1;
      searchMovies(query);
      event.target.value = '';
    }
  });
  
  // Обробник для кнопки "Load more"
  document.getElementById('load-more-button').addEventListener('click', async function () {
    currentPage++;
    searchMovies(currentQuery);
  });
  