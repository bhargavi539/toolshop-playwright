import { APIRequestContext, expect } from "@playwright/test";

// Helper 1: call the login endpoint and return the response
export async function login(request:APIRequestContext){
    return await request.post('/users/login',{
        data:{
            email:process.env.USER_EMAIL,
            password:process.env.USER_PASSWORD,
        },
    });

}

// Helper 2: create the test user (only used when login fails)
export async function createUser(request:APIRequestContext){
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