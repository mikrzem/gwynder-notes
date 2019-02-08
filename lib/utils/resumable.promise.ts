export class ResumablePromise<T> extends Promise<T> {

    private onResolve: (data?: T) => void;

    private onReject: (error?: any) => void;

    constructor() {
        super((resolve, reject) => {
            this.onResolve = resolve;
            this.onReject = reject;
        });
    }

    public resolve(data?: T) {
        if (this.onResolve) {
            this.onResolve(data);
            this.clear();
        }
    }

    public reject(error?: any) {
        if (this.onReject) {
            this.onReject(error);
            this.clear();
        }
    }

    private clear() {
        this.onResolve = null;
        this.onReject = null;
    }
}