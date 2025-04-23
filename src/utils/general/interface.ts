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