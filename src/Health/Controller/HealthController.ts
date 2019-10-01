import { Application } from '../../Application'
import { AbstractApiController, IApiQueryData } from '../../Base/Controller/AbstractApiController'

export class HealthController extends AbstractApiController {

    constructor(app: Application) {
        super(app)

        this.onApiQuery('/api/health-status', this.healthStatus)
    }

    public async healthStatus(data: IApiQueryData) {
        return this.app.healthService.getHealthInfo()
    }

}
