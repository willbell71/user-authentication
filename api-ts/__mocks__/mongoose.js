const connect = jest.fn().mockImplementation((connection, options) => {
  return new Promise((resolve, reject) => {
    if (connection) {
      resolve('');
    } else {
      reject('');
    }
  });
});

function TestModel() {}
TestModel.findById = function() {
  return new Promise((resolve, reject) => {
    resolve('findById');
  });
};
TestModel.findOne = function() {
  return new Promise((resolve, reject) => {
    resolve('findOne');
  });
};
const model = jest.fn().mockImplementation((name) => name.length > 1 ? TestModel : undefined);
const Schema = jest.fn().mockImplementation(() => {});
const Model = jest.fn().mockImplementation(() => {});

module.exports = {
  connect,
  model,
  Schema,
  Model
};
