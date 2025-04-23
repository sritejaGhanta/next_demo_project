"use client"
import { Formik } from 'formik'
import './change-pass.css'
import { useCallback, useReducer } from 'react';
import { Axios } from '../../../utils/axios/service';
import { ROUTE } from '../../../utils/axios/routes';
import { useDispatch } from 'react-redux';
import { API_RESPONSE } from '../../../utils/general/interface';
import { sEmmitNotification } from '../../../lib/slice';

export default function PasswordChange() {
    const dispatch = useDispatch()
    const staticPass = {
        pass: false,
        n_pass: false,
        c_pass: false
    }
    let checkType = useCallback((state, action) => {
        switch (action) {
            case 'pass':
                return { ...state, pass: !state.pass };
            case 'n-pass':
                return { ...state, n_pass: !state.n_pass };
            case 'c-pass':
                return { ...state, c_pass: !state.c_pass };
            default:
                return state;
        }
    }, []);
    let [pass, setPass] = useReducer(checkType, staticPass);
    const submite = useCallback((values:any, resetForm:any) => {
        Axios.post(ROUTE.USER.CHANGE_PASSWORD, values).then((res: API_RESPONSE) => {
            dispatch(sEmmitNotification(res.settings))
            if(res.settings.success){
                resetForm();
            }
        })
    }, [])

    return <>
        <div className="password-container">
            <h3 className="text-center mb-4">Change Password</h3>
            <Formik
                initialValues={{
                    password: '',
                    new_password: '',
                    confirm_password: '',
                }}
                validate={(values) => {
                    const errors: any = {};
                    if (!values.password) {
                        errors.password = 'Enter a valid password.';
                    }
                    if (!values.new_password) {
                        errors.new_password = 'Enter a valid new password.';
                    }
                    if (!values.confirm_password) {
                        errors.confirm_password = 'Enter a confirm password.';
                    } else if (values.confirm_password !== values.new_password) {
                        errors.confirm_password = 'Password and Confirm password must be the same.';
                    }
                    return errors;
                }}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    setSubmitting(false);
                    submite(values, resetForm);
                }}
                enableReinitialize={true}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    handleReset,
                    resetForm
                }) =>
                    <form id="passwordForm" onSubmit={handleSubmit}>
                        <div className="form-floating mb-3 position-relative">
                            <input
                                type={pass.pass ? 'text' : 'password'}
                                className={`form-control ${touched.password && errors.password && "border-danger"}`}
                                id="currentPassword"
                                placeholder="Current Password"
                                name="password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                                required
                            />
                            <i className="bi bi-eye-fill toggle-password" onClick={() => setPass('pass')}></i>
                            {
                                touched.password && errors.password ?
                                    <label htmlFor="newPassword" className="text-danger">{errors.password}</label> :
                                    <label htmlFor="newPassword" >New Password</label>

                            }
                        </div>

                        <div className="form-floating mb-3 position-relative">
                            <input
                                type={pass.n_pass ? 'text' : 'password'}
                                className={`form-control ${touched.new_password && errors.new_password && "border-danger"}`}
                                id="newPassword"
                                placeholder="New Password"
                                name="new_password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.new_password}
                                required
                            />
                            <i className="bi bi-eye-fill toggle-password" onClick={() => setPass('n-pass')}></i>
                            {
                                touched.new_password && errors.new_password ?
                                    <label htmlFor="newPassword" className="text-danger">{errors.new_password}</label> :
                                    <label htmlFor="newPassword" >New Password</label>

                            }
                        </div>

                        <div className="form-floating mb-3 position-relative">
                            <input
                                type={pass.c_pass ? 'text' : 'password'}
                                className={`form-control ${touched.confirm_password && errors.confirm_password && "border-danger"}`}
                                id="confirmPassword"
                                placeholder="Confirm Password"
                                name="confirm_password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.confirm_password}
                                required
                            />
                            {touched.confirm_password && errors.confirm_password ?
                                <label htmlFor="confirmPassword" className="text-danger">{errors.confirm_password}</label> :
                                <label htmlFor="confirmPassword">Confirm Password</label>
                            }
                            <i className="bi bi-eye-fill toggle-password" onClick={() => setPass('c-pass')}></i>
                        </div>

                        <button type="submit" className="btn btn-primary w-100">
                            Update Password
                        </button>
                    </form>
                }
            </Formik>

        </div>
    </>
}