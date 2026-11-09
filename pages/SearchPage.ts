import { Locator, Page } from '@playwright/test';

export class SearchPage{

    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly productNames: Locator;
    readonly page: Page;

    readonly searchCaption: Locator;
    readonly noResultsMessage: Locator;
    constructor(page: Page){
        this.page = page;
        this.searchInput = page.getByTestId('search-query');
        this.searchButton = page.getByTestId('search-submit');
        this.productNames = page.getByTestId('product-name');
        this.searchCaption = page.getByTestId('search-caption');
        this.noResultsMessage = page.getByTestId('no-results');
    }

    async gotoPage(){
        await this.page.goto('/');
    }

    async search(searchTerm: string){
        await this.searchInput.fill(searchTerm);
        await this.searchButton.click();
    }

}

