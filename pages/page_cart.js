const { By } = require('selenium-webdriver');

class CartPage {
    constructor(driver) {
        this.driver = driver;
    }

    // Selectors
    get cartContainer() {
        return this.driver.findElement(By.id('cart_contents_container'));
    }

    get checkoutButton() {
        return this.driver.findElement(By.id('checkout'));
    }

    get checkoutInfoContainer() {
        return this.driver.findElement(By.id('checkout_info_container'));
    }

    // Actions
    async isLoaded() {
        const container = await this.cartContainer;
        return container.isDisplayed();
    }

    async startCheckout() {
        const button = await this.checkoutButton;
        await button.click();
        const container = await this.checkoutInfoContainer;
        return container.isDisplayed();
    }

    async fillCheckoutForm(firstName, lastName, postalCode) {
        const firstNameInput = await this.driver.findElement(By.id('first-name'));
        const lastNameInput = await this.driver.findElement(By.id('last-name'));
        const postalCodeInput = await this.driver.findElement(By.id('postal-code'));
        const continueButton = await this.driver.findElement(By.id('continue'));

        await firstNameInput.clear();
        await lastNameInput.clear();
        await postalCodeInput.clear();

        if (firstName) await firstNameInput.sendKeys(firstName);
        if (lastName) await lastNameInput.sendKeys(lastName);
        if (postalCode) await postalCodeInput.sendKeys(postalCode);

        await continueButton.click();

        try {
            const errorEl = await this.driver.findElement(By.css('[data-test="error"]'));
            const errorText = await errorEl.getText();
            if (errorText) return errorText; 
        } catch (err) {
            return true;
        }
    }
}

module.exports = CartPage;
