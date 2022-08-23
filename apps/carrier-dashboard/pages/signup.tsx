import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { PATHS, PUBLIC_PATHS } from '../utils/constants';
import { getCsrfToken } from 'next-auth/react';
import prisma from '../db';
import moment from 'moment/moment';
import React, { useCallback, useState } from 'react';
import { Group, PasswordInput, Box, Stack, TextInput, Tooltip, Text, Center, Button, Loader, Anchor, Progress } from '@mantine/core';
import { useForm } from '@mantine/form';
import { InfoCircle, Check, X } from 'tabler-icons-react';
import Link from 'next/link';

const requirements = [
	{ re: /[0-9]/, label: 'Includes number' },
	{ re: /[a-z]/, label: 'Includes lowercase letter' },
	{ re: /[A-Z]/, label: 'Includes uppercase letter' },
	{ re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' }
];

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
	return (
		<Text color={meets ? 'teal' : 'red'} mt={5} size='sm'>
			<Center inline>
				{meets ? <Check size={14} /> : <X size={14} />}
				<Box ml={7}>{label}</Box>
			</Center>
		</Text>
	);
}

function getStrength(password: string) {
	let multiplier = password.length > 5 ? 0 : 1;

	requirements.forEach(requirement => {
		if (!requirement.re.test(password)) {
			multiplier += 1;
		}
	});

	return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

const signup = () => {
	const [opened, setOpened] = useState(false);
	const [loading, setLoading] = useState(false);
	const form = useForm({
		initialValues: {
			firstname: '',
			lastname: '',
			companyName: '',
			email: '',
			phone: '',
			crn: '',
			jobTitle: '',
			website: '',
			password: '',
			confirmPassword: ''
		}
	});
	const strength = getStrength(form.values.password);
	const checks = requirements.map((requirement, index) => <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(form.values.password)} />);

	const handleSignUp = useCallback(values => {
		alert(JSON.stringify(values));
	}, []);

	const bars = Array(4)
		.fill(0)
		.map((_, index) => (
			<Progress
				styles={{ bar: { transitionDuration: '0ms' } }}
				value={form.values.password.length > 0 && index === 0 ? 100 : strength >= ((index + 1) / 4) * 100 ? 100 : 0}
				color={strength > 80 ? 'teal' : strength > 50 ? 'yellow' : 'red'}
				key={index}
				size={4}
			/>
		));

	const valid = form.values.password.trim().length >= 6;

	return (
		<div className='flex flex-row'>
			<div className='flex'>
				<img src='/static/images/login-wallpaper.svg' alt='' className='h-screen object-cover' />
			</div>
			<div className='my-auto flex grow justify-center'>
				<form onSubmit={form.onSubmit(handleSignUp)} className='w-196 flex flex-col space-y-8'>
					<figure className='flex flex-row items-center justify-center space-x-2'>
						<img src={'/static/images/logo.svg'} alt='' />
						<span className='mb-1 text-2xl font-bold'>voyage</span>
					</figure>
					<Stack>
						<Group grow pb='xs'>
							<TextInput size='md' radius={0} placeholder='First Name' {...form.getInputProps('firstname')} />
							<TextInput size='md' radius={0} placeholder='Last Name' {...form.getInputProps('lastname')} />
						</Group>
						<Group grow pb='xs'>
							<TextInput size='md' radius={0} placeholder='Work Email' {...form.getInputProps('email')} />
							<TextInput size='md' radius={0} placeholder='Company Phone Number' {...form.getInputProps('phone')} />
						</Group>
						<Box pb='xs'>
							<TextInput size='md' radius={0} placeholder='Legal Company Name' {...form.getInputProps('companyName')} />
						</Box>
						<Box pb='xs'>
							<TextInput
								size='md'
								radius={0}
								placeholder='CRN'
								rightSection={
									<Tooltip
										multiline
										width={250}
										title='Companies House Registration Number'
										label='7 or 8-digit Company Number. Can be found at https://find-and-update.company-information.service.gov.uk/'
										position='top-end'
										withArrow
										transition='pop-bottom-right'
									>
										<Text color='dimmed' sx={{ cursor: 'help' }}>
											<Center>
												<InfoCircle size={18} />
											</Center>
										</Text>
									</Tooltip>
								}
								{...form.getInputProps('crn')}
							/>
						</Box>
						<Box pb='xs'>
							<TextInput size='md' radius={0} placeholder='Job Title / Role' {...form.getInputProps('jobTitle')} />
						</Box>
						<Box pb='xs'>
							<TextInput type='url' size='md' radius={0} placeholder='Company Website' {...form.getInputProps('website')} />
						</Box>
						<Box pb='xs'>
							<Tooltip label={valid ? 'All good!' : 'Password must include at least 6 characters'} position='bottom-start' withArrow opened={opened} color={valid ? 'teal' : undefined}>
								<PasswordInput required minLength={6} size='md' onFocus={() => setOpened(true)} onBlur={() => setOpened(false)} placeholder='Password' radius={0} {...form.getInputProps('password')} />
							</Tooltip>
						</Box>
						<Box>
							<PasswordInput required minLength={6} size='md' placeholder='Confirm Password' radius={0} {...form.getInputProps('confirmPassword')} />
						</Box>
					</Stack>
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
							<Text color='white' size='lg' weight={400}>
								Continue
							</Text>
						</Button>
						<span>
							Already have an account?&nbsp;
							<Link href={PUBLIC_PATHS.LOGIN} passHref>
								<Anchor component='a'>Login Here</Anchor>
							</Link>
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
	const users = (
		await prisma.user.findMany({
			where: {
				shipperId: {
					is: {
						shipperId: {}
					}
				}
			}
		})
	).map(user => ({
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

export default signup;
