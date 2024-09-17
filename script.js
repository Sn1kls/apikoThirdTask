// Клас для роботи з API TheMovieDB
class Api {
    constructor(apiKey) {
      this.apiKey = apiKey;
      this.baseUrl = 'https://api.themoviedb.org/3';
    }
  
    // Метод для отримання списку фільмів за пошуковим запитом і сторінкою
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
  }
  
  // Функція для відображення списку фільмів
  function renderMovies(movies, movieListElement) {
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
  }
  
  // Змінні для зберігання стану пошуку
  let currentPage = 1;
  let totalPages = 1;
  let currentQuery = '';
  
  // Функція для пошуку і відображення результатів
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
  async function handleSearch(event) {
    if (event.key === 'Enter') {
      const query = event.target.value.trim();
      if (!query) return;
  
      // Оновлюємо поточний запит та сторінку
      currentQuery = query;
      currentPage = 1;
  
      // Викликаємо пошук
      searchMovies(query);
  
      // Очищаємо поле пошуку
      event.target.value = '';
    }
  }
  
  // Функція для завантаження додаткових сторінок
  async function loadMoreMovies() {
    // Збільшуємо номер сторінки
    currentPage++;
    searchMovies(currentQuery);
  }
  
  // Додаємо обробник подій для інпуту пошуку
  document.getElementById('search-input').addEventListener('keydown', handleSearch);
  
  // Додаємо обробник для кнопки "Load more"
  document.getElementById('load-more-button').addEventListener('click', loadMoreMovies);
  