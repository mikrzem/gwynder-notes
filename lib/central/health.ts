import * as moment from 'moment';
import {RouterBuilder} from '../base/router';

interface HealthInfo {

    healthy: boolean;
    startupTime: string;

}

export class HealthRouter extends RouterBuilder {

    private readonly startupTime: string = moment().format();

    constructor() { super(); }

    get rootPath() {
        return '/api/notes/central/health';
    }

    protected initializeRoutes() {
        this.get(
            '/',
            params => {
                return Promise.resolve(this.createHealth())
            }
        )
    }

    private createHealth(): HealthInfo {
        return {
            healthy: true,
            startupTime: this.startupTime
        };
    }

}