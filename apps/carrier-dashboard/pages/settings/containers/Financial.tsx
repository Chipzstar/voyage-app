import React, { useCallback } from 'react';
import { Button, Checkbox, Container, Group, NumberInput, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDispatch } from 'react-redux';
import { updateSettings } from '../../../store/feature/settingsSlice';
import { AppDispatch } from 'apps/carrier-dashboard/store';
import { notifySuccess } from 'apps/carrier-dashboard/utils/functions';
import { Check } from 'tabler-icons-react';
import { ChargeUnitType, RateChargeRules } from 'apps/carrier-dashboard/utils/types';
import { defaultChargeRules } from '../../../utils/constants';

const Financial = ({ settings }) => {
	const dispatch = useDispatch<AppDispatch>();
	const initialValues: RateChargeRules = settings?.rateChargeRules ?? defaultChargeRules;
	const quoteConfigForm = useForm({
		initialValues
	});

	const submitQuoteSettings = useCallback(values => {
		dispatch(updateSettings(values))
			.unwrap()
			.then(() => {
				notifySuccess('update-settings-success', 'Quote settings saved!', <Check size={20} />);
			});
	}, []);

	return (
		<Container fluid className='tab-container bg-voyage-background'>
			<div className='grid grid-cols-2 h-full py-6'>
				<section className='flex flex-col h-full justify-center items-center border-r border-voyage-grey'>
					<header className='page-header my-6'>Payment Settings</header>
					<form>
						<Group px={20}>
							<TextInput label='Card Info' placeholder='1234 1234 1234 1234' />
							<Group>
								<TextInput
									label='Month'
									placeholder='MM'
									classNames={{
										root: 'w-24'
									}}
								/>
								<TextInput
									label='Year'
									placeholder='YY'
									classNames={{
										root: 'w-24'
									}}
								/>
							</Group>
							<TextInput
								label='CVV'
								placeholder=''
								classNames={{
									root: 'w-24'
								}}
							/>
						</Group>
						<Stack align='center' py={20}>
							<Button className='bg-secondary hover:bg-secondary-600'>Save Changes</Button>
						</Stack>
					</form>
				</section>
				<section className='flex flex-col h-full justify-center items-center border-l border-voyage-grey'>
					<header className='page-header my-6'>Quote Settings</header>
					<form onSubmit={quoteConfigForm.onSubmit(submitQuoteSettings)}>
						<Stack>
							<Group>
								<Checkbox checked={quoteConfigForm.values[ChargeUnitType.DISTANCE].active} value='mile' label='Charge per mile' className='w-48' {...quoteConfigForm.getInputProps(`${ChargeUnitType.DISTANCE}.active`)} />
								<NumberInput
									disabled={!quoteConfigForm.values[ChargeUnitType.DISTANCE].active}
									required
									size='sm'
									radius={0}
									precision={2}
									step={0.05}
									min={0}
									max={100}
									placeholder='Charge'
									{...quoteConfigForm.getInputProps(`${ChargeUnitType.DISTANCE}.value`)}
									icon={<span className='text-voyage-grey'>£</span>}
								/>
							</Group>
							<Group>
								<Checkbox checked={quoteConfigForm.values[ChargeUnitType.PACKAGE].active} value='package' label='Charge per pallet' className='w-48' {...quoteConfigForm.getInputProps(`${ChargeUnitType.PACKAGE}.active`)} />
								<NumberInput
									disabled={!quoteConfigForm.values[ChargeUnitType.PACKAGE].active}
									required
									size='sm'
									radius={0}
									precision={2}
									step={0.05}
									min={0}
									max={100}
									placeholder='Charge'
									{...quoteConfigForm.getInputProps(`${ChargeUnitType.PACKAGE}.value`)}
									icon={<span className='text-voyage-grey'>£</span>}
								/>
							</Group>

							<Group>
								<Checkbox checked={quoteConfigForm.values[ChargeUnitType.WEIGHT].active} value='weight' label='Charge per kg' className='w-48' {...quoteConfigForm.getInputProps(`${ChargeUnitType.WEIGHT}.active`)} />
								<NumberInput
									disabled={!quoteConfigForm.values[ChargeUnitType.WEIGHT].active}
									required
									size='sm'
									radius={0}
									precision={2}
									step={0.05}
									min={0}
									max={100}
									placeholder='Charge'
									{...quoteConfigForm.getInputProps(`${ChargeUnitType.WEIGHT}.value`)}
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
			</div>
		</Container>
	);
};

export default Financial;
