import {Pool} from 'pg';
import {BaseData} from './data';
import {Entity} from './entity';
import {EntityRepository} from './repository';

export class Database {

    public readonly pool: Pool;

    constructor() {
        this.pool = new Pool({
            user: 'node',
            password: 'node',
            host: 'localhost',
            port: 5432,
            database: 'gwynder_notes'
        });
    }

    public async initialize() {
        await this.pool.connect();
    }

    public createRepository<SelectedEntity extends Entity, SelectedData extends BaseData, Repository extends EntityRepository<SelectedEntity, BaseData>>(
        RepositoryType: new (pool: Pool) => Repository
    ): Repository {
        return new RepositoryType(this.pool);
    }

    public async close() {
        await this.pool.end();
    }

}