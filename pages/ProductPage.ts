import { Page, Locator } from "@playwright/test";

export class ProductPage {
    readonly page: Page;
    readonly addtoCart: Locator;
    readonly toastMessage: Locator;
    readonly cartIcon: Locator;
    readonly productPageTitle: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.addtoCart = page.getByTestId('add-to-cart');
        this.toastMessage = page.getByRole('alert', { name: 'Product added to shopping cart.' });
        this.cartIcon = page.getByTestId('nav-cart');
        this.productPageTitle = page.getByTestId('product-name');
     }

    async addToCart() {
        await this.addtoCart.click();
    }

    async openCart() {
        await this.cartIcon.click();
    }
}