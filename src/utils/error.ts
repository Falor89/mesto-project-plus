export const WRONG_DATA_ERROR_STATUS = 400;
export const AUTH_ERROR_STATUS = 401;
export const NOT_FOUND_ERROR_STATUS = 404;
export const ALREADY_ERROR_STATUS = 409;
export const SERVER_ERROR_STATUS = 500;
export const FORBIDDEN_ERROR_STATUS = 403;

export class WrongDataError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.status = WRONG_DATA_ERROR_STATUS;
  }
}

export class AuthError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.status = AUTH_ERROR_STATUS;
  }
}

export class NotFoundError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.status = NOT_FOUND_ERROR_STATUS;
  }
}

export class ForbiddenError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.status = FORBIDDEN_ERROR_STATUS;
  }
}
