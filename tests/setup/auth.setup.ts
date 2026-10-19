import {APIRequestContext, expect, test as setup} from '@playwright/test';
import fs from 'fs';

const authFile = '.auth/user.json';

// Helper 1: call the login endpoint and return the response
async function login(request:APIRequestContext){
    return await request.post('/users/login',{
        data:{
            email:process.env.USER_EMAIL,
            password:process.env.USER_PASSWORD,
        },
    });

}

// Helper 2: create the test user (only used when login fails)
async function createUser(request:APIRequestContext){
    const response = await request.post('/users/register',{
        data:{
                first_name: "qa",
                last_name: "detective",
                address: {
                street: "Street 1",
                house_number: "12",
                city: "Viby",
                state: "AJ",
                country: "Ireland",
                postal_code: "1234"
                },
                phone: "0987654321",
                dob: "1990-01-01",
                password: process.env.USER_PASSWORD,
                email: process.env.USER_EMAIL
            },
        });
        await expect(response).toBeOK();
    
}

setup('log in through the API and save the session',async({request})=>{
    //1. Try to login
    let response = await login(request);

    // 2. If login failed, the account is probably gone: create it, then log in again
    if(!response.ok()){
        await createUser(request);
        response = await login(request);
    }
    await expect(response).toBeOK();

    //3.Read the access token from the response
    const body = await response.json();
    expect(body.access_token).toBeTruthy();

    // 4. Write a storage state file with the token in localStorage

    fs.mkdirSync('.auth',{recursive:true});
    const storageState = {
    cookies: [],
    origins: [
      {
        origin: process.env.BASE_URL,
        localStorage: [{ name: 'auth-token', value: body.access_token }],
      },
    ],
  };
  fs.writeFileSync(authFile, JSON.stringify(storageState,null,2));
});