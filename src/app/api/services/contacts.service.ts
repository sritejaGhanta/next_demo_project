import db from "../database/connection";
import "reflect-metadata";
import { ContatsEntity } from "../database/scema/contacts.entity";

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

        if (whereCondition.id) {
            where.id = whereCondition.id;
        }

        if (whereCondition.user_id) {
            where.user_id = whereCondition.user_id;
        }

        return await this.contacts.findOne({ where })
    }

    /**
     * Get Contact List
     * @param whereCondition
     * @returns Array Objects
     */
    getAllContacts = async (whereCondition) => {
        let where: any = {};

        if (whereCondition.user_id) {
            where.user_id = whereCondition.user_id;
        }

        if (whereCondition.id_in) {
            where.id = whereCondition.id_in;
        }

        return await this.contacts.findBy(where)
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