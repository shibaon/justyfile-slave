import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export default class DownloadToken1570207746159 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'download_token',
            columns: [
                { name: 'id', type: 'varchar', length: '128', isPrimary: true },
                { name: 'file_id', type: 'integer' },
                { name: 'timestamp', type: 'bigint' },
            ],
            indices: [
                { name: 'idx_download_token_timestamp', columnNames: ['timestamp'] },
            ],
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('download_token')
    }

}
