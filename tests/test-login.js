const { Builder, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const LoginPage = require('../pages/page_login'); 

describe('Sukses Login SauceDemo', function () {
    let driver;
    let loginPage;

    // Profiling: Waktu eksekusi setup
    before(async function () {
        const startTime = Date.now();  
        const options = new chrome.Options();
        options.addArguments("--incognito");

        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        loginPage = new LoginPage(driver);
        console.log('Waktu setup: ' + (Date.now() - startTime) + 'ms');
    });

    // Profiling: Waktu eksekusi quit
    after(async function () {
        const startTime = Date.now();  // Mulai pengukuran waktu
        await driver.quit();
        console.log('Waktu quit: ' + (Date.now() - startTime) + 'ms');
    });

    it('Dapat login dengan kredensial yang valid', async function () {
        const startTestTime = Date.now();  

        // Debugging:  log untuk memeriksa alur eksekusi
        console.log('Membuka halaman login...');
        await loginPage.open();

        console.log('Melakukan login dengan kredensial valid...');
        await loginPage.login('standard_user', 'secret_sauce');

        // Profiling: Waktu tunggu elemen
        const startWait = performance.now();
        const cartButton = await loginPage.cartButton;
        await driver.wait(until.elementIsVisible(cartButton), 10000);
        console.log('Waktu tunggu elemen cart button: ' + (performance.now() - startWait) + 'ms');

        // Debugging: log untuk memeriksa elemen
        console.log('Memeriksa visibilitas cart button...');
        assert(await cartButton.isDisplayed(), 'Cart button tidak terlihat, login gagal');

        const logoText = await (await loginPage.appLogo).getText();
        console.log('Logo aplikasi: ' + logoText);  // Debugging: log untuk logo

        // Profiling: Waktu total tes
        console.log('Waktu tes login: ' + (Date.now() - startTestTime) + 'ms');
        assert.strictEqual(logoText, 'Swag Labs', 'Logo teks tidak sesuai');
    });
});
