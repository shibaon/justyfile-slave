import { AbstractController, IQueryData, AccessDeniedException } from './AbstractController'

export interface IApiQueryData extends IQueryData {

}

export abstract class AbstractApiController extends AbstractController {

    public onApiQuery(url: string, callback: (data: IApiQueryData) => Promise<any>) {
        this.onQuery(url, async data => {
            const now = Date.now() / 1000
            const timestamp: number = data.params.timestamp
            const hash = data.params.hash
            if (!hash || !timestamp || timestamp < now - 60 || timestamp > now + 60) {
                throw new AccessDeniedException()
            }
            const params: string = data.params.parameters
            if (`${timestamp}.${params}.${this.app.config.secret}`.sha512() !== hash) {
                throw new AccessDeniedException()
            }
            
            return callback.call(this, { ...data, params: JSON.parse(params) })
        })
    }

}
