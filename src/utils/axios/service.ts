import axios from "axios"
import { ENV } from "@env/envirolment";
import { Clear, GetKey } from "../general/localstorage"
class Axios {
    ax: any;

    constructor() {
        this.ax = axios.create({
            baseURL: ENV.BASE_URL,
            timeout: 10000,
            headers: {
                "Content-Type": "application/json",
            }
        });
        this.ax.interceptors.response.use(
            (response) => {
                if ([401].includes(response.status)) {
                    Clear();
                    window.location.href = "/auth/login"
                }
                return response.data;
            }
        )
        this.ax.interceptors.request.use((req) => {
            try{
                const token = GetKey(ENV.TOKEN_KEY);
                if (token) {
                    req.headers.Authorization = `Bearer ${token}`;
                }
                return req;

            } catch (error){
                console.log(error)
            }

        })
    }

    get(path: string, params: any = {}, headers: any = {}) {
        return this.ax.get(path, { params, headers })
    }

    post(path: string, params: any = {}, headers: any = {}) {
        return this.ax.post(path, params, { headers })
    }
}

export default new Axios();