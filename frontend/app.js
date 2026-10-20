const API_BASE_URL = 'http://localhost:3000';

const estado = {
  token: sessionStorage.getItem('cineflex-token') || '',
  peliculaSeleccionada: null,
  asientosSeleccionados: [],
  valorReserva: 0,
  historialVistas: []
};

const vistas = {
  login: document.querySelector('#login-view'),
  catalogo: document.querySelector('#catalog-view'),
  asientos: document.querySelector('#seat-view'),
  checkout: document.querySelector('#checkout-view'),
  confirmacion: document.querySelector('#confirmation-view')
};

const elementos = {
  loginForm: document.querySelector('#login-form'),
  loginError: document.querySelector('#login-error'),
  logoutButton: document.querySelector('#logout-button'),
  backButton: document.querySelector('#back-button'),
  movieGrid: document.querySelector('#movie-grid'),
  seatGrid: document.querySelector('#seat-grid'),
  selectedSeatsText: document.querySelector('#selected-seats-text'),
  seatMovieTitle: document.querySelector('#seat-movie-title'),
  continueToPayment: document.querySelector('#continue-to-payment'),
  backToCatalogButton: document.querySelector('#back-to-catalog-button'),
  backToSeatButton: document.querySelector('#back-to-seat-button'),
  checkoutForm: document.querySelector('#checkout-form'),
  checkoutError: document.querySelector('#checkout-error'),
  checkoutAmount: document.querySelector('#checkout-amount'),
  checkoutMovieName: document.querySelector('#checkout-movie-name'),
  checkoutSeatList: document.querySelector('#checkout-seat-list'),
  checkoutTotal: document.querySelector('#checkout-total'),
  confirmationDetail: document.querySelector('#confirmation-detail'),
  newBookingButton: document.querySelector('#new-booking-button')
};

function obtenerTipoTarjeta(numero) {
  const limpio = numero.replace(/\s+/g, '').replace(/-/g, '');
  if (/^4/.test(limpio)) return 'visa';
  if (/^5[1-5]/.test(limpio)) return 'mastercard';
  if (/^3[47]/.test(limpio)) return 'amex';
  return 'visa';
}

function cabecerasAutorizadas() {
  return {
    'Content-Type': 'application/json',
    ...(estado.token ? { Authorization: `Bearer ${estado.token}` } : {})
  };
}

function actualizarBotonesNavegacion(vistaActual) {
  const mostrarLogout = vistaActual !== 'login';
  const mostrarVolver = ['asientos', 'checkout', 'confirmacion'].includes(vistaActual);

  elementos.logoutButton.classList.toggle('hidden', !mostrarLogout);
  elementos.backButton.classList.toggle('hidden', !mostrarVolver);
}

function mostrarVista(nombreVista, { registrar = true, reemplazarUltima = false } = {}) {
  Object.entries(vistas).forEach(([clave, vista]) => {
    vista.classList.toggle('hidden', clave !== nombreVista);
  });

  if (registrar) {
    const ultimaVista = estado.historialVistas[estado.historialVistas.length - 1];
    if (reemplazarUltima && estado.historialVistas.length) {
      estado.historialVistas[estado.historialVistas.length - 1] = nombreVista;
      window.history.replaceState({ view: nombreVista }, '', `#${nombreVista}`);
    } else if (ultimaVista !== nombreVista) {
      estado.historialVistas.push(nombreVista);
      window.history.pushState({ view: nombreVista }, '', `#${nombreVista}`);
    }
  }

  actualizarBotonesNavegacion(nombreVista);
}

function retrocederVista() {
  if (estado.historialVistas.length <= 1) {
    return;
  }

  estado.historialVistas.pop();
  const vistaAnterior = estado.historialVistas[estado.historialVistas.length - 1];

  if (vistaAnterior === 'catalogo') {
    mostrarVista('catalogo', { registrar: false, reemplazarUltima: true });
    return;
  }

  if (vistaAnterior === 'asientos') {
    mostrarVista('asientos', { registrar: false, reemplazarUltima: true });
    return;
  }

  if (vistaAnterior === 'checkout') {
    mostrarVista('checkout', { registrar: false, reemplazarUltima: true });
    return;
  }

  mostrarVista('catalogo', { registrar: false, reemplazarUltima: true });
}

window.addEventListener('popstate', (evento) => {
  const vistaSolicitada = evento.state?.view || 'catalogo';

  if (vistaSolicitada === 'login') {
    return;
  }

  if (['catalogo', 'asientos', 'checkout', 'confirmacion'].includes(vistaSolicitada)) {
    mostrarVista(vistaSolicitada, { registrar: false, reemplazarUltima: true });
  }
});

async function cargarCartelera() {
  try {
    const respuesta = await fetch(`${API_BASE_URL}/cartelera`, {
      headers: cabecerasAutorizadas()
    });

    if (!respuesta.ok) {
      throw new Error('No se pudo cargar la cartelera.');
    }

    const resultado = await respuesta.json();
    const peliculas = resultado.datos || [];

    elementos.movieGrid.innerHTML = peliculas
      .map((pelicula, indice) => {
        const precio = 18000 + indice * 4500;
        return `
          <button
            type="button"
            class="movie-card"
            data-testid="movie-card-${pelicula.id || indice + 1}"
            data-movie-id="${pelicula.id || indice + 1}"
            data-movie-title="${pelicula.titulo}"
            data-movie-price="${precio}"
          >
            <div class="movie-poster" aria-hidden="true">🎬</div>
            <div>
              <h3>${pelicula.titulo}</h3>
            </div>
            <div class="movie-meta">
              <span>${pelicula.hora || '18:30 hrs'}</span>
              <strong>$${precio.toLocaleString('es-CO')}</strong>
            </div>
          </button>
        `;
      })
      .join('');

    elementos.movieGrid.querySelectorAll('[data-testid^="movie-card-"]').forEach((boton) => {
      boton.addEventListener('click', async () => {
        const { movieId, movieTitle, moviePrice } = boton.dataset;
        estado.peliculaSeleccionada = {
          id: Number(movieId),
          titulo: movieTitle,
          precio: Number(moviePrice)
        };

        elementos.movieGrid.querySelectorAll('[data-testid^="movie-card-"]').forEach((tarjeta) => {
          tarjeta.classList.toggle('selected', tarjeta === boton);
        });

        await renderizarAsientos();
        mostrarVista('asientos');
      });
    });
  } catch (error) {
    console.error(error);
  }
}

async function renderizarAsientos() {
  try {
    const respuesta = await fetch(`${API_BASE_URL}/asientos/disponibles`);
    const resultado = await respuesta.json();
    const disponibles = new Set((resultado.datos || []).map((asiento) => asiento.id));

    const filas = ['A', 'B', 'C', 'D', 'E'];
    const columnas = [1, 2, 3, 4, 5, 6, 7, 8];

    const html = filas.flatMap((fila) =>
      columnas.map((numero) => {
        const asientoId = `${fila}${numero}`;
        const disponible = disponibles.has(asientoId);
        const ocupado = !disponible;

        return `
          <button
            type="button"
            class="seat-button ${ocupado ? 'occupied' : ''}"
            data-testid="seat-${asientoId}"
            data-seat-id="${asientoId}"
            aria-label="Asiento ${asientoId}"
            ${ocupado ? 'disabled' : ''}
          >
            ${asientoId}
          </button>
        `;
      })
    ).join('');

    elementos.seatGrid.innerHTML = html;
    elementos.seatMovieTitle.textContent = estado.peliculaSeleccionada
      ? `Elige tus asientos para ${estado.peliculaSeleccionada.titulo}`
      : 'Elige tus asientos';

    elementos.seatGrid.querySelectorAll('.seat-button:not(.occupied)').forEach((boton) => {
      boton.addEventListener('click', () => {
        const seatId = boton.dataset.seatId;
        const index = estado.asientosSeleccionados.indexOf(seatId);

        if (index >= 0) {
          estado.asientosSeleccionados.splice(index, 1);
        } else if (estado.asientosSeleccionados.length < 6) {
          estado.asientosSeleccionados.push(seatId);
        }

        boton.classList.toggle('selected', index < 0 && estado.asientosSeleccionados.includes(seatId));
        actualizarResumenAsientos();
      });
    });

    actualizarResumenAsientos();
  } catch (error) {
    console.error('Seat map error:', error);
  }
}

function actualizarResumenAsientos() {
  elementos.selectedSeatsText.textContent = estado.asientosSeleccionados.length > 0
    ? estado.asientosSeleccionados.join(', ')
    : 'Ninguno';

  if (estado.peliculaSeleccionada) {
    const valor = estado.peliculaSeleccionada.precio * Math.max(estado.asientosSeleccionados.length, 0);
    estado.valorReserva = valor;
  }
}

async function enviarLogin(evento) {
  evento.preventDefault();
  elementos.loginError.classList.add('hidden');

  const correo = document.querySelector('#login-email').value.trim();
  const contrasena = document.querySelector('#login-password').value.trim();

  try {
    const respuesta = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correoElectronico: correo, contrasena })
    });

    const resultado = await respuesta.json();
    if (!respuesta.ok) {
      throw new Error(resultado.mensaje || 'No se pudo iniciar sesión.');
    }

    estado.token = resultado.datos.token;
    sessionStorage.setItem('cineflex-token', estado.token);
    mostrarVista('catalogo');
    await cargarCartelera();
  } catch (error) {
    elementos.loginError.textContent = error.message;
    elementos.loginError.classList.remove('hidden');
  }
}

function limpiarReserva() {
  estado.peliculaSeleccionada = null;
  estado.asientosSeleccionados = [];
  estado.valorReserva = 0;
  elementos.checkoutAmount.value = '$0';
  document.querySelector('#checkout-card-number').value = '4242 4242 4242 4242';
  document.querySelector('#checkout-card-holder').value = 'Edwin Martinez';
  document.querySelector('#checkout-expiry').value = '12/30';
  document.querySelector('#checkout-cvv').value = '123';
  elementos.checkoutError.classList.add('hidden');
  elementos.checkoutMovieName.textContent = '—';
  elementos.checkoutSeatList.textContent = '—';
  elementos.checkoutTotal.textContent = '$0';
}

function prepararCheckout() {
  if (!estado.peliculaSeleccionada || estado.asientosSeleccionados.length === 0) {
    elementos.checkoutError.textContent = 'Debes seleccionar una película y al menos un asiento.';
    elementos.checkoutError.classList.remove('hidden');
    return;
  }

  estado.valorReserva = estado.peliculaSeleccionada.precio * estado.asientosSeleccionados.length;
  elementos.checkoutMovieName.textContent = estado.peliculaSeleccionada.titulo;
  elementos.checkoutSeatList.textContent = estado.asientosSeleccionados.join(', ');
  elementos.checkoutTotal.textContent = `$${estado.valorReserva.toLocaleString('es-CO')}`;
  elementos.checkoutAmount.value = `$${estado.valorReserva.toLocaleString('es-CO')}`;
  elementos.checkoutError.classList.add('hidden');

  mostrarVista('checkout');
}

async function confirmarPago(evento) {
  evento.preventDefault();
  elementos.checkoutError.classList.add('hidden');

  if (!estado.peliculaSeleccionada || estado.asientosSeleccionados.length === 0) {
    return;
  }

  const numTarjeta = document.querySelector('#checkout-card-number').value.trim();
  const nombreTitular = document.querySelector('#checkout-card-holder').value.trim();
  const expiracion = document.querySelector('#checkout-expiry').value.trim();
  const cvv = document.querySelector('#checkout-cvv').value.trim();

  const [mes, anio] = expiracion.split('/');
  const payload = {
    cardNumber: numTarjeta,
    cardHolder: nombreTitular,
    expiryMonth: mes,
    expiryYear: anio || '30',
    cvv,
    amount: estado.valorReserva,
    currency: 'COP',
    cardType: obtenerTipoTarjeta(numTarjeta),
    email: 'edwin@gmail.com'
  };

  try {
    const respuesta = await fetch(`${API_BASE_URL}/reserva`, {
      method: 'POST',
      headers: cabecerasAutorizadas(),
      body: JSON.stringify(payload)
    });

    const resultado = await respuesta.json();
    if (!respuesta.ok) {
      throw new Error(resultado.mensaje || 'La transacción fue rechazada.');
    }

    const reserva = resultado.datos || {};
    elementos.confirmationDetail.innerHTML = `
      <div><strong>Película:</strong> ${estado.peliculaSeleccionada.titulo}</div>
      <div><strong>Asientos:</strong> ${estado.asientosSeleccionados.join(', ')}</div>
      <div><strong>Total:</strong> $${estado.valorReserva.toLocaleString('es-CO')}</div>
      <div><strong>Transacción:</strong> ${reserva.idTransaccion || 'CF-000000'}</div>
      <div><strong>Estado:</strong> ${reserva.estado || 'aprobado'}</div>
    `;

    mostrarVista('confirmacion');
  } catch (error) {
    elementos.checkoutError.textContent = error.message;
    elementos.checkoutError.classList.remove('hidden');
  }
}

function manejarCierreSesion() {
  sessionStorage.removeItem('cineflex-token');
  estado.token = '';
  estado.peliculaSeleccionada = null;
  estado.asientosSeleccionados = [];
  limpiarReserva();
  estado.historialVistas = ['login'];
  mostrarVista('login', { registrar: false, reemplazarUltima: true });
}

function inicializarVista() {
  if (estado.token) {
    estado.historialVistas = ['catalogo'];
    mostrarVista('catalogo', { registrar: false, reemplazarUltima: true });
    cargarCartelera();
  } else {
    estado.historialVistas = ['login'];
    mostrarVista('login', { registrar: false, reemplazarUltima: true });
  }
}

elementos.loginForm.addEventListener('submit', enviarLogin);
elementos.logoutButton.addEventListener('click', manejarCierreSesion);
elementos.backButton.addEventListener('click', retrocederVista);
elementos.backToCatalogButton.addEventListener('click', () => {
  mostrarVista('catalogo', { registrar: true });
});
elementos.backToSeatButton.addEventListener('click', () => {
  mostrarVista('asientos', { registrar: true });
});
elementos.continueToPayment.addEventListener('click', prepararCheckout);
elementos.checkoutForm.addEventListener('submit', confirmarPago);
elementos.newBookingButton.addEventListener('click', () => {
  limpiarReserva();
  mostrarVista('catalogo');
  cargarCartelera();
});

inicializarVista();
