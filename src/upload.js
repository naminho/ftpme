import eachSeries from 'async/eachSeries'
import { join } from 'path'
import { upload } from './utils/spinners'

const uploadFolder = async (client, pkg, folder) => {
  const assetPath = join(pkg.absolute, folder)
  const resultFolder = pkg.rename || folder
  upload.text = `Uploading ${join(pkg.base, resultFolder)}`
  await client.ensureDir(join('/', pkg.base, resultFolder))
  console.log(await client.pwd())
  await client.uploadFromDir(assetPath)
}

export default (packages, client) => {
  upload.start()
  return new Promise(uploaded => {
    eachSeries(
      packages,
      async pkg => {
        await client.cd('/')
        await client.ensureDir(pkg.base)

        // Upload each folder.
        await new Promise(foldersDone =>
          eachSeries(pkg.folders, uploadFolder.bind(this, client, pkg), () =>
            foldersDone()
          )
        )
      },
      () => upload.stop() && uploaded()
    )
  })
}
