class CustomError extends Error {
  constructor(name: string, message?: string) {
    super(message);
    this.name = name;
    // restore prototype chain
    const actualProto = new.target.prototype;
    Object.setPrototypeOf(this, actualProto);
  }
}

export class MissingImplementationError extends CustomError {
  constructor(message?: string) {
    super('MissingImplementationError', message);
  }
}

export class AuthorizationError extends CustomError {
  constructor(message?: string) {
    super('AuthorizationError', message);
  }
}

export class ResourceNotFoundError extends CustomError {
  constructor(message?: string) {
    super('ResourceNotFoundError', message);
  }
}

export class InvalidDataError extends CustomError {
  constructor(message?: string) {
    super('InvalidDataError', message);
  }
}
