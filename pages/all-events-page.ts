import type { Page } from 'playwright';

export class AllEventsPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
}