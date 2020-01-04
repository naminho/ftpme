import ctx from './context'
import { scripts as prompt } from './prompts'

export default async pkgs => {
  // Aggregate scripts from all packages.
  let scripts = pkgs.reduce(
    (total, current) => total.concat(Object.keys(current.scripts)),
    []
  )

  // Remove duplicates.
  scripts = [...new Set(scripts)]

  return await prompt(scripts)
}
