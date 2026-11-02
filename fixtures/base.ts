import {test as base, expect} from "@playwright/test";
import { ApiClient } from "../api/ApiClient";

type MyFixtures = {
    api: ApiClient;
};

export const test = base.extend<MyFixtures>({
    api: async({request},use)=>{
        const api = new ApiClient(request);
        await use(api);
    }
})

export {expect};