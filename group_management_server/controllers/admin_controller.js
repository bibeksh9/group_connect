const User = require('../database/models/User');
const { Op } = require("sequelize");

const createUser = async (req, res, next) => {
    let data = req.body;
    data.role = data.role ? "Admin" : "User";
    const newUser = await User.create(data)

    res.status(200).json({
        status: "success",
        result: true,
    });
}


const editUser = async (req, res, next) => {
    let data = req.body;
    const { id } = data;
    delete data.id;
    data.role = data.role ? "Admin" : "User";
    const users = await User.update(
        data,
        {
            where: {
                id: {
                    [Op.eq]: id
                }
            }
        })
    res.status(200).json({
        status: "success",
        result: users,
    });
}
const viewUser = async (req, res, next) => {
    const users = await User.findAll(
        {
            where: {

                [Op.not]: [{ id: req.user.id }]

            }
        })
    res.status(200).json({
        status: "success",
        result: users,
    });

}
const deleteUser = async (req, res, next) => {
    let { id } = req.params;
    const user = await User.findByPk(id);
    await user.destroy();
    res.status(200).json({
        status: "success",
        result: user,
    });
}


module.exports = { createUser, editUser, deleteUser, viewUser }