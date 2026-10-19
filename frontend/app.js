const loginPanel = document.querySelector('#login-panel');
const catalogPanel = document.querySelector('#catalog-panel');
const loginError = document.querySelector('#login-error');
const movieList = document.querySelector('#movie-list');

document.querySelector('#login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  loginError.hidden = true;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: document.querySelector('#username').value,
        password: document.querySelector('#password').value
      })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'No se pudo iniciar sesión.');
    }

    sessionStorage.setItem('cineflex-token', result.token);
    const catalogResponse = await fetch('/cartelera', {
      headers: { Authorization: `Bearer ${result.token}` }
    });
    if (!catalogResponse.ok) {
      throw new Error('No se pudo cargar la cartelera.');
    }

    const movies = await catalogResponse.json();
    movieList.replaceChildren(...movies.map((movie) => {
      const item = document.createElement('li');
      item.dataset.testid = 'movie-card';
      item.textContent = movie.titulo;
      return item;
    }));
    loginPanel.hidden = true;
    catalogPanel.hidden = false;
  } catch (error) {
    loginError.textContent = error.message;
    loginError.hidden = false;
  }
});

document.querySelector('#logout-button').addEventListener('click', () => {
  sessionStorage.removeItem('cineflex-token');
  catalogPanel.hidden = true;
  loginPanel.hidden = false;
});
