const { test, expect } = require('../support')

test('deve logar como administrador', async ({ page }) => {
  
  await page.login.visit()
  await page.login.login('admin@zombieplus.com', 'pwd123')
  await page.login.isLoggedIn('Admin')
  
})

test('não deve logar com senha incorreta', async ({ page }) => {
  
  await page.login.visit()
  await page.login.login('admin@zombieplus.com', '123')
  const toastMessage = 'Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.'
  await page.popup.haveText(toastMessage)

})

test('não deve logar quando email não é preenchido', async ({ page }) => {
  
  await page.login.visit()
  await page.login.login('', '123')
  await page.login.alertHaveText('Campo obrigatório')

})

test('não deve logar quando senha não é preenchida', async ({ page }) => {
  
  await page.login.visit()
  await page.login.login('igor@yahoo.com', '')
  await page.login.alertHaveText('Campo obrigatório')
  
})

test('não deve logar quando email e senha não são preenchidos', async ({ page }) => {
  
  await page.login.visit()
  await page.login.login('', '')
  await page.login.alertHaveText(['Campo obrigatório', 'Campo obrigatório'])
  
})

test('não deve logar com email inválido', async ({ page }) => {
  
  await page.login.visit()
  await page.login.login('igor.com.br', 'pwd123')
  await page.login.alertHaveText('Email incorreto')
  
})