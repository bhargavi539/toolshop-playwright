import {Page, Locator} from "@playwright/test";

export class CartPage{
    readonly page: Page;
    readonly productTitleInCart: Locator;
    readonly productQuantityInCart: Locator;
    readonly proceedToCheckout1: Locator;
    readonly loggedInText: Locator;
    readonly proceedToCheckout2: Locator;

    constructor(page: Page){
        this.page = page;
        this.productTitleInCart = page.getByTestId('product-title');
        this.productQuantityInCart = page.getByTestId('product-quantity');
        this.proceedToCheckout1 = page.getByTestId('proceed-1');
        this.loggedInText = page.locator('p').filter({hasText: 'you are already logged in'});
        this.proceedToCheckout2 = page.getByTestId('proceed-2');
    }

    async checkOutClick(){
        await this.proceedToCheckout1.click();
    }

    async checkOutClickAgain(){
        await this.proceedToCheckout2.click();
    }
}