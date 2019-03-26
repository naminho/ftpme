import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'

// Store config in install path of global package.
const configFilePath = join(__dirname, '../../.ftpme')

// Util to manage access to the .ftpme config file.
export const read = () => {
  let values = []

  try {
    values = JSON.parse(readFileSync(configFilePath, 'utf8'))
  } catch(error) {}

  return values
}

export const update = (credentials, silent = false) => {
  let newCredentials = read()
  let found = false
  newCredentials = newCredentials.map(existing => {
    // Update existing ones.
    if (existing.url === credentials.url) {
      found = true
      return credentials
    }
    return existing
  })

  // Add as new credentials.
  if (!found) {
    newCredentials.push(credentials)
  }

  writeFileSync(configFilePath, JSON.stringify(newCredentials), 'utf8')

  if (!silent) {
    console.log(`Configuration stored in ${configFilePath}.`)
  }
}
