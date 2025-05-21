"use client"
import { Field, Formik } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useReducer, useState } from 'react';
import Select from 'react-select';
import { Axios } from '../../../../utils/axios/service';
import { ROUTE } from '../../../../utils/axios/routes';
import { API_RESPONSE } from '../../../api/general/interface';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function ContactDetails(prop) {
    const [profile, setProfile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [contact, setContact] = useState({
        name: "",
        phone_number: "",
        status: "active",
        image: ""
    })
    const statusFileds = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
    ]
    const params = useParams();
    const routes = useRouter()


    const submit = useCallback(async (form) => {
        const url = params?.id ? ROUTE.CONTACTS.UPDATE + '/' + params?.id : ROUTE.CONTACTS.CREATE;
        const method = params?.id ? 'put' : 'post'
        const saveContact = new Promise((resolve, reject) => {
            Axios[method](
                url,
                form,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            ).then((response: API_RESPONSE) => {
                if (response.settings.success) {
                    toast.success(response.settings.message);
                    routes.push('/contacts/' + response.data.id)
                    resolve(1)
                } else {
                    toast.error(response.settings.message)
                    reject(0)
                }
            })
        });

        toast.promise(
            saveContact,
            {
                pending: 'Please wait.',
                error: 'Contact save failed 🤯, Please try again.'
            }
        )
    }, [])

    useEffect(() => {

        if (params.id) {
            Axios.get(ROUTE.CONTACTS.DETAILS + '/' + params.id).then((response: API_RESPONSE) => {
                if (response.settings.success) {
                    setContact(response.data);
                    setPreviewImage(response.data.image)
                } else {
                    toast.error(response.settings.message);
                }
            })
        }

    }, [])

    return <>
        <section className="vh-100 bg-image">
            <div className="mask d-flex align-items-center h-100">
                <div className="container h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                            <div className="card" >
                                <div className="card-body p-5">
                                    <h2 className="text-uppercase text-center mb-5">{params.id ? "Update Contact" : "Register Contact"}</h2>
                                    <Formik
                                        initialValues={contact}
                                        validate={(value) => {
                                            const error: any = {};
                                            if (!value.name) {
                                                error.name = "Please enter Contact Name."
                                            }
                                            if (!value.phone_number) {
                                                error.phone_number = "Please Contact Phone Number."
                                            }
                                            return error;
                                        }}
                                        onSubmit={(values, { setSubmitting }) => {
                                            setSubmitting(false);
                                            const form = new FormData();
                                            form.append("name", values.name);
                                            form.append("phone_number", values.phone_number);
                                            form.append("status", values.status);
                                            if (profile) {
                                                form.append("image", profile);
                                            }
                                            submit(form);
                                        }}

                                        // it is importent to update values depending on state or api's
                                        enableReinitialize={true}

                                    >
                                        {({
                                            values,
                                            errors,
                                            touched,
                                            handleChange,
                                            handleBlur,
                                            handleSubmit,
                                            setFieldValue,
                                            isSubmitting,
                                        }) => <form onSubmit={handleSubmit} encType="multipart/form-data">
                                                <div className="form-floating mb-3 d-flex justify-content-center">
                                                    <Image
                                                        width={150}
                                                        height={150}
                                                        onClick={() => document.getElementById('profile_input').click()}
                                                        src={previewImage || "https://img.icons8.com/bubbles/150/000000/user.png"}
                                                        className="img-radius"
                                                        alt="{user.first_name} {user.last_name"
                                                    />
                                                    <Field
                                                        className="d-none"
                                                        type="file"
                                                        name="profile"
                                                        id="profile_input"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            setProfile(e.target.files[0])
                                                            setPreviewImage(URL.createObjectURL(e.target.files[0]));
                                                        }}
                                                        onBlur={handleBlur}
                                                    >
                                                    </Field>

                                                </div>

                                                <div className="form-floating mb-3">
                                                    <Field
                                                        type="text"
                                                        className={`form-control ${(touched.name && !values.name) ? 'border-danger' : ''}`}
                                                        id="name"
                                                        placeholder="Contact Name"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.name}
                                                    />
                                                    {(touched.name && !values.name) ?
                                                        <label htmlFor="name" className="text-danger">{errors.name}</label> :
                                                        <label htmlFor="name">Contact Name</label>
                                                    }
                                                </div>

                                                <div className="form-floating mb-3">
                                                    <Field
                                                        type="number"
                                                        className={`form-control ${(touched.phone_number && !values.phone_number) ? 'border-danger' : ''}`}
                                                        id="phone_number"
                                                        placeholder="Phone Number"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.phone_number}
                                                    />
                                                    {(touched.phone_number && !values.phone_number) ?
                                                        <label htmlFor="phone_number" className="text-danger">{errors.phone_number}</label> :
                                                        <label htmlFor="phone_number">Phone Number</label>
                                                    }
                                                </div>

                                                <div className="mb-3">
                                                    <Select
                                                        className="h-50"
                                                        classNamePrefix="select"
                                                        name="color"
                                                        value={values.status == "active" ? statusFileds[0] : statusFileds[1]}
                                                        defaultValue={statusFileds[0]}
                                                        options={statusFileds}
                                                        onChange={(e) => setFieldValue('status', e.value)}
                                                        onBlur={handleBlur}
                                                    />
                                                </div>

                                                <div className="d-flex justify-content-center">
                                                    <Link href="/contacts" className="btn btn-secondary btn-block me-2"> Back</Link>
                                                    <button type="submit" className="btn btn-success btn-block">{params.id ? "Update" : "Register"}</button>
                                                </div>

                                            </form>}

                                    </Formik>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
}