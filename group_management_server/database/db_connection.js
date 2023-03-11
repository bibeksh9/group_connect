const { Sequelize } = require('sequelize');
const config = require('../config/config.json');




const getDatabaseInstance = () => {
    const options = config[process.env.DATABASE];
    return new Sequelize(options.database, options.username, options.password, options);
}





module.exports = getDatabaseInstance;
