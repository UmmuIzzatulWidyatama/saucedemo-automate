const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const SortProdukPage = require('../pages/page_sort_produk');

describe('Sort Produk dari A-Z di SauceDemo', function () {
    let driver;
    let page;

    this.timeout(30000); // Antisipasi timeout

    before(async function () {
        const options = new chrome.Options();
        options.addArguments("--incognito");

        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        page = new SortProdukPage(driver);
    });

    after(async function () {
        await driver.quit();
    });

    it('Login dan sort produk dari A-Z', async function () {
        await page.open();
        await page.login('standard_user', 'secret_sauce');
        await page.waitForProductPage();
        await page.sortByAZ();

        const productNames = await page.getProductNames();
        const sortedNames = [...productNames].sort();

        console.log("Produk tampil:", productNames);
        console.log("Produk urut:", sortedNames);

        assert.deepStrictEqual(productNames, sortedNames, 'Produk tidak terurut A-Z');
    });
});
