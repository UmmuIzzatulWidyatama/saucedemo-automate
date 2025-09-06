const { Builder, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const LoginPage = require('../pages/page_login'); 

describe('Sukses Login SauceDemo', function () {
    let driver;
    let loginPage;

    before(async function () {
        const options = new chrome.Options();
        options.addArguments("--incognito");

        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        loginPage = new LoginPage(driver);
    });

    after(async function () {
        await driver.quit();
    });

    // Test case untuk memastikan login berhasil dengan kredensial yang valid
    it('Dapat melakukan login dengan kredensial yang valid', async function () {
        await loginPage.open();
        await loginPage.login('standard_user', 'secret_sauce');
        const cartButton = await loginPage.cartButton;
        await driver.wait(until.elementIsVisible(cartButton), 10000);
        assert(await cartButton.isDisplayed(), 'Cart button tidak terlihat, login gagal');
    });
});
