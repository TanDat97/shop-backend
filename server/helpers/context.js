import httpContext from 'express-http-context';

export class Context {
  constructor() {
    this._currentUserContextName = 'currentUser';
  }

  get currentUser() {
    return httpContext.get(this._currentUserContextName);
  }

  set currentUser(user) {
    return httpContext.set(this._currentUserContextName, user);
  }
}
