const crypto = require('crypto');

module.exports = () => ({
  _token: null,
  _timer: null,
  _resetTimeout: null,
  makeToken(size = 16) {
    this._token = crypto.randomBytes(size).toString('hex');
    return this._token;
  },
  getToken() {
    return this._token;
  },
  resetToken() {
    this._token = undefined;
    if (this._timer) {
      clearTimeout(this._timer);
    }
  },
  setResetTimeout(t) {
    this._resetTimeout = t;
    this._timer = setTimeout(() => {
      this.resetToken();
    }, t);
  }
});
