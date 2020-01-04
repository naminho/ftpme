#! /usr/bin/env node

import '@babel/polyfill'
import ctx, { set } from './context'
import credentials from './credentials'
import connect from './connect'
import packages from './packages'
import pick from './pick'
import scripts from './scripts'
import prepare from './prepare'
import folders from './folders'
import base from './base'
import rename from './rename'
import upload from './upload'

// Upload package dist files for scripts inside current folder to an FTP server.
;(async () => {
  // Load stored credentials or prompt when not found.
  const { url, user, password } = await credentials()

  // Establish a connection to the server.
  set({ client: await connect(url, 21, user, password) })

  // Find applicapble packages.
  set({ packages: packages(ctx.directory) })

  // Prompt to pick the packages to upload.
  set({ packages: await pick(ctx.packages) })

  // Prompt for scripts to be run.
  set({ scripts: await scripts(ctx.packages) })

  // Install dependencies and run scripts.
  await prepare(ctx.packages, ctx.scripts)

  // Prompt for folders to be uploaded for each package.
  set({ packages: await folders(ctx.packages) })

  // Prompt for base upload path per package.
  set({ packages: await base(ctx.packages) })

  // Prompt whether build paths should be merged.
  set({ packages: await rename(ctx.packages) })

  // Upload the packages to the server.
  await upload(ctx.packages, ctx.client)

  process.exit(0)
})()
