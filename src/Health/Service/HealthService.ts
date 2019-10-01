import { AbstractService } from '../../Base/Service/AbstractService'
import childprocess from 'child_process'

export class HealthService extends AbstractService {

    public getHealthInfo(): Promise<{ total: number, free: number }> {
        return new Promise((resolve, reject) => {
            childprocess.exec('df --block-size=1 --output=source,size,avail .', (err, stdout) => {
                if (err) {
                    return reject(err)
                }
                const parts = stdout.split('\n')[1].replace(/ +/, ' ').split(' ').map(r => r.trim())
                resolve({ total: Number(parts[1]), free: Number(parts[2]) })
            })
        })
    }

}
