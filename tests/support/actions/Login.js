import { expect } from "@playwright/test"

export class Login {
  constructor(page) {
    this.page = page
  }

  async do(email, password, user) {
    await this.visit()
    await this.login(email, password)
    await this.isLoggedIn(user)
  }

  async visit() {
    await this.page.goto('/admin/login')
    const loginForm = this.page.locator('.login-form')
    await expect(loginForm).toBeVisible()
  }

  async login(user, pwd) {
    await this.page.getByPlaceholder('E-mail').fill(user)
    await this.page.getByPlaceholder('Senha').fill(pwd)
    await this.page.getByText('Entrar').click()
  }

  async alertHaveText(text) {
    const alert = this.page.locator('span[class$=alert]')
    await expect(alert).toHaveText(text)
  }

  async isLoggedIn(user) {
    const loggedUser = this.page.locator('.logged-user')
    await expect(loggedUser).toHaveText(`Olá, ${user}`)
  }

}