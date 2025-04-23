import db from "../database/connection";
import "reflect-metadata";
import { GENDER, STATUS } from "../database/enum/enum";
import { User } from "../database/scema/user.entity";

class UserServiceClass {
    userRepository;
    db;
    constructor() {
        this.db = db
        this.userRepository = this.db.getRepository(User);
    }

    async getUser(condition) {
        const where: any = {};
        if (condition.id) {
            where.id = condition.id
        }

        if (condition.email) {
            where.email = condition.email
        }

        return await this.userRepository.findOne({ where });
    }
    async insertUser(userInfo) {
        const insertData = new User();
        insertData.first_name = userInfo.first_name;
        insertData.last_name = userInfo.last_name;
        insertData.email = userInfo.email;
        insertData.password = userInfo.password;
        insertData.phone_number = userInfo.phone_number;
        insertData.gender = userInfo.gender == 'male' ? GENDER.MALE : GENDER.FEMALE;
        insertData.status = STATUS.ACTIVE;

        return await db.manager.save(insertData)
    }

    async updateUser(id: number, userInfo: any) {
        // return await this.userRepository
        // .createQueryBuilder()
        // .update(User)
        // .set(userInfo)
        // .where({
        //     id
        // })

        return await this.userRepository.save(userInfo)
    }
}

export const UserService = new UserServiceClass()

