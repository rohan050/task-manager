require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors=require("cors");

const app=express();
const PORT=process.env.PORT||5143;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

const taskSchema=new mongoose.Schema({
    title: {
        type: String,
        required: true
      },
      description: String,
      status: {
        type: String,
        enum: ["pending", "in-progress", "completed"],
        default: "pending"
      },
      dueDate: Date,
      createdAt: {
        type: Date,
        default: Date.now,
      }
});
const Task=mongoose.model("Task",taskSchema);
app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await Task.find();
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

app.get("/api/tasks/:id",async (req,res)=>{
    try{
        const task=await Task.findById(req.params.id);
        if(!task) return res.status(404).json({ message:"Task not found"})
            res.json(task);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Create a new task
  app.post("/api/tasks", async (req, res) => {
    try {
      const newTask = new Task(req.body);
      const savedTask = await newTask.save();
      res.status(201).json(savedTask);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // Update a task
  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedTask) return res.status(404).json({ message: "Task not found" });
      res.json(updatedTask);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // Delete a task
  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const deletedTask = await Task.findByIdAndDelete(req.params.id);
      if (!deletedTask) return res.status(404).json({ message: "Task not found" });
      res.json({ message: "Task deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Server start
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  
