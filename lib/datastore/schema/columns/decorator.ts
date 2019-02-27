import {columnService} from './service';
import {ColumnConfig} from './data';

export function Column(config?: ColumnConfig) {
    return (target: any, property: string) => {
        columnService.addColumn(target.constructor, property, config || {});
    };
}