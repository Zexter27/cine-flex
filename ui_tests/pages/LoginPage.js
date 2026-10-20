class LoginPage {
  constructor(driver) {
    this.driver = driver;
    this.emailInput = { id: 'login-email' };
    this.passwordInput = { id: 'login-password' };
    this.submitButton = { id: 'login-submit' };
    this.errorMessage = { id: 'login-error' };
    this.logoutButton = { id: 'logout-button' };
  }

  async abrir() {
    await this.driver.get('http://localhost:3000');
  }

  async ingresarCredenciales(email, password) {
    const emailElement = await this.driver.findElement({ id: this.emailInput.id });
    const passwordElement = await this.driver.findElement({ id: this.passwordInput.id });
    await emailElement.clear();
    await emailElement.sendKeys(email);
    await passwordElement.clear();
    await passwordElement.sendKeys(password);
  }

  async hacerLogin() {
    const button = await this.driver.findElement({ id: this.submitButton.id });
    await button.click();
  }

  async obtenerMensajeError() {
    return this.driver.findElement({ id: this.errorMessage.id }).getText();
  }

  async cerrarSesion() {
    const button = await this.driver.findElement({ id: this.logoutButton.id });
    await button.click();
  }
}

module.exports = LoginPage;
