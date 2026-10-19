import {test, expect} from '@playwright/test';
import fs from 'fs';

test("Valid user login with API", {tag:['@api','@smoke']},async({request})=>{

    const response = await request.post('/users/login', {
        data:{
                email: process.env.USER_EMAIL,
                password: process.env.USER_PASSWORD
            },

    });

    expect(response.status()).toBe(200);
    
    
    const body = await response.json();
    expect(body).toHaveProperty('access_token');
    expect(body).toHaveProperty('expires_in');

    expect(body.access_token).toBeTruthy();
    expect(body.token_type).toBe('bearer');
    expect(typeof body.expires_in).toBe('number');
    
});

test("Invalid user login with API", {tag:['@api','@smoke']},async({request})=>{
    const invalidUser = {
                email: 'not.a.real.user@example.com',
                password: 'WrongPassword1!',
            };

    const response = await request.post('/users/login', {
        data:{
                email: invalidUser.email,
                password: invalidUser.password
            },

    });

    expect(response.status()).toBe(401);
    
    
    const body = await response.json();
    expect(body).not.toHaveProperty('access_token');
    expect(body.error).toBe('Unauthorized');
    
});