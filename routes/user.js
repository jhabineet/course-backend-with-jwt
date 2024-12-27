const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");

// User Routes
router.post('/signup', async(req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await User.findOne({ username: username })
    if(existingUser) {
        res.status(403).json({
            msg: "User Already Exists",
        })
    } else {
        await User.create({
            username: username,
            password: password
        })
        res.status(200).json({
            msg: "User Created Successfully",
        })
    }
});

router.get('/courses', async(req, res) => {
    // Implement listing all courses logic
    const response = await User.find({ })
    res.status(200).json({
        course: response
    })
});

router.post('/courses/:courseId', userMiddleware, async(req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    const username = req.headers.username;

    await User.updateOne({
        username: username,
    }, {
        "$push" : {
            purchasedCourses: courseId,
        }
    })
    res.status(200).json({
        msg: "Course Purchased Successfully",
    })
});

router.get('/purchasedCourses', userMiddleware, async(req, res) => {
    // Implement fetching purchased courses logic
    const user = await User.findOne({
        username: req.headers.username
    })
    const response = await Course.find({
        _id: {
            "$in": user.purchasedCourses
        }
    })
    res.status(200).json({
        purchasedCourse: response,
    })
});

module.exports = router