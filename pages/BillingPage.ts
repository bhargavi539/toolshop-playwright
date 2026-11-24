import {Locator, Page} from "@playwright/test";

export class BillingPage{
    readonly page: Page;
    readonly billingAddress: Locator;
    readonly countrySelect: Locator;
    readonly stateField: Locator;
    readonly proceedToCheckout: Locator;
    constructor(page: Page){
        this.page = page;
        this.billingAddress = page.getByRole('heading',{name: 'Billing Address'});
        this.countrySelect = page.getByLabel('Country');
        this.stateField = page.getByTestId('state');
        this.proceedToCheckout = page.getByTestId('proceed-3');

}
    async selectCountry(country:string){
        await this.countrySelect.selectOption(country);

    }

    async fillState(state:string){
        await this.stateField.fill(state);

    }

    async clickProceedToCheckout(){
        await this.proceedToCheckout.click();

    }
}