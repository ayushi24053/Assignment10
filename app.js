const express = require("express");
const app = express();
const PORT = 8880;
app.use(express.json());
const Student = require("./models/student");
const mongoose = require("mongoose");

app.post("/students", async (req, res) => {
  try {
    const { name, age, grade, courses} = req.body;
    const nStudent = new Student({ name, age, grade,courses });
    const sStudent = await nStudent.save();
    res.status(201).json({ data: sStudent });
  } catch (error) {
    console.log(error);
  }
});

app.get("/students", async (req, res) => {
  try {
    let studentData = await Student.find();
    res.status(200).json({ data: studentData });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.status(200).json({ data: student });
  } catch (error) {
    console.log(error);
  }
});

app.put("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, grade } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, age, grade },
      { new: true, runValidators: true } 
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({ data: updatedStudent });
  } catch (error) {
    console.log(error);
  }
});

app.patch("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body; 

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({ data: updatedStudent });
  } catch (error) {
    console.log(error);
  }
});

mongoose
  .connect("mongodb://127.0.0.1:27017/")
  .then(() => {
    console.log("Connected to MongoDB!");

    app.listen(PORT, (err) => {
      if (err) {
        console.log("Error starting server:", err);
      } else {
        console.log(`Server is running on port ${PORT}`);
      }
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
