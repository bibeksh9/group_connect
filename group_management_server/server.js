require('dotenv').config({ path: '.env' });
const syncModels = require('./database/models/SyncModels');
const app = require('./app.js');
const getDatabaseInstance = require('./database/db_connection');
const sequelize = getDatabaseInstance();
const User = require('./database/models/User');

(async () => {
    await syncModels();
    await sequelize.sync({ force: true });

    const user1 = await User.findOne({ where: { email: 'admin@admin.com' } })
    if (user1 == null) {
        await User.create({
            email: 'admin@admin.com',
            name: 'Admin',
            password: 'admin@123',
            phone: '123456',
            role: 'Admin',
        })
        await User.create({
            email: 'admin1@admin.com',
            name: 'Admin',
            password: 'admin@123',
            phone: '1234569',
            role: 'Admin',
        })
    }



})();



const PORT = process.env.PORT || 3000
app.listen(PORT, () => "Listening on port 8080")