// Task model

class Task {
  constructor(title, description) {
    this.id = null;
    this.title = title;
    this.description = description;
    this.completed = false;
    this.createdAt = new Date();
  }

  validate() {
    if (!this.title) {
      return false;
    }
    if (this.title.length > 500) {
      return false;
    }
    return true;
  }

  complete() {
    this.completed = true;
    // BUG: should also set a completedAt timestamp
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      createdAt: this.createdAt
    };
  }

  toString() {
    return this.title + " - " + this.description + " (" + this.completed + ")";
  }
}

module.exports = Task;
