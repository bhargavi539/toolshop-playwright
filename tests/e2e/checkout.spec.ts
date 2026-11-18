import { test, expect } from "../../fixtures/base";
import { SearchPage } from "../../pages/SearchPage";
import { ProductPage } from "../../pages/ProductPage";
import { CartPage } from "../../pages/CartPage";

const searchTerm = "Hammer";
const toastMessage = "Product added to shopping cart.";


test.describe("Checkout flow",{tag:['@e2e']},()=>{

    test("Complete checkout with bank transfer",async({loggedInPage})=>{
        const searchPage = new SearchPage(loggedInPage);
        await searchPage.gotoPage();
        await searchPage.search(searchTerm);

        await expect(searchPage.productNames.first()).toContainText(searchTerm,{ignoreCase: true});
        await searchPage.openFirstProduct();



    })
})