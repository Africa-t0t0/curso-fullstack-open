const { describe, test, expect, beforeEach } = require('@playwright/test')
const { loginWith } = require('./helper')

describe('Blog app', () => {

    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset').then(() => {
            console.log('Database reset')
        }).catch((error) => {
            console.log('Database reset failed', error)
        })
        await request.post('http://localhost:3003/api/users', {
            data: {
                username: 'Test',
                password: 'testing',
                name: 'Test User'
            }
        })
        await page.goto('http://localhost:5173')
    })

    test('front page can be opened', async ({ page }) => {
        const locator = await page.getByText('blogs')
        await expect(locator).toBeVisible()
        await expect(page.getByText('Full stack course 2025')).toBeVisible()
    })

    test('login fails with wrong password', async ({ page }) => {
        await loginWith(page, 'Test', 'wrong')
        await expect(page.getByText('invalid username or password')).toBeVisible()
    })

    test('login form can be opened', async ({ page }) => {
        await loginWith(page, 'Test', 'testing')
        await expect(page.getByText('Welcome back Test')).toBeVisible()

    })

    describe('when user is logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'Test', 'testing')
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

        describe('and a blog exists', () => {
            beforeEach(async ({ page }) => {
                await page.getByRole('button', { name: 'new blog' }).click()
                await page.getByRole('textbox', { name: 'title' }).fill('Test blog')
                await page.getByRole('textbox', { name: 'author' }).fill('Test author')
                await page.getByRole('textbox', { name: 'url' }).fill('http://testblog.com')
                await page.getByRole('button', { name: 'create' }).click()
            })

            test('a blog can be liked', async ({ page }) => {
                await expect(page.getByText('Welcome back Test')).toBeVisible()
                // select only the last blog
                await page.getByRole('button', { name: 'view' }).last().click()
                await page.getByRole('button', { name: 'like' }).click()
                await expect(page.getByText('1 likes')).toBeVisible()
            })

            test('a blog can be deleted', async ({ page }) => {
                await expect(page.getByText('Welcome back Test')).toBeVisible()
                // select only the last blog
                await page.getByRole('button', { name: 'view' }).last().click()
                // expect the remove button to be visible
                await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
            })

            test('a blog can only be deleted by the user who created it', async ({ page }) => {
                await expect(page.getByText('Welcome back Test')).toBeVisible()
                // select only the last blog
                await page.getByRole('button', { name: 'view' }).last().click()
                await page.getByRole('button', { name: 'remove' }).click()
                await expect(page.getByText('Blog "Test blog" was successfully removed')).toBeVisible()
            })
        })
    })


})

