const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch').default;
const assert = require('assert');

describe('Visual Testing Halaman Login SauceDemo', function () {
    let driver;

    this.timeout(20000);

    before(async function () {
        const options = new chrome.Options();
        options.addArguments("--incognito");
        options.addArguments("--headless=new"); 

        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    });

    after(async function () {
        await driver.quit();
    });

    it('Visit saucedemo dan cek page title', async function () {
        await driver.get('https://www.saucedemo.com');

        // Ambil screenshot current
        const screenshot = await driver.takeScreenshot();
        const imgBuffer = Buffer.from(screenshot, "base64");
        fs.writeFileSync("current_login.png", imgBuffer);

        // Cek dan buat baseline jika belum ada
        const baselinePath = "baseline_login.png";
        if (!fs.existsSync(baselinePath)) {
            fs.copyFileSync("current_login.png", baselinePath);
            console.log("Baseline image dibuat. Silakan jalankan ulang untuk verifikasi visual.");
            return;
        }

        // Baca image untuk dibandingkan
        const img1 = PNG.sync.read(fs.readFileSync(baselinePath));
        const img2 = PNG.sync.read(fs.readFileSync("current_login.png"));
        const { width, height } = img1;
        const diff = new PNG({ width, height });

        const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, {
            threshold: 0.1
        });

        fs.writeFileSync("diff_login.png", PNG.sync.write(diff));

        console.log(`Jumlah piksel berbeda: ${numDiffPixels}`);
        assert.strictEqual(numDiffPixels, 0, "Visual tidak cocok dengan baseline.");
    });
});
