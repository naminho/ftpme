// Stores the application context.
let context = {
  directory: process.cwd()
}

export const set = values => {
  Object.assign(context, values)
}

export default context
