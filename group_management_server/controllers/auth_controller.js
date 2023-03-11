
const User = require('../database/models/User');
const jwt = require("jsonwebtoken");
const util = require('util')
const createToken = user => {
    return jwt.sign(
        {
            user,
        },
        process.env.SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES,
        },
    );
};


const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.send("Invalid Credential");
        }
        const user = await User.findOne({ where: { email: email } });

        if (!user || !(await user.correctPassword(password, user.password))) {
            res.status(401).json({
                status: '',
                error: '',
                message: "Email/Password is wrong",
                stack: ''
            });
            return;
        }
        let u = user.dataValues;
        u.password = undefined;
        const token = createToken(u);
        res.status(200).json({
            status: "success",
            token,
            user: u,
        });
    } catch (err) {
        next(err);
    }
}


const logout = (req, res, next) => {

}

const protect = async (req, res, next) => {
    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            res.status(401).send("You are not logged in ");
            return;
        }
        const decode = await util.promisify(jwt.verify)(token, process.env.SECRET);

        const user = await User.findByPk(decode.user.id);
        if (!user) {
            res.status(401).send("User Expired ");
            return;
        }

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};


const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(401).send("Unauthorized!!! User Restriction ");
            return;
        }
        next();
    };
};
module.exports = { login, logout, protect, restrictTo }