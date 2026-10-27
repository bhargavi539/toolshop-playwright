import { APIRequestContext, expect, test } from "@playwright/test";


async function getFirstProduct(request:APIRequestContext) {
    const response = await request.get('/products');
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(Array.isArray(body.data)).toBe(true);
        expect(body.data.length).toBeGreaterThan(0);

        const firstProduct = body.data[0];
        const productId = firstProduct.id;
        expect(typeof firstProduct.price).toBe('number');
        return productId;
        
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


async function addItemToCart(request:APIRequestContext, productId:string, cartId:string, ){
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

test("create an order through the API",{tag:['@api','@regression']},async({request})=>{
    const productId = await getFirstProduct(request);
    const cartId = await createCart(request);
    const result = await addItemToCart(request, productId, cartId);
    expect(result).toBeTruthy();

});