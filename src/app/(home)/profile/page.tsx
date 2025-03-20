"use client"
import { Formik } from "formik";
import "./profile.css";

export default function Profile() {
	const subite = (value) => {

	}
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
													src="https://img.icons8.com/bubbles/150/000000/user.png"
													className="img-radius"
													alt="User-Profile-Image"
												/>
											</div>
											<div>
												<h6 className="fs-1">Hembo Tingor</h6>
												<p>Web Designer</p>
											</div>
										</div>
									</div>
									<div className="col-sm-12">
										<div className="card-block">
											<Formik
												initialValues={{
													first_name: "",
													last_name: "",
													email: "",
													phone_number: "",
													gender: "male",
												}}
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
													subite(values);
												}}
											>
												{({ values,
													errors,
													touched,
													handleChange,
													handleBlur,
													handleSubmit,
													isSubmitting,

												}) =>
													<form onSubmit={handleSubmit}>
														<h6 className="m-b-20 p-b-5 b-b-default f-w-600">
															Information
														</h6>
														<div className="row">
															<div className="col-sm-6">
																<div className="form-floating mb-3">
																	<input
																		type="text"
																		className={`form-control ${(touched.first_name && !values.first_name) ? 'border-danger': ''}` }
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
																		className={`form-control ${(touched.last_name && !values.last_name) ? 'border-danger': ''}` }
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
																		className={`form-control ${(touched.email && !values.email) ? 'border-danger': ''}` }
																		id="email"
																		placeholder="Email address"
																		onChange={handleChange}
																		onBlur={handleBlur}
																		value={values.email}
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
																		className={`form-control ${(touched.phone_number && !values.phone_number) ? 'border-danger': ''}` }
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
														</div>
														<div className="d-flex justify-content-center w-100">
															<button className="btn btn-primary" id="submite-btn">
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
