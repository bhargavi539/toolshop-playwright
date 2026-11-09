import { Page, Locator } from '@playwright/test';

export class LoginPage{
    readonly emailInputField: Locator;
    readonly passwordInputField: Locator;
    readonly loginButton: Locator;
    readonly loginErrorMessage: Locator;
    readonly page: Page;

    constructor(page: Page){
        this.page = page;
        this.emailInputField = page.locator('#email');
        this.passwordInputField = page.locator('#password');
        this.loginButton = page.getByTestId('login-submit');
        this.loginErrorMessage = page.getByTestId('login-error');

    }

    async gotoPage(){
        await this.page.goto('auth/login');
    }

    async login(email: string, password: string){
        await this.emailInputField.fill(email);
        await this.passwordInputField.fill(password);
        await this.loginButton.click();
    }

}