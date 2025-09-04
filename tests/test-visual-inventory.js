const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch').default;
const assert = require('assert');

describe('Visual Testing Halaman Produk (Inventory) SauceDemo', function () {
    let driver;

    this.timeout(30000); 

    before(async function () {
        const options = new chrome.Options();
        options.addArguments("--incognito");
        options.addArguments("--headless=new");

        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    });

    after(async function () {
        await driver.quit();
    });

    it('Cek tampilan halaman produk', async function () {
        await driver.get('https://www.saucedemo.com');

        // Login terlebih dahulu
        await driver.findElement(By.css('[data-test="username"]')).sendKeys('problem_user');
        await driver.findElement(By.css('[data-test="password"]')).sendKeys('secret_sauce');
        await driver.findElement(By.css('[data-test="login-button"]')).click();

        // Tunggu sampai halaman inventory muncul
        await driver.wait(until.urlContains('/inventory.html'), 10000);
        await driver.wait(until.elementLocated(By.className('inventory_list')), 10000);

        // Ambil screenshot saat ini
        const screenshot = await driver.takeScreenshot();
        const imgBuffer = Buffer.from(screenshot, "base64");
        fs.writeFileSync("current_inventory.png", imgBuffer);

        const baselinePath = "baseline_inventory.png";
        if (!fs.existsSync(baselinePath)) {
            fs.copyFileSync("current_inventory.png", baselinePath);
            console.log("Baseline inventory dibuat. Jalankan ulang test untuk perbandingan.");
            return;
        }

        // Baca dan bandingkan gambar
        const img1 = PNG.sync.read(fs.readFileSync(baselinePath));
        const img2 = PNG.sync.read(fs.readFileSync("current_inventory.png"));
        const { width, height } = img1;
        const diff = new PNG({ width, height });

        const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, {
            threshold: 0.1,
        });

        fs.writeFileSync("diff_inventory.png", PNG.sync.write(diff));

        console.log(`Perbedaan visual: ${numDiffPixels} piksel`);
        assert.strictEqual(numDiffPixels, 0, "Visual inventory tidak cocok dengan baseline!");
    });
});
