import {baseLogger} from './logging';

export abstract class BaseService {

    protected readonly logger = baseLogger.child({location: this.constructor.name});

    public async initialize() {
    }

}