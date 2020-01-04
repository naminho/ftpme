import URL from 'url'
import prompts from 'prompts'
import isUrl from 'is-url'
import cancel from './utils/cancel-prompt'
import filenamify from 'filenamify'
import isValidPath from 'valid-path'

const options = { onCancel: cancel }

const getCredentialTitle = credential => {
  if (!credential.url) {
    return
  }
}

export const reuse = async credentials => {
  const choices = credentials.map((credential, index) => ({
    title: `${credential.url} - ${credential.user}`,
    value: credential
  }))
  // Empty value, to add new credentials.
  choices.push({ title: 'No, enter new credentials.', value: {} })
  const response = await prompts(
    [
      {
        type: 'select',
        name: 'reuse',
        message: 'Existing credentials found, should these be used?',
        choices
      }
    ],
    options
  )

  return response.reuse
}

export const url = async () => {
  const addProtocol = value =>
    value.indexOf('://') === -1 ? 'http://' + value : value

  const response = await prompts(
    [
      {
        type: 'text',
        name: 'url',
        message: "What's the URL of the ftp server?",
        validate: value => isUrl(addProtocol(value)),
        format: value => {
          const parsed = URL.parse(addProtocol(value))
          let combined = parsed.host + parsed.path
          // Remove trailing '/', will break connect.
          combined = combined.replace(/\/+$/, '')
          return combined
        }
      }
    ],
    options
  )

  return response.url
}

export const user = async () => {
  const response = await prompts(
    [
      {
        type: 'text',
        name: 'user',
        message: 'Please enter the username:'
      }
    ],
    options
  )

  return response.user
}

export const password = async () => {
  const response = await prompts(
    [
      {
        type: 'password',
        name: 'password',
        message: "What's the password?"
      }
    ],
    options
  )

  return response.password
}

export const store = async () => {
  const response = await prompts(
    [
      {
        type: 'select',
        name: 'store',
        message: 'Should the password be stored?',
        choices: [
          { title: 'No', value: false },
          { title: 'macOS Keychain (safe)', value: 'keychain' },
          { title: 'Locally (unsafe)', value: 'local' }
        ],
        initial: 0
      }
    ],
    options
  )

  return response.store
}

export const packages = async pkgs => {
  const response = await prompts(
    [
      {
        type: 'multiselect',
        name: 'packages',
        message: 'Which packages do you want to upload?',
        choices: pkgs.map(pkg => ({ title: pkg.name, value: pkg.name })),
        min: 1
      }
    ],
    options
  )

  return response.packages
}

export const scripts = async values => {
  const response = await prompts(
    [
      {
        type: 'multiselect',
        name: 'scripts',
        message: 'Which scripts should be run?',
        choices: values.map(script => ({ title: script, value: script })),
        min: 1
      }
    ],
    options
  )

  return response.scripts
}

export const folders = async (values, pkg) => {
  const response = await prompts(
    [
      {
        type: 'multiselect',
        name: 'folders',
        message: `Which folders do you want to upload for package ${pkg.name}?`,
        choices: values.map(folder => ({ title: folder, value: folder }))
      }
    ],
    options
  )

  return response.folders
}

export const base = async pkg => {
  const response = await prompts(
    [
      {
        type: 'text',
        name: 'base',
        message: `What's the base upload path for package ${pkg.name}?`,
        initial: `/${filenamify(pkg.name)}/`,
        validate: value => isValidPath(value)
      }
    ],
    options
  )

  return response.base
}

export const rename = async () => {
  let response = await prompts(
    [
      {
        type: 'confirm',
        name: 'result',
        message: 'Do you want to rename and merge the distribution folders?',
        initial: false
      }
    ],
    options
  )

  if (!response.result) {
    return false
  }

  response = await prompts(
    [
      {
        type: 'text',
        name: 'rename',
        message: 'Into which folder do you want to merge them?',
        initial: '/',
        validate: value => isValidPath(value)
      }
    ],
    options
  )

  return response.rename
}

export const connection = async () => {
  let response = await prompts(
    [
      {
        type: 'text',
        name: 'url',
        message: "What's the URL of the ftp server?",
        format: value => url.parse(value)
      },
      {
        type: 'text',
        name: 'user',
        message: 'Please enter the username:'
      },
      {
        type: 'password',
        name: 'password',
        message: "What's the password?"
      }
    ],
    options
  )

  return {
    ...response,
    url: response.url.path
  }
}
