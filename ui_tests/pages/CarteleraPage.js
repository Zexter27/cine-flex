const { until } = require('selenium-webdriver');

class CarteleraPage {
  constructor(driver) {
    this.driver = driver;
    this.catalogView = { id: 'catalog-view' };
    this.movieGrid = { id: 'movie-grid' };
    this.movieCards = '[data-testid^="movie-card-"]';
    this.catalogTitle = { id: 'catalog-view' };
    this.backButton = { id: 'back-button' };
  }

  async obtenerTituloCatalogo() {
    return this.driver.findElement({ id: 'catalog-view' }).getText();
  }

  async seleccionarPrimeraPelicula() {
    await this.driver.wait(
      until.elementIsVisible(this.driver.findElement({ id: this.catalogView.id })),
      10000,
      'La vista de cartelera no está visible.'
    );

    let seleccionada = false;
    for (let intento = 0; intento < 3 && !seleccionada; intento += 1) {
      try {
        const primeraPelicula = await this.driver.wait(
          until.elementLocated({ css: this.movieCards }),
          10000,
          'No se cargaron películas en la cartelera.'
        );
        await this.driver.wait(
          until.elementIsVisible(primeraPelicula),
          10000,
          'La primera película no está visible.'
        );
        await primeraPelicula.click();
        seleccionada = true;
      } catch (error) {
        if (error.name !== 'StaleElementReferenceError' || intento === 2) {
          throw error;
        }
      }
    }

    await this.driver.wait(
      until.elementIsVisible(this.driver.findElement({ id: 'seat-view' })),
      10000,
      'La vista de asientos no apareció después de seleccionar la película.'
    );
  }

  async obtenerCantidadPeliculas() {
    return (await this.driver.findElements({ css: this.movieCards })).length;
  }

  async navegarAtras() {
    const button = await this.driver.findElement({ id: this.backButton.id });
    await button.click();
  }
}

module.exports = CarteleraPage;
