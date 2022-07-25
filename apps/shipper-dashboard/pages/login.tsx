import {InferGetServerSidePropsType} from 'next';
import React, {useCallback} from 'react';
import {useForm} from '@mantine/form';
import {Button, PasswordInput, Text, TextInput} from '@mantine/core';
import {Lock, Mail} from 'tabler-icons-react';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../store';
import {PATHS} from '../utils/constants';
import {useRouter} from 'next/router';
import {getCsrfToken, getSession, signIn} from 'next-auth/react';
import prisma from '../db';

const login = ({ csrfToken, ...props }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	const form = useForm({
		initialValues: {
			email: '',
			password: ''
		},
		validate: (values) => ({
			email: !props.users.find(item => item.email === values.email) ? 'No user found with that email address' : null,
			password: !props.users.find(item => item.password === values.password && item.email === values.email) ? 'Wrong password' : null
		})
	});

	const handleSignIn = useCallback(async (values) => {
		try {
			const { ok, error } = await signIn('credentials', {
				email: values.email,
				password: values.password,
				redirect: false,
				callbackUrl: PATHS.HOME,
			});
			if (ok) {
				console.log("Login Success")
				await router.replace('/');
				return;
			}
			// Something went wrong
			if (error) {
				return null;
			}
		} catch(error) {
			// handle error here (eg. display message to user)
			console.log(error.error)
		}
	}, []);

	// @ts-ignore
	return (
		<div className='flex flex-row'>
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
							name="csrfToken"
							//@ts-ignore
							type="hidden"
							defaultValue={csrfToken}
						/>
						<TextInput
							name="email"
							placeholder='Email'
							icon={<Mail size={16} />}
							radius={0}
							size='md'
							{...form.getInputProps('email')}
						/>
					</div>
					<div>
						<PasswordInput
							name="password"
							placeholder='Password'
							icon={<Lock size={16} />}
							radius={0}
							size='md'
							{...form.getInputProps('password')}
						/>
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
							<Text color='white' size='lg'>Log in</Text>
						</Button>
						<span role='button' className='text-secondary hover:underline'>Forgot password?</span>
					</div>
				</form>
			</div>
		</div>
	);
};

export async function getServerSideProps(context) {
	const session = await getSession({req: context.req});
	if (session?.user){
		return {
			redirect: {
				destination: PATHS.HOME,
                permanent: false,
			}
		}
	}
	const csrfToken = await getCsrfToken();
	const users = await prisma.user.findMany({})
	console.log("USERS:", users)
	return {
		props: {
			csrfToken: csrfToken ?? null,
			users
		},
	};
}

export default login;
