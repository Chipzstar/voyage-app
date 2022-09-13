import React, { useCallback, useEffect, useState } from 'react';
import { Button, Center, Container, Group, Loader, Popover, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { editCarrier, updateCarrier } from '../../store/feature/profileSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { Check, X } from 'tabler-icons-react';
import { ActivationStatus, Carrier } from '../../utils/types';
import { notifyError, notifySuccess } from '@voyage-app/shared-utils';
import { useInterval } from '@mantine/hooks';

interface OrganisationProps {
	carrierInfo: Carrier;
	nextTab: () => void;
}

const Organisation = ({ carrierInfo, nextTab }: OrganisationProps) => {
	const [opened, setOpen] = useState(false);
	const interval = useInterval(() => setOpen(true), 3000);
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch<AppDispatch>();
	const initialValues: Carrier = {
		id: carrierInfo?.id ?? undefined,
		carrierId: carrierInfo?.carrierId ?? undefined,
		company: carrierInfo?.company ?? '',
		firstname: carrierInfo?.firstname ?? '',
		lastname: carrierInfo?.lastname ?? '',
		fullName: carrierInfo?.fullName ?? '',
		email: carrierInfo?.email ?? '',
		phone: carrierInfo?.phone ?? '',
		address: carrierInfo?.address ?? {
			line1: '',
			line2: '',
			city: '',
			region: '',
			postcode: '',
			country: 'UK'
		},
		status: carrierInfo?.status ?? ActivationStatus.COMPLETE
	};
	const form = useForm({
		initialValues
	});

	useEffect(() => {
		carrierInfo.status !== ActivationStatus.COMPLETE && interval.start();
		return () => interval.stop();
	}, [carrierInfo]);

	const handleSubmit = useCallback(
		values => {
			setLoading(true);
			// CHECK IF CARRIER SIGNUP STATUS IS NOT COMPLETE, IF IT IS NOT, change status to WORKFLOWS
			if (carrierInfo.status === ActivationStatus.COMPANY_INFO) {
				console.log('STATUS:', carrierInfo.status);
				values.status = ActivationStatus.WORKFLOWS;
			}
			dispatch(updateCarrier(values))
				.unwrap()
				.then(() => {
					notifySuccess('update-carrier-success', `Your Organisation details have been saved`, <Check size={20} />);
					setLoading(false);
					if (carrierInfo.status === ActivationStatus.COMPANY_INFO) {
						dispatch(editCarrier({ ...carrierInfo, status: ActivationStatus.WORKFLOWS }));
						nextTab();
					}
				})
				.catch(err => {
					console.error(err);
					notifyError('update-carrier-error', `There was error updating your organisation details ${err.message}`, <X size={20} />);
					setLoading(false);
				});
		},
		[carrierInfo]
	);

	return (
		<Container fluid className='tab-container bg-voyage-background'>
			<Popover opened={opened} onChange={setOpen} transition='fade' transitionDuration={500} position='bottom' withArrow shadow='md'>
				<Center className='flex h-full w-full flex-col'>
					<header className='page-header my-6'>Organisation Settings</header>
					<form onSubmit={form.onSubmit(handleSubmit)} className='w-256'>
						<Stack className='w-full grow'>
							<Group grow>
								<TextInput radius={0} label='Full Name' {...form.getInputProps('fullName')} />
								<TextInput radius={0} label='Company Name' {...form.getInputProps('company')} />
							</Group>
							<Group grow>
								<TextInput radius={0} label='Phone Number' {...form.getInputProps('phone')} />
								<TextInput radius={0} label='Email Address' {...form.getInputProps('email')} disabled />
							</Group>
							<Group grow>
								<TextInput radius={0} label='Address Line 1' {...form.getInputProps('address.line1')} />
								<TextInput radius={0} label='Address Line 2' {...form.getInputProps('address.line2')} />
							</Group>
							<Group grow>
								<TextInput radius={0} label='City' {...form.getInputProps('address.city')} />
								<TextInput radius={0} label='Postal Code' {...form.getInputProps('address.postcode')} />
							</Group>
							<Group grow>
								<TextInput radius={0} label='Region' {...form.getInputProps('address.region')} />
								<TextInput radius={0} label='Country' readOnly {...form.getInputProps('address.country')} />
							</Group>
						</Stack>
						<Group my={20} py={10}>
							<Popover.Target>
								<Button
									type='submit'
									size='md'
									classNames={{
										root: 'bg-secondary hover:bg-secondary-600'
									}}
								>
									<Loader size='sm' className={`mr-3 ${!loading && 'hidden'}`} />
									<span>Save Changes</span>
								</Button>
							</Popover.Target>
							<Popover.Dropdown>
								<Text size='sm'>Click "Save Changes" to continue</Text>
							</Popover.Dropdown>
						</Group>
					</form>
				</Center>
			</Popover>
		</Container>
	);
};

Organisation.propTypes = {};

export default Organisation;
