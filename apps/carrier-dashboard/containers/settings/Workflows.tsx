import React, { forwardRef, useCallback, useState } from 'react';
import { useForm } from '@mantine/form';
import { createSettings, updateSettings } from '../../store/feature/settingsSlice';
import { Check, X } from 'tabler-icons-react';
import { Center, Container, Stack, Group, Button, NumberInput, Popover, Text, Loader } from '@mantine/core';
import { Carrier, ChargeUnitType, Settings, ActivationStatus } from '../../utils/types';
import { defaultSettings } from '../../utils/constants';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'apps/carrier-dashboard/store';
import { notifyError, notifySuccess } from '@voyage-app/shared-utils';
import { editCarrier, updateCarrier } from '../../store/feature/profileSlice';

interface WorkflowsProps {
	carrierInfo: Carrier;
	settings: Settings;
	nextTab: () => void;
}

const Workflows = forwardRef<HTMLDivElement, WorkflowsProps>(({ carrierInfo, settings, nextTab }, ref) => {
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch<AppDispatch>();
	const initialValues: Settings = {
		id: settings?.id ?? undefined,
		carrierId: undefined,
		rateChargeRules: settings?.rateChargeRules ?? defaultSettings.rateChargeRules
	};
	const form = useForm({
		initialValues
	});

	const handleSubmit = useCallback(
		async values => {
			setLoading(true);
			try {
				if (settings?.id) {
					await dispatch(updateSettings(values)).unwrap();
					notifySuccess('update-settings-success', 'Quote settings saved!', <Check size={20} />);
					setLoading(false);
				} else {
					await dispatch(createSettings(values)).unwrap();
					notifySuccess('create-settings-success', 'Quote settings saved!', <Check size={20} />);
					carrierInfo.status === ActivationStatus.WORKFLOWS && nextTab();
					setLoading(false);
				}
				if (carrierInfo.status === ActivationStatus.WORKFLOWS) {
					dispatch(updateCarrier({ ...carrierInfo, status: ActivationStatus.BANK_ACCOUNT })).unwrap().then(() => nextTab());
				}
			} catch (err) {
				notifyError('create-settings-failure', `There was a problem updating your settings ${err.message}`, <X size={20} />);
				setLoading(false);
			}
		},
		[settings, carrierInfo]
	);

	return (
		<Container ref={ref} fluid className='tab-container bg-voyage-background'>
			<Center className='flex h-full flex-col'>
				<section className='border-voyage-grey flex h-full flex-col items-center justify-center space-y-2'>
					<header className='page-header my-6'>Quote Settings</header>
					<section className='w-128 text-center text-sm'>
						<p className='text-gray-600'>
							When booking loads, we calculate the final rate based on <strong>distance</strong>, <strong>package quantity</strong> and <strong>package weight</strong>. Here you can adjust how much each variable contributes to
							the final rate
						</p>
					</section>
					<form onSubmit={form.onSubmit(handleSubmit)}>
						<Stack py='lg'>
							<Group position='center'>
								<Text className='w-32'>Charge per mile</Text>
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
								<Text className='w-32'>Charge per pallet</Text>
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
								<Text className='w-32'>Charge per Kg</Text>
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
							<Popover opened={carrierInfo.status !== ActivationStatus.COMPLETE} transition='fade' transitionDuration={500} position='bottom' withArrow shadow='md'>
								<Popover.Target>
									<Button type='submit' size='md' className='bg-secondary hover:bg-secondary-600'>
										<Loader size='sm' className={`mr-3 ${!loading && 'hidden'}`} />
										<span>Save Changes</span>
									</Button>
								</Popover.Target>
								<Popover.Dropdown>
									<Text size='sm'>Click "Save Changes" to continue</Text>
								</Popover.Dropdown>
							</Popover>
						</Stack>
					</form>
				</section>
			</Center>
		</Container>
	);
});

export default Workflows;
