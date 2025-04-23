"use node"

import "reflect-metadata"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { GENDER, STATUS } from "../enum/enum";
import { BaseEntity } from "./base.entity";


@Entity('user')
export class User  extends BaseEntity{
    @PrimaryGeneratedColumn({name: 'iUserId'})
    id: number

    @Column({ name: "vFirstName",length: 255 })
    first_name: string

    @Column({name: "vLastName", length: 255 })
    last_name: string

    @Column({name: "vEmail", length: 255 })
    email: string

    @Column({name: "vPassword", length: 255 })
    password: string

    @Column({name: "vProfile", length: 255, nullable: true })
    profile: string

    @Column({name: "vPhoneNumber", length: 255 })
    phone_number: string

    @Column({name: "eGender", type: 'enum', enum: GENDER })
    gender: GENDER

    @Column({name: "eStatus", type: 'enum', enum: STATUS })
    status: STATUS
}