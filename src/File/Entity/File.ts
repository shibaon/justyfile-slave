import { AbstractEntity } from '../../Database/Entity/AbstractEntity'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: 'file' })
export class File extends AbstractEntity {
    @PrimaryGeneratedColumn()
    public id!: number

    @Column('varchar')
    public name!: string

    @Column('varchar')
    public type!: string

    @Column('bigint', { transformer: {
        from: (value: string) => Number(value),
        to: (value: string|number) => value, 
    } })
    public size!: number

    @Column('varchar')
    public uri?: string

    @Column('bigint', { transformer: {
        from: (value: string) => Number(value),
        to: (value: string|number) => value,
    } })
    public timestamp!: number

    @Column('varchar', { name: 'upload_token' })
    public uploadToken?: string|null

    @Column('boolean', { name: 'remove_mark' })
    public removeMark: boolean = false
    
}
