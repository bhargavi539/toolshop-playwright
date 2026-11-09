import { test, expect } from '@playwright/test';
import  { LoginPage } from '../../pages/LoginPage';
import path from 'path';


const validEmail = process.env.USER_EMAIL!;
const validPassword = process.env.USER_PASSWORD!;

const invalidPassword = 'wrong-password';
const invalidLoginMessage = 'Invalid email or password';


test.describe('Login Page',{tag:['@ui']}, ()=>{
    test('login with a valid email and a wrong password',async ({page})=>{
        const loginPage = new LoginPage(page);
        await loginPage.gotoPage();
        await loginPage.login(validEmail, invalidPassword);

        //Assert that the correct error message is visible
        await expect(loginPage.loginErrorMessage).toHaveText(invalidLoginMessage);

        //Assert the page still remains on the login page
        await expect(page).toHaveURL(/auth\/login/);

    });

    test('Login with valid email and password', async ({page})=>{


        const myAccountHeading = page.getByRole('heading',{name:'My account'})
        const loginPage = new LoginPage(page);
        await loginPage.gotoPage();
        await loginPage.login(validEmail, validPassword);

        //assert the page navigates to Myaccount page after successful login
        await expect(page).toHaveURL(/account/);
        //assert that My account heading is visible after successful login
        await expect(myAccountHeading).toBeVisible();

    })
})