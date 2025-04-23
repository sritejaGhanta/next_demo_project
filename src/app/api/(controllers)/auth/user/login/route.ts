import { NextResponse } from "next/server";
import { UserService } from "../../../../services/user.service";
import { User } from "../../../../database/scema/user.entity";
import { prepateUserInfo } from "../../../user/info/route";
import { CheckPassword, DefaultResponse } from "../../../../general/general";
import { CreateJWT } from "../../../../general/jwt.service";

/**
 * User Loign Api
 * @param req 
 * @returns Object
 */
export async function POST(req: Request) {
    try {
        const data = await req.json();
        const condition = { email: data.email };
        const user: User = await UserService.getUser(condition) as User;
        console.log(CheckPassword(data.password, user.password), data.password, user.password)
        if (user.email && CheckPassword(data.password, user.password)) {
            const userInfo = prepateUserInfo(user)

            DefaultResponse.success = 1;
            DefaultResponse.message = `Welocome Back <b>${user.first_name} ${user.last_name}</b>`;
            DefaultResponse.data = userInfo;
            DefaultResponse.settings = {
                token: await CreateJWT(userInfo)
            }

        } else {
            throw new Error("Please enter valid details")
        }

    } catch (error) {
        console.log(error)
        DefaultResponse.success = 0;
        DefaultResponse.message = error.message || DefaultResponse.message;
    }

    return NextResponse.json(DefaultResponse.json());
}