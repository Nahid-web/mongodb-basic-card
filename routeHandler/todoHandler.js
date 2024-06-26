const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

//get all the todos
router.get("/", async (req, res) => {});

//get a todo by id
router.get("/:id", async (req, res) => {});

//post a todo
router.post("/", async (req, res) => {});
//post multiple todo
router.get("/all", async (req, res) => {});
//put todo
router.put("/:id", async (req, res) => {});

//delete todo
router.put("/:id", async (req, res) => {});

module.exports = router;
