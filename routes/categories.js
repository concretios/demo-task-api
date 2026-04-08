var express = require('express');
var router = express.Router();

var categories = [];
var nextId = 1;

// get all categories
router.get('/', function(req, res) {
  res.json(categories);
});

// get single category
router.get('/:id', function(req, res) {
  var category = categories.find(function(c) { return c.id == req.params.id; });
  if (!category) {
    res.status(404).json({ message: 'not found' });
    return;
  }
  res.json(category);
});

// create category
router.post('/', function(req, res) {
  var category = {
    id: nextId++,
    name: req.body.name,
    description: req.body.description,
    color: req.body.color
  };
  categories.push(category);
  res.json(category);
});

// update category
router.patch('/:id', function(req, res) {
  var category = categories.find(function(c) { return c.id == req.params.id; });
  if (!category) {
    res.status(404).json({ message: 'not found' });
    return;
  }
  if (req.body.name) category.name = req.body.name;
  if (req.body.description) category.description = req.body.description;
  if (req.body.color) category.color = req.body.color;
  res.json(category);
});

// delete category
router.delete('/:id', function(req, res) {
  var index = categories.findIndex(function(c) { return c.id == req.params.id; });
  if (index === -1) {
    res.status(404).json({ message: 'not found' });
    return;
  }
  categories.splice(index, 1);
  res.json({ message: 'deleted' });
});

module.exports = router;
