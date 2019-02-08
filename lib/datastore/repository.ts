import {Pool} from 'pg';
import {Entity} from './entity';
import {columnService} from './schema/columns/service';
import {Schema} from './schema/data';

const EXISTS_QUERY = 'SELECT to_regclass($1)';
const CREATE_QUERY = 'CREATE TABLE {0} (id serial PRIMARY KEY, owner VARCHAR(200) NOT NULL, content jsonb NOT NULL)';

export abstract class EntityRepository<Data extends Entity> {

    protected constructor(
        protected readonly pool: Pool,
        protected readonly EntityType: new () => Data
    ) { }

    get entityName() {
        return this.EntityType.name;
    }

    private _schema: Schema;

    get schema() {
        if (!this._schema) {
            this._schema = columnService.getSchema(this.EntityType);
        }
        return this._schema;
    }

    public async initialize() {
        if (!(await this.tableExists())) {
            await this.createTable();
        }
    }

    public loadContent(entity: Data, data: any) {
        for (const column of this.schema.columns) {
            entity[column.name] = data[column.name];
        }
    }

    public createContent(entity: Data): any {
        const result: any = {};
        for (const column of this.schema.columns) {
            result[column.name] = entity[column.name];
        }
        return result;
    }

    private createEntity(row: any): Data {
        const entity = new this.EntityType();
        entity.id = row['id'];
        entity.owner = row['owner'];
        this.loadContent(entity, row);
        return entity;
    }

    private async tableExists(): Promise<boolean> {
        const results = await this.pool.query(EXISTS_QUERY, ['public.' + this.entityName]);
        return !!results.rows[0]['to_regclass'];
    }

    private async createTable() {
        await this.pool.query(CREATE_QUERY.replace('{0}', this.entityName));
    }

}