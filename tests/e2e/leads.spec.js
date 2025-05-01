const { test, expect }  = require('../support');
import { faker } from '@faker-js/faker';
const { executeSQL } = require('../support/database')

test.beforeAll(async () => {
  await executeSQL(`DELETE FROM leads;`)
})

test('deve cadastrar um lead na fila de espera', async ({ page }) => {

  const leadName = faker.person.fullName() 
  const leadEmail = faker.internet.email()

  await page.leads.visit()

  await page.leads.openLeadModal()

  await page.leads.submitFormLead(leadName, leadEmail)

 /*  await page.getByText('seus dados conosco').click()
  const content = await page.content()
  console.log(content) */

  const toastMessage = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato.'
  await page.popup.haveText(toastMessage)

});

test('não deve cadastrar um lead com email já cadastrado', async ({ page, request }) => {

  const leadName = faker.person.fullName() 
  const leadEmail = faker.internet.email()

  const newLead = await request.post('http://localhost:3333/leads', {
    data: {
      name: leadName,
      email: leadEmail
    }
  })

  expect(newLead.ok()).toBeTruthy()

  await page.leads.visit()

  await page.leads.openLeadModal()

  await page.leads.submitFormLead(leadName, leadEmail)

 /*  await page.getByText('seus dados conosco').click()
  const content = await page.content()
  console.log(content) */

  const toastMessage = 'Verificamos que o endereço de e-mail fornecido já consta em nossa lista de espera. Isso significa que você está um passo mais perto de aproveitar nossos serviços.'
  await page.popup.haveText(toastMessage)

});

test('não deve cadastrar com email incorreto', async ({ page }) => {

  await page.leads.visit()

  await page.leads.openLeadModal()

  await page.leads.submitFormLead('Igor Ferreira', 'igor.yahoo.com')

  await page.leads.shouldAlertHaveText('Email incorreto')

});

test('não deve cadastrar com email vazio', async ({ page }) => {

  await page.leads.visit()

  await page.leads.openLeadModal()

  await page.leads.submitFormLead('Igor Ferreira', '')

  await page.leads.shouldAlertHaveText('Campo obrigatório')

});

test('não deve cadastrar com nome vazio', async ({ page }) => {

  await page.leads.visit()

  await page.leads.openLeadModal()

  await page.leads.submitFormLead('', 'igor@yahoo.com')

  await page.leads.shouldAlertHaveText('Campo obrigatório')

});

test('não deve cadastrar com campos vazios', async ({ page }) => {

  await page.leads.visit()

  await page.leads.openLeadModal()

  await page.leads.submitFormLead('', '')

  await page.leads.shouldAlertHaveText([
    'Campo obrigatório',
    'Campo obrigatório'
  ])

});