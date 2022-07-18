import React, { useCallback } from 'react';
import { useForm } from '@mantine/form';
import { Text, TextInput, PasswordInput, Button } from '@mantine/core';
import { Mail, Lock } from 'tabler-icons-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { users, PATHS } from '../utils/constants';
import { useRouter } from 'next/router';

const login = () => {
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	const form = useForm({
		initialValues: {
			email: '',
			password: ''
		},
		validate: (values) => ({
			email: !users.find(item => item.email === values.email) ? 'No user found with that email address' : null,
			password: values.password !== 'admin' ? 'Wrong password' : null
		})
	});

	const handleSubmit = useCallback((values) => {
		// login
		// @ts-ignore
		router.push(PATHS.HOME);
	}, [form.values]);

	return (
		<div className='flex flex-row'>
			<div className='flex'>
				<img src='/static/images/login-wallpaper.svg' alt='' className='object-cover h-screen' />
			</div>
			<div className='grow flex my-auto justify-center'>
				<form onSubmit={form.onSubmit(handleSubmit)} action='' className='flex flex-col space-y-8 w-196'>
					<figure className='flex flex-row justify-center space-x-4 items-center'>
						<img src={'/static/images/favicon.svg'} alt='' />
						<span className='text-2xl font-bold mb-1'>voyage</span>
					</figure>
					<div>
						<TextInput
							placeholder='Email'
							icon={<Mail size={16} />}
							radius={0}
							size='md'
							{...form.getInputProps('email')}
						/>
					</div>
					<div>
						<PasswordInput
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

export default login;
