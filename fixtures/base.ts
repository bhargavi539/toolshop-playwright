import {test as base, expect, Page} from "@playwright/test";
import { ApiClient } from "../api/ApiClient";

type MyFixtures = {
    api: ApiClient;
    token: string;
    loggedInPage: Page;
};

export const test = base.extend<MyFixtures>({
    // Create a fixture for the API client to use the helpers in the ApiClient class
    api: async({request},use)=>{
        const api = new ApiClient(request);
        await use(api);
    },
    // Create a fixture for the token to use the getToken method from the ApiClient class
    token: async({playwright},use)=>{
        const apiContext = await playwright.request.newContext({baseURL: process.env.API_URL});
        const api = new ApiClient(apiContext);
        const token = await api.getToken();
        await apiContext.dispose();
        await use(token);

    },
    // Create a fixture for the loggedInPage to use the token to set the localStorage item for the auth-token
    loggedInPage: async({page,token},use)=>{
        await page.addInitScript(value=>{
            window.localStorage.setItem('auth-token',value);
        },token);
        await use(page);
    },
});

export {expect};