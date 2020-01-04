import { rename as prompt } from './prompts'

// Prompt whether to merge dist folders into a custom folder.
export default packages => {
  return new Promise(async done => {
    const result = await prompt(packages)

    if (!result) {
      return done(packages)
    }

    packages.forEach(pkg => (pkg.rename = result))

    done(packages)
  })
}
