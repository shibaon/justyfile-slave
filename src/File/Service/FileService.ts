import { AbstractService } from '../../Base/Service/AbstractService'
import { File } from '../Entity/File'
import fs from 'fs'
import path from 'path'

export class FileService extends AbstractService {

    public get fileRepository() {
        return this.app.dbService.connection.getRepository(File)
    }

    public getByUploadToken(token: string) {
        return this.fileRepository.findOne({ uploadToken: token })
    }

    public async uploadFile(file: File, url: string) {
        const destFilename = `${file.uploadToken}.${Math.random}.${Date.now()}`.md5()
        const destDir = ['files', destFilename.substr(0, 2), destFilename.substr(2, 2)]
        const destPath = path.join(...destDir, destFilename)
        let iterator = ''

        for (const p of destDir) {
            iterator += p + path.sep
            if (!fs.existsSync(iterator)) {
                fs.mkdirSync(iterator)
            }
        }
        fs.renameSync(url, destPath)
        file.uploadToken = null
        file.uri = destPath
        return await this.fileRepository.save(file)
    }

}