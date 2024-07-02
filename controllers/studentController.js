const fs = require("fs");
const path = require("path");
const students = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../dev-data/students.json"))
);

exports.checkId = (req, res, next, val) => {
    console.log(`Tour id is ${val}`);
    const student = students.find((s) => s.id === val * 1);
    if (!student) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        });
    }
    next();
};

// exports.checkBody = (req, res, next) => {
//     if (!req.body.name || !req.body.surname || !req.body.score) {
//         return res.status(400).json({
//             status: "fail",
//             message: "Missing name or surname"
//         });
//     }
//     next();
// };

exports.checkBody = (req, res, next) => {
    if (req.method === "POST") {
        if (!req.body.name || !req.body.surname || !req.body.score) {
            return res.status(400).json({
                status: "fail",
                message: "Missing name, surname, or score"
            });
        }
    }
    else if (req.method === "PATCH") {
        if (req.body.name === "" && req.body.surname === "" && req.body.score < 0) {
            return res.status(400).json({
                status: "fail",
                message: "At least one of name, surname, or score must be provided"
            });
        }
    }
    next();
};


exports.getAllStudents = (req, res) => {
    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        results: students.length,
        data: {
            students
        },
    });
};

exports.getStudent = (req, res) => {
    const id = req.params.id * 1;
    const student = students.find((s) => s.id === id);

    if (!student) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        });
    }

    res.status(200).json({
        status: "success",
        data: {
            student
        },
    });
};

exports.createStudent = (req, res) => {
    const newId = students.length ? students[students.length - 1].id + 1 : 1;
    const newStudent = Object.assign({ id: newId }, req.body);

    students.push(newStudent);

    fs.writeFile(
        path.join(__dirname, "../dev-data/students.json"),
        JSON.stringify(students),
        (err) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: "Failed to save data",
                });
            }
            res.status(201).json({
                status: "success",
                data: {
                    student: newStudent
                },
            });
        }
    );
};

exports.updateStudent = (req, res) => {
    const id = req.params.id * 1;
    const studentIndex = students.findIndex((s) => s.id === id);

    if (studentIndex === -1) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        });
    }

    const updatedStudent = Object.assign(students[studentIndex], req.body);

    fs.writeFile(
        path.join(__dirname, "../dev-data/students.json"),
        JSON.stringify(students),
        (err) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: "Failed to save data",
                });
            }

            res.status(200).json({
                status: "success",
                data: {
                    tour: updatedStudent
                },
            });
        }
    );
};

exports.deleteStudent = (req, res) => {
    const id = req.params.id * 1;
    const studentIndex = students.findIndex((s) => s.id === id);

    if (studentIndex === -1) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        });
    }

    students.splice(studentIndex, 1);

    fs.writeFile(
        path.join(__dirname, "../dev-data/students.json"),
        JSON.stringify(students),
        (err) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: "Failed to save data"
                });
            }

            res.status(204).json({
                status: "success",
                data: null
            });
        }
    );
};
