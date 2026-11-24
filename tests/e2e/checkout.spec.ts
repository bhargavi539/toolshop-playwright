import { test, expect } from "../../fixtures/base";
import { SearchPage } from "../../pages/SearchPage";
import { ProductPage } from "../../pages/ProductPage";
import { CartPage } from "../../pages/CartPage";
import { BillingPage } from "../../pages/BillingPage";
import { time } from "console";

const searchTerm = "Hammer";
const toastMessage = "Product added to shopping cart.";
const loggedInText = "you are already logged in";
const country = "Denmark";
const state = "Capital Region";



test.describe("Checkout flow",()=>{

    test("Complete checkout with bank transfer",{tag:['@e2e']},async({loggedInPage})=>{
        const searchPage = new SearchPage(loggedInPage);
        await searchPage.gotoPage();
        await searchPage.search(searchTerm);

        // assert that search results contain search term
        await expect(searchPage.productNames.first()).toContainText(searchTerm,{ignoreCase: true});
        await searchPage.openFirstProduct();

        await expect(loggedInPage).toHaveURL(/\/product\//);
        const productPage = new ProductPage(loggedInPage);
        await expect(productPage.productPageTitle).toContainText(searchTerm);
        await productPage.addToCart();
        //assert that toast message is displayed
        await expect(productPage.toastMessage).toHaveText(toastMessage);
        await productPage.openCart();
        //assert that the page has /checkout in url
        await expect(loggedInPage).toHaveURL(/\/checkout/);

        const cartPage = new CartPage(loggedInPage);
        //assert that the cart has the product title
        await expect(cartPage.productTitleInCart).toContainText(searchTerm);
        await expect(cartPage.productQuantityInCart).toHaveValue('1');

        await cartPage.checkOutClick();
        await expect(cartPage.loggedInText).toContainText(loggedInText);
        await cartPage.checkOutClickAgain();
        const billingPage = new BillingPage(loggedInPage);
        
        //assert that the billing address heading is displayed
        await expect(billingPage.billingAddress).toBeVisible();

        //Select country= 'Denmark' from dropdown
        await billingPage.selectCountry(country);

        //wait until the lookup spinner disappears
        const spinner = loggedInPage.getByText('Looking up your address');
        await expect(spinner).toBeHidden();
        
        //assert that state field does not have empty value
        await expect(billingPage.stateField).not.toHaveValue('');

        //assert that proceed to checkout button is enabled
        await expect(billingPage.proceedToCheckout).toBeEnabled();



    })
})