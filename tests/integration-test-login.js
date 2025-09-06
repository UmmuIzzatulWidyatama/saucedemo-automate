const { Builder, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const LoginPage = require('../pages/page_login'); 
const ProductsPage = require('../pages/page_products');
const CartPage = require('../pages/page_cart');



describe('Integrasi Alur Utama Saucedemo', function () {
    let driver;
    let loginPage;
    let productsPage;
    let cartPage;

    before(async function () {
        const options = new chrome.Options();
        options.addArguments('--incognito');
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

        loginPage = new LoginPage(driver);
        productsPage = new ProductsPage(driver);
        cartPage = new CartPage(driver);
    });

    after(async function () {
        await driver.quit();
    });

    // Test case utama: login -> tambah produk -> checkout
    it('Login, tambah produk ke keranjang, dan mulai checkout', async function () {
        await loginPage.open();
        await loginPage.login('standard_user', 'secret_sauce');

        // Verifikasi halaman produk muncul setelah login
        const isProductsLoaded = await productsPage.isLoaded();
        assert.strictEqual(isProductsLoaded, true, 'Halaman produk tidak muncul setelah login');

         // Tambahkan produk pertama ke keranjang
        await productsPage.addFirstProductToCart();

        // Verifikasi jumlah produk di keranjang bertambah
        const cartCount = await productsPage.getCartCount();
        assert.strictEqual(cartCount, '1', 'Produk tidak muncul di keranjang');

        // Masuk ke halaman keranjang
        await productsPage.goToCart();
        const isCartLoaded = await cartPage.isLoaded();
        assert.strictEqual(isCartLoaded, true, 'Halaman keranjang tidak terbuka');

        // Mulai proses checkout dan verifikasi halaman checkout muncul
        const checkoutStarted = await cartPage.startCheckout();
        assert.strictEqual(checkoutStarted, true, 'Halaman checkout tidak muncul');
    });
});
