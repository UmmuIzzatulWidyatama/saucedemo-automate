const { By, until } = require('selenium-webdriver');

class SortProdukPage {
    constructor(driver) {
        this.driver = driver;
    }

    // Navigasi ke halaman login
    async open() {
        await this.driver.get('https://www.saucedemo.com/');
    }

    // Login
    async login(username, password) {
        await this.driver.findElement(By.css('[data-test="username"]')).sendKeys(username);
        await this.driver.findElement(By.css('[data-test="password"]')).sendKeys(password);
        await this.driver.findElement(By.css('[data-test="login-button"]')).click();
    }

    // Tunggu halaman produk
    async waitForProductPage() {
        await this.driver.wait(until.elementLocated(By.className('inventory_list')), 10000);
    }

    // Pilih sorting A-Z
    async sortByAZ() {
        const dropdown = await this.driver.findElement(By.css('[data-test="product-sort-container"]'));
        await dropdown.click();
        const optionAZ = await this.driver.findElement(By.css('option[value="az"]'));
        await optionAZ.click();
        await this.driver.sleep(1000); // tunggu DOM update
    }

    // Ambil semua nama produk
    async getProductNames() {
        const productElements = await this.driver.findElements(By.className('inventory_item_name'));
        const productNames = [];

        for (let el of productElements) {
            productNames.push(await el.getText());
        }

        return productNames;
    }
}

module.exports = SortProdukPage;
