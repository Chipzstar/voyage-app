import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { createSettings, updateSettings } from '../../store/feature/settingsSlice';
import { Check, X } from 'tabler-icons-react';
import { Center, Container, Stack, Group, Button, NumberInput, Popover, Text, Loader } from '@mantine/core';
import { Carrier, ChargeUnitType, Settings, ActivationStatus } from '../../utils/types';
import { defaultSettings } from '../../utils/constants';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'apps/carrier-dashboard/store';
import { notifyError, notifySuccess } from '@voyage-app/shared-utils';
import { editCarrier } from '../../store/feature/profileSlice';
import { useInterval } from '@mantine/hooks';

interface WorkflowsProps {
	carrierInfo: Carrier;
	settings: Settings;
	nextTab: () => void;
}

const Workflows = ({ carrierInfo, settings, nextTab }: WorkflowsProps) => {
	const [opened, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const interval = useInterval(() => setOpen(true), 3000);
	const dispatch = useDispatch<AppDispatch>();
	const initialValues: Settings = {
		id: settings?.id ?? undefined,
		carrierId: undefined,
		rateChargeRules: settings?.rateChargeRules ?? defaultSettings.rateChargeRules
	};
	const form = useForm({
		initialValues
	});

	useEffect(() => {
		carrierInfo.status !== ActivationStatus.COMPLETE && interval.start();
		return interval.stop();
	}, [carrierInfo]);

	const handleSubmit = useCallback(
		values => {
			setLoading(true);
			settings?.id
				? dispatch(updateSettings(values))
						.unwrap()
						.then(() => {
							notifySuccess('update-settings-success', 'Quote settings saved!', <Check size={20} />);
							setLoading(false);
							if (carrierInfo.status === ActivationStatus.WORKFLOWS) {
								dispatch(editCarrier({ ...carrierInfo, status: ActivationStatus.BANK_ACCOUNT }));
								nextTab();
							}
						})
						.catch(err => {
							notifyError('update-settings-failure', `There was a problem saving your settings. ${err?.message}`, <X size={20} />)
							setLoading(false);
						})
				: dispatch(createSettings(values))
						.unwrap()
						.then(() => {
							notifySuccess('create-settings-success', 'Quote settings saved!', <Check size={20} />);
							carrierInfo.status === ActivationStatus.WORKFLOWS && nextTab();
							setLoading(false);
						})
						.catch(err => {
							notifyError('create-settings-failure', `There was a problem updating your settings ${err.message}`, <X size={20} />)
							setLoading(false);
						});
		},
		[settings, carrierInfo]
	);

	return (
		<Container fluid className='tab-container bg-voyage-background'>
			<Popover opened={opened} onChange={setOpen} transition='fade' transitionDuration={500} position='bottom' withArrow shadow='md'>
				<Center className='flex h-full flex-col'>
					<section className='border-voyage-grey flex h-full flex-col items-center justify-center space-y-2'>
						<header className='page-header my-6'>Quote Settings</header>
						<section className='w-128 text-center text-sm'>
							<p className='text-gray-600'>When booking loads, we calculate the final rate based on <strong>distance</strong>, <strong>package quantity</strong> and <strong>package weight</strong>. Here you can adjust how much each variable contributes to the final rate</p>
						</section>
						<form onSubmit={form.onSubmit(handleSubmit)}>
							<Stack py="lg">
								<Group position='center'>
									<Text className="w-32">Charge per mile</Text>
									<NumberInput
										disabled={!form.values.rateChargeRules[ChargeUnitType.DISTANCE].active}
										required
										size='sm'
										radius={0}
										precision={2}
										step={0.05}
										min={0}
										max={100}
										placeholder='Charge'
										{...form.getInputProps(`rateChargeRules.${ChargeUnitType.DISTANCE}.value`)}
										icon={<span className='text-voyage-grey'>£</span>}
									/>
								</Group>
								<Group position='center'>
									<Text className="w-32">Charge per pallet</Text>
									<NumberInput
										disabled={!form.values.rateChargeRules[ChargeUnitType.PACKAGE].active}
										required
										size='sm'
										radius={0}
										precision={2}
										step={0.05}
										min={0}
										max={100}
										placeholder='Charge'
										{...form.getInputProps(`rateChargeRules.${ChargeUnitType.PACKAGE}.value`)}
										icon={<span className='text-voyage-grey'>£</span>}
									/>
								</Group>

								<Group position='center'>
									<Text className="w-32">Charge per Kg</Text>
									<NumberInput
										disabled={!form.values.rateChargeRules[ChargeUnitType.WEIGHT].active}
										required
										size='sm'
										radius={0}
										precision={2}
										step={0.05}
										min={0}
										max={100}
										placeholder='Charge'
										{...form.getInputProps(`rateChargeRules.${ChargeUnitType.WEIGHT}.value`)}
										icon={<span className='text-voyage-grey'>£</span>}
									/>
								</Group>
							</Stack>
							<Stack align='center' py={20}>
								<Popover.Target>
									<Button type='submit' size='md' className='bg-secondary hover:bg-secondary-600'>
										<Loader size='sm' className={`mr-3 ${!loading && 'hidden'}`} />
										<span>Save Changes</span>
									</Button>
								</Popover.Target>
								<Popover.Dropdown>
									<Text size='sm'>Click "Save Changes" to continue</Text>
								</Popover.Dropdown>
							</Stack>
						</form>
					</section>
				</Center>
			</Popover>
		</Container>
	);
};

export default Workflows;
