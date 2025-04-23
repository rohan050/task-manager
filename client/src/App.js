import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5143/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", status: "pending", dueDate: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchTasks = async () => {
    const res = await axios.get(API);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`${API}/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post(API, form);
    }
    setForm({ title: "", description: "", status: "pending", dueDate: "" });
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchTasks();
  };

  const handleEdit = (task) => {
    setForm(task);
    setEditingId(task._id);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem", textAlign: "center" }}> Task Manager</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "1rem",
          borderRadius: "0.5rem",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          maxWidth: "500px",
          margin: "0 auto 2rem",
        }}
      >
        <input
          style={inputStyle}
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <input
          style={inputStyle}
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <select style={inputStyle} name="status" value={form.status} onChange={handleChange}>
          <option value="pending">Pending</option>
          <option value="in-progress">In-progress</option>
          <option value="completed">Completed</option>
        </select>
        <input
          style={inputStyle}
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "0.375rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          {editingId ? "Update Task" : "Add Task"}
        </button>
      </form>

      <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gap: "1rem" }}>
        {tasks.map((task) => (
          <div
            key={task._id}
            style={{
              background: "#fff",padding: "1rem",borderRadius: "0.5rem",boxShadow: "0 2px 4px rgba(0,0,0,0.1)", display: "flex",justifyContent: "space-between",alignItems: "center",
            }}
          >
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>{task.title}</h2>
              <p style={{ color: "#4b5563", fontSize: "0.875rem" }}>{task.description}</p>
              <p style={{ color: "#92400e", fontSize: "0.875rem" }}>Status: {task.status}</p>
              <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                Created: {new Date(task.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button style={{ color: "#2563eb", border: "none", background: "transparent", cursor: "pointer" }} onClick={() => handleEdit(task)}>Edit</button>
              <button style={{ color: "#dc2626", border: "none", background: "transparent", cursor: "pointer" }} onClick={() => handleDelete(task._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block", width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.375rem", marginBottom: "0.75rem",
};

export default App;
