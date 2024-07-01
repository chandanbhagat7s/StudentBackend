
const express = require('express');
const { getMyHomework, buyCourse } = require('../Controllers/studentController');
const studentRouter = express.Router()

studentRouter.get("/getMyHomework", getMyHomework);
studentRouter.post("/buyCourse", buyCourse)





module.exports = studentRouter































