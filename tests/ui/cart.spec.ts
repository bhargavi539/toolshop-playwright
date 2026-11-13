import { expect, test } from "@playwright/test";
import { ProductPage } from "../../pages/ProductPage";
import { SearchPage } from "../../pages/SearchPage";
import { CartPage } from "../../pages/CartPage";

const searchTerm = 'Hammer';
const toastMessage = 'Product added to shopping cart.';

test("Add a product to cart",{tag:["@ui"]},async({page})=>{


    const searchPage = new SearchPage(page);
    await searchPage.gotoPage();
    await searchPage.search(searchTerm);
    await expect(searchPage.productNames.first()).toContainText(searchTerm);
    await searchPage.openFirstProduct();

    const productPage =  new ProductPage(page);
    await expect(page).toHaveURL(/\/product\//);
    await expect(productPage.productPageTitle).toContainText(searchTerm);

    await productPage.addToCart();

    await expect(productPage.toastMessage).toBeVisible();
    await expect(productPage.toastMessage).toHaveText(toastMessage);

    await productPage.openCart();
    await expect(page).toHaveURL(/\/checkout/);

    const cartPage = new CartPage(page);
    await expect(cartPage.productTitleInCart).toContainText(searchTerm);
    await expect(cartPage.productQuantityInCart).toHaveValue('1');





})