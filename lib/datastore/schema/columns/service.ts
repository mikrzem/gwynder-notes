import 'reflect-metadata';
import {Schema} from '../data';
import {ColumnConfig, ColumnData} from './data';

const SCHEMA_KEY = 'gwynder:schema';

class ColumnService {

    public getSchema(entity: any): Schema {
        const schema: Schema = Reflect.getOwnMetadata(SCHEMA_KEY, entity);
        if (!schema) {
            return this.createSchema(entity);
        } else {
            return schema;
        }
    }

    public addColumn(target: any, property: string, config: ColumnConfig): ColumnData {
        const columnData = new ColumnData(property, config);
        const schema = this.getSchema(target);
        schema.setColumn(property, columnData);
        return columnData;
    }

    private createSchema(entity: any): Schema {
        const result = new Schema();
        Reflect.defineMetadata(SCHEMA_KEY, result, entity);
        return result;
    }

}

export const columnService = new ColumnService();