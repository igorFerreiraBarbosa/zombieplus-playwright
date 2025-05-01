const { test, expect } = require('../support')
const data = require('../support/fixtures/movies.json')
const { executeSQL } = require('../support/database')

test.beforeAll(async () => {
  await executeSQL(`DELETE FROM movies;`)
})

test('deve cadastrar um filme', async( { page }) => { 
  const movie = data.create

  await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')

  await page.movies.create(movie)
  await page.popup.haveText(`O filme '${movie.title}' foi adicionado ao catálogo.`)
})

test('deve remover um filme', async( { page, request } ) => {
  const movie = data.to_remove
  await request.api.postMovie(movie)

  await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
  await page.movies.remove(movie.title)
  await page.popup.haveText('Filme removido com sucesso.')
})

test('não deve cadastrar um filme duplicado', async( { page, request }) => { 
  const movie = data.duplicate
  await request.api.postMovie(movie)

  await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
  await page.movies.create(movie)
  await page.popup.haveText(`O título '${movie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)
})

test('não deve cadastrar um filme quando os campos obrigatórios são vazios', async({ page }) => {
  await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')

  await page.movies.goForm()
  await page.movies.submit()
  await page.movies.shouldAlertHaveText([
    'Campo obrigatório',
    'Campo obrigatório',
    'Campo obrigatório',
    'Campo obrigatório'
  ])
})

test('deve realizar busca pelo termo zumbi', async({ page, request }) => {
  const movies = data.search

  movies.data.forEach(async (m) => {
    await request.api.postMovie(m)
  })

  await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
  await page.movies.search(movies.input)
  await page.movies.tableHave(movies.output)
})