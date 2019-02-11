import {Router} from 'express';

export abstract class RouterBuilder {

    private readonly _router: Router = Router();

    protected constructor() {
        this.initializeRoutes(this._router);
    }

    protected abstract initializeRoutes(router: Router);

    get router() {
        return this._router;
    }

}