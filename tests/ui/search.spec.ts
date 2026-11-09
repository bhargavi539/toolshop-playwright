import { expect, test } from "@playwright/test";
import { SearchPage } from "../../pages/SearchPage";


const searchTerm = 'Hammer';

test(`Search for a product "${searchTerm}"`,{tag:['@ui']},async({page})=>{

    
    const searchPage = new SearchPage(page);
    await searchPage.gotoPage();
    await searchPage.search(searchTerm);

    //1. Wait until the list is filtered (this assertion retries)
    await expect(searchPage.productNames.first()).toContainText(searchTerm,{ignoreCase:true});

    const productNames = await searchPage.productNames.allTextContents();

    // 2. Assert there is at least one result
    expect(productNames.length).toBeGreaterThan(0);
    
    for(const productName of productNames){
        //3. Assert that each product name contains the search term (case-insensitive)
        expect(productName.toLowerCase()).toContain(searchTerm.toLowerCase());
    }   

})