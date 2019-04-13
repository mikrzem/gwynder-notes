import * as fs from 'fs';
import fetch, {RequestInit} from 'node-fetch';
import * as util from 'util';
import {BaseService} from '../base/service';

export class RegistrationService extends BaseService {

    private get registerUrl(): string {
        return process.env['notes_register_url'];
    }

    private get selfUrl(): string {
        return process.env['notes_self_url'];
    }

    private get apiConfiguration(): ApiConfiguration {
        return {
            name: 'notes',
            path: this.selfUrl + '/api/notes',
            application: {
                active: true,
                path: this.selfUrl + '/application/notes',
                displayName: 'Notes',
                startPath: 'page/'
            },
            dashboard: {
                active: true
            },
            health: {
                active: true
            }
        };
    }

    public async initialize() {
        if (this.shouldRegister()) {
            this.logger.info('ENABLED Registering service with central');
            await this.registerWithRetry();
        } else {
            this.logger.info('DISABLED Registering service with central');
        }
    }

    private async registerWithRetry() {
        let attemptsLeft = 10;
        let success = await this.tryRegister();
        while (!success && attemptsLeft) {
            this.logger.info('Failed to register service. Attempts left: ' + attemptsLeft);
            attemptsLeft--;
            await this.sleep();
            success = await this.tryRegister();
        }
        if (!success) {
            throw new Error('Failed to register service');
        }
    }

    private sleep(): Promise<any> {
        return new Promise<any>((resolve => {
            setTimeout(resolve, 1000 * 60);
        }));
    }

    private async tryRegister(): Promise<boolean> {
        try {
            await this.registerApi();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    private shouldRegister() {
        return process.env['notes_register'] === 'true';
    }

    private async token(): Promise<string> {
        const token = await (util.promisify(fs.readFile))(process.env['notes_token_file'], 'utf8');
        if (!token) {
            throw new Error('Missing token during registration');
        }
        return token.toString();
    }

    private async fetchOptions(body: any): Promise<RequestInit> {
        return {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'InternalToken': await this.token(),
                'Content-Type': 'application/json'
            }
        };
    }

    private async registerApi() {
        this.logger.info('Registering API at central');
        await fetch(
            this.registerUrl + '/proxy/api/notes',
            await this.fetchOptions(this.apiConfiguration)
        );
    }

}

interface ApiConfiguration {
    name: string;
    path: string;
    application: {
        active: boolean;
        path: string;
        displayName: string;
        startPath: string;
    },
    dashboard: {
        active: boolean;
        path?: string;
    },
    health: {
        active: boolean;
        path?: string;
    }
}