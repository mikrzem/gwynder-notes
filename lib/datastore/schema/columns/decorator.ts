import {columnService} from './service';

export function Column() {
    return (target: any, property: string) => {
        columnService.addColumn(target.constructor, property);
    };
}