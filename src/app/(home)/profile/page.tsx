"use client"
import { Field, Formik, useField } from "formik";
import "./profile.css";
import store from "../../../lib/store"
import React, { useCallback, useEffect, useState } from "react";
import { Axios } from "../../../utils/axios/service";
import { ROUTE } from "../../../utils/axios/routes";
import { API_RESPONSE } from "@utils/general/interface";
import { useDispatch } from "react-redux";
import { sSetUser } from "@lib/slice";
import { sEmmitNotification } from "../../../lib/slice";

export default function Profile() {
	const dispatch = useDispatch()
	const [profileImage, setProfile] = useState()
	const [previewImage, setPreviewImage] = useState(null);

	const [user, setUser] = useState({
		first_name: "",
		last_name: "",
		email: "",
		phone_number: "",
		gender: "",
		profile: "",
		...store.getState()?.user?.payload
	})

	store.subscribe(() => {
		setUser(store.getState()?.user?.payload)
	})

	useEffect(() => {
		setPreviewImage(user.profile || "https://img.icons8.com/bubbles/150/000000/user.png")
	}, [user])

	const subite = useCallback((value) => {
		Axios.put(
			ROUTE.USER.UPDATE_PROFILE,
			value,
			{
				headers: { 'Content-Type': 'multipart/form-data' }
			}
		).then((response: API_RESPONSE) => {
			dispatch(sSetUser(response.data))
			dispatch(sEmmitNotification(response.settings));
			setUser(response.data)
		})
	}, [])

	return (
		<>
			<div className="page-content page-container" id="page-content">
				<div className="padding d-flex justify-content-center align-items-center">
					<div className="row container d-flex justify-content-center">
						<div className="col-xl-12 col-md-12">
							<div className="card user-card-full">
								<div className="row m-l-0 m-r-0">
									<div className="col-sm-12 bg-c-lite-green user-profile">
										<div className="card-block text-center text-white">
											<div className="m-b-25">
												<img
													width={150}
													height={150}
													onClick={() => document.getElementById('profile_input').click()}
													src={previewImage}
													className="img-radius"
													alt="User-Profile-Image"
												/>
											</div>
											<div>
												<h6 className="fs-1">{user.first_name} {user.last_name}</h6>
												{/* <p>Web Designer</p> */}
											</div>
										</div>
									</div>
									<div className="col-sm-12">
										<div className="card-block">
											<Formik
												initialValues={{
													first_name: user.first_name,
													last_name: user.last_name,
													email: user.email,
													phone_number: user.phone_number,
													gender: user.gender,
													profile: "",
												}}

												// it is importent to update values depending on state or api's
												enableReinitialize={true}

												validate={(val) => {
													const error: any = {};
													if (!val.email) {
														error.email = "Please enter valid email.";
													} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(val.email)) {
														error.email = "Please enter valid Email address"
													}

													if (!val.phone_number) {
														error.phone_number = "Please enter Phone number"
													}

													if (!val.first_name) {
														error.first_name = "Please enter First Name"
													}

													if (!val.last_name) {
														error.last_name = "Please enter Last Name"
													}

													return error;
												}}
												onSubmit={(values, { setSubmitting }) => {
													setSubmitting(false);
													const form = new FormData();
													form.append("first_name", values.first_name);
													form.append("last_name", values.last_name);
													form.append("email", values.email);
													form.append("phone_number", values.phone_number);
													form.append("gender", values.gender);
													if (profileImage) {
														form.append("profile", profileImage);
													}
													subite(form);
												}}
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
												}) =>
													<form onSubmit={handleSubmit} encType="multipart/form-data">
														<h6 className="m-b-20 p-b-5 b-b-default f-w-600">
															Information
														</h6>
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
														<div className="row">
															<div className="col-sm-6">
																<div className="form-floating mb-3">
																	<input
																		type="text"
																		className={`form-control ${(touched.first_name && !values.first_name) ? 'border-danger' : ''}`}
																		id="first_name"
																		placeholder="First Name"
																		onChange={handleChange}
																		onBlur={handleBlur}
																		value={values.first_name}
																	/>
																	{(touched.first_name && !values.first_name) ?
																		<label htmlFor="first_name" className="text-danger">{errors.first_name}</label> :
																		<label htmlFor="first_name">First Name</label>
																	}
																</div>
															</div>
															<div className="col-sm-6">
																<div className="form-floating mb-3">
																	<input
																		type="text"
																		className={`form-control ${(touched.last_name && !values.last_name) ? 'border-danger' : ''}`}
																		id="last_name"
																		placeholder="First Name"
																		onChange={handleChange}
																		onBlur={handleBlur}
																		value={values.last_name}
																	/>
																	{(touched.last_name && !values.last_name) ?
																		<label htmlFor="last_name" className="text-danger">{errors.last_name}</label> :
																		<label htmlFor="last_name">Last Name</label>
																	}
																</div>
															</div>
															<div className="col-sm-6">
																<div className="form-floating mb-3">
																	<input
																		type="email"
																		className={`form-control ${(touched.email && !values.email) ? 'border-danger' : ''}`}
																		id="email"
																		placeholder="Email address"
																		onChange={handleChange}
																		onBlur={handleBlur}
																		value={values.email}
																		readOnly
																	/>
																	{(touched.email && !values.email) ?
																		<label htmlFor="email" className="text-danger">{errors.email}</label> :
																		<label htmlFor="email">Email address</label>
																	}
																</div>
															</div>
															<div className="col-sm-6">
																<div className="form-floating mb-3">
																	<input
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
															</div>
															<div className="mb-4">

																<h6 className="mb-2 pb-1">Gender: </h6>
																<div className="form-check form-check-inline">
																	<input
																		onChange={() => values.gender = "Male"}
																		className="form-check-input"
																		type="radio"
																		name="gender"
																		id="maleGender"
																		checked={values.gender == "Male"}
																	/>
																	<label className="form-check-label" htmlFor="maleGender">Male</label>
																</div>
																<div className="form-check form-check-inline">
																	<input
																		onChange={() => values.gender = "Female"}
																		className="form-check-input"
																		type="radio"
																		name="gender"
																		id="femaleGender"
																		checked={values.gender == "Female"}
																	/>
																	<label className="form-check-label" htmlFor="femaleGender">Female</label>
																</div>
																<div className="form-check form-check-inline">
																	<input
																		onChange={() => values.gender = "Other"}
																		className="form-check-input"
																		type="radio"
																		name="gender"
																		id="otherGender"
																		checked={values.gender == "Other"}

																	/>
																	<label className="form-check-label" htmlFor="otherGender">Other</label>
																</div>{ values.gender}

															</div>


														</div>
														<div className="d-flex justify-content-center w-100">
															<button className="btn btn-primary" id="submite-btn" >
																Update
															</button>
														</div>
													</form>
												}
											</Formik>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
