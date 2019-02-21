import * as fs from 'fs';
import fetch, {RequestInit} from 'node-fetch';
import * as util from 'util';
import {BaseService} from '../base/service';

export class RegistrationService extends BaseService {

    private get registerUrl(): string {
        return process.env['notes.register.url'];
    }

    private get selfUrl(): string {
        return process.env['notes.self.url'];
    }

    private get applicationConfiguration() {
        return {
            name: 'notes',
            path: this.selfUrl + '/application/notes',
            displayName: 'Notes',
            startPath: 'page/'
        }
    }

    private get apiConfiguration() {
        return {
            name: 'notes',
            path: this.selfUrl + '/api/notes'
        };
    }

    public async initialize() {
        if (this.shouldRegister()) {
            this.logger.info('ENABLED Registering service with central');
            await this.registerApi();
            await this.registerApplication();
        } else {
            this.logger.info('DISABLED Registering service with central');
        }
    }

    private shouldRegister() {
        return process.env['notes.register'] === 'true';
    }

    private async token(): Promise<string> {
        const token = await (util.promisify(fs.readFile))(process.env['notes.token.file'], 'utf8');
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
        }
    }

    private async registerApplication() {
        this.logger.info('Registering application at central');
        await fetch(
            this.registerUrl + '/proxy/application/notes',
            await this.fetchOptions(this.applicationConfiguration)
        )
    }

    private async registerApi() {
        this.logger.info('Registering API at central');
        await fetch(
            this.registerUrl + '/proxy/api/notes',
            await this.fetchOptions(this.apiConfiguration)
        )
    }

}