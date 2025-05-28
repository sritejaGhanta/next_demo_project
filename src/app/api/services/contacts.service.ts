import db from "../database/connection";
import "reflect-metadata";
import { ContatsEntity } from "../database/scema/contacts.entity";
import { In } from "typeorm";

class ContactServiceClass {
    db = db;
    contacts = this.db.getRepository(ContatsEntity);
    constructor() { }

    /**
     * Get Single Contact record only
     * @param whereCondition
     * @returns Object
     */
    getContact = async (whereCondition) => {
        let where: any = {};
        const find = whereCondition.id ? "findOne" : "find";

        if (whereCondition.id) {
            where.id = whereCondition.id;
        }
        if (whereCondition.ids) {
            where.id = In(whereCondition.ids);
        }

        if (whereCondition.user_id) {
            where.user_id = whereCondition.user_id;
        }

        return await this.contacts[find]({ where })
    }

    /**
     * Get Contact List
     * @param whereCondition
     * @returns Array Objects
     */
    getAllContacts = async (whereCondition, needCount = 0) => {
        let where: any = {};
        const contact = this.contacts.createQueryBuilder('c')

        if (whereCondition.user_id) {
            contact.where(`c.iUserId = ${whereCondition.user_id}`)
        }

        if (whereCondition.id_in) {
            contact.where(`c.iContactId IN (${whereCondition.id_in.join(',')})`);
        }

        if (whereCondition.status) {
            contact.andWhere(`c.eStatus IN  ('${whereCondition.status}')`);
        }

        if (whereCondition.keyword) {
            contact.andWhere(`(c.vName LIKE "%${whereCondition.keyword}%" OR c.vPhoneNumber LIKE "%${whereCondition.keyword}%" OR c.eStatus LIKE "%${whereCondition.keyword}%")`)
        }

        if (whereCondition.sort) {
            whereCondition.sort.forEach(field => {
                const dir = field.dir == "desc" ? "DESC" : "ASC";
                if (field.prop == "name" && dir) {
                    contact.orderBy("c.vName", dir);
                }

                if (field.prop == "phone_number" && dir) {
                    contact.orderBy("c.vPhoneNumber", dir)
                }

                if (field.prop == "status" && dir) {
                    contact.orderBy("c.eStatus", dir)
                }

                if (field.prop == "adt" && dir) {
                    contact.orderBy("c.dtAddedDate", dir)
                }
            })
        }

        let count = 0;
        if (needCount) {
            count = await contact.getCount();
        }
        contact.limit(whereCondition.limit);
        contact.offset(whereCondition.offset);
        console.log(contact.getQuery());

        return {
            data: await contact.getMany(),
            count: count
        }
    }

    /**
     * Insert Contact Record
     * @param data
     * @returns Object
     */
    saveContact = async (data) => {
        let contact = new ContatsEntity();
        contact.name = data.name;
        contact.image = data.image;
        contact.phone_number = data.phone_number;
        contact.status = data.status;
        contact.user_id = data.user_id;

        return await this.contacts.save(contact);
    }

    /**
     * Update contact Record Only
     * @param data
     * @returns Object
     */
    updateContact = async (data) => {
        return await this.contacts.save(data);
    }

    /**
     * Delete Contact Record Only
     * @param id
     * @returns Object
     */
    deleteContact = async (id) => {
        return await this.contacts.delete(id);
    }
}

export const ContactService = new ContactServiceClass()