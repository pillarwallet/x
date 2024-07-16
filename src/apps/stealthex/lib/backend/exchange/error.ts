export class SignatureError extends Error {
    constructor() {
        super('failed to verify signature');
    }
}

export function isSignatureError(error: unknown) {
    return error instanceof SignatureError;
}
