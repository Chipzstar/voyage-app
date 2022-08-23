import * as Yup from 'yup';

export const signupSchema1 = Yup.object({
	firstname: Yup.string().required("First name is required"),
	lastname: Yup.string().required("Last name is required"),
	companyName: Yup.string().required("Company name is required"),
	phone: Yup.string().required("Phone is required"),
	crn: Yup.number().required("Company number is required"),
	jobTitle: Yup.string().required("Job title is required"),
	email: Yup.string().email().required("Email is required"),
	website: Yup.string().url("Website must be a valid URL").nullable(),
	password: Yup.string().required('Password is required'),
	confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
});

export const signupSchema2 = Yup.object({
	line1: Yup.string().required("First name is required"),
	line2: Yup.string(),
	city: Yup.string().required("City is required"),
	region: Yup.string().required("Region is required"),
	postcode: Yup.string().required("Postcode is required"),
	country: Yup.string().required("Country is required"),
});
