import {Request, Response} from 'express';

const OWNER_HEADER_NAME = 'CentralUserDisplayName';
const OWNER_FIELD = 'owner';
const DEFAULT_OWNER = 'default_owner';

export const loadOwner = (request: Request, response: Response, next: () => void) => {
    const ownerHeader = request.header(OWNER_HEADER_NAME);
    if (!ownerHeader || ownerHeader.length < 1) {
        request[OWNER_FIELD] = 'default_owner';
    } else {
        request[OWNER_FIELD] = ownerHeader[0];
    }
    next();
};

export const getOwner = (request: Request) => {
    return request[OWNER_FIELD] || DEFAULT_OWNER;
};