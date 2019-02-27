export class ColumnData {

    constructor(
        public readonly name: string,
        public readonly config: ColumnConfig
    ) { }

}

export interface ColumnConfig {

    default?: any;

}