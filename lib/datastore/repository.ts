import {Pool, QueryResult} from 'pg';
import {DataNotFound} from '../utils/response.errors';
import {BaseData, CreateResult} from './data';
import {Entity} from './entity';
import {PageRequest, PageResponse} from './paging';
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
        this.parseContent(result, entity);
        return result;
    }

    public async count(owner: string): Promise<number> {
        let result = await this.pool.query(
            `SELECT COUNT(1) AS AMOUNT FROM ${this.entityName}  WHERE owner = $1`,
            [owner]
        );
        return parseInt(result.rows[0]['AMOUNT'] || result.rows[0]['amount'], 10);
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
        return this.parseResults(results);
    }

    public async findPage(owner: string, request: PageRequest): Promise<PageResponse<SelectedEntity>> {
        let query = `SELECT * FROM ${this.entityName} 
                WHERE owner = $1
                ORDER BY id ${request.oldestFirst ? 'ASC' : 'DESC'}
                LIMIT ${request.pageSize} OFFSET ${request.page * request.pageSize}`;
        const result = await this.pool.query(
            query,
            [owner]
        );
        const count = await this.count(owner);
        return {
            data: this.parseResults(result),
            count: count,
            page: request.page,
            pageSize: request.pageSize,
            totalPages: Math.ceil(count / request.pageSize)
        };
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
        if (result.rowCount < 1) {
            throw new DataNotFound(this.entityName + ':' + id);
        }
    }

    public async delete(id: number, owner: string): Promise<void> {
        const result = await this.pool.query(
            `DELETE FROM ${this.entityName} WHERE id = $1 AND owner = $2`,
            [id, owner]
        );
        if (result.rowCount < 1) {
            throw new DataNotFound(this.entityName + ':' + id);
        }
    }

    protected async postInitialize() { }

    protected parseResults(results: QueryResult): SelectedEntity[] {
        return results.rows.map(row => this.createEntity(row));
    }

    /**
     * Copying field according to schema
     */
    private parseContent(target: any, source: any): any {
        for (const column of this.schema.columns) {
            target[column.name] = source[column.name];
            if (!target[column.name] && column.config.default) {
                target[column.name] = JSON.parse(JSON.stringify(column.config.default));
            }
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