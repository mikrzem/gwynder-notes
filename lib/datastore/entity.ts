import {BaseData} from './data';

export abstract class Entity implements BaseData {

    public id: number;

    public owner: string;

}