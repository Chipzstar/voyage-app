import * as Yup from 'yup';

export const signupSchema1 = Yup.object({
	firstname: Yup.string().required("First name is required"),
	lastname: Yup.string().required("Last name is required"),
	company: Yup.string().required("Company name is required"),
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


/*export const signupSchema1 = z
	.object({
		firstname: z.string({
			required_error: 'First name is required',
		}),
		lastname: z.string({
			required_error: 'Last name is required'
		}),
		company: z.string({
			required_error: 'Company name is required'
		}),
		phone: z.string({
			required_error: 'Phone is required'
		}),
		crn: z.number({
			required_error: 'Company number is required'
		}),
		jobTitle: z.string({
			required_error: 'Job title is required'
		}),
		email: z
			.string({
				required_error: 'Email is required'
			})
			.email(),
		website: z.string().url('Website must be a valid URL').nullable().optional(),
		password: z.string({
			required_error: 'Password is required'
		}),
		confirmPassword: z.string()
	})
	.refine(data => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirm'] // path of error
	});

export const signupSchema2 = z.object({
	line1: z.string({ required_error: 'First name is required' }),
	line2: z.string().optional(),
	city: z.string({ required_error: 'City is required' }),
	region: z.string({
		required_error: 'Region is required'
	}),
	postcode: z.string({
		required_error: 'Postcode is required'
	}),
	country: z.string({
		required_error: 'Country is required'
	})
});*/
