import { NextRequest, NextResponse } from "next/server";
import { DefaultResponse } from "../../../../general/general";
import Joi, { object } from "joi"
import { getFile, uploadFile } from "../../../../file.service";
import { ContactService } from "../../../../services/contacts.service";
const folderName = 'contact_images'

/**
 * Contacts update only
 * @param request
 * @param responce
 * @returns Object
 */
export async function GET(request: NextRequest, { params }, responce: NextResponse) {
    try {
        const tokenData = JSON.parse(request.headers.get('token_data') as string);

        params = await params;

        if (!params.id) {
            throw "Please provide valid id"
        }

        const contact = await ContactService.getContact({
            id: params.id,
            user_id: tokenData.id
        });

        if (!Object.keys(contact)) {
            throw "Contact not found.!"
        }
        contact.image = getFile(contact.image, folderName);

        DefaultResponse.data = contact;
        DefaultResponse.success = 1;
        DefaultResponse.message = "Contact updates successfully";
    } catch (error) {
        console.log(error)
        DefaultResponse.success = 0;
        DefaultResponse.message = error.message || error;
    }

    return NextResponse.json(DefaultResponse.json());
}

