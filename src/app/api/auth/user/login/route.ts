import { NextResponse } from "next/server";
import { DefaultRespone } from "@utils/general/general";
import { CreateJWT } from "@utils/general/jwt.service";
import { CheckPassword } from "../../../../../utils/general/general";
import { GetUser } from "../../../services/user.service";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const user = await GetUser({ email: data.email })
        if (user.email && CheckPassword(data.password, user.password)) {
            const userInfo = {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone_number: user.phone_number,
                gender: user.gender,
            }

            DefaultRespone.success = 1;
            DefaultRespone.message = "User login successfully.";
            DefaultRespone.data = userInfo;
            DefaultRespone.settings = {
                token : await CreateJWT(userInfo)
            }

        } else {
            throw new Error("Please enter valid details")
        }

    } catch (error) {
        DefaultRespone.success = 0;
        DefaultRespone.message = error.message || DefaultRespone.message;
    }

    return NextResponse.json(DefaultRespone.json());
}