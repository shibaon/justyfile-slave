interface String {
    sha512(): string
    md5(): string
}

interface IConfig {
    listen: number
    logdir: string
    db: {
        name: string
        user: string
        password: string
    }
    secret: string
}
