import eachSeries from 'async/eachSeries'
import { join } from 'path'
import { upload } from './utils/spinners'

export default (packages, client) => {
  upload.start()
  return new Promise((uploaded) => {
    eachSeries(packages, async (pkg) => {
      await client.cd('/')
      await client.ensureDir(pkg.base)

      // Upload each folder.
      await new Promise(foldersDone => eachSeries(pkg.folders, async folder => {
        await client.ensureDir(pkg.base)
        const assetPath = join(pkg.absolute, folder)
        upload.text = `Uploading ${join(pkg.base, folder)}`
        await client.ensureDir(folder)
        await client.uploadDir(assetPath)
      }, () => foldersDone()))
    }, () => upload.stop() && uploaded())
  })
}
