const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Enable CORS and JSON body parsing
app.use(cors());
app.use(bodyParser.json());

// MySQL Database Connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

const db = mysql.createConnection(dbConfig);

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
  console.log('MySQL connected...');
});

// API Endpoints
// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const sql = 'SELECT * FROM tasks';
    const result = await db.promise().query(sql);
    res.json(result[0]);
  } catch (err) {
    console.error('Error getting tasks:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add a new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const sql = 'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)';
    const result = await db.promise().query(sql, [title, description, status]);
    res.status(200).json({ message: 'Task added' });
  } catch (err) {
    console.error('Error adding task:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update a task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const id = req.params.id;
    const sql = 'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?';
    const result = await db.promise().query(sql, [title, description, status, id]);
    res.status(200).json({ message: 'Task updated' });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const sql = 'DELETE FROM tasks WHERE id = ?';
    const result = await db.promise().query(sql, [id]);
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
