import { join } from 'path'
import FTPServer from 'ftp-srv'
import bunyan from 'bunyan'

// Creates a local mock server instance.
export default () =>
  new Promise(async done => {
    const Server = new FTPServer({
      // Hide logs from test output.
      log: bunyan.createLogger({
        name: 'quiet-logger',
        level: 60
      })
    })
    Server.on('login', (data, resolve) =>
      resolve({ root: join(__dirname, '../server') })
    )
    await Server.listen()
    done(Server)
  })
