import { expect, test as setup} from '@playwright/test';
import fs from 'fs';
import { login, createUser } from '../../api/auth';

const authFile = '.auth/user.json';

setup('log in through the API and save the session',async({request})=>{

    //1. Try to login
    let response = await login(request);

    // 2. If login failed, the account is probably gone: create it, then log in again
    if(response.status()=== 401){
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