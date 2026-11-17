import { test, expect } from "../../fixtures/base";
import { SearchPage } from "../../pages/SearchPage";
import { ProductPage } from "../../pages/ProductPage";
import { CartPage } from "../../pages/CartPage";

const searchTerm = "bolt";
const toastMessage = "Order placed successfully!";


test.describe("Checkout flow",()=>{

    test("Should allow users to complete the checkout process",async({loggedInPage})=>{
        await loggedInPage.goto('/');
        console.log(loggedInPage.url());


    })
})