const loginWith = async (page, username, password) => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByRole('textbox', { name: 'username' }).fill(username)
    await page.getByRole('textbox', { name: 'password' }).fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

export { loginWith }