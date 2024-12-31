const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");

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

router.post('/signin', async(req, res) => {
    // Implement user signin logic
    const username = req.body.username;
    const password = req.body.password;

    const userExists = await User.find({ username: username, password: password })
    if(userExists) {
        res.status(411).json({
            msg: "User Doesn't Exists"
        })    
    } else {
        const token = jwt.sign({ username }, JWT_SECRET)
        return res.status(200).json({
            msg: "User Signed In Successfully", 
            token: token,
        })
    }
})

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
    const username = req.username; // This is coming from the usermiddleware

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
        username: req.username
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