import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity('contacts')
export class ContatsEntity extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "iContactId" })
    id: Number;

    @Column({ name: "vName", nullable: false, })
    name: string;

    @Column({ name: "iUserId", nullable: false, })
    user_id: string;

    @Column({ name: "vPhoneNumber", nullable: false })
    phone_number: string;

    @Column({ name: "vImage", nullable: true })
    image: string;

    @Column({ name: "eStatus", nullable: false })
    status: "Active" | "Inactive"
}