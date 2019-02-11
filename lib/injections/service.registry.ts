import {RepositoryRegistry} from './repository.registry';
import {Registry} from './registry';

export class ServiceRegistry extends Registry {

    constructor(
        private readonly repositories: RepositoryRegistry
    ) {
        super();
    }

}