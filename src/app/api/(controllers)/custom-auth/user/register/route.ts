import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import { UserService } from "../../../../services/user.service";
import { DefaultResponse, EncryptPassword } from "../../../../general/general";

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

        const oldUser = await UserService.getUser({
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
        }
        const result = await UserService.insertUser(insertParams)
        console.log(insertParams, result)
        DefaultResponse.message = "User registered successfully.";
        DefaultResponse.success = 1;
        DefaultResponse.data = insertParams;

    } catch (error) {
        DefaultResponse.success = 0;
        DefaultResponse.message = error?.message|| error || DefaultResponse.message;
    }

    return NextResponse.json(DefaultResponse.json())
}