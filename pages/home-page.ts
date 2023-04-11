import type { Page } from 'playwright';
import { isVisible } from '../framework/common-actions';

export class HomePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
  
  }

    //Открыть главную страницу
    async open() {
        await this.page.goto('https://dev.sergek.kz/login');
    }

}
