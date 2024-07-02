const express = require("express");
const fs = require("fs");
const morgan = require("morgan");
const path = require("path");

const studentRouter = require("./routes/studentRoutes");

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next)=>{
    console.log("Hello from middleware");
    next();
});

app.use((req, res, next)=>{
    req.requestTime = new Date().toISOString();
    next();
});

app.use("/api/v1/students", studentRouter);

module.exports = app;