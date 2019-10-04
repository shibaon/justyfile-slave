import { AbstractEntity } from '../../Database/Entity/AbstractEntity'
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'download_token' })
export class DownloadToken extends AbstractEntity {
    @PrimaryColumn('varchar')
    public id!: string

    @Column('integer', { name: 'file_id' })
    public fileId!: number

    @Column('bigint', { transformer: {
        from: (value: string) => Number(value),
        to: (value: number) => value,
    } })
    public timestamp!: number

}
