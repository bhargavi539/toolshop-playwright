import { APIRequestContext, expect } from "@playwright/test";
import { login } from "./auth";
import { Product } from "./types";
import { billingDetails } from "./testData";

export class ApiClient {
    constructor(private request: APIRequestContext) {
        }
    
        
    async getFirstProduct(): Promise<Product>{
        // Get the first product from the API and return its id and price
    const response = await this.request.get('/products');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);

    const firstProduct = body.data[0];
    expect(typeof firstProduct.price).toBe('number');
    
    return { id: firstProduct.id, price:firstProduct.price };
        
    }
    
    async createCart() {
    
    // Create a new cart and return its id
    const response = await this.request.post('/carts');
    expect(response.status()).toBe(201);
    
    const body = await response.json();
    expect(body).toHaveProperty('id');

    const cartId = body.id;
    expect(cartId).toBeTruthy();
    return cartId;
    }


    async addItemToCart( productId:string, cartId:string){

    // Add an item to the cart and return true if successful
    const response = await this.request.post(`/carts/${cartId}`,{
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

    async getCart(cartId:string,){
    const response = await this.request.get(`/carts/${cartId}`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    return body;

}

    async getToken():Promise<string>{

        const response = await login(this.request);
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body).toHaveProperty("access_token");
        expect(body.access_token).toBeTruthy();
        const accessToken = body.access_token;
        return accessToken;
    
    }

    async createInvoice(token: string, cartId: string){
        const response =  await this.request.post('/invoices',{
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
}
