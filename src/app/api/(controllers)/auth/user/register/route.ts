import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import { DefaultRespone , EncryptPassword} from "@utils/general/general";
import { GetUser, InsertUser } from "../../../../services/user.service";

/**
 * API Nama  User Registration
 * API Path `/api/auth/user/register`
 * @method POST
 * @param req request object
 * @returns JSON Object
 */

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const oldUser = await GetUser({
            email: body.email
        });

        if (oldUser && oldUser.email) {
            throw  'User is already existed.'
        }
        const insertParams = {
            "first_name": body.first_name,
            "last_name": body.last_name,
            "email": body.email,
            "password": EncryptPassword(body.password),
            "phone_number": body.phone_number,
            "gender": body.gender,
            "cat": new Date(),
            "mat": new Date()
        }

        const result = await InsertUser(insertParams)
        DefaultRespone.message = "User registered successfully.";
        DefaultRespone.success = 1;
        DefaultRespone.data = result;

    } catch (error) {
        DefaultRespone.success = 0;
        DefaultRespone.message = error || DefaultRespone.message;
    }

    return NextResponse.json(DefaultRespone.json())
}