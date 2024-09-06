import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'todo' });
  const [editingTaskId, setEditingTaskId] = useState(null); 

  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')  
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Error fetching tasks:', error));
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;               
    setNewTask({ ...newTask, [name]: value });
  };

  const addTask = () => {
    fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask), 
    })
      .then((response) => response.json())
      .then(() => {
        setTasks([...tasks, newTask]);
        resetNewTask();
      })
      .catch((error) => console.error('Error adding task:', error));
  };

  const resetNewTask = () => {
    setNewTask({ title: '', description: '', status: 'todo' });
  };

  const deleteTask = (id) => {
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id));
      })
      .catch((error) => console.error('Error deleting task:', error));
  };

  const editTask = (task) => {
    setNewTask({ title: task.title, description: task.description, status: task.status });
    setEditingTaskId(task.id);
  };

  const updateTask = () => {
    fetch(`http://localhost:5000/api/tasks/${editingTaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask), 
    })
      .then((response) => response.json())
      .then(() => {
        setTasks(tasks.map((task) => (task.id === editingTaskId ? { ...task, ...newTask } : task)));
        resetNewTask();
        setEditingTaskId(null);
      })
      .catch((error) => console.error('Error updating task:', error));
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>

      <div>
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={newTask.title}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Task Description"
          value={newTask.description}
          onChange={handleInputChange}
        />
        <select name="status" value={newTask.status} onChange={handleInputChange}>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button onClick={editingTaskId ? updateTask : addTask}>
          {editingTaskId ? 'Update Task' : 'Add Task'}
        </button>
        {editingTaskId && (
          <button onClick={() => {
            resetNewTask();
            setEditingTaskId(null);
          }}>
            Cancel Edit
          </button>
        )}
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
            <button onClick={() => editTask(task)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
