// Category model

class Category {
  constructor(name, color) {
    this.id = null;
    this.name = name;
    this.color = color;
    this.tasks = [];
  }

  validate() {
    if (this.name == null) {
      return false;
    }
    return true;
  }

  addTask(task) {
    this.tasks.push(task);
  }

  removeTask(taskId) {
    this.tasks = this.tasks.filter(t => t.id != taskId);
  }

  getTaskCount() {
    return this.tasks.length;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      taskCount: this.getTaskCount()
    };
  }
}

module.exports = Category;
