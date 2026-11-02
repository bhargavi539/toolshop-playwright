import { expect, test } from "@playwright/test";
import { ApiClient } from "../../api/ApiClient";
import { billingDetails } from "../../api/testData";

test("create an order through the API",{tag:['@api','@regression']},async({request})=>{

    const api = new ApiClient(request);
    const product = await api.getFirstProduct();
    const cartId = await api.createCart();
    const result = await api.addItemToCart(product.id, cartId);
    expect(result).toBeTruthy();

    const cart = await api.getCart(cartId);
    expect(Array.isArray(cart.cart_items)).toBe(true);
    expect(cart.cart_items).toHaveLength(1);
    expect(cart.cart_items[0].product_id).toBe(product.id);
    expect(cart.cart_items[0].quantity).toBe(1);
    expect(cart.id).toBe(cartId);

    const token = await api.getToken();
    expect(token).toBeTruthy();

    const invoice = await api.createInvoice(token, cartId);
    //Asserting that the billing details of the invoice are equal to the billing details provided in the request
    expect(invoice.billing_street).toBe(billingDetails.billing_street);
    expect(invoice.billing_city).toBe(billingDetails.billing_city);
    expect(invoice.billing_country).toBe(billingDetails.billing_country);
    expect(invoice.billing_postal_code).toBe(billingDetails.billing_postal_code);

    //Asserting that the total amount of the invoice is equal to the price of the product added to the cart
    expect(invoice).toHaveProperty("total");
    expect(typeof invoice.total).toBe('number');
    expect(invoice.total).toBe(product.price);
});