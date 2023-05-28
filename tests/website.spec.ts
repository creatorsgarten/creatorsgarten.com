import { test, expect } from '@playwright/test'

test('Homepage works', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: 'CONNECTING CREATORS,' })
  ).toBeVisible()
})

test('Can go to events page', async ({ page }) => {
  await page.goto('/')
  await page.locator('#nav-menu > ul > li:nth-child(1) > a').click()
  await expect(
    page.getByRole('heading', { name: 'Past Events' })
  ).toBeVisible()
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

// test('Webring page works', async ({ page }) => {
//   await page.goto('/ring')
//   await expect(
//     page.getByRole('heading', { name: 'Us & Our Friends' })
//   ).toBeVisible()
// })
