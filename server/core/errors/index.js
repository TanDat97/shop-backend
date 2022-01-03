export class AppError extends Error {
  constructor(message, code) {
    super();

    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'Something wrong. Please try again.';
    this.code = code || 500;
  }
}

export class MissingUUID extends Error {
  constructor(message, code) {
    super();

    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'UUID is required!';
    this.code = code || 500;
  }
}
