import { NextRequest, NextResponse } from "next/server";
import { DefaultResponse } from "../../../../general/general";
import Joi, { object } from "joi"
import { uploadFile } from "../../../../file.service";
import { ContactService } from "../../../../services/contacts.service";
import { addInputValidations } from "../route";
const folderName = 'contact_images'

/**
 * Contacts update only
 * @param request
 * @param responce
 * @returns Object
 */
export async function PUT(request: NextRequest, { params }, responce: NextResponse) {
    try {
        const reqData = await request.formData();
        const tokenData = JSON.parse(request.headers.get('token_data') as string);

        params = await params;

        if (!params.id) {
            throw "Please provide valid id"
        }

        const contact = await ContactService.getContact({ 
            id: params.id,
            user_id: tokenData.id
        });

        if(!Object.keys(contact)){
            throw "Contact not found.!"
        }

        const { value, error } = addInputValidations({
            name: reqData.get('name'),
            phone_number: reqData.get('phone_number'),
            status: reqData.get('status'),
            image: reqData.get('image'),
        });
        // check contact image
        if (value.image) {
            const bufferData = Buffer.from(await value.image.arrayBuffer());
            value.image = uploadFile(bufferData, folderName, value.image.name);
        }

        const contactInfo = {
            ...contact,
            ...value
        }

        DefaultResponse.data = await ContactService.updateContact(contactInfo);
        DefaultResponse.success = 1;
        DefaultResponse.message = "Contact updates successfully";
    } catch (error) {
        console.log(error)
        DefaultResponse.success = 0;
        DefaultResponse.message = error.message || error;
    }

    return NextResponse.json(DefaultResponse.json());
}

