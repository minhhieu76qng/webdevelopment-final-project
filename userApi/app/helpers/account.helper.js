module.exports = {
  isEmail: function(email) {
    return /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/.test(
      email
    );
  }
};
