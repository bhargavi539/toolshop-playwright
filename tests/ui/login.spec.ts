import { test, expect } from '@playwright/test';
import  { LoginPage } from '../../pages/LoginPage';


const validEmail = process.env.USER_EMAIL!;
const validPassword = process.env.USER_PASSWORD!;

const invalidPassword = 'wrong-password';
const invalidLoginMessage = 'Invalid email or password';

test.describe('Login Page',{tag:['@ui']}, ()=>{
    test('login with a valid email and a wrong password',async ({page})=>{
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(validEmail, invalidPassword);

        //Assert that the correct error message is visible
        await expect(loginPage.loginErrorMessage).toHaveText(invalidLoginMessage);

        //Assert the page still remains on the login page
        await expect(page).toHaveURL(/auth\/login/);

    });
})