import { expect } from '@playwright/test';

export class Popup {

  constructor(page) {
    this.page = page
  }

  async haveText(message) {
      await expect(this.page.locator('.swal2-popup .swal2-html-container')).toHaveText(message)
      //await expect(this.page.locator('.toast')).toBeHidden({ timeout: 7000 })
  }
}