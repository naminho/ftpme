import execa from 'execa'
import eachSeries from 'async/eachSeries'
import { install, build } from './utils/spinners'

// Run script if defined for current package.
const runScript = async (pkg, script) => {
  if (typeof pkg.scripts[script] === 'undefined') return

  build.text = `Running 'npm run ${script}' for ${pkg.name}`
  await execa('npm', ['run', script], {
    cwd: pkg.absolute
  })
}

// `npm install`, `npm run demo` and `npm run doc` per package.
const prepare = async (scripts, pkg) => {
  // Install dependencies.
  install.start()
  install.text = `Installing dependencies for package ${pkg.name}...`
  await execa('npm', ['install', '--loglevel=error'], {
    cwd: pkg.absolute
  })
  install.stop()

  build.start() // Needs to be triggered from this thread to disappear after.
  // Run scripts.
  await new Promise(scriptDone => {
    eachSeries(scripts, runScript.bind(null, pkg), () => scriptDone())
  })
  build.stop()
}

// Install dependencies and run scripts.
export default (packages, scripts) => new Promise(prepareDone => {
  eachSeries(packages, prepare.bind(null, scripts), () => prepareDone())
})
