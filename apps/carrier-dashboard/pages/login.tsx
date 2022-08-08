import React, { useCallback, useState } from 'react';
import { useForm } from '@mantine/form';
import { Alert, Button, Modal, Text, TextInput } from '@mantine/core';
import { AlertCircle, Mail } from 'tabler-icons-react';
import { useRouter } from 'next/router';
import { getCsrfToken, signIn } from 'next-auth/react';
import prisma from '../db';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { PATHS } from '../utils/constants';
import moment from 'moment/moment';

const VerifyEmailAlert = ({ email, onClose }) => {
	console.log("EMAIL:", email)
	return (
		<Modal opened={!!email} onClose={onClose} centered padding={0} withCloseButton={false}>
			<Alert icon={<AlertCircle size={25} />} title='Verify your email!' color='green' radius='md' variant='outline' classNames={{
				title: 'text-lg',
				icon: 'mt-1'
			}}>
				<Text>Email sent to {email}. Please check your email to complete verification</Text>
			</Alert>
		</Modal>
	);
};

const login = ({ csrfToken, ...props }) => {
	const [verifyEmail, showEmailVerification] = useState("");
	const router = useRouter();
	const form = useForm({
		initialValues: {
			email: ''
		},
		validate: values => ({
			email: !props.users.find(item => item.email === values.email) ? 'No user found with that email address' : null
		})
	});

	const handleSignIn = useCallback(async values => {
		try {
			const { ok, error } = await signIn('email', {
				email: values.email,
				redirect: false
			});
			if (ok) {
				console.log('Login Success');
				showEmailVerification(values.email);
				// await router.replace('/');
				return;
			}
			// Something went wrong
			if (error) {
				return null;
			}
		} catch (error) {
			// handle error here (eg. display message to user)
			console.log(error.error);
		}
	}, []);

	// @ts-ignore
	return (
		<div className='flex flex-row'>
			<VerifyEmailAlert email={verifyEmail} onClose={() => showEmailVerification("")} />
			<div className='flex'>
				<img src='/static/images/login-wallpaper.svg' alt='' className='object-cover h-screen' />
			</div>
			<div className='grow flex my-auto justify-center'>
				<form onSubmit={form.onSubmit(handleSignIn)} action='' className='flex flex-col space-y-8 w-196'>
					<figure className='flex flex-row justify-center space-x-4 items-center'>
						<img src={'/static/images/favicon.svg'} alt='' />
						<span className='text-2xl font-bold mb-1'>voyage</span>
					</figure>
					<div>
						<TextInput
							name='csrfToken'
							//@ts-ignore
							type='hidden'
							defaultValue={csrfToken}
						/>
						<TextInput name='email' placeholder='Email' icon={<Mail size={16} />} radius={0} size='md' {...form.getInputProps('email')} />
					</div>
					<div className='flex flex-col items-center space-y-4'>
						<Button
							type='submit'
							color='dark'
							radius={0}
							size='md'
							classNames={{
								root: 'bg-black'
							}}
							className='text-normal text-white text-center w-full h-12'
						>
							<Text color='white' size='lg'>
								Log in
							</Text>
						</Button>
						<span role='button' className='text-secondary hover:underline'>
							Forgot password?
						</span>
					</div>
				</form>
			</div>
		</div>
	);
};

export async function getServerSideProps({ req, res }) {
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions);
	console.log(session);
	if (session?.user) {
		return {
			redirect: {
				destination: PATHS.HOME,
				permanent: false
			}
		};
	}
	const csrfToken = await getCsrfToken();
	const users = (await prisma.user.findMany({})).map(user => ({
		...user,
		emailVerified: moment(user.emailVerified).unix()
	}));
	console.log(users);
	return {
		props: {
			csrfToken: csrfToken ?? null,
			users
		}
	};
}

export default login;
