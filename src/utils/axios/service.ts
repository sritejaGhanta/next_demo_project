import axios from "axios"
import { ENV } from "@env/envirolment";
import { useDispatch } from "react-redux";
class Axios {
    ax: any;
    constructor() {
        this.ax = axios.create({
            baseURL: ENV.BASE_URL,
            timeout: 10000,
            headers: {
                "Content-Type": "application/json"
            }
        });
        this.ax.interceptors.response.use(
            (response) => response.data
        )
    }

    get(path: string, params: any = {}, headers: any = {}) {
        return this.ax.get(path, { params, headers })
    }

    post(path: string, params: any = {}, headers: any = {}) {
        return this.ax.post(path, params, { headers })
    }
}

export default new Axios();