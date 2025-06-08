const express = require('express');
const app = express();
const PORT = 3000;

// In-memory array of items
let items = [
  { id: 1, name: "First item" },
  { id: 2, name: "Second item" }
];

// Middleware to parse JSON
app.use(express.json());

// Serve static files from 'public'
app.use(express.static('public'));

// GET - fetch all items
app.get('/api/items', (req, res) => {
  console.log("GET /api/items called");
  res.json(items);
});

// POST - add a new item
app.post('/api/items', (req, res) => {
  const { name } = req.body;

  if (!name) {
    console.error("POST error: 'name' is required");
    return res.status(400).json({ error: "'name' field is required" });
  }

  const newItem = {
    id: items.length + 1,
    name
  };

  items.push(newItem);
  console.log("POST /api/items:", newItem);
  res.status(201).json(newItem);
});

// PUT - update item by ID
app.put('/api/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const { name } = req.body;

  const item = items.find(i => i.id === itemId);

  if (!item) {
    console.error(`PUT error: item with id ${itemId} not found`);
    return res.status(404).json({ error: 'Item not found' });
  }

  if (!name) {
    console.error("PUT error: 'name' is required");
    return res.status(400).json({ error: "'name' field is required" });
  }

  item.name = name;
  console.log(`PUT /api/items/${itemId}:`, item);
  res.json(item);
});

// DELETE - remove item by ID
app.delete('/api/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const index = items.findIndex(i => i.id === itemId);

  if (index === -1) {
    console.error(`DELETE error: item with id ${itemId} not found`);
    return res.status(404).json({ error: 'Item not found' });
  }

  const deletedItem = items.splice(index, 1)[0];
  console.log(`DELETE /api/items/${itemId}:`, deletedItem);
  res.json(deletedItem);
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
