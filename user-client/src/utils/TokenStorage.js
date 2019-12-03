import jwt from 'jsonwebtoken';

const tokenText = 'token-hj2rbv25';
export default {
  get() {
    return localStorage.getItem(tokenText);
  },
  set(token) {
    localStorage.setItem(tokenText, token);
  },
  remove() {
    localStorage.removeItem(tokenText);
  },
  isValid() {
    return !!this.decode();
  },
  decode() {
    const token = this.get();
    if (!token) {
      return null;
    }
    const account = jwt.decode(token);

    if (Date.now() > account.exp) {
      this.remove();
      return null;
    }

    return account;
  },
};
