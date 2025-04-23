import CrypTo from "crypto-js"
import { COMMON_RESPONSE } from "./interface";

/**
 * Common Response Formate in All Api's
 */
export const DefaultResponse: COMMON_RESPONSE = {
    success: 0,
    message: "Something went wrong please",
    data: [],
    settings: {},
    status: 200,
    json: function () {
        const result = {
            settings: {
                success: this.success,
                message: this.message,
                ...(this.settings || {})
            },
            data: this.data
        };

        // Reset the object's properties after getting the json.
        this.success = 0;
        this.message = "Something went wrong please";
        this.data = [];
        this.settings = {};
        this.status = 200;

        return result;
    }
}

export function EncryptPassword(password: string | number) {
    return CrypTo.SHA256(password).toString();
}

export function CheckPassword(password: string | number, hash: string) {
    return CrypTo.SHA256(password).toString() == hash;
}