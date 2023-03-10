import React, { useState } from 'react';
import { Button, Loader, Modal, Select } from '@mantine/core';
import { ChevronDown } from 'tabler-icons-react';
import { Driver, Member, TeamRole } from '../utils/types';
import { SelectInputData } from '@voyage-app/shared-types';
import { useForm } from '@mantine/form';

const AssignDriverModal = ({ opened, onClose, onSubmit, drivers, team, title = 'Assign Personnel' }) => {
	const [loading, setLoading] = useState(false);
	const form = useForm({
		initialValues: {
			controllerId: '',
			driverId: ''
		},
		validate: values => ({
			controllerId: !values.controllerId ? 'Please select a controller' : null,
			driverId: !values.driverId ? 'Please select a driver' : null
		})
	});
	return (
		<Modal
			size="lg"
			opened={opened}
			onClose={onClose}
			title={title}
			classNames={{
				title: 'font-semibold text-xl'
			}}
			padding="lg"
		>
			<form onSubmit={form.onSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-8 gap-x-12">
				<div className='flex flex-row items-center'>
					<Select
						classNames={{
							root: 'w-full'
						}}
						required
						size='md'
						radius={0}
						label='Select driver'
						rightSection={<ChevronDown size={14} />}
						rightSectionWidth={30}
						styles={{ rightSection: { pointerEvents: 'none' } }}
						data={drivers.map(
							(driver: Driver): SelectInputData => ({
								label: driver.fullName,
								value: driver.id
							})
						)}
						{...form.getInputProps('driverId')}
					/>
				</div>
				<div className='flex flex-row items-center'>
					<Select
						classNames={{
							root: 'w-full'
						}}
						required
						size='md'
						radius={0}
						label='Select controller'
						rightSection={<ChevronDown size={14} />}
						rightSectionWidth={30}
						styles={{ rightSection: { pointerEvents: 'none' } }}
						data={team
							.filter(item => item.role === TeamRole.CONTROLLER)
							.map(
								(member: Member): SelectInputData => ({
									label: member.fullName,
									value: member.id
								})
							)}
						{...form.getInputProps('controllerId')}
					/>
				</div>
				<div className="lg:col-span-2 flex justify-end space-x-4">
					<Button
						variant="subtle"
						type='button'
						color="gray"
						onClick={onClose}
					>
						<span>Cancel</span>
					</Button>
					<Button
						type='submit'
						classNames={{
							root: `bg-secondary hover:bg-secondary-600`
						}}
					>
						<Loader size='sm' className={`mr-3 ${!loading && 'hidden'}`} />
						<span>Confirm</span>
					</Button>
				</div>
			</form>
		</Modal>
	);
};

AssignDriverModal.propTypes = {};

export default AssignDriverModal;
