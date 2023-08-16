import { test, expect } from '@playwright/test';
import { user } from '../../constants/userdata';
import { userOne} from '../../constants/userdata';
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

test('User can auth with authentificator', async ({ page }) => {

    const homepage = new HomePage(page);
    const locator = page.locator('.MuiFormHelperText-contained'); 
    await homepage.open();
    let otp = generateToken(user.token)
    await page.click('//span[contains(text(),"Логин")]');
    await page.locator('//input[@name="username"]').fill(userOne.login);
    await page.locator('//input[@name="password"]').fill(userOne.password);
    await page.click('//span[@class="MuiButton-label"]');
    await page.locator('//input[@name="verificationCode"]').fill(userOne.token) ;
    await page.click('button[type="submit"] span[class="MuiButton-label"]')
    await expect(page).toHaveURL('https://dev.sergek.kz/ai-testing?tab=numbers');
});

test.skip('User can auth with ECP', async ({ page }) => {

    const homepage = new HomePage(page);
    const locator = page.locator('.MuiFormHelperText-contained'); 
    await homepage.open();
    await page.goto('https://dev.sergek.kz/login');
    await page.locator('[data-testid="ЭЦП"]').click();
    await page.locator('[data-testid="choose-certificate-button"]').click();
    await page.locator('[data-testid="certificate-file"]').click();
    await page.setInputFiles('[data-testid="certificate-file"]','');
    await page.locator('[data-testid="certificate-file"]').setInputFiles('C:\Users\Myskill.PC\S3E2EAutotest\tests\AUTH_RSA256_b53c55d94087f9247e464837afe58e12c0b550fe.p12')
    await page.locator('input[type="password"]').click();
    await page.locator('input[type="password"]').fill('Astana001kz!');  
    await page.locator('button:has-text("Применить")').click()
});

