import { APIRequestContext, expect, test } from "@playwright/test";
import { login } from "../../api/auth";

type Product = {id: string, price: string};
const billingDetails = {
    billing_street: "Plougvej",
    billing_city: "Bække",
    billing_country: "DK",
    billing_postal_code: "2300",}

async function getFirstProduct(request:APIRequestContext): Promise<Product>{
    const response = await request.get('/products');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);

    const firstProduct = body.data[0];
    expect(typeof firstProduct.price).toBe('number');
    
    return { id: firstProduct.id, price:firstProduct.price };
        
}
async function createCart(request:APIRequestContext) {

    const response = await request.post('/carts');
    expect(response.status()).toBe(201);
    
    const body = await response.json();
    expect(body).toHaveProperty('id');

    const cartId = body.id;
    expect(cartId).toBeTruthy();
    return cartId;
}


async function addItemToCart(request:APIRequestContext, productId:string, cartId:string){
    const response = await request.post(`/carts/${cartId}`,{
        data:{
                product_id: productId,
                quantity: 1
            }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("result");
    expect(body.result).toBe("item added or updated");
    return true;
    
}

async function getCart(request:APIRequestContext,cartId:string,){
    const response = await request.get(`/carts/${cartId}`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    return body;

}

async function getToken(request:APIRequestContext):Promise<string>{

    const response = await login(request);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty("access_token");
    expect(body.access_token).toBeTruthy();
    const accessToken = body.access_token;
    return accessToken;
    
}

async function createInvoice(request:APIRequestContext, token: string, cartId: string){
    const response =  await request.post('/invoices',{
        data:{
                billing_street: billingDetails.billing_street,
                billing_city: billingDetails.billing_city,
                billing_state: "DK",
                billing_country: billingDetails.billing_country,
                billing_postal_code: billingDetails.billing_postal_code,
                payment_method: "bank-transfer",
                cart_id: cartId,
                    payment_details: {
                        bank_name: "Axel",
                        account_name: "Customer Name",
                        account_number: "1234567891232343"
  }
}
,
        headers:{
            Authorization: `Bearer ${token}`
        }
    })

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.invoice_number).toMatch(/^INV-/);
    expect(body.id).toBeTruthy();
    return body;

}

test("create an order through the API",{tag:['@api','@regression']},async({request})=>{
    const product = await getFirstProduct(request);
    const cartId = await createCart(request);
    const result = await addItemToCart(request, product.id, cartId);
    expect(result).toBeTruthy();

    const cart = await getCart(request,cartId);
    expect(Array.isArray(cart.cart_items)).toBe(true);
    expect(cart.cart_items).toHaveLength(1);
    expect(cart.cart_items[0].product_id).toBe(product.id);
    expect(cart.cart_items[0].quantity).toBe(1);
    expect(cart.id).toBe(cartId);

    const token = await getToken(request);
    expect(token).toBeTruthy();

    const invoice = await createInvoice(request, token, cartId);
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