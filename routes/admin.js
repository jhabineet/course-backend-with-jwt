const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    //ab check karo ki the username provided above is already in use or exists or not in the database
    const existingAdmin = await Admin.findOne({ username: username })
    if(existingAdmin) {
        res.status(403).json({
            msg: "User already exists"
        })
    } else {
        await Admin.create({
            username: username,
            password: password
        })
        res.status(200).json({
            msg: "User created successfully"
        })
    }
});

router.post('/courses', adminMiddleware, async(req, res) => {
    // Implement course creation logic
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const imageLink = req.body.imageLink;

    //Creating the Courses by Admins
    const newCourse = await Course.create({
        title: title,
        description: description,
        price: price,
        imageLink: imageLink
    })
    console.log("newCourse is", newCourse);
    res.status(200).json({
        msg: "Course created successfully", courseId: newCourse._id
    })
});

router.get('/courses', adminMiddleware, async(req, res) => {
    // Implement fetching all courses logic
    const response = await Course.find({ });
        res.status(200).json ({
            courses: response
        });
    }
);

module.exports = router;