const { until } = require('selenium-webdriver');

class ReservaPage {
  constructor(driver) {
    this.driver = driver;
    this.seatGrid = { id: 'seat-grid' };
    this.continueToPayment = { id: 'continue-to-payment' };
    this.cardNumberInput = { id: 'checkout-card-number' };
    this.cardHolderInput = { id: 'checkout-card-holder' };
    this.expiryInput = { id: 'checkout-expiry' };
    this.cvvInput = { id: 'checkout-cvv' };
    this.checkoutForm = { id: 'checkout-form' };
    this.checkoutError = { id: 'checkout-error' };
    this.confirmationDetail = { id: 'confirmation-detail' };
    this.newBookingButton = { id: 'new-booking-button' };
    this.seatButton = '.seat-button';
    this.backButton = { id: 'back-button' };
    this.logoutButton = { id: 'logout-button' };
  }

  async seleccionarPrimerAsientoDisponible() {
    const asiento = await this.driver.findElement({
      css: `${this.seatButton}:not(.occupied)`
    });
    await asiento.click();
    await this.driver.wait(async () => {
      const asientosSeleccionados = await this.driver.findElement({ id: 'selected-seats-text' }).getText();
      return asientosSeleccionados !== 'Ninguno';
    }, 5000, 'No se pudo seleccionar el asiento disponible.');
  }

  async continuarAlPago() {
    await this.driver.findElement({ id: this.continueToPayment.id }).click();
    await this.driver.wait(
      until.elementIsVisible(this.driver.findElement({ id: 'checkout-view' })),
      5000,
      'La vista de pago no apareció después de continuar.'
    );
  }

  async completarPago({ numero, titular, expiracion, cvv }) {
    const form = await this.driver.findElement({ id: this.checkoutForm.id });
    await form.findElement({ id: this.cardNumberInput.id }).clear();
    await form.findElement({ id: this.cardNumberInput.id }).sendKeys(numero);
    await form.findElement({ id: this.cardHolderInput.id }).clear();
    await form.findElement({ id: this.cardHolderInput.id }).sendKeys(titular);
    await form.findElement({ id: this.expiryInput.id }).clear();
    await form.findElement({ id: this.expiryInput.id }).sendKeys(expiracion);
    await form.findElement({ id: this.cvvInput.id }).clear();
    await form.findElement({ id: this.cvvInput.id }).sendKeys(cvv);
  }

  async confirmarPago() {
    await this.driver.findElement({ css: '[data-testid="checkout-submit-button"]' }).click();
  }

  async obtenerDetalleConfirmacion() {
    return this.driver.findElement({ id: this.confirmationDetail.id }).getText();
  }

  async confirmarNuevaReserva() {
    await this.driver.findElement({ id: this.newBookingButton.id }).click();
  }

  async cerrarSesion() {
    await this.driver.findElement({ id: this.logoutButton.id }).click();
  }
}

module.exports = ReservaPage;
