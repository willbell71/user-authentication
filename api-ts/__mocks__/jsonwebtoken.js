const sign = jest.fn().mockImplementation((payload, secret, cb) => cb((payload && secret) ? null : 'Error', 'token'));
const verify = jest.fn().mockImplementation((token, secret, cb) => cb((token && secret) ? null : 'Error', 'payload'));

module.exports = {
  sign,
  verify
};
