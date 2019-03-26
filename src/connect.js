// import doesn't work anymore for this package.
const FTP = require('basic-ftp')

// Establishes a connection to the FTP server.
export default async (url, port, user, password, connected) => {
  const client = new FTP.Client()
  try {
    await client.access({
      host: url,
      user,
      password
    })
    return client
  } catch(error) {
    console.error('Couldn\'t establish a connection to the server.')
    process.exit()
  }
}
