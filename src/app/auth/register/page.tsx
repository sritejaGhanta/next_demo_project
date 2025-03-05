"use client"
import css from './css.module.css';
import "./css.module.css";
import { Formik } from 'formik';
import Axios from "@utils/axios/service.ts"
import { ROUTE } from '../../api/routes';
import { useDispatch } from 'react-redux';
import { sEmmitNotification } from '../../../lib/slice';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function Registration(prop: any) {
    const dispatch = useDispatch();
    const submire = (value) => {
        Axios.post(ROUTE.USER.LOGIN, value).then((res) => {
            if (res.settings.success) {
                redirect('auth/login')
            }
            dispatch(sEmmitNotification(res.settings));
        })
    }
    return (<>
        <section className="vh-100 gradient-custom">
            <div className="container py-5 h-100">
                <div className="row justify-content-center align-items-center h-100">
                    <div className="col-12 col-lg-9 col-xl-7">
                        <div className={`card shadow-2-strong card-registration  ${css.style1}`}>
                            <div className="card-body p-4 p-md-5">
                                <h3 className="mb-4 pb-2 pb-md-0 mb-md-5">Registration Form</h3>
                                <Formik
                                    initialValues={{
                                        first_name: "",
                                        last_name: "",
                                        email: "",
                                        password: "",
                                        phone_number: "",
                                        gender: "male",
                                    }}
                                    validate={value => {
                                        const error: any = {};
                                        if (!value.first_name) {
                                            error.first_name = "Please Enter First Name";
                                        }

                                        if (!value.last_name) {
                                            error.last_name = "Please Enter Last Name";
                                        }

                                        if (!value.email) {
                                            error.email = "Please Enter Email";
                                        } else if (
                                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value.email)
                                        ) {
                                            error.email = 'Invalid email address.';
                                        }

                                        if (!value.password) {
                                            error.password = "Please Enter Password";
                                        }

                                        if (!value.phone_number) {
                                            error.phone_number = "Please Enter Phone Number";
                                        }

                                        return error;
                                    }}

                                    onSubmit={(values, { setSubmitting }) => {
                                        setSubmitting(false);

                                    }}
                                >
                                    {({
                                        values,
                                        errors,
                                        touched,
                                        handleChange,
                                        handleBlur,
                                        handleSubmit,
                                        isSubmitting
                                    }) =>
                                        <form className='form' onSubmit={handleSubmit}>
                                            <div className="row mb-3">
                                                <div className="form-floating  col-6">
                                                    <input
                                                        value={values.first_name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        type="text"
                                                        className={`form-control ${errors.first_name && touched.first_name && "border-danger"}`}
                                                        id="firtstName"
                                                        name="first_name"
                                                        placeholder="First Name"
                                                    />
                                                    {(errors.first_name && touched.first_name) ?
                                                        <label className="ms-2 text-danger" htmlFor="firtstName">{errors.first_name}</label> :
                                                        <label className="ms-2" htmlFor="firtstName">First Name</label>
                                                    }
                                                </div>
                                                <div className="form-floating col-6">
                                                    <input
                                                        value={values.last_name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        type="text"
                                                        className={`form-control ${(touched.last_name && errors.last_name && "border-danger")}`}
                                                        id="lastName"
                                                        name="last_name"
                                                        placeholder="Last Name"
                                                    />
                                                    {(touched.last_name && errors.last_name) ?
                                                        <label className="ms-2  text-danger" htmlFor="lastName">{errors.last_name}</label> :
                                                        <label className="ms-2" htmlFor="lastName">Last Name</label>
                                                    }
                                                </div>
                                            </div>
                                            <div className="form-floating mb-3">
                                                <input
                                                    value={values.phone_number}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur} type="text"
                                                    className={`form-control ${(touched.phone_number && errors.phone_number && "border-danger")}`}
                                                    id="phoneNumber"
                                                    name="phone_number"
                                                    placeholder="Phone Number"
                                                />
                                                {(errors.phone_number && touched.phone_number) ?
                                                    <label htmlFor="phoneNumber" className="text-danger" >{errors.phone_number}</label> :
                                                    <label htmlFor="phoneNumber">Phone Number</label>
                                                }
                                            </div>

                                            <div className="form-floating mb-3">
                                                <input
                                                    value={values.email}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    type="email"
                                                    className={`form-control ${(touched.email && errors.email && "border-danger")}`}
                                                    id="email"
                                                    name="email"
                                                    placeholder="name@example.com"
                                                />
                                                {(errors.email && touched.email) ?
                                                    <label htmlFor="email" className="text-danger">{errors.email}</label> :
                                                    <label htmlFor="email">Email address</label>
                                                }
                                            </div>

                                            <div className="form-floating  mb-3">
                                                <input
                                                    value={values.password}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    type="password"
                                                    autoComplete="current-password"
                                                    name="password"
                                                    className={`form-control ${(touched.password && errors.password && "border-danger")}`}
                                                    id="password"
                                                    placeholder="Password"
                                                />
                                                {(errors.password && touched.password) ?
                                                    <label htmlFor="password" className="text-danger">{errors.password}</label> :
                                                    <label htmlFor="password">Password</label>
                                                }
                                            </div>

                                            <div className="mb-4">

                                                <h6 className="mb-2 pb-1">Gender: </h6>
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        value={values.gender}
                                                        onChange={() => values.gender = "male"}
                                                        onBlur={handleBlur}
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="gender"
                                                        id="maleGender"
                                                        defaultChecked
                                                    />
                                                    <label className="form-check-label" htmlFor="maleGender">Male</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        value={values.gender}
                                                        onChange={() => values.gender = "female"}
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="gender"
                                                        id="femaleGender"
                                                    />
                                                    <label className="form-check-label" htmlFor="femaleGender">Female</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        value={values.gender}
                                                        onChange={() => values.gender = "other"}
                                                        onBlur={handleBlur}
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="gender"
                                                        id="otherGender"
                                                    />
                                                    <label className="form-check-label" htmlFor="otherGender">Other</label>
                                                </div>

                                            </div>

                                            <div className="mt-4 pt-2 w-100 d-flex justify-content-center">
                                                <button
                                                    className="btn btn-primary btn-lg w-50 "
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                >
                                                    Submit
                                                </button >
                                            </div>
                                            <div className="mt-1 pt-2 w-100 d-flex justify-content-center">
                                                <Link href={'login'} >Back to Sign in </Link>
                                            </div>

                                        </form>
                                    }
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>)
}