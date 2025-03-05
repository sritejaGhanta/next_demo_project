import { db } from "@utils/database/connection";

const user = db.collection('users');
const options = { ordered: true }


export async function GetUser(where){
    return await user.findOne(where)
}

export async function InsertUser(user){
    return await user.insertOne(user, options)
}