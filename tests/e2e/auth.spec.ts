import { test, expect } from '@playwright/test';
import { userOne } from '../../constants/userdata';
import { HomePage } from '../../pages/home-page';
import { LoginPage } from '../../pages/login-page';
import { generateToken } from 'authenticator';
import {faker} from 'Faker';
import path from 'path';


//Авторизация с корректным e-mail-ом и паролем
/*
test.beforeEach(async ({ page }) => {
    const homepage = new HomePage(page);
    const locator = page.locator('.MuiFormHelperText-contained'); 
    await homepage.open();
    let otp = generateToken(user.token)
    await page.click('//span[contains(text(),"Логин")]');
    await page.locator('//input[@name="username"]').fill('auto.test');
    await page.locator('//input[@name="password"]').fill('Qwerty11!');
    await page.click('//span[@class="MuiButton-label"]');
    await page.locator('//input[@name="verificationCode"]').fill(otp) ;
    await page.click('button[type="submit"] span[class="MuiButton-label"]')
});
*/

test('Авторизация', async ({ page }) => {

    
});


