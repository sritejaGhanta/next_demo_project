import { NextResponse } from "next/server";
import { DefaultResponse } from "../../../general/general";
import Joi, { object } from "joi"
import { uploadFile } from "../../../file.service";
import { ContactService } from "../../../services/contacts.service";
const folderName = 'contact_images'
/**
 * Contacts add only
 * @param request 
 * @param responce 
 * @returns 
 */
export async function POST(request: Request, responce) {
    try {
        const reqData: any = await request.formData();
        const tokenData = JSON.parse(request.headers.get('token_data') as string);

        const { value, error } = addInputValidations({
            name: reqData.get('name'),
            phone_number: reqData.get('phone_number'),
            status: reqData.get('status'),
            image: reqData.get('image'),
        });

        if (error) {
            throw error;
        }

        // check contact image
        if (value.image) {
            const bufferData = Buffer.from(await value.image.arrayBuffer());
            value.image = uploadFile(bufferData, folderName, value.image.name);
        }
        value.user_id = tokenData.id;
        console.log(value)
        let insetData = await ContactService.saveContact(value)

        DefaultResponse.success = 1;
        DefaultResponse.message = "Contact saved successfully";
        DefaultResponse.data = insetData;
    } catch (error) {
        console.log(error)
        DefaultResponse.success = 0;
        DefaultResponse.message = error.message || error;
    }

    return NextResponse.json(DefaultResponse.json());
}

/**
 * Input params validator
 * @param data
 * @returns
 */
export function addInputValidations(data) {
    let Object = Joi.object({
        name: Joi.required(),
        phone_number: Joi.required(),
        status: Joi.valid('active', 'inactive', 'Active', 'Inactive').required(),
        image: Joi.any()
    })
    return Object.validate(data);
}
