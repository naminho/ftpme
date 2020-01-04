import { get, set } from 'kychain'
import { read, update } from './utils/file'
import { reuse, url, user, password, store } from './prompts'

export default async () => {
  let storedCredentials = read()
  let credentials = {}

  // Prompt whether to reuse existing credentials.
  if (storedCredentials.length) {
    credentials = await reuse(storedCredentials)
  }

  // Prompt for missing credentials one-by-one.
  if (!credentials.url) {
    credentials.url = await url()
  }

  if (!credentials.user) {
    credentials.user = await user()
  }

  let pswd
  try {
    if (!credentials.password) {
      // Check if password can be found in keychain.
      pswd = await get(`ftpme:${credentials.url}`)
    }
  } catch (error) {}

  if (!credentials.password && !pswd) {
    pswd = await password()
    const where = await store()

    if (where === 'local') {
      credentials.password = pswd
    }

    if (where === 'keychain') {
      await set(pswd, `ftpme:${credentials.url}`)
    }
  }

  update(credentials)
  // After update to avoid unwanted storage of password.
  if (pswd) {
    credentials.password = pswd
  }

  return credentials
}
