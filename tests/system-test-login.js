const { Builder, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

// Page Objects
const LoginPage = require('../pages/page_login'); 
const ProductsPage = require('../pages/page_products');
const CartPage = require('../pages/page_cart');

describe('System Testing SauceDemo', function () {
    this.timeout(30000); 

    let driver;
    let loginPage;
    let productsPage;
    let cartPage;

    before(async function () {
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(new chrome.Options().addArguments('--incognito'))
            .build();


        loginPage = new LoginPage(driver);
        productsPage = new ProductsPage(driver);
        cartPage = new CartPage(driver);
    });

    after(async function () {
        await driver.quit();
    });

    // Login test
    it('Login sukses dengan akun valid', async function () {
        await loginPage.open();
        await loginPage.login('standard_user', 'secret_sauce');

        const isProductsLoaded = await productsPage.isLoaded();
        assert.strictEqual(isProductsLoaded, true, 'Halaman produk tidak muncul setelah login');
    });

    it('Login gagal dengan akun invalid', async function () {
        await loginPage.open();
        await loginPage.login('invalid_user', 'wrong_password');

        // Verifikasi muncul error message
        const errorMsg = await loginPage.getErrorMessage();
        assert.strictEqual(errorMsg.includes('Username and password do not match'), true, 'Error message tidak muncul');
    });

    // Product & Cart test
    it('Tambah dan hapus produk di cart', async function () {
        await loginPage.open();
        await loginPage.login('standard_user', 'secret_sauce');

        // Tambah produk pertama
        await productsPage.addFirstProductToCart();
        let cartCount = await productsPage.getCartCount();
        assert.strictEqual(cartCount, '1', 'Produk tidak muncul di cart');

        // Hapus produk
        await productsPage.removeFirstProductFromCart();
        cartCount = await productsPage.getCartCount();
        assert.strictEqual(cartCount, '0', 'Produk masih ada setelah dihapus');
    });

    // Checkout test
    it('Checkout sukses dengan input valid', async function () {
        await loginPage.open();
        await loginPage.login('standard_user', 'secret_sauce');

        // Tambah produk ke cart
        await productsPage.addFirstProductToCart();
        await productsPage.goToCart();

        const isCartLoaded = await cartPage.isLoaded();
        assert.strictEqual(isCartLoaded, true, 'Halaman cart tidak terbuka');

        const checkoutStarted = await cartPage.startCheckout();
        assert.strictEqual(checkoutStarted, true, 'Halaman checkout tidak muncul');

        // Isi form checkout
        const checkoutCompleted = await cartPage.fillCheckoutForm('John', 'Doe', '12345');
        assert.strictEqual(checkoutCompleted, true, 'Checkout tidak berhasil');
    });

    it('Checkout gagal dengan input kosong', async function () {
        await loginPage.open();
        await loginPage.login('standard_user', 'secret_sauce');

        await productsPage.addFirstProductToCart();
        await productsPage.goToCart();
        await cartPage.startCheckout();

        // Isi form kosong
        const errorMsg = await cartPage.fillCheckoutForm('', '', '');
        assert.strictEqual(errorMsg.includes('Error'), true, 'Error message tidak muncul saat input kosong');
    });

    // Logout test
    it('Logout berhasil', async function () {
        await loginPage.open();
        await loginPage.login('standard_user', 'secret_sauce');

        await productsPage.logout();
        const isLoginPage = await loginPage.isLoaded();
        assert.strictEqual(isLoginPage, true, 'Logout gagal, halaman login tidak muncul');
    });

    
});
