import {Page, Locator} from "@playwright/test";

export class CartPage{
    readonly page: Page;
    readonly productTitleInCart: Locator;
    readonly productQuantityInCart: Locator;

    constructor(page: Page){
        this.page = page;
        this.productTitleInCart = page.getByTestId('product-title');
        this.productQuantityInCart = page.getByTestId('product-quantity');
    }


}