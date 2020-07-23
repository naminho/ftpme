import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import rimraf from 'rimraf'
import localFTPServer from './utils/server'
import connect from './../src/connect'
import credentials from './../src/credentials'
import packages from './../src/packages'
import upload from './../src/upload'
import prepare from './../src/prepare'
import ctx, { set as setCtx } from './../src/context'

let client
let server

const fixturesOne = join(process.cwd(), 'test/fixtures/one')
const serverFiles = join(process.cwd(), 'test/server')

beforeAll(async () => {
  if (!existsSync(serverFiles)) {
    mkdirSync(serverFiles)
  }
  rimraf.sync(`${serverFiles}/**/*`)
  server = await localFTPServer()
  client = await connect('127.0.0.1', 21)
  setCtx({
    client,
    directory: fixturesOne
  })
})

afterAll(async () => {
  if (client) {
    client.close()
  }
  if (server) {
    server.close()
  }
})

test('Can connect to FTP server.', () => {
  if (client.error) {
    console.log(
      "Couldn't connect to the local ftp server. Make sure to run the tests with sudo."
    )
  }
  expect(client.error).not.toBeTruthy()
})

test('Gets user credentials.', async () => {
  const { url, user, password } = await credentials()

  expect(url).toEqual('test_url')
  expect(user).toEqual('test_user')
  expect(password).toEqual('test_password')
})

test('Finds all the applicable packages.', () => {
  const pkgs = packages(ctx.directory)
  expect(pkgs.length).toEqual(2)

  const alpha = pkgs[0]
  const gamma = pkgs[1]

  expect(alpha.absolute).toEqual(join(fixturesOne, 'alpha'))
  expect(alpha.relative).toEqual('test/fixtures/one/alpha')
  expect(alpha.name).toEqual('alpha')

  expect(gamma.absolute).toEqual(join(fixturesOne, 'gamma'))
  expect(gamma.relative).toEqual('test/fixtures/one/gamma')
  expect(gamma.name).toEqual('gamma')

  setCtx({
    packages: pkgs
  })
})

test('Install package dependencies and run scripts.', async () => {
  await prepare(ctx.packages, ['demo', 'doc'])

  expect(existsSync(join(fixturesOne, 'alpha', 'public'))).toEqual(true)
  expect(existsSync(join(fixturesOne, 'gamma', 'public'))).toEqual(true)
  // Wait ten minutes for async, as install and build can take a while.
}, 60000)

test('Uploads the files to the server.', async () => {
  const packages = [
    {
      absolute: join(fixturesOne, 'alpha'),
      relative: 'alpha',
      name: 'alpha',
      folders: ['public/demo', 'public/doc'],
      base: '/alpha/'
    },
    {
      absolute: join(fixturesOne, 'gamma'),
      relative: 'gamma',
      name: 'gamma',
      folders: ['public/demo'],
      base: '/gamma'
    }
  ]

  await upload(packages, client)

  await client.cd('/')
  let files = await client.list()

  expect(files[0].name).toEqual('alpha')
  expect(files[1].name).toEqual('gamma')

  await client.cd('alpha')
  files = await client.list()

  expect(files.length).toEqual(1)
  expect(files[0].name).toEqual('public')

  await client.cd('public')
  files = await client.list()

  expect(files.length).toEqual(2)
  expect(files[0].name).toEqual('demo')
  expect(files[1].name).toEqual('doc')

  await client.cd('demo')
  files = await client.list()

  // NOTE fails if package alpha not installed and built.
  expect(files.length).toEqual(2)
  expect(files[0].name).toEqual('assets')
  expect(files[1].name).toEqual('index.html')

  await client.cd('/')
  files = await client.list()

  expect(files[0].name).toEqual('alpha')
  expect(files[1].name).toEqual('gamma')

  // NOTE will fail if gamma assets not built.
  await client.cd('gamma/public/demo/assets')
  files = await client.list()

  expect(files.length).toEqual(3)
  expect(files[1].name).toEqual('manifest.json')
})
