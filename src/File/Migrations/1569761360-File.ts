import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export default class File1569761359995 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'file',
            columns: [
                { name: 'id', type: 'integer', isGenerated: true, isPrimary: true },
                { name: 'name', type: 'varchar', length: '255' },
                { name: 'type', type: 'varchar', length: '255' },
                { name: 'size', type: 'bigint' },
                { name: 'uri', type: 'varchar', length: '255', isNullable: true },
                { name: 'timestamp', type: 'bigint' },
                { name: 'upload_token', type: 'varchar', length: '128', isNullable: true },
                { name: 'remove_mark', type: 'boolean', default: false },
            ],
            indices: [
                { name: 'idx_file_timestamp', columnNames: ['timestamp'] },
                { name: 'idx_file_upload_token', columnNames: ['upload_token'] },
                { name: 'idx_file_remove_mark', columnNames: ['remove_mark'] },
            ],
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('file')
    }

}
