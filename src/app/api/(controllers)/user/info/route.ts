import { NextRequest, NextResponse } from "next/server";
import { UserService } from "../../../services/user.service";
import { getFile, uploadFile } from "../../../file.service";
import { DefaultResponse } from "../../../general/general";
import { USER } from "../../../general/interface";
import { useSession } from "next-auth/react";



const folderName = 'profile_images'
export function prepateUserInfo(user: any) {
    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        profile: getFile(user.profile, folderName),
        gender: user.gender,
        adt: user.adt,
        mdt: user.mdt
    }
}

/**
 * Get usre information
 * @param req 
 * @returns Object
 */
export async function GET(req: NextRequest) {
    try {
        const tokenData = JSON.parse(req.headers.get('token_data') as string);
        const user: USER = await UserService.getUser({ email: tokenData.email, id: tokenData.id });
        if (Object.keys(user).length) {
            DefaultResponse.success = 1;
            DefaultResponse.message = "User login successfully.";
            DefaultResponse.data = prepateUserInfo(user)
        } else {
            throw "User not found.!"
        }
    } catch (error) {
        DefaultResponse.message = error?.message || error;
        DefaultResponse.data = {};
    }

    return NextResponse.json(DefaultResponse.json());
}

/**
 * Update user information profile
 * @param req 
 * @returns Object
 */
export async function PUT(req) {
    try {
        const tokenData = JSON.parse(req.headers.get('token_data') as string);
        const data = await req.formData();

        const user = await UserService.getUser({ id: tokenData.id })
        if (!Object.keys(user).length) {
            throw "User not found.!"
        }

        // check and upload profile image
        const file = data.get('profile');
        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            user.profile = uploadFile(buffer, folderName, file.name);
        }


        user.first_name = data.get("first_name");
        user.last_name = data.get("last_name");
        user.phone_number = data.get("phone_number");
        user.gender = data.get("gender");
        const update = await UserService.updateUser(tokenData.id, user);

        DefaultResponse.success = 1;
        DefaultResponse.message = "User login successfully.";
        DefaultResponse.data = prepateUserInfo(update)

    } catch (error) {
        console.log(error)
        DefaultResponse.message = error?.message || error;
        DefaultResponse.data = {};
    }

    return NextResponse.json(DefaultResponse.json());
}