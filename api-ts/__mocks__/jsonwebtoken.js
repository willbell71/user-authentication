const sign = jest.fn().mockImplementation((payload, secret, cb) => cb(payload ? null : 'Error', 'token'));
const verify = jest.fn().mockImplementation((token, secret, cb) => cb(token ? null : 'Error', 'payload'));

module.exports = {
  sign,
  verify
};
