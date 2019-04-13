// import doesn't work anymore for this package.
const FTP = require('basic-ftp')
import { connecting } from './utils/spinners'

// Establishes a connection to the FTP server.
export default async (url, port, user, password, connected) => {
  connecting.start()
  const client = new FTP.Client()
  try {
    await client.access({
      host: url,
      user,
      password
    })
    connecting.stop()
    return client
  } catch(error) {
    connecting.stop()
    console.error('Couldn\'t establish a connection to the server.')
    process.exit()
  }
}
