import { AbstractApiController, IApiQueryData } from '../../Base/Controller/AbstractApiController'
import { Application } from '../../Application';

export class RemoveController extends AbstractApiController {

    public constructor(app: Application) {
        super(app)
        this.onApiQuery('/api/mark-for-remove', this.markForRemove)
    }

    public async markForRemove(data: IApiQueryData) {
        const file = await this.app.fileService.getById(data.params.fileId)
        if (!file) {
            return 'NOT_FOUND'
        }
        file.removeMark = true
        await this.app.fileService.fileRepository.save(file)
        return 'OK'
    }

}
