import { test, expect } from '@playwright/test';

test("GET /products returns a non-empty list with the expected fields",{tag:["@api","@smoke"]},
    async({request})=>{
        
        const productsResponse = await request.get('/products');
        expect(productsResponse.status()).toBe(200);

        const body = await productsResponse.json();
        expect(Array.isArray(body.data)).toBe(true);
        expect(body.data.length).toBeGreaterThan(0);

        const product = body.data[0];
        expect(typeof product.price).toBe('number');
        expect(product.price).toBeGreaterThan(0);
        expect(product.category).toHaveProperty('name');
    
});