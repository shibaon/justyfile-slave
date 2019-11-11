import { AbstractApiController, IApiQueryData } from '../../Base/Controller/AbstractApiController'
import { Application } from '../../Application'
import { Request, Response } from 'express'
import { File } from '../Entity/File'
import multer from 'multer'
import fs from 'fs'

interface IUploadRequest extends Request {
    fileEntity?: File
}

export class UploadController extends AbstractApiController {

    public constructor(app: Application) {
        super(app)

        this.onApiQuery('/api/pre-upload', this.preUpload)
        this.app.http.options('/upload', this.uploadOptions.bind(this))
        this.app.http.post('/upload', this.startUpload.bind(this), multer({ dest: 'uploads' }).single('file'), this.upload.bind(this))
    }

    public uploadOptions(req: Request, res: Response, next: CallableFunction) {
        this.sendOriginHeader(req, res)
        next()
    }

    public async startUpload(req: IUploadRequest, res: Response, next: CallableFunction) {
        this.sendOriginHeader(req, res)
        const file = req.query.t ? await this.app.fileService.getByUploadToken(req.query.t) : undefined
        if (!file || file.timestamp < Date.now() / 1000 - 60) {
            return this.errorResponse(res, 'Token is expired :-(')
        }
        req.fileEntity = file
        next()
    }

    public async upload(req: IUploadRequest, res: Response) {
        const removeTempFile = () => {
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path)
            }
        }
        const file = req.fileEntity
        if (!req.file) {
            return this.errorResponse(res, 'File was not uploaded :-(')
        }   
        if (!file) {
            removeTempFile()
            return this.errorResponse(res, 'Something went wrong :-(')
        }
        if (Number(req.file.size) !== file.size) {
            removeTempFile()
            return this.errorResponse(res, 'File damaged while uploading :-(')
        }
        file.uploadToken = null
        await this.app.fileService.fileRepository.save(file)
        await this.app.fileService.uploadFile(file, req.file.path)
        res.send()
    }

    public async preUpload(data: IApiQueryData) {
        const name: string = data.params.name
        const type: string = data.params.type
        const size: number = data.params.size

        if (!name || !type || !size) {
            throw new Error('insufficient_parameters')
        }
        const file = this.app.fileService.fileRepository.create({
            name,
            size: Number(size),
            type,
            uploadToken: `${Math.random()}.${new Date().toISOString()}.${name}.${type}.${size}`.sha512(),
            timestamp: Math.floor(Date.now() / 1000),
        })
        await this.app.fileService.fileRepository.save(file)
        return { id: file.id, token: file.uploadToken }
    }

    protected sendOriginHeader(req: Request, res: Response) {
        const origin = req.headers.origin
        if (origin && typeof origin === 'string') {
            if (origin.indexOf('http://localhost:') === 0 || origin.indexOf('https://justyfile.io') === 0) {
                res.setHeader('Access-Control-Allow-Origin', origin)
            }
        }
    }

}
