const { describe, test, expect, beforeEach } = require('@playwright/test')

describe('Blog app', () => {

    beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173')
    })

    test('front page can be opened', async ({ page }) => {
        const locator = await page.getByText('blogs')
        await expect(locator).toBeVisible()
        await expect(page.getByText('Full stack course 2025')).toBeVisible()
    })

    test('login form can be opened', async ({ page }) => {
        await page.getByRole('button', { name: 'login' }).click()
        await page.getByRole('textbox', { name: 'username' }).fill('Test')
        await page.getByRole('textbox', { name: 'password' }).fill('testing')
        await page.getByRole('button', { name: 'login' }).click()
        await expect(page.getByText('Welcome back Test')).toBeVisible()

    })

    describe('when user is logged in', () => {
        beforeEach(async ({ page }) => {
            await page.getByRole('button', { name: 'login' }).click()
            await page.getByRole('textbox', { name: 'username' }).fill('Test')
            await page.getByRole('textbox', { name: 'password' }).fill('testing')
            await page.getByRole('button', { name: 'login' }).click()
        })

        test('a new blog can be created', async ({ page }) => {
            await expect(page.getByText('Welcome back Test')).toBeVisible()
            await page.getByRole('button', { name: 'new blog' }).click()
            await page.getByRole('textbox', { name: 'title' }).fill('Test blog')
            await page.getByRole('textbox', { name: 'author' }).fill('Test author')
            await page.getByRole('textbox', { name: 'url' }).fill('http://testblog.com')
            await page.getByRole('button', { name: 'create' }).click()
            await expect(page.getByText('A new blog "Test blog" by Test author added')).toBeVisible()
        })
    })


})

