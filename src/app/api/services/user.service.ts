import { db } from "@utils/database/connection";

const user = db.collection('users');
const options = { ordered: true }


export async function GetUser(where){
    return await user.findOne(where)
}

export async function InsertUser(userInfo){
    return await user.insertOne(userInfo, options)
}