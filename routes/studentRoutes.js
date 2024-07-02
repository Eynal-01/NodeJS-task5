const express = require("express");
const router = express.Router();
const controller = require('./../controllers/studentController');

router.param("id", controller.checkId);

router.route("/")
    .get(controller.getAllStudents)
    .post(controller.checkBody, controller.createStudent);

router.route("/:id")
    .get(controller.getStudent)
    .patch(controller.checkBody, controller.updateStudent)
    .delete(controller.deleteStudent);

module.exports = router;