import React, { useCallback, useState } from 'react';
import { useForm } from '@mantine/form';
import { Button, Loader, PasswordInput, Text, TextInput } from '@mantine/core';
import { Lock, Mail, X } from 'tabler-icons-react';
import { useRouter } from 'next/router';
import { getCsrfToken, signIn } from 'next-auth/react';
import { PATHS } from '../utils/constants';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import moment from 'moment';
import prisma from '../db';
import { notifyError } from '@voyage-app/shared-utils';

const login = ({ csrfToken, ...props }) => {
	const [loading, setLoading] = useState(false);
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
			setLoading(true)
			const { ok, error } = await signIn('credentials', {
				email: values.email,
				password: values.password,
				redirect: false,
				callbackUrl: process.env.NEXT_PUBLIC_HOST
			});
			if (ok) {
				console.log('Login Success');
				await router.replace('/');
				setLoading(false)
				return;
			}
			// Something went wrong
			if (error) {
				setLoading(false)
				return null;
			}
		} catch (error) {
			notifyError('user-login-failure', error.error, <X size={20} />)
			console.log(error.error);
			setLoading(false)
		}
	}, []);

	return (
		<div className='flex flex-row'>
			<div className='flex'>
				<img src='/static/images/login-wallpaper.svg' alt='' className='h-screen object-cover' />
			</div>
			<div className='my-auto flex grow justify-center'>
				<form onSubmit={form.onSubmit(handleSignIn)} action='' className='w-196 flex flex-col space-y-8'>
					<figure className='flex flex-row items-center justify-center space-x-4'>
						<img src={'/static/images/logo.svg'} alt='' />
						<span className='mb-1 text-2xl font-bold'>voyage</span>
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
	if (session?.user) {
		return {
			redirect: {
				destination: PATHS.HOME,
				permanent: false
			}
		};
	}
	const csrfToken = await getCsrfToken();
	const users = (await prisma.user.findMany({
		where: {
			shipperId: {
				is: {
					shipperId: {}
				}
			}
		}
	})).map(user => ({
		...user,
		emailVerified: moment(user.emailVerified).unix()
	}));
	return {
		props: {
			csrfToken: csrfToken ?? null,
			users
		}
	};
}

export default login;
