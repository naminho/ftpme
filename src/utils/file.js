import { writeFileSync, readFileSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

// Store config in user directory.
const configFilePath = join(homedir(), '/.ftpme')

// Util to manage access to the .ftpme config file.
export const read = () => {
  let values = []

  try {
    values = JSON.parse(readFileSync(configFilePath, 'utf8'))
  } catch(error) {}

  return values
}

export const update = (credentials, silent = false) => {
  const existingCredentials = read()
  let found = false
  const newCredentials = existingCredentials.map(existing => {
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

  try {
    writeFileSync(configFilePath, JSON.stringify(newCredentials), 'utf8')
  } catch(error) {
    return console.warn('Couldn\'t store configuration locally.')
  }

  if (!silent) {
    const action = existingCredentials.length ? 'updated' : 'stored'
    console.log(`Configuration ${action} in ${configFilePath}.`)
  }
}
