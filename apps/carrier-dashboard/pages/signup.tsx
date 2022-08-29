import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { PATHS } from '../utils/constants';
import { getCsrfToken } from 'next-auth/react';
import prisma from '../db';
import moment from 'moment/moment';
import React, { useEffect, useState } from 'react';
import { Box, Center, ScrollArea, Stepper, Text } from '@mantine/core';
import { Check, X } from 'tabler-icons-react';
import Step1 from '../containers/signup/Step1';
import Step2 from '../containers/signup/Step2';

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

const signup = ({users}) => {
	const [active, setActive] = useState(0);
	const nextStep = () => setActive(current => (current < 3 ? current + 1 : current));
	const prevStep = () => setActive(current => (current > 0 ? current - 1 : current));
	return (
		<div className='flex flex-row overflow-hidden'>
			<img src='/static/images/login-wallpaper.svg' alt='' className='h-screen object-cover' />
			<ScrollArea type='auto' className='h-screen flex-1 items-center grow'>
				<Stepper
					active={active}
					onStepClick={setActive}
					breakpoint='sm'
					size='sm'
					px='xl'
					classNames={{
						stepBody: 'hidden',
						steps: 'sticky top-0 z-50 bg-white mb-2 hidden',
						content: 'h-screen'
					}}
				>
					<Stepper.Step label='First step' description='Create an account' allowStepSelect={active > 0}>
						<Step1 existingUsers={users} nextStep={nextStep} />
					</Stepper.Step>
					<Stepper.Step label='Second step' description='Business Address' allowStepSelect={active > 1}>
						<Step2 nextStep={nextStep} prevStep={prevStep} />
					</Stepper.Step>
					<Stepper.Completed>Completed, click back button to get to previous step</Stepper.Completed>
				</Stepper>
			</ScrollArea>
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
				carrierId: {
					is: {
						carrierId: {}
					}
				}
			}
		})
	).map(user => ({
		...user,
		emailVerified: moment(user.emailVerified).unix()
	}));
	console.log(users)
	return {
		props: {
			csrfToken: csrfToken ?? null,
			users
		}
	};
}

export default signup;
