import { Application } from './Application'
import crypto from 'crypto'

String.prototype.sha512 = function(this: string) { return crypto.createHash('sha512').update(this).digest('hex').toLowerCase() }
String.prototype.md5 = function(this: string) { return crypto.createHash('md5').update(this).digest('hex').toLowerCase() }

export = (config: IConfig) => {
    const app = new Application(config)
    app.run()
}
