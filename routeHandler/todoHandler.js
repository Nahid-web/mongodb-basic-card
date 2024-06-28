const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const toDoSchema = require("../schemas/todoSchema");
const userSchema = require("../schemas/userSchema");
const checkLogin = require("../middlewares/checkLogin");
const Todo = new mongoose.model("Todo", toDoSchema);
const User = new mongoose.model("User", userSchema);

//get all the todos
router.get("/", checkLogin, async (req, res) => {
  console.log(req.username);
  console.log(req.userId);
  try {
    const todo = await Todo.find({})
      .populate("user", "name username -_id")
      .select({
        _id: 0,
        __v: 0,
        date: 0,
      });
    if (todo) {
      res.status(200).json({
        result: todo,
        message: "Successfully retrieved the todo!",
      });
    } else {
      res.status(404).json({
        error: "Todo not found!",
      });
    }
  } catch (error) {
    console.error("Error fetching todo:", error);
    res.status(500).json({
      error: "There was a server side error!",
    });
  }
});

//get active todos
router.get("/active", async (req, res) => {
  const todo = new Todo();
  const data = await todo.findActive();
  res.status(200).json({
    data,
  });
});

//get active todos with callback
router.get("/active-callback", (req, res) => {
  const todo = new Todo();
  todo.findActiveCallback((err, data) => {
    res.status(200).json({ data });
  });
});

//get todos with js
router.get("/js", async (req, res) => {
  const data = await Todo.findByMongodb();
  if (data) {
    res.status(200).json({ data });
  }
});

//get todo by language
router.get("/language", async (req, res) => {
  const data = await Todo.find().byLanguage("js");
  res.status(200).json({ data });
});

//get a todo by id
router.get("/:id", async (req, res) => {
  try {
    const todo = await Todo.find({ _id: req.params.id });
    if (todo) {
      res.status(200).json({
        result: todo,
        message: "Successfully retrieved the todo!",
      });
    } else {
      res.status(404).json({
        error: "Todo not found!",
      });
    }
  } catch (error) {
    console.error("Error fetching todo:", error);
    res.status(500).json({
      error: "There was a server side error!",
    });
  }
});

//post a todo
router.post("/", checkLogin, async (req, res) => {
  const newTodo = new Todo({
    ...req.body,
    user: req.userId,
  });

  try {
    const todo = await newTodo.save();
    await User.updateOne(
      {
        _id: req.userId,
      },
      {
        $push: {
          todos: todo._id,
        },
      }
    );
    res.status(200).json({
      message: "Todo was inserted successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "There was a server side error!",
    });
  }
});
//post multiple todo
router.post("/all", async (req, res) => {
  await Todo.insertMany(req.body, (err) => {
    if (err) {
      res.status(500).json({
        error: "There was a server side error!",
      });
    } else {
      res.status(200).json({
        error: "Todos were inserted successfully!",
      });
    }
  });
});
//put todo
router.put("/:id", async (req, res) => {
  try {
    // Execute findByIdAndUpdate query once
    const result = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: { status: "active" } },
      { new: true }
    );

    console.log(result);

    if (result) {
      res.status(200).json({ message: "Todo was updated successfully!" });
    } else {
      res.status(404).json({ error: "Todo not found!" });
    }
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "There was a server side error!" });
  }
});

// delete todo by id
router.delete("/:id", async (req, res) => {
  try {
    const todo = await Todo.deleteOne({ _id: req.params.id });
    if (todo) {
      res.status(200).json({ message: "Todo was deleted successfully!" });
    } else {
      res.status(404).json({ error: "Todo not found!" });
    }
  } catch (error) {
    console.error("Error updating todo", error);
    res.status(500).json({ error: "There was a server side error" });
  }
});

module.exports = router;
