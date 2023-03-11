require('dotenv').config({ path: '.env.test' });

const app = require('../app')
const { Op } = require('sequelize');
const request = require('supertest')
const getDatabaseInstance = require('../database/db_connection');
const syncModels = require('../database/models/SyncModels');

const Group = require('../database/models/Group');
const User = require('../database/models/User');
const { Message, Like } = require('../database/models/Message');


const sequelize = getDatabaseInstance();

let token = '';
let adminToken = '';
let adminUser;
let user;
beforeAll(async () => {
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
});

afterAll(async () => {
    await sequelize.close();
});


describe('Auth Endpoints', () => {
    test('Validate Unauthorized User', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: "admin1@admin.com",
                password: 'Admin@123',
            });
        expect(res.statusCode).toEqual(401)
    })
    test('Validate Authorized Admin Role', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: "admin@admin.com",
                password: 'admin@123',
            })
        adminToken = res.body.token;
        adminUser = res.body.user;
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('token')
    })
    test('Validate Authorized  User Role', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: "admin1@admin.com",
                password: 'admin@123',
            })
        token = res.body.token;
        user = res.body.user;
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('token')
    })
})


describe('User Endpoints', () => {
    test('Validate Create Group as unauthorized user', async () => {
        const res = await request(app)
            .post('/api/v1/user/createGroup')
            .send({
                name: "Group 1",
                creator: adminUser.id
            })
        expect(res.statusCode).toEqual(401)
    })
    test('Validate Create Group as authorized user', async () => {
        const res = await request(app)
            .post('/api/v1/user/createGroup')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "Group 1",
                creator: adminUser.id
            })
        expect(res.statusCode).toEqual(200)
    })
    test('Validate Create and Delete Group', async () => {
        const groupResponse = await request(app)
            .post('/api/v1/user/createGroup')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "Group 2",
                creator: adminUser.id
            })

        const deleteResponse = await request(app)
            .delete(`/api/v1/user/deleteGroup/${groupResponse.body.result.id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(groupResponse.statusCode).toEqual(200)
        expect(deleteResponse.statusCode).toEqual(200)
    })
    test('Validate Add Member to the group', async () => {
        const newMember = 'admin1@admin.com';
        const res = await addMemberToGroup(newMember);
        expect(res.statusCode).toEqual(200)


        const user = await Group.findOne({
            include: [{
                model: User,
                where: {
                    email: res.body.result.email
                }
            }]
        })
        expect(user).not.toBe(null)
    })
    test('Validate Add existing Member to the group again', async () => {
        const existMember = 'admin@admin.com';
        const group = await Group.findOne({
            include: [{
                model: User,
                where: {
                    email: existMember
                }
            }]
        })

        const res = await request(app)
            .post('/api/v1/user/addGroupMember')
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: existMember,
                groupId: group.id,
            })
        expect(res.statusCode).toEqual(409)
    })
    test('Validate Remove Existing Member from Group', async () => {
        const existMember = 'admin1@admin.com';
        const group = await Group.findOne({
            include: [{
                model: User,
                where: {
                    email: existMember
                }
            }]
        })
        const user = await User.findOne({
            where: {
                email: existMember
            }
        });
        const res = await request(app)
            .delete(`/api/v1/user/removeGroupMember/${user.id}/${group.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: existMember,
                groupId: group.id,
            })
        expect(res.statusCode).toEqual(200)
    })
})


async function addMemberToGroup(email) {

    const group = await Group.findOne({
        include: [{
            model: User,
            where: {
                email: adminUser.email
            }
        }]
    })

    const res = await request(app)
        .post('/api/v1/user/addGroupMember')
        .set('Authorization', `Bearer ${token}`)
        .send({
            email: email,
            groupId: group.id,
        })
    return res;
}

describe('User Activities Endpoints', () => {
    test('Validate Add Message', async () => {

        const group = await Group.findOne({
            include: [{
                model: User,
                where: {
                    email: adminUser.email
                }
            }]
        })

        const res = await request(app)
            .post('/api/v1/user/addMessage')
            .set('Authorization', `Bearer ${token}`)
            .send({
                user: adminUser.id,
                group: group.id,
                message: "hello"
            })
        expect(res.statusCode).toEqual(200)

    })
    test('Validate Like Message', async () => {
        const newMember = 'admin1@admin.com';
        const groupResponse = await addMemberToGroup(newMember);
        expect(groupResponse.statusCode).toEqual(200)
        const group = await Group.findOne({
            include: [{
                model: User,
                where: {
                    email: adminUser.email
                }
            }]
        })

        const message = await Message.findOne({
            include: [{
                model: Group,
                where: {
                    id: group.id
                }
            }, {
                model: User,
                where: {
                    email: adminUser.email
                }
            }]
        })
        const likeuser = await User.findOne({
            where: {
                email: newMember
            }
        });
        const res = await request(app)
            .post('/api/v1/user/likeMessage')
            .set('Authorization', `Bearer ${token}`)
            .send({
                user: likeuser.id,
                message: message.id,
            })
        expect(res.statusCode).toEqual(200)
    })

    test('Validate Dislike Message', async () => {
        const groupMember = 'admin1@admin.com';
        const like = await Like.findOne({
            include: [{
                model: User,
                where: {
                    email: groupMember
                }
            }]
        })

        const res = await request(app)
            .delete(`/api/v1/user/dislikeMessage/${like.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200)
    })

    test('Validate All Group Messages ', async () => {

        const dbGroup = await Group.findOne({
            include: [Message,
                {
                    model: User,
                    where: {
                        email: adminUser.email
                    }
                }]
        })

        const res = await request(app)
            .get(`/api/v1/user/getMessages/${dbGroup.id}`)
            .set('Authorization', `Bearer ${token}`);
        const apiGroup = res.body.result.messages;
        expect(res.statusCode).toEqual(200)
        expect(apiGroup.length).toEqual(dbGroup.messages.length)
    })
    test('Validate user groups list', async () => {

        const groups = await Group.findAll({
            include: [{
                model: User,
                where: {
                    email: adminUser.email
                }
            }]
        })

        const res = await request(app)
            .post('/api/v1/user/getUserGroups')
            .set('Authorization', `Bearer ${token}`)
            .send({
                userId: adminUser.id
            })
        expect(res.statusCode).toEqual(200)
        const apiGroups = res.body.result.groups;

        expect(groups.length).toEqual(apiGroups.length)
    })
    test('Validate Search Member', async () => {
        const searMember = "123";
        const users = await User.findAll({
            where: {
                id: { [Op.not]: adminUser.id },
                [Op.or]: [
                    { email: { [Op.like]: `%${searMember}%` } },
                    { phone: { [Op.like]: `%${searMember}%` } }
                ]

            }
        });
        const res = await request(app)
            .get(`/api/v1/user/searchAllMembers/${searMember}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200)
        const apiUsers = res.body.result;
        expect(users.length).toEqual(apiUsers.length)
    })
})


describe('Admin activities with admin role', () => {
    test('creates a new user', async () => {
        const newUser = {
            email: 'user1@user.com',
            name: 'User 1',
            password: 'user@123',
            phone: '11111111',
            role: false,
        };

        const response = await request(app)
            .post('/api/v1/admin/createUser')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(newUser);

        expect(response.statusCode).toBe(200);

        const user = await User.findOne({
            where: {
                email: newUser.email
            }
        });
        expect(user).not.toBe(null);
    })
    test('Change user details', async () => {
        const existUser = 'user1@user.com';
        const user = await User.findOne({
            where: {
                email: existUser
            }
        });
        const id = user.id;
        let u = user.dataValues;
        delete u.password;
        u.name = "User 3";


        const response = await request(app)
            .patch('/api/v1/admin/editUser')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(u);

        expect(response.statusCode).toBe(200);

        const updatedUser = await User.findOne({
            where: {
                email: existUser
            }
        });
        expect(updatedUser.name).toBe(u.name);


    })
    test('Validate remove User', async () => {
        const existUser = 'user1@user.com';
        const user = await User.findOne({
            where: {
                email: existUser
            }
        });

        const response = await request(app)
            .delete(`/api/v1/admin/deleteUser/${user.id}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);

        const updatedUser = await User.findOne({
            where: {
                email: existUser
            }
        });
        expect(updatedUser).toBe(null);
    })
})
describe('Admin activities without admin role', () => {
    test('creates a new user', async () => {
        const newUser = {
            email: 'user1@user.com',
            name: 'User 1',
            password: 'user@123',
            phone: '11111111',
            role: false,
        };

        const response = await request(app)
            .post('/api/v1/admin/createUser')
            .set('Authorization', `Bearer ${token}`)
            .send(newUser);

        expect(response.statusCode).toBe(401);
    })
    test('Change user details', async () => {
        const existUser = 'admin1@admin.com';
        const user = await User.findOne({
            where: {
                email: existUser
            }
        });
        const id = user.id;
        let u = user.dataValues;
        delete u.password;
        u.name = "User 3";

        const response = await request(app)
            .patch('/api/v1/admin/editUser')
            .set('Authorization', `Bearer ${token}`)
            .send(u);

        expect(response.statusCode).toBe(401);
    })
    test('Validate remove User', async () => {
        const existUser = 'admin1@admin.com';
        const user = await User.findOne({
            where: {
                email: existUser
            }
        });

        const response = await request(app)
            .delete(`/api/v1/admin/deleteUser/${user.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(401);
    })
})