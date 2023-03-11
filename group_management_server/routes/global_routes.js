const express = require('express');
const router = express.Router();
const authRouter = require('./auth_routes');
const adminRouter = require('./admin_routes');
const userRouter = require('./user_routes');
const { protect, restrictTo } = require('../controllers/auth_controller');

router.use("/auth", authRouter);
router.use(protect);
router.use("/user", userRouter);
router.use(restrictTo('Admin'));
router.use("/admin", adminRouter);
module.exports = router;