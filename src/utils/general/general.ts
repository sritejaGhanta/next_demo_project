import CrypTo from "crypto-js"
interface FR {
    settings: {
        success: 0 | 1,
        message: string,
        page?: number,
    },
    data: any
}

interface DR {
    success: 0 | 1,
    message: string,
    data: any,
    settings?: any,
    json: () => FR
}
// export function CustomResponse(res: DR) {
//     return {
//         settings: {
//             success: res.success,
//             message: res.message,
//             ...(res.settings || {})
//         },
//         data: res.data
//     }
// }

export const DefaultRespone: DR = {
    success: 0,
    message: "Something went wrong please",
    data: [],
    settings: {},
    json: function () {
        return {
            settings: {
                success: this.success,
                message: this.message,
                ...(this.settings || {})
            },
            data: this.data
        }
    }
}

export function EncryptPassword(password: string | number) {
    return CrypTo.SHA256(password).toString();
}

export function CheckPassword(password: string | number, hash: string) {
    return CrypTo.SHA256(password).toString() == hash;
}