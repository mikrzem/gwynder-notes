import {Pool} from 'pg';
import {DataNotFound} from '../utils/response.errors';
import {BaseData, CreateResult} from './data';
import {Entity} from './entity';
import {columnService} from './schema/columns/service';
import {Schema} from './schema/data';

const EXISTS_QUERY = 'SELECT to_regclass($1)';
const CREATE_QUERY = 'CREATE TABLE {0} (id serial PRIMARY KEY, owner VARCHAR(200) NOT NULL, content jsonb NOT NULL)';

export abstract class EntityRepository<SelectedEntity extends Entity, SelectedData extends BaseData> {

    protected constructor(
        protected readonly pool: Pool,
        protected readonly EntityType: new () => SelectedEntity
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
        await this.postInitialize();
    }

    public loadContent(entity: SelectedEntity, data: SelectedData) {
        this.parseContent(entity, data);
    }

    public createContent(entity: SelectedEntity): SelectedData {
        const result: any = {id: entity.id};
        for (const column of this.schema.columns) {
            result[column.name] = entity[column.name];
        }
        return result;
    }

    public async count(owner: string): Promise<number> {
        let result = await this.pool.query(
            `SELECT COUNT(1) AS AMOUNT FROM ${this.entityName}  WHERE owner = $2`,
            [owner]
        );
        return result.rows[0]['AMOUNT'];
    }

    public async find(id: number, owner: string): Promise<SelectedEntity> {
        const results = await this.pool.query(
            `SELECT * FROM ${this.entityName} WHERE id = $1 AND owner = $2`,
            [id, owner]
        );
        if (results.rows.length < 1) {
            throw new DataNotFound(this.entityName + ':' + id);
        }
        return this.createEntity(results.rows[0]);
    }

    public async findAll(owner: string): Promise<SelectedEntity[]> {
        const results = await this.pool.query(
            `SELECT * FROM ${this.entityName}  WHERE owner = $1`,
            [owner]
        );
        return results.rows.map(row => this.createEntity(row));
    }

    public async create(content: SelectedData, owner: string): Promise<CreateResult> {
        const result = await this.pool.query(
            `INSERT INTO ${this.entityName} (owner, content) VALUES($1, $2) RETURNING id`,
            [
                owner,
                JSON.stringify(
                    this.parseContent({}, content)
                )
            ]
        );
        return {id: result.rows[0]['id']};
    }

    public async update(content: SelectedData, id: number, owner: string): Promise<void> {
        const result = await this.pool.query(
            `UPDATE ${this.entityName} SET content = $1 WHERE id = $2 AND owner = $3 RETURNING id`,
            [content, id, owner]
        );
        if (result.rows.length < 1) {
            throw new DataNotFound(this.entityName + ':' + id);
        }
    }

    public async delete(id: number, owner: string): Promise<void> {
        const result = await this.pool.query(
            `DELETE FROM ${this.entityName} WHERE id = $1 AND owner = $2`,
            [id, owner]
        );
        if (result.rows.length < 1) {
            throw new DataNotFound(this.entityName + ':' + id);
        }
    }

    protected async postInitialize() { }

    /**
     * Copying field according to schema
     */
    private parseContent(target: any, source: any): any {
        for (const column of this.schema.columns) {
            target[column.name] = source[column.name];
        }
        return target;
    }

    private createEntity(row: any): SelectedEntity {
        const entity = new this.EntityType();
        entity.id = row['id'];
        entity.owner = row['owner'];
        this.loadContent(entity, row['content']);
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