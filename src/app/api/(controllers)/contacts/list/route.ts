import { NextResponse } from "next/server";
import { DefaultResponse } from "../../../general/general";
import Joi, { object } from "joi"
import { getFile, uploadFile } from "../../../file.service";
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

        let whereCondition: any = {
            user_id: tokenData.id
        };

        if (reqData?.keyword) {
            whereCondition.keyword = reqData?.keyword;
        }

        if (reqData?.status) {
            whereCondition.status = reqData?.status;
        }

        if (reqData.sort && reqData.sort.length) {
            whereCondition.sort = reqData.sort || [];
        }

        whereCondition.limit = reqData?.limit || 20;
        whereCondition.offset = ((Number(reqData?.page) - 1) * Number(reqData?.limit)) || 0;


        let { data: contactsList, count } = await ContactService.getAllContacts(whereCondition, 1);

        if (count) {
            DefaultResponse.settings.page = Number(reqData?.page);
            DefaultResponse.settings.limit = whereCondition.limit;
            DefaultResponse.settings.count = count;
            DefaultResponse.settings.total_pages = Math.ceil(count / whereCondition.limit) || 1;
            DefaultResponse.settings.next_page = DefaultResponse.settings.page < Math.round(count / whereCondition.limit);

        }

        if (!contactsList?.length) {
            throw "No records found."
        } else {
            contactsList?.map(e => {
                e.image = getFile(e.image, folderName);
            })
        }

        DefaultResponse.success = 1;
        DefaultResponse.message = "Contacts list found.";
        DefaultResponse.data = contactsList;

    } catch (error) {
        console.log(error)
        DefaultResponse.success = 0;
        DefaultResponse.message = error.message || error;
    }

    return NextResponse.json(DefaultResponse.json());
}
