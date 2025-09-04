const { By } = require('selenium-webdriver');

class LoginPage {
    constructor(driver) {
        this.driver = driver;
    }

    // Selectors
    get inputUsername() {
        return this.driver.findElement(By.css('[data-test="username"]'));
    }

    get inputPassword() {
        return this.driver.findElement(By.css('[data-test="password"]'));
    }

    get loginButton() {
        return this.driver.findElement(By.css('[data-test="login-button"]'));
    }

    get cartButton() {
        return this.driver.findElement(By.css('[data-test="shopping-cart-link"]'));
    }

    get appLogo() {
        return this.driver.findElement(By.className('app_logo'));
    }

    // Actions
    async open() {
        await this.driver.get('https://www.saucedemo.com/');
    }

    async login(username, password) {
        const usernameInput = await this.inputUsername;
        const passwordInput = await this.inputPassword;
        const button = await this.loginButton;

        await usernameInput.sendKeys(username);
        await passwordInput.sendKeys(password);
        await button.click();
    }
}

module.exports = LoginPage;
