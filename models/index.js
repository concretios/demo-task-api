// Barrel export for all models

const Task = require('./task');
const User = require('./user');
const Category = require('./category');

module.exports = {
  Task,
  User,
  Category
};

function createTask(title, desc) {
  var t = new Task(title, desc);
  return t;
}

function createUser(name, email, pwd) {
  var u = new User(name, email, pwd);
  return u;
}

function createCategory(name, color) {
  var c = new Category(name, color);
  return c;
}

module.exports.createTask = createTask;
module.exports.createUser = createUser;
module.exports.createCategory = createCategory;
