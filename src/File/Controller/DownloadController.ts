import path from 'path'
import { AbstractApiController, IApiQueryData } from '../../Base/Controller/AbstractApiController'
import { Application } from '../../Application'
import { NotFoundException } from '../../Base/Controller/AbstractController'
import { Request, Response } from 'express'
import fs from 'fs'

export class DownloadController extends AbstractApiController {

    public constructor(app: Application) {
        super(app)

        this.onApiQuery('/api/pre-download', this.preDownload)
        this.app.http.get('/*', this.download.bind(this))
    }

    public async download(req: Request, res: Response) {
        const token = await this.app.fileService.getDownloadToken(req.query.t)
        if (!token) {
            return this.notFoundResponse(res)
        }
        //await this.app.fileService.downloadTokenRepository.delete(token)
        const file = await this.app.fileService.getById(token.fileId)
        const filename = req.params[0]
        if (!file || !file.uri || filename !== file.name) {
            return this.notFoundResponse(res)
        }
        const imageMimes = ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'application/pdf']
        if (imageMimes.includes(file.type.toLowerCase())) {
            return fs.createReadStream(file.uri).pipe(res)
        }
        res.download(path.join(this.app.rootDir, file.uri), file.name)
    }

    public async preDownload(data: IApiQueryData) {
        const file = data.params.fileId ? await this.app.fileService.getById(data.params.fileId) : undefined
        if (!file) {
            throw new NotFoundException()
        }
        const token = await this.app.fileService.downloadTokenRepository.save({
            id: (JSON.stringify(file.getPlain()) + `.${Date.now()}.${Math.random()}`).sha512(),
            fileId: file.id,
            timestamp: Math.floor(Date.now() / 1000),
        })
        return token.id
    }

}
