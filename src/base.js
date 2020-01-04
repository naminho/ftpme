import mapSeries from 'async/mapSeries'
import { base as prompt } from './prompts'

const basePaths = async pkg => {
  pkg.base = await prompt(pkg)
  return pkg
}

// Prompt for base paths for each package.
export default packages => {
  return new Promise(done =>
    mapSeries(packages, basePaths, (error, results) => {
      done(results)
    })
  )
}
