import { lstatSync, readdirSync, existsSync, readFileSync } from 'fs'
import { join, relative } from 'path'

const getPackageJSON = source => join(source, 'package.json')
const readPackageJSON = source => {
  // require('package.json') didn't work with jest.
  return JSON.parse(readFileSync(getPackageJSON(source), 'utf8'))
}

// Returns paths with applicable packages inside.
export default (directory) => {
  const enhance = source => {
    const pkg = readPackageJSON(source)
    return ({
      absolute: source,
      relative: relative(process.cwd(), source),
      name: pkg.name,
      scripts: pkg.scripts
    })
  }
  const isValidPackage = source => {
    const pkg = readPackageJSON(source)
    return pkg.name && pkg.scripts && !pkg.private
  }
  const isPackage = source => existsSync(getPackageJSON(source))
  const isDirectory = source => lstatSync(source).isDirectory()

  return readdirSync(directory)
    .map(name => join(directory, name))
    .filter(isDirectory)
    .filter(isPackage)
    .filter(isValidPackage)
    .map(enhance)
}
