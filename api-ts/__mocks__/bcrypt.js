const genSalt = jest.fn().mockImplementation((saltRounds, cb) => cb(saltRounds ? null : 'gensalt error', 'salt'));
const hash = jest.fn().mockImplementation((password, salt, cb) => cb(password ? null : 'hash error', 'hash'));
const compare = jest.fn().mockImplementation((password, hash, cb) => cb(password ? null : 'compare error', password === hash));

module.exports = {
  genSalt,
  hash,
  compare
};
