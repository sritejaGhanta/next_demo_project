import { NextResponse } from "next/server";
import { DefaultResponse } from "../../../general/general";
import Joi, { object } from "joi"
import { uploadFile } from "../../../file.service";
import { ContactService } from "../../../services/contacts.service";
const folderName = 'contact_images'
/**
 * Contacts List Api
 * @param request 
 * @param responce 
 * @returns 
 */
export async function POST(request: Request, responce) {
    try {
        const reqData: any = await request.json();
        const tokenData = JSON.parse(request.headers.get('token_data') as string);
        const { value, error } = addInputValidations({
            ids: reqData.ids,
            status: reqData.status
        })
        if (error) {
            throw error
        }

        let whereCondition = {
            user_id: tokenData.id,
            id_in: reqData.ids
        }

        let contactsList = await ContactService.getAllContacts(whereCondition);

        if (!contactsList.length) {
            throw "No records found."
        }

        DefaultResponse.success = 1;
        DefaultResponse.message = "Contacts list found.";
        DefaultResponse.data = contactsList;
    } catch (error) {
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
        ids: Joi.array().required(),
        status: Joi.valid('active', 'inactive', 'Active', 'Inactive').required(),
    })
    return Object.validate(data);
}
