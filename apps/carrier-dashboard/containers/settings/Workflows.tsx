import React, { useCallback } from 'react';
import { useForm } from '@mantine/form';
import { createSettings, updateSettings } from '../../store/feature/settingsSlice';
import { Check, X } from 'tabler-icons-react';
import { Center, Container, Stack, Group, Checkbox, Button, NumberInput } from '@mantine/core';
import { Carrier, ChargeUnitType, Settings, SignupStatus } from '../../utils/types';
import { defaultSettings } from '../../utils/constants';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'apps/carrier-dashboard/store';
import { notifyError, notifySuccess } from '@voyage-app/shared-utils';
import { editCarrier } from '../../store/feature/profileSlice'

interface WorkflowsProps {
	carrierInfo: Carrier;
	settings: Settings;
	nextTab: () => void;
}

const Workflows = ({ carrierInfo, settings, nextTab }: WorkflowsProps) => {
	const dispatch = useDispatch<AppDispatch>();
	const initialValues: Settings = {
		id: settings?.id ?? undefined,
		carrierId: settings?.carrierId ?? carrierInfo?.id ?? undefined,
		rateChargeRules: settings?.rateChargeRules ?? defaultSettings.rateChargeRules
	};
	const quoteConfigForm = useForm({
		initialValues
	});

	const submitQuoteSettings = useCallback(
		values => {
			settings?.id
				? dispatch(updateSettings(values))
						.unwrap()
						.then(() => {
							notifySuccess('update-settings-success', 'Quote settings saved!', <Check size={20} />);
							if (carrierInfo.status === SignupStatus.WORKFLOWS) {
								dispatch(editCarrier({...carrierInfo, status: SignupStatus.BANK_ACCOUNT }))
								nextTab();
							}
						})
						.catch(err => notifyError('update-settings-failure', `There was a problem saving your settings. ${err?.message}`, <X size={20} />))
				: dispatch(createSettings(values))
						.unwrap()
						.then(() => {
							notifySuccess('create-settings-success', 'Quote settings saved!', <Check size={20} />);
							carrierInfo.status === SignupStatus.WORKFLOWS && nextTab();
						})
						.catch(err => notifyError('create-settings-failure', `There was a problem updating your settings ${err.message}`, <X size={20} />));
		},
		[settings, carrierInfo]
	);

	return (
		<Container fluid className='tab-container bg-voyage-background'>
			<Center className='flex h-full flex-col'>
				<section className='border-voyage-grey flex h-full flex-col items-center justify-center'>
					<header className='page-header my-6'>Quote Settings</header>
					<form onSubmit={quoteConfigForm.onSubmit(submitQuoteSettings)}>
						<Stack>
							<Group position='center'>
								<Checkbox
									checked={quoteConfigForm.values.rateChargeRules[ChargeUnitType.DISTANCE].active}
									label='Charge per mile'
									className='lg:w-48'
									{...quoteConfigForm.getInputProps(`rateChargeRules.${ChargeUnitType.DISTANCE}.active`)}
								/>
								<NumberInput
									disabled={!quoteConfigForm.values.rateChargeRules[ChargeUnitType.DISTANCE].active}
									required
									size='sm'
									radius={0}
									precision={2}
									step={0.05}
									min={0}
									max={100}
									placeholder='Charge'
									{...quoteConfigForm.getInputProps(`rateChargeRules.${ChargeUnitType.DISTANCE}.value`)}
									icon={<span className='text-voyage-grey'>£</span>}
								/>
							</Group>
							<Group position='center'>
								<Checkbox
									checked={quoteConfigForm.values.rateChargeRules[ChargeUnitType.PACKAGE].active}
									label='Charge per pallet'
									className='lg:w-48'
									{...quoteConfigForm.getInputProps(`rateChargeRules.${ChargeUnitType.PACKAGE}.active`)}
								/>
								<NumberInput
									disabled={!quoteConfigForm.values.rateChargeRules[ChargeUnitType.PACKAGE].active}
									required
									size='sm'
									radius={0}
									precision={2}
									step={0.05}
									min={0}
									max={100}
									placeholder='Charge'
									{...quoteConfigForm.getInputProps(`rateChargeRules.${ChargeUnitType.PACKAGE}.value`)}
									icon={<span className='text-voyage-grey'>£</span>}
								/>
							</Group>

							<Group position='center'>
								<Checkbox
									checked={quoteConfigForm.values.rateChargeRules[ChargeUnitType.WEIGHT].active}
									label='Charge per kg'
									className='lg:w-48'
									{...quoteConfigForm.getInputProps(`rateChargeRules.${ChargeUnitType.WEIGHT}.active`)}
								/>
								<NumberInput
									disabled={!quoteConfigForm.values.rateChargeRules[ChargeUnitType.WEIGHT].active}
									required
									size='sm'
									radius={0}
									precision={2}
									step={0.05}
									min={0}
									max={100}
									placeholder='Charge'
									{...quoteConfigForm.getInputProps(`rateChargeRules.${ChargeUnitType.WEIGHT}.value`)}
									icon={<span className='text-voyage-grey'>£</span>}
								/>
							</Group>
						</Stack>
						<Stack align='center' py={20}>
							<Button type='submit' className='bg-secondary hover:bg-secondary-600'>
								Save Changes
							</Button>
						</Stack>
					</form>
				</section>
			</Center>
		</Container>
	);
};


export default Workflows;
