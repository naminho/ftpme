// Mocks for interactive prompts.

export const reuse = async credentials => Promise.resolve({})

export const url = async () => Promise.resolve('test_url')

export const user = async () => Promise.resolve('test_user')

export const password = async () => Promise.resolve('test_password')

export const store = async () => Promise.resolve({ title: 'No', value: false })
