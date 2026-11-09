import { Locator, Page } from '@playwright/test';

export class SearchPage{

    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly productNames: Locator;
    readonly page: Page;
    constructor(page: Page){
        this.page = page;
        this.searchInput = page.getByTestId('search-query');
        this.searchButton = page.getByTestId('search-submit');
        this.productNames = page.getByTestId('product-name');
    }

    async gotoPage(){
        await this.page.goto('/');
    }

    async search(searchTerm: string){
        await this.searchInput.fill(searchTerm);
        await this.searchButton.click();
    }

}



