import { Column } from "typeorm"

export class BaseEntity {
    @Column({name: "dtAddedDate", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    adt: Date

    @Column({name: "dtModifyDate", type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: 'CURRENT_TIMESTAMP' })
    mdt: Date
}