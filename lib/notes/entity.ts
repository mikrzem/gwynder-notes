import {Entity} from '../datastore/entity';
import {Column} from '../datastore/schema/columns/decorator';

export class Note extends Entity {

    @Column()
    public title: string;

}