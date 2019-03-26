import ctx from './context'
import { packages } from './prompts'

// Prompt for packages to be considered.
export default async pkgs => {
  // Cancel if no packages found.
  if (pkgs.length === 0) {
    console.warn(`No applicable packages found in ${process.cwd()}.`)
    process.exit()
  }
  // No need to prompt if there is just one package available.
  if (pkgs.length < 2) {
    console.log(`Found package ${pkgs[0].name}.`)
    return pkgs
  }

  const picks = await packages(pkgs)

  return pkgs.filter(pkg => picks.indexOf(pkg.name) !== -1)
}
