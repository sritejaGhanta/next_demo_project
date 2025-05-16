import { ColDef } from "ag-grid-community"

export interface API_RESPONSE {
    settings: {
        success: 0 | 1,
        message: string,
        page?: number,
        token?: string
    },
    data: any
}

export interface COMMON_RESPONSE {
    success: 0 | 1,
    message: string,
    data: any,
    settings?: any,
    json: () => API_RESPONSE
}

export interface USER {
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    phone_number: string,
    gender: string,
    adt: string,
    mdt: string
}

export interface COMMON_LIST_COMPONENT_INTERFACE {
    colDefs: ColDef[],
    defaultColDef: any,
    api_url?: {
        add?: string,
        update?: string,
        list?: string,
        delete?: string,
        details?: string,
        status?: string,
    },
    actions?: {
        add?: boolean,
        update?: boolean,
        list?: boolean,
        delete?: boolean,
        refresh?: boolean,
        status?: boolean,
        pagination?: boolean,
        search?: boolean
    },
    add_update_actions?: {
        add?: {
            pop_up?: boolean,
            redirect: boolean,
            pop_up_component?: any
        },
        update: {
            pop_up?: boolean,
            redirect: boolean,
            pop_up_component?: any
        },
    }
    list_data?: boolean,
    row_selction?: "multiRow" | "singleRow",

}