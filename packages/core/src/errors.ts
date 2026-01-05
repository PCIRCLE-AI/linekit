export class LineKitError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "LineKitError";
    }
}

export class SignatureValidationFailedError extends LineKitError {
    constructor(message = "Signature validation failed") {
        super(message);
        this.name = "SignatureValidationFailedError";
    }
}

export class JSONParseError extends LineKitError {
    constructor(message = "Failed to parse JSON body") {
        super(message);
        this.name = "JSONParseError";
    }
}

