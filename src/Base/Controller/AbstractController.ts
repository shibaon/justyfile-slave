import { Application } from '../../Application'
import { Response, Request } from 'express'

export interface IQueryData {
    params: Record<string, any>
    req: Request
    res: Response
}

export class AccessDeniedException extends Error { }

export class NotFoundException extends Error { }

export class AbstractController {

    public static jsonResponse(res: Response, data: any = {}) {
        res.send(data)
    }

    public static successResponse(res: Response, data: any = {}) {
        res.send({ success: true, error: false, result: true, ...data })
    }

    public static errorResponse(res: Response, message: string, data: any = {}) {
        res.send({ success: false, error: true, errorMessage: message, ...data })
    }

    public static notFoundResponse(res: Response) {
        return this.errorResponse(res, 'not_found')
    }

    public static accessDeniedResponse(res: Response) {
        return this.errorResponse(res, 'access_denied')
    }

    constructor(protected readonly app: Application, readonly templatesPath?: string) { }

    public jsonResponse(res: Response, data: any = {}) { return AbstractController.jsonResponse(res, data) }

    public successResponse(res: Response, data: any = {}) { return AbstractController.successResponse(res, data) }

    public errorResponse(res: Response, message: string, data: any = {}) { return AbstractController.errorResponse(res, message, data) }

    public notFoundResponse(res: Response) { return AbstractController.notFoundResponse(res) }

    public accessDeniedResponse(res: Response) { return AbstractController.accessDeniedResponse(res) }

    protected onQuery(url: string, callback: (data: IQueryData) => Promise<any>) {
        this.app.http.post(url, async (req, res) => {
            try {
                const result = await callback.call(this, { params: req.body, req, res })
                return this.successResponse(res, { result })
            } catch (err) {
                if (err instanceof AccessDeniedException) {
                    return this.accessDeniedResponse(res)
                } else if (err instanceof NotFoundException) {
                    return this.notFoundResponse(res)
                }
                return this.errorResponse(res, err.message)
            }
        })
    }


}
