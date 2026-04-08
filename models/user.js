// User model

class User {
  constructor(name, email, password) {
    this.id = null;
    this.name = name;
    this.email = email;
    this.password = password; // storing plain text password
    this.tasks = [];
    this.createdAt = new Date();
  }

  validate() {
    if (!this.name || !this.email) {
      return false;
    }
    return true;
  }

  addTask(task) {
    this.tasks.push(task);
  }

  getTasks() {
    return this.tasks;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      tasks: this.tasks,
      createdAt: this.createdAt
    };
  }
}

module.exports = User;
