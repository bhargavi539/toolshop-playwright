import { APIRequestContext, expect, test } from "@playwright/test";

type Product = {id: string, price: string};


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

});