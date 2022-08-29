import React, { useCallback, useState } from 'react';
import { useForm } from '@mantine/form';
import { Alert, Button, Loader, Modal, PasswordInput, Text, TextInput } from '@mantine/core';
import { AlertCircle, Lock, Mail } from 'tabler-icons-react';
import { useRouter } from 'next/router';
import { getCsrfToken, signIn } from 'next-auth/react';
import prisma from '../db';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { PATHS } from '../utils/constants';
import moment from 'moment/moment';

const VerifyEmailAlert = ({ email, onClose }) => {
	return (
		<Modal opened={!!email} onClose={onClose} centered padding={0} withCloseButton={false}>
			<Alert
				icon={<AlertCircle size={25} />}
				title='Verify your email!'
				color='green'
				variant='outline'
				classNames={{
					title: 'text-lg',
					icon: 'mt-1'
				}}
			>
				<Text>Email sent to {email}. Please check your email to complete verification</Text>
			</Alert>
		</Modal>
	);
};

const login = ({ csrfToken, ...props }) => {
	const [loading, setLoading] = useState(false);
	const [verifyEmail, showEmailVerification] = useState('');
	const router = useRouter();

	const form = useForm({
		initialValues: {
			email: '',
			password: ''
		},
		validate: values => ({
			email: !props.users.find(item => item.email === values.email) ? 'No user found with that email address' : null,
			password: !props.users.find(item => item.password === values.password && item.email === values.email) ? 'Wrong password' : null
		})
	});

	const handleSignIn = useCallback(async values => {
		try {
			setLoading(true);
			const { ok, error } = await signIn('credentials', {
				email: values.email,
				password: values.password,
				redirect: false
			});
			if (ok) {
				console.log('Login Success');
				await router.replace('/');
				return;
			}
			// Something went wrong
			if (error) {
				return null;
			}
			setLoading(false);
		} catch (error) {
			setLoading(false);
			// handle error here (eg. display message to user)
			console.log(error.error);
		}
	}, []);

	// @ts-ignore
	return (
		<div className='flex flex-row'>
			<VerifyEmailAlert email={verifyEmail} onClose={() => showEmailVerification('')} />
			<div className='flex'>
				<img src='/static/images/login-wallpaper.svg' alt='' className='h-screen object-cover' />
			</div>
			<div className='my-auto flex grow justify-center'>
				<form onSubmit={form.onSubmit(handleSignIn)} action='' className='w-196 flex flex-col space-y-8'>
					<figure className='flex flex-row items-center justify-center space-x-2'>
						<img src={'/static/images/logo.svg'} alt='' />
						<span className='mb-1 text-2xl font-bold'>voyage</span>
					</figure>
					{/*<Group grow mb='md' mt='md'>
						<Button leftIcon={<GoogleIcon />} variant='default' color='gray' onClick={() => signIn('google')}>
							Google
						</Button>
						<Button disabled={process.env.NODE_ENV === 'development'} component='a' leftIcon={<TwitterIcon size={16} color='#00ACEE' />} variant='default' onClick={() => signIn('twitter')}>
							Twitter
						</Button>
					</Group>
					<Divider label='Or continue with email' labelPosition='center' my='lg' />*/}
					<div>
						<TextInput
							name='csrfToken'
							//@ts-ignore
							type='hidden'
							defaultValue={csrfToken}
						/>
						<TextInput name='email' placeholder='Email' icon={<Mail size={16} />} radius={0} size='md' {...form.getInputProps('email')} />
					</div>
					<div>
						<PasswordInput name='password' placeholder='Password' icon={<Lock size={16} />} radius={0} size='md' {...form.getInputProps('password')} />
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
							className='text-normal h-12 w-full text-center text-white'
						>
							{loading && <Loader size='xs' className='mr-2' />}
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
	const users = await prisma.user.findMany({
		select: {
			email: true,
			password: true
		}
	});
	console.log(users);
	return {
		props: {
			csrfToken: csrfToken ?? null,
			users
		}
	};
}

export default login;
