import {test as base, expect, Page} from "@playwright/test";
import { ApiClient } from "../api/ApiClient";

type MyFixtures = {
    api: ApiClient;
    token: string;
    loggedInPage: Page;
};

export const test = base.extend<MyFixtures>({
    api: async({request},use)=>{
        const api = new ApiClient(request);
        await use(api);
    },

    token: async({api},use)=>{
        const token = await api.getToken();
        await use(token);
    },

    loggedInPage: async({page,token},use)=>{
        await page.addInitScript(value=>{
            window.localStorage.setItem('auth-token',value);
        },token);
        await use(page);
    },
});

export {expect};