import {ColumnData} from './columns/data';

export class Schema {

    private readonly columnsData: {[name: string]: ColumnData} = {};

    get columns(): ColumnData[] {
        return Object.values(this.columnsData);
    }

    public setColumn(property: string, data: ColumnData) {
        this.columnsData[property] = data;
    }

    public hasColumn(property: string): boolean {
        return property in this.columnsData;
    }

}