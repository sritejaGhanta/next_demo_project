import { NextResponse } from "next/server";
import { User } from "../../../database/scema/user.entity";
import { UserService } from "../../../services/user.service";
import { CheckPassword, DefaultResponse, EncryptPassword } from "../../../general/general";

/**
 * User Password Change Api
 * @param req
 * @return Object
 */
export async function POST(req) {
    try {
        const tokenData = JSON.parse(req.headers.get('token_data') as string);
        const data = await req.json();
        const user: User = await UserService.getUser({ email: tokenData.email, id: tokenData.id });
        if (!Object.keys(user).length) {
            throw "User Not Found. Please try again"
        }

        if (user.password &&!CheckPassword(data.password, user.password)) {
            throw "Incorrect Old Password."
        }

        user.password = EncryptPassword(data.new_password);
        await UserService.updateUser(user.id, user);

        DefaultResponse.success = 1;
        DefaultResponse.message = "Password Change successfully.";

    } catch (error) {
        console.log(error)
        DefaultResponse.success = error.message || error;
    }

    return NextResponse.json(DefaultResponse.json())
}