import { readdirSync, statSync } from 'fs'
import { join } from 'path'
import mapSeries from 'async/mapSeries'
import { folders as prompt } from './prompts'

// Remove node_modules and folders starting with . (.git).
const removeCommon = directory => {
  if (directory === 'node_modules') return false
  if (directory.length && directory[0] === '.') return false
  return true
}
// Get directories for path.
const directories = path =>
  readdirSync(path)
    .filter(file => statSync(join(path, file)).isDirectory())
    .filter(removeCommon)
// Scan for directories.
const scanForDirectories = (absolute, relative, depth) => {
  if (depth > 2) return
  let dirs = directories(join(absolute, relative))
  if (dirs.length === 0) return
  dirs = dirs.map(dir => join(relative, dir))
  const furtherDirectories = dirs
    .map(dir => scanForDirectories(absolute, dir, depth + 1))
    .filter(Boolean)
  dirs = dirs.concat(furtherDirectories)
  // Flatten directories.
  dirs = [].concat.apply([], dirs)
  return dirs
}

const folders = async pkg => {
  const directories = scanForDirectories(pkg.absolute, '', 0).sort()
  pkg.folders = await prompt(directories, pkg)
  return pkg
}

// For each package check which directories exist and prompt for choice.
export default packages => {
  return new Promise(done =>
    mapSeries(packages, folders, (error, results) => {
      done(results)
    })
  )
}
