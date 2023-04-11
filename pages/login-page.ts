import type { Page } from 'playwright';
import { generateToken } from 'authenticator';
import { user } from '../constants/userdata';
export class LoginPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public async authLoginAutentificator(login: string, password: string) {
        let otp = generateToken('LBGXAOCGKJGHMXRQJAZTQZSKOBSE2KLE')
        await this.page.click('//span[contains(text(),"Логин")]');
        await this.page.type('//input[@name="username"]', login);
        await this.page.type('//input[@name="password"]', password);
        await this.page.click('//span[@class="MuiButton-label"]');
        await this.page.locator('//input[@name="verificationCode"]').fill(otp) ;
        //await this.page.type('//input[@name="verificationCode"]'.fill("TOTP_TOKEN"));
        await this.page.click('button[type="submit"] span[class="MuiButton-label"]')

    }
         
    public async authLoginECP() {
       // Go to https://dev.sergek.kz/login
        await this.page.goto('https://dev.sergek.kz/login');
        await this.page.locator('[data-testid="ЭЦП"]').click();
        await this.page.locator('[data-testid="choose-certificate-button"]').click();
        await this.page.locator('[data-testid="certificate-file"]').click();
        await this.page.locator('input[type="password"]').click();
        await this.page.locator('input[type="password"]').fill('Astana001kz!');       
        await this.page.waitForNavigation(/*{ url: 'https://dev.sergek.kz/events/list' }*/),
        await this.page.locator('button:has-text("Применить")').click()
        /*
        await this.page.locator('input[name="start_date"]').click();
        await this.page.locator('[aria-label="Choose Wednesday\\, January 4th\\, 2023"]').click();
        await this.page.locator('input[name="end_date"]').click();
        await this.page.locator('[aria-label="Choose Thursday\\, January 5th\\, 2023"]').click();
        await this.page.locator('[data-testid="submit-button"]').click();
        */
    }

}

