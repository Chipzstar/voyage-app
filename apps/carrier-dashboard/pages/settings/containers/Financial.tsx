import React, { useCallback } from 'react';
import { Container, Center, Card, Stack, Button, Group, TextInput, Radio, Popover, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';

enum ChargeUnitType {
	WEIGHT,
	PACKAGE,
	DISTANCE
}

const Financial = () => {
	const quoteConfigForm = useForm({
		initialValues: {
			chargeUnit: null,
			chargePerUnit: 0
		}
	});

	const submitQuoteSettings = useCallback(values => {
		alert(JSON.stringify(values))
	}, [])

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
						<Radio.Group orientation='vertical' required>
							<Popover width={300} trapFocus position='bottom' withArrow shadow='md'>
								<Popover.Target>
									<Radio value='mile' label='Charge per mile' />
								</Popover.Target>
								<Popover.Dropdown sx={theme => ({ background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white })}>
									<NumberInput
										required
										size='sm'
										radius={0}
										precision={2}
										step={0.05}
										min={0}
										max={100}
										label='Charge per Mile'
										placeholder='Charge'
										{...quoteConfigForm.getInputProps('chargePerUnit')}
										icon={<span className='text-voyage-grey'>£</span>}
									/>
								</Popover.Dropdown>
							</Popover>
							<Popover width={300} trapFocus position='bottom' withArrow shadow='md'>
								<Popover.Target>
									<Radio value='package' label='Charge per pallet' />
								</Popover.Target>
								<Popover.Dropdown sx={theme => ({ background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white })}>
									<NumberInput
										required
										size='sm'
										radius={0}
										precision={2}
										step={0.05}
										min={0}
										max={100}
										label='Charge per Pallet'
										placeholder='Charge'
										{...quoteConfigForm.getInputProps('chargePerUnit')}
										icon={<span className='text-voyage-grey'>£</span>}
									/>
								</Popover.Dropdown>
							</Popover>
							<Popover width={300} trapFocus position='bottom' withArrow shadow='md'>
								<Popover.Target>
									<Radio value='weight' label='Charge per kg' />
								</Popover.Target>
								<Popover.Dropdown sx={theme => ({ background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white })}>
									<NumberInput
										required
										size='sm'
										radius={0}
										precision={2}
										step={0.05}
										min={0}
										max={100}
										label='Charge per Kg'
										placeholder='Charge'
										{...quoteConfigForm.getInputProps('chargePerUnit')}
										icon={<span className='text-voyage-grey'>£</span>}
									/>
								</Popover.Dropdown>
							</Popover>
						</Radio.Group>
						<Stack align='center' py={20}>
							<Button type="submit" className='bg-secondary hover:bg-secondary-600'>Save Changes</Button>
						</Stack>
					</form>
				</section>
			</div>
		</Container>
	);
};

export default Financial;
