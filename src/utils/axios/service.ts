import axios from "axios"
import { ENV } from "@env/envirolment";
import { APIRESPONSE } from "../interfaces";
class AxiosClass {
    public readonly ax: any = axios.create({
        baseURL: ENV.BASE_URL,
        timeout: 10000,
        headers: {
        }
    });

    // Add spinner HTML to body
    addSpinner = () => {
        const spinner = document.createElement("div");
        spinner.id = "loading-spinner";
        spinner.innerHTML = `
            <div class="spinner-overlay z-3">
                <div class="spinner-container">
                    <div class="circle circle1"></div>
                    <div class="circle circle2"></div>
                    <div class="circle circle3"></div>
                    <div class="circle circle4"></div>
                    <div class="circle circle5"></div>
                </div>
            </div>
        `;
        document.body.appendChild(spinner);
    };

    // Remove spinner from body
    removeSpinner = () => {
        // const spinner = document.getElementById("loading-spinner");
        // if (spinner) {
        //     spinner.remove();
        // }
    };

    constructor() {

        this.ax.interceptors.response.use(
            (response) => {
                this.removeSpinner();
                return response.data as APIRESPONSE
            },
            (error) => {
                this.removeSpinner();
                if ([401].includes(error.status)) {
                    localStorage.clear();
                    window.location.href = "/auth/login"
                }
            }
        )
        this.ax.interceptors.request.use((req) => {
            // this.addSpinner();
            try {
                const token = localStorage.getItem(ENV.TOKEN_KEY);
                if (token) {
                    req.headers.Authorization = `Bearer ${token}`;
                }
                return req;

            } catch (error) {
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

    put(path: string, params: any = {}, headers: any = {}) {
        return this.ax.put(path, params, { headers })
    }
}

export const Axios = new AxiosClass();