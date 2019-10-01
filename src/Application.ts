import Express from 'express'
import { AbstractConsoleCommand } from './Base/Console/AbstractConsoleCommand'
import { DbService } from './Database/Service/DbService'
import { HelpCommand } from './Base/Console/HelpCommand'
import { LoggerService } from './Logger/Service/LoggerService'
import { HealthService } from './Health/Service/HealthService'
import { HealthController } from './Health/Controller/HealthController'
import { FileService } from './File/Service/FileService'
import { CreateMigrationCommand } from './Database/Console/CreateMigrationCommand'
import { MigrateCommand } from './Database/Console/MigrateCommand'
import { MigrateUndoCommand } from './Database/Console/MigrateUndoCommand'
import { UploadController } from './File/Controller/UploadController'

export class Application {
    public http!: Express.Express

    // Services
    public loggerService!: LoggerService
    public dbService!: DbService
    public healthService!: HealthService
    public fileService!: FileService

    // Commands
    public helpCommand!: HelpCommand
    public createMigrationCommand!: CreateMigrationCommand
    public migrateCommand!: MigrateCommand
    public migrateUndoCommand!: MigrateUndoCommand

    // Controllers
    public healthController!: HealthController
    public uploadController!: UploadController

    constructor(public readonly config: IConfig) { }

    public async run() {
        this.initializeServices()
        if (process.argv[2]) {
            this.initializeCommands()
            for (const command of Object.values(this)
                .filter((c: any) => c instanceof AbstractConsoleCommand) as AbstractConsoleCommand[]
            ) {
                if (command.name === process.argv[2]) {
                    await command.execute()
                    process.exit()
                }
            }
            await this.helpCommand.execute()
            process.exit()
        } else {
            this.runWebServer()
        }
    }

    protected runWebServer() {
        this.http = Express()
        this.http.use('/public', Express.static('public'))
        this.http.use(Express.urlencoded())
        this.http.use(Express.json())
        this.http.listen(this.config.listen, () => console.log(`Listening on port ${this.config.listen}`))

        this.initializeControllers()
    }

    protected initializeServices() {
        this.loggerService = new LoggerService(this)
        this.dbService = new DbService(this)
        this.healthService = new HealthService(this)
        this.fileService = new FileService(this)
    }

    protected initializeCommands() {
        this.helpCommand = new HelpCommand(this)
        this.createMigrationCommand = new CreateMigrationCommand(this)
        this.migrateCommand = new MigrateCommand(this)
        this.migrateUndoCommand = new MigrateUndoCommand(this)
    }

    protected initializeControllers() {
        this.healthController = new HealthController(this)
        this.uploadController = new UploadController(this)
    }

}
