const { test, expect }  = require('../support');
import { faker } from '@faker-js/faker';

test('deve cadastrar um lead na fila de espera', async ({ page }) => {

  const leadName = faker.person.fullName() 
  const leadEmail = faker.internet.email()

  await page.landing.visit()

  await page.landing.openLeadModal()

  await page.landing.submitFormLead(leadName, leadEmail)

 /*  await page.getByText('seus dados conosco').click()
  const content = await page.content()
  console.log(content) */

  const toastMessage = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!'
  await page.toast.containText(toastMessage)

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

  await page.landing.visit()

  await page.landing.openLeadModal()

  await page.landing.submitFormLead(leadName, leadEmail)

 /*  await page.getByText('seus dados conosco').click()
  const content = await page.content()
  console.log(content) */

  const toastMessage = 'O endereço de e-mail fornecido já está registrado em nossa fila de espera.'
  await page.toast.containText(toastMessage)

});

test('não deve cadastrar com email incorreto', async ({ page }) => {

  await page.landing.visit()

  await page.landing.openLeadModal()

  await page.landing.submitFormLead('Igor Ferreira', 'igor.yahoo.com')

  await page.landing.shouldAlertHaveText('Email incorreto')

});

test('não deve cadastrar com email vazio', async ({ page }) => {

  await page.landing.visit()

  await page.landing.openLeadModal()

  await page.landing.submitFormLead('Igor Ferreira', '')

  await page.landing.shouldAlertHaveText('Campo obrigatório')

});

test('não deve cadastrar com nome vazio', async ({ page }) => {

  await page.landing.visit()

  await page.landing.openLeadModal()

  await page.landing.submitFormLead('', 'igor@yahoo.com')

  await page.landing.shouldAlertHaveText('Campo obrigatório')

});

test('não deve cadastrar com campos vazios', async ({ page }) => {

  await page.landing.visit()

  await page.landing.openLeadModal()

  await page.landing.submitFormLead('', '')

  await page.landing.shouldAlertHaveText([
    'Campo obrigatório',
    'Campo obrigatório'
  ])

});