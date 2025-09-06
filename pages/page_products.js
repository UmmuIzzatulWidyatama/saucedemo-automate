const { By, until } = require('selenium-webdriver');

class ProductsPage {
    constructor(driver) {
        this.driver = driver;
    }

    // Selectors
    get firstProductAddButton() {
        return this.driver.findElement(By.css('.inventory_item:first-child button'));
    }

    get cartBadge() {
        return this.driver.findElements(By.css('.shopping_cart_badge')); // gunakan findElements untuk aman
    }

    get cartLink() {
        return this.driver.findElement(By.css('[data-test="shopping-cart-link"]'));
    }

    get inventoryContainer() {
        return this.driver.findElement(By.id('inventory_container'));
    }

    // Hamburger menu & logout
    get menuButton() {
        return this.driver.findElement(By.id('react-burger-menu-btn'));
    }

    get logoutButton() {
        return this.driver.findElement(By.id('logout_sidebar_link'));
    }

    get allProductPricesElements() {
        return this.driver.findElements(By.css('.inventory_item_price'));
    }

    // Actions
    async isLoaded() {
        const container = await this.inventoryContainer;
        return container.isDisplayed();
    }

    async addFirstProductToCart() {
        const button = await this.firstProductAddButton;
        await button.click();
    }

    async removeFirstProductFromCart() {
        const button = await this.firstProductAddButton;
        const buttonText = await button.getText();
        if (buttonText.toLowerCase() === 'remove') {
            await button.click();
        }
    }

    async getCartCount() {
        const badges = await this.cartBadge;
        if (badges.length === 0) return '0'; // jika tidak ada badge, berarti cart kosong
        const badge = badges[0];
        return await badge.getText();
    }

    async goToCart() {
        const cart = await this.cartLink;
        await cart.click();
    }

    async logout() {
        // klik hamburger menu dulu
        const menu = await this.menuButton;
        await menu.click();

        // tunggu tombol logout muncul
        const logoutBtn = await this.logoutButton;
        await this.driver.wait(until.elementIsVisible(logoutBtn), 5000);

        await logoutBtn.click();
    }

    async getAllProductPrices() {
        const priceElements = await this.allProductPricesElements;
        const prices = [];
        for (let el of priceElements) {
            let text = await el.getText(); // misal "$29.99"
            text = text.replace('$', '');
            prices.push(parseFloat(text));
        }
        return prices;
    }
}

module.exports = ProductsPage;
