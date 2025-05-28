import { NextRequest, NextResponse } from "next/server";
import { DefaultResponse } from "../../../../general/general";
import Joi, { object } from "joi"
import { uploadFile } from "../../../../file.service";
import { ContactService } from "../../../../services/contacts.service";
const folderName = 'contact_images'

/**
 * Contacts update only
 * @param request
 * @param responce
 * @returns Object
 */
export async function DELETE(request: NextRequest, { params }, responce: NextResponse) {
    try {
        const tokenData = JSON.parse(request.headers.get('token_data') as string);

        params = await params;

        if (!params.id) {
            throw "Please provide valid id"
        }

        const contact = await ContactService.getContact({
            ids: params.id,
            user_id: tokenData.id
        });

        if (!Object.keys(contact)) {
            throw "Contact not found.!"
        }

        console.log(contact)

        DefaultResponse.data = await ContactService.deleteContact(params.id);
        DefaultResponse.success = 1;
        DefaultResponse.message = "Contact updates successfully";
    } catch (error) {
        console.log(error)
        DefaultResponse.success = 0;
        DefaultResponse.message = error.message || error;
    }

    return NextResponse.json(DefaultResponse.json());
}

