import { expect, test } from '@playwright/test'

test('Homepage works', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('community of creators')).toBeVisible()
})

test('Can go to events page', async ({ page }) => {
  await page.goto('/')
  await page.getByText('See More →').click()
  await expect(page.getByRole('heading', { name: 'Past Events' })).toBeVisible()
})

test('Events page can navigate into an event', async ({ page }) => {
  await page.goto('/events')
  await page.getByRole('link', { name: 'Stupid Hackathon Bangkok' }).click()
  await page
    .getByRole('heading', { name: 'The Stupid Hackathon Bangkok' })
    .click()
})

test('Event page works', async ({ page }) => {
  await page.goto('/event/bkkjs17')
  await expect(page.getByRole('heading', { name: 'Schedule' })).toBeVisible()
})

test('Special/AllPages page works', async ({ page }) => {
  await page.goto('/wiki/Special/AllPages')
  await expect(page.getByRole('listitem').getByText('MainPage')).toBeVisible()
})

test('Nonexistent page works', async ({ page }) => {
  await page.goto('/wiki/Nonexistent')
  await expect(page.getByRole('link', { name: 'Edit this page' })).toBeVisible()
})

// test('Webring page works', async ({ page }) => {
//   await page.goto('/ring')
//   await expect(
//     page.getByRole('heading', { name: 'Us & Our Friends' })
//   ).toBeVisible()
// })
