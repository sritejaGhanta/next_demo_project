"use client"

import Link from 'next/link'
import { Formik } from 'formik'
import './login.css'
import { Axios } from "@utils/axios/service.ts"
import { ROUTE } from '../../../utils/axios/routes'
import { ENV } from '@env/envirolment'
import { sEmmitNotification } from '@lib/slice'
import { useDispatch } from 'react-redux'
import { sSetUser } from '../../../lib/slice';
import { redirect, useRouter } from 'next/navigation'
import { API_RESPONSE } from '@utils/general/interface'
import { signIn, } from 'next-auth/react'
import Google from 'next-auth/providers/google'
import { toast } from 'react-toastify'


export default function Login() {
    const dispatch = useDispatch();
    const router = useRouter();
    const submire = (value) => {
        let loginPromise = new Promise((res, rej) => {
            Axios.post(ROUTE.AUTH.LOGIN, value).then((res: API_RESPONSE) => {
                if (res.settings.success) {
                    localStorage.setItem(ENV.TOKEN_KEY, res.settings.token);
                    // signIn('credentials', value);
                    dispatch(sSetUser(res.data))
                    router.push('/dashbord');
                    toast.success(res.settings.message)
                    res()
                } else {
                    res()
                }
            })
        })
        toast.promise(
            loginPromise,
            {
                pending: "Plese wait...",
                error: "Invalid credentials, Please try againg.!"
            }
        )
    }
    return (<>
        <section className="py-3 py-md-5 py-xl-8">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="mb-5">
                            <h2 className="display-5 fw-bold text-center">Sign in</h2>
                            <p className="text-center m-0">Don't have an account? <Link href="/auth/register">Sign up</Link></p>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-10 col-xl-8">
                        <div className="row gy-5 justify-content-center">
                            <div className="col-12 col-lg-5">
                                <Formik
                                    initialValues={{
                                        email: '',
                                        password: ''
                                    }}
                                    validate={(value) => {
                                        const error: any = {};
                                        if (!value.email) {
                                            error.email = "Please enter Email address"
                                        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value.email)) {
                                            error.email = "Please enter valid Email address"
                                        }

                                        if (!value.password) {
                                            error.password = "Please enter password"
                                        }

                                        return error;
                                    }}
                                    onSubmit={(value, { setSubmitting }) => {
                                        setSubmitting(false);
                                        submire(value)
                                    }}
                                >
                                    {({
                                        values,
                                        errors,
                                        touched,
                                        handleBlur,
                                        handleChange,
                                        handleSubmit,
                                        isSubmitting
                                    }) =>

                                        <form onSubmit={handleSubmit}>
                                            <div className="row gy-3 overflow-hidden">
                                                <div className="col-12">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="email"
                                                            className={`form-control border-0 border-bottom rounded-0 ${(errors.email && touched.email) && "border-danger"}`}
                                                            name="email"
                                                            id="email"
                                                            placeholder="name@example.com"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.email}
                                                            required
                                                        />
                                                        {
                                                            (errors.email && touched.email) ?
                                                                <label htmlFor="email" className="form-label text-danger">{errors.email}</label> :
                                                                <label htmlFor="email" className="form-label">Email</label>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="password"
                                                            className={`form-control border-0 border-bottom rounded-0 ${((errors.password && touched.password)) && 'border-danger'}`}
                                                            name="password"
                                                            id="password"
                                                            placeholder="Password"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.password}
                                                            required
                                                        />
                                                        {
                                                            (errors.password && touched.password) ?
                                                                <label htmlFor="password" className="form-label text-danger">{errors.password}</label> :
                                                                <label htmlFor="password" className="form-label">Password</label>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="row justify-content-between">
                                                        <div className="col-6">
                                                            {/* <div className="form-check">
                                                                <input className="form-check-input" type="checkbox" name="remember_me" id="remember_me" />
                                                                <label className="form-check-label text-secondary" htmlFor="remember_me">
                                                                    Remember me
                                                                </label>
                                                            </div> */}
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="text-end">
                                                                <a href="#!" className="link-secondary text-decoration-none">Forgot password?</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="d-grid">
                                                        <button
                                                            disabled={isSubmitting}
                                                            className="btn btn-lg btn-dark rounded-0 fs-6"
                                                            type="submit"
                                                        >
                                                            Log in
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    }


                                </Formik>
                            </div>
                            <div className="col-12 col-lg-2 d-flex align-items-center justify-content-center gap-3 flex-lg-column">
                                <div className="bg-dark h-100 d-none d-lg-block style1"></div>
                                <div className="bg-dark w-100 d-lg-none style1"></div>
                                <div>or</div>
                                <div className="bg-dark h-100 d-none d-lg-block style1"></div>
                                <div className="bg-dark w-100 d-lg-none style1"></div>
                            </div>
                            <div className="col-12 col-lg-5 d-flex align-items-center">
                                <div className="d-flex gap-3 flex-column w-100 ">
                                    <a className="btn bsb-btn-2xl btn-outline-dark rounded-0 d-flex align-items-center" onClick={() => signIn('google')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google text-danger" viewBox="0 0 16 16">
                                            <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                                        </svg>
                                        <span className="ms-2 fs-6 flex-grow-1">Continue with Google</span>
                                    </a>
                                    <a className="btn bsb-btn-2xl btn-outline-dark rounded-0 d-flex align-items-center" onClick={() => signIn('github')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" x="0px" y="0px" viewBox="0 0 30 30">
                                            <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                                        </svg>
                                        <span className="ms-2 fs-6 flex-grow-1">Continue with Git Hub</span>
                                    </a>
                                    <a className="btn bsb-btn-2xl btn-outline-dark rounded-0 d-flex align-items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-facebook text-primary" viewBox="0 0 16 16">
                                            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                                        </svg>
                                        <span className="ms-2 fs-6 flex-grow-1">Continue with Facebook</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>)
}