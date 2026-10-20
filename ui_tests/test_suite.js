const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const LoginPage = require('./pages/LoginPage');
const CarteleraPage = require('./pages/CarteleraPage');
const ReservaPage = require('./pages/ReservaPage');

async function construirDriver() {
  const opciones = new chrome.Options();
  opciones.addArguments('--no-sandbox');
  opciones.addArguments('--disable-dev-shm-usage');
  opciones.addArguments('--window-size=1440,1200');
  opciones.addArguments('--headless=new');
  return new Builder().forBrowser('chrome').setChromeOptions(opciones).build();
}

async function ejecutarCaso(nombre, fn) {
  console.log(`\n[CASO ${nombre}]`);
  await fn();
  console.log(`✓ ${nombre}`);
}

async function ejecutarSuite() {
  const driver = await construirDriver();
  try {
    const loginPage = new LoginPage(driver);
    const carteleraPage = new CarteleraPage(driver);
    const reservaPage = new ReservaPage(driver);

    await ejecutarCaso('01_bloqueo_preventivo', async () => {
      await loginPage.abrir();
      for (let intento = 1; intento <= 3; intento += 1) {
        await loginPage.ingresarCredenciales('bloqueo-ui@domain.com', `pass-${intento}`);
        await loginPage.hacerLogin();
      }

      await driver.wait(async () => {
        const mensaje = await loginPage.obtenerMensajeError();
        return mensaje.toLowerCase().includes('bloqueada') || mensaje.toLowerCase().includes('bloqueo');
      }, 15000, 'Se esperaba bloqueo después de tres intentos fallidos.');
    });

    await ejecutarCaso('02_login_exitoso', async () => {
      await loginPage.abrir();
      await loginPage.ingresarCredenciales('edwin@gmail.com', 'edwin1234567');
      await loginPage.hacerLogin();
      await driver.wait(until.elementLocated(By.id('catalog-view')), 10000);
      const catalogo = await driver.findElement(By.id('catalog-view'));
      const clase = await catalogo.getAttribute('class');
      if (clase.includes('hidden')) {
        throw new Error('La vista de cartelera no es visible.');
      }
    });

    await ejecutarCaso('03_seleccion_pelicula', async () => {
      const cards = await driver.findElements(By.css('[data-testid^="movie-card-"]'));
      if (cards.length === 0) throw new Error('No hay películas disponibles.');
      await cards[0].click();
      await driver.wait(
        until.elementIsVisible(driver.findElement(By.id('seat-view'))),
        10000,
        'La vista de asientos no apareció.'
      );
    });

    await ejecutarCaso('04_compra_end_to_end', async () => {
      await reservaPage.seleccionarPrimerAsientoDisponible();
      await reservaPage.continuarAlPago();
      await reservaPage.completarPago({
        numero: '4242 4242 4242 4242',
        titular: 'Edwin Martinez',
        expiracion: '12/30',
        cvv: '123'
      });
      await reservaPage.confirmarPago();
      await driver.wait(
        until.elementIsVisible(driver.findElement(By.id('confirmation-view'))),
        15000,
        'No apareció la confirmación después de procesar el pago.'
      );
    });

    await ejecutarCaso('05_cierre_sesion_y_historial', async () => {
      await loginPage.cerrarSesion();
      await driver.wait(async () => {
        const loginVisible = await driver.findElement(By.id('login-view')).getAttribute('class');
        return !loginVisible.includes('hidden');
      }, 10000, 'La vista login no apareció.');
      await driver.navigate().back();
      await driver.wait(async () => {
        const loginVisible = await driver.findElement(By.id('login-view')).getAttribute('class');
        return !loginVisible.includes('hidden');
      }, 5000, 'El historial no bloqueó acceso sin sesión.');
    });

    await ejecutarCaso('06_login_nuevo_exitoso', async () => {
      await loginPage.ingresarCredenciales('edwin@gmail.com', 'edwin1234567');
      await loginPage.hacerLogin();
      await driver.wait(until.elementLocated(By.id('catalog-view')), 10000);
    });

    await ejecutarCaso('07_persistencia_ocupacion_real', async () => {
      await carteleraPage.seleccionarPrimeraPelicula();
      await reservaPage.seleccionarPrimerAsientoDisponible();
      await driver.navigate().back();
      await driver.navigate().back();
      await loginPage.cerrarSesion();
      await loginPage.abrir();
      await loginPage.ingresarCredenciales('edwin@gmail.com', 'edwin1234567');
      await loginPage.hacerLogin();
      await driver.findElements(By.css('[data-testid^="movie-card-"]'));
    });

    await ejecutarCaso('08_tarjeta_vencida', async () => {
      await loginPage.cerrarSesion();
      await loginPage.abrir();
      await loginPage.ingresarCredenciales('edwin@gmail.com', 'edwin1234567');
      await loginPage.hacerLogin();
      await carteleraPage.seleccionarPrimeraPelicula();
      await reservaPage.seleccionarPrimerAsientoDisponible();
      await reservaPage.continuarAlPago();
      await reservaPage.completarPago({
        numero: '4555 1234 5678 9012',
        titular: 'Edwin Martinez',
        expiracion: '01/20',
        cvv: '123'
      });
      await reservaPage.confirmarPago();
      const mensaje = await driver.wait(async () => {
        const texto = await driver.findElement(By.id('checkout-error')).getText();
        return texto || false;
      }, 10000, 'No se mostró un error para la tarjeta vencida.');
      if (!mensaje.toLowerCase().includes('vencida') && !mensaje.toLowerCase().includes('expir')) {
        throw new Error(`La tarjeta vencida produjo un mensaje inesperado: ${mensaje}`);
      }
    });

    await ejecutarCaso('09_cvv_invalido', async () => {
      await reservaPage.completarPago({
        numero: '4555 1234 5678 9012',
        titular: 'Edwin Martinez',
        expiracion: '12/30',
        cvv: '1234'
      });
      await reservaPage.confirmarPago();
      await driver.wait(async () => {
        const mensaje = await driver.findElement(By.id('checkout-error')).getText();
        return mensaje.toLowerCase().includes('cvv');
      }, 10000, 'No se validó el CVV.');
    });

    await ejecutarCaso('10_fondos_insuficientes', async () => {
      await reservaPage.completarPago({
        numero: '5555 5555 5555 4444',
        titular: 'Edwin Martinez',
        expiracion: '12/30',
        cvv: '123'
      });
      await reservaPage.confirmarPago();
      await driver.wait(async () => {
        const mensaje = await driver.findElement(By.id('checkout-error')).getText();
        return mensaje.toLowerCase().includes('fondos') || mensaje.toLowerCase().includes('insuf');
      }, 10000, 'No se validó fondos insuficientes.');
    });

    await ejecutarCaso('11_login_timeout', async () => {
      await loginPage.cerrarSesion();
      await loginPage.abrir();
      await loginPage.ingresarCredenciales(`invalid-${Date.now()}@domain.com`, 'pass');
      await loginPage.hacerLogin();
      const mensaje = await driver.wait(async () => {
        const texto = await loginPage.obtenerMensajeError();
        return texto || false;
      }, 10000, 'No se gestionó respuesta fallida.');
      if (!mensaje.trim()) {
        throw new Error('El intento fallido no mostró un mensaje de error.');
      }
    });

    await ejecutarCaso('12_sin_asientos_seleccionados', async () => {
      await loginPage.ingresarCredenciales('edwin@gmail.com', 'edwin1234567');
      await loginPage.hacerLogin();
      await carteleraPage.seleccionarPrimeraPelicula();
      await driver.findElement(By.id('continue-to-payment')).click();
      await driver.wait(async () => {
        const mensaje = await driver.findElement(By.id('seat-selection-error')).getText();
        return mensaje.toLowerCase().includes('seleccionar') || mensaje.toLowerCase().includes('asiento');
      }, 10000, 'Se esperaba validación de asiento.');
    });

    await ejecutarCaso('13_navegacion_atras_dentro_login', async () => {
      await loginPage.cerrarSesion();
      await driver.navigate().back();
      await driver.wait(async () => {
        const loginVisible = await driver.findElement(By.id('login-view')).getAttribute('class');
        return !loginVisible.includes('hidden');
      }, 5000, 'No se bloqueó el acceso con historial.');
    });

    await ejecutarCaso('14_navegacion_insegura_sin_token', async () => {
      await driver.get('http://localhost:3000');
      await driver.wait(until.elementLocated(By.id('login-view')), 5000);
      const urlActual = await driver.getCurrentUrl();
      if (urlActual.includes('catalog')) throw new Error('Se permitió navegación insegura.');
    });

    await ejecutarCaso('15_cierre_sesion_desde_catalogo', async () => {
      await loginPage.ingresarCredenciales('edwin@gmail.com', 'edwin1234567');
      await loginPage.hacerLogin();
      await driver.wait(
        until.elementIsVisible(driver.findElement(By.id('catalog-view'))),
        10000,
        'La cartelera no apareció después del login.'
      );
      await driver.findElement(By.id('logout-button')).click();
      await driver.wait(until.elementLocated(By.id('login-view')), 10000);
    });
  } finally {
    await driver.quit();
  }
}

(async () => {
  try {
    await ejecutarSuite();
    console.log('\nSuite Selenium completada con 15 casos ejecutados.');
  } catch (error) {
    console.error('\nFallo en la suite UI:', error);
    process.exitCode = 1;
  }
})();
